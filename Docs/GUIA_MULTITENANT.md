# 🏢 Guía de Multi-Tenancy

Esta guía explica cómo mantener la arquitectura multi-tenant en el proyecto. **Cada entidad debe estar aislada por compañía** para garantizar la seguridad y privacidad de los datos.

## 📖 Conceptos Clave

- **Multi-Tenancy**: Cada usuario pertenece a una `Company` y solo puede acceder a los datos de su compañía.
- **Aislamiento de Datos**: Las entidades (Clients, Products, Sellers, etc.) están vinculadas a una `companyId`.
- **Seguridad en el Backend**: El filtrado SIEMPRE se hace en el API, nunca confiar en el frontend.

---

## ✅ Checklist: Agregar Nueva Entidad Multi-Tenant

Cuando agregues cualquier nueva entidad (ej: `Invoice`, `Category`, `Warehouse`), sigue estos pasos:

### 1️⃣ **Actualizar el Schema de Prisma**

Agrega el campo `companyId` y la relación con `Company`:

```prisma
model TuNuevaEntidad {
  id   Int    @id @default(autoincrement())
  name String
  // ... otros campos de tu entidad

  // 🔹 MULTI-TENANT: Relación con Company
  companyId Int?
  company   Company? @relation(fields: [companyId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Actualiza el modelo `Company`** para incluir la relación inversa:

```prisma
model Company {
  id Int @id @default(autoincrement())
  // ... campos existentes

  clients         Client[]
  products        Product[]
  sellers         Seller[]
  tuNuevaEntidad  TuNuevaEntidad[]  // ← Agregar aquí

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Ejecuta la migración:**

```bash
npx prisma db push
```

---

### 2️⃣ **Crear API Route: GET (Listar con Filtrado)**

Crea el archivo `/app/api/tu-entidad/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Verificar autenticación
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2️⃣ Verificar token y obtener usuario
    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 3️⃣ Obtener usuario con su compañía
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    // 4️⃣ FILTRAR por companyId (CRÍTICO para multi-tenancy)
    const items = await prisma.tuNuevaEntidad.findMany({
      where: {
        companyId: user.company.id,  // ← FILTRADO POR COMPAÑÍA
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos' },
      { status: 500 }
    );
  }
}
```

---

### 3️⃣ **Crear API Route: POST (Crear con companyId)**

En el mismo archivo `/app/api/tu-entidad/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Verificar autenticación (igual que GET)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    // 2️⃣ Obtener datos del body
    const data = await request.json();

    // 3️⃣ Crear con companyId AUTOMÁTICAMENTE
    const item = await prisma.tuNuevaEntidad.create({
      data: {
        ...data,
        companyId: user.company.id,  // ← ASIGNAR COMPAÑÍA AUTOMÁTICAMENTE
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Error al crear' },
      { status: 500 }
    );
  }
}
```

---

### 4️⃣ **Crear API Route: PUT/DELETE (Verificar Ownership)**

Crea el archivo `/app/api/tu-entidad/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Verificar autenticación
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    // 2️⃣ Obtener ID del parámetro
    const { id } = await params;
    const itemId = parseInt(id);

    // 3️⃣ Verificar que el item existe
    const item = await prisma.tuNuevaEntidad.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
    }

    // 4️⃣ VERIFICAR OWNERSHIP (CRÍTICO para seguridad)
    if (item.companyId !== user.company.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 5️⃣ Actualizar
    const data = await request.json();
    const updatedItem = await prisma.tuNuevaEntidad.update({
      where: { id: itemId },
      data,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Error al actualizar' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1️⃣ Verificar autenticación (igual que PUT)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload || !payload.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.id) },
    include: { company: true },
  });

  if (!user || !user.company) {
    return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
  }

  // 2️⃣ Obtener ID
  const { id } = await params;
  const itemId = Number(id);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // 3️⃣ Verificar que existe
  const item = await prisma.tuNuevaEntidad.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  }

  // 4️⃣ VERIFICAR OWNERSHIP
  if (item.companyId !== user.company.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // 5️⃣ Eliminar
  await prisma.tuNuevaEntidad.delete({
    where: { id: itemId },
  });

  return NextResponse.json({ message: "Item eliminado" }, { status: 200 });
}
```

---

## 🔒 Reglas de Seguridad Multi-Tenant

### ✅ SIEMPRE hacer:

1. **Verificar autenticación** en TODAS las rutas API
2. **Filtrar por `companyId`** en todas las consultas GET
3. **Asignar `companyId` automáticamente** en POST (nunca confiar en el cliente)
4. **Verificar ownership** antes de UPDATE/DELETE
5. **Retornar 403 Forbidden** si el usuario intenta acceder a datos de otra compañía

### ❌ NUNCA hacer:

1. ❌ Confiar en el `companyId` enviado desde el frontend
2. ❌ Permitir que el usuario especifique su `companyId` en POST/PUT
3. ❌ Hacer consultas sin filtrar por `companyId`
4. ❌ Omitir la verificación de ownership en DELETE/PUT

---

## 🎯 Patrón de Código Reutilizable

### Helper para Autenticación (Opcional)

Puedes crear un helper en `/app/api/_helpers/auth.ts`:

```typescript
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import { NextResponse } from 'next/server';

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  if (!accessToken) {
    return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload || !payload.id) {
    return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.id) },
    include: { company: true },
  });

  if (!user || !user.company) {
    return { error: NextResponse.json({ error: 'User or company not found' }, { status: 404 }) };
  }

  return { user };
}
```

**Uso:**

```typescript
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const items = await prisma.tuEntidad.findMany({
    where: { companyId: user.company.id },
  });

  return NextResponse.json(items);
}
```

---

## 📚 Ejemplos de Referencia

Consulta estos archivos como referencia:

- ✅ `/app/api/clients/route.ts` - GET y POST con multi-tenancy
- ✅ `/app/api/clients/[id]/route.ts` - PUT y DELETE con verificación de ownership
- ✅ `/prisma/schema.prisma` - Modelos Client, Product, Seller con `companyId`

---

## 🧪 Testing Multi-Tenancy

### Casos de prueba esenciales:

1. ✅ Usuario A no puede ver datos de Usuario B (diferente compañía)
2. ✅ Usuario A no puede editar/eliminar datos de Usuario B
3. ✅ Crear datos asigna automáticamente el `companyId` correcto
4. ✅ Sin token de autenticación retorna 401
5. ✅ Token inválido retorna 401
6. ✅ Intentar acceder a datos de otra compañía retorna 403

---

## 🚀 Resumen Rápido

Para **CADA nueva entidad**:

1. ✅ Agregar `companyId` en Prisma schema
2. ✅ Ejecutar `npx prisma db push`
3. ✅ GET: Filtrar por `companyId`
4. ✅ POST: Asignar `companyId` automáticamente
5. ✅ PUT/DELETE: Verificar ownership antes de modificar

**El frontend NO cambia** - los hooks y componentes siguen igual porque el filtrado es transparente desde el API.

---

## 📞 Soporte

Si tienes dudas sobre cómo implementar multi-tenancy en una entidad específica, revisa los ejemplos en `/app/api/clients/` o consulta esta guía.

**Última actualización:** 2025-12-11
