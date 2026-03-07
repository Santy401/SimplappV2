# Guía para Organizar Commits de Git

Una guía sistemática para organizar y hacer commits de manera lógica y revisable, con mensajes en inglés.

## Filosofía

- **Agrupar por propósito**: Cada commit debe representar un cambio lógico
- **Ordenar por dependencias**: Commitea cambios de base antes que features que dependen de ellos
- **Hazlo revisable**: Cada commit debe ser comprensible por sí solo
- **Mantén atomicidad**: Los cambios deben estar completos y no romper el build

## Proceso Paso a Paso

### 1. Verificar el Estado Actual

```bash
git status
```

Identifica todos los archivos modificados, eliminados y sin seguimiento.

### 2. Revisar los Cambios

Para archivos modificados, revisa qué cambió:

```bash
git diff <archivo>
```

Para directorios nuevos, explora su contenido:

```bash
ls -la <directorio>
```

Para archivos específicos muy largos:

```bash
git diff <archivo1> <archivo2> <archivo3>
```

### 3. Crear un Plan de Commits

Organiza los cambios en grupos lógicos siguiendo este orden de dependencias:

#### Orden Típico de Commits

1. **Dependencias y Configuración**
   - `package.json`, `pnpm-lock.yaml`, `yarn.lock`
   - Cambios en archivos de configuración
   - Eliminar configs deprecados

2. **Base de Datos y Schema**
   - Definiciones de schema (`prisma/schema.prisma`)
   - Definiciones de entidades (`domain/entities/`)
   - Migraciones de base de datos

3. **Infraestructura y Librerías Core**
   - Clientes de base de datos (Prisma, MongoDB setup)
   - Utilidades de cliente API
   - Capas de repositorio
   - Providers principales

4. **Rutas de API Backend**
   - Implementaciones de endpoints API
   - Handlers de rutas
   - Middleware

5. **Hooks Frontend y Manejo de Estado**
   - Custom hooks de React
   - Utilidades de manejo de estado
   - Query hooks

6. **Componentes UI**
   - Componentes compartidos/reutilizables
   - Librerías de componentes
   - Utilidades de UI

7. **Páginas y Features**
   - Componentes de páginas
   - Implementaciones de features
   - Actualizaciones de estilos relacionadas

8. **Integración y Cableado**
   - Cambios en layout raíz
   - Integración de providers
   - Configuración a nivel de app

9. **Scaffolds de Nuevas Features**
   - Estructuras de páginas vacías
   - Scaffolding de rutas
   - Componentes placeholder

### 4. Stagear y Commitear Cada Grupo

Para cada grupo lógico:

```bash
# Stagear archivos/directorios específicos
git add <archivos>

# Commit con mensaje descriptivo EN INGLÉS
git commit -m "Brief summary

- Bullet point explaining change 1
- Bullet point explaining change 2
- Bullet point explaining change 3"
```

**IMPORTANTE**: Los mensajes de commit SIEMPRE en inglés, pero el proceso lo haces pensando en español.

### 5. Verificar Progreso

Después de cada commit, verifica el estado:

```bash
git status
```

### 6. Revisar Resultado Final

Revisa todos los commits creados:

```bash
git log --oneline -<número_de_commits>
```

## Formato de Mensajes de Commit (en Inglés)

### Estructura

```
<Verb>: <Resumen breve (50 caracteres)>

- <Cambio detallado 1>
- <Cambio detallado 2>
- <Cambio detallado 3>
```

### Verbos Comunes para Empezar

| Inglés | Cuándo Usarlo |
|--------|---------------|
| **Add** | Archivos/features nuevos |
| **Update** | Modificaciones a código existente |
| **Implement** | Implementación completa de features |
| **Remove** | Archivos/features eliminados |
| **Fix** | Corrección de bugs |
| **Refactor** | Reestructuración de código |
| **Integrate** | Conectar sistemas |
| **Create** | Crear algo nuevo |
| **Build** | Construir algo completo |
| **Setup** | Configurar algo |

### Buenos Mensajes de Commit

```
Add authentication and query dependencies

- Add @tanstack/react-query for server state management
- Add @prisma/client, bcryptjs, and jsonwebtoken for auth
- Downgrade Prisma to v6.0.0 for compatibility
- Remove deprecated prisma.config.ts
```

```
Implement registration and dashboard pages

- Build complete registration form with validation
- Add email confirmation and password strength checks
- Implement phone input with country code selector
- Create interactive admin dashboard with onboarding steps
```

```
Update User schema with additional fields

- Add name, typeAccount, and country fields to User model
- Update Prisma schema generator configuration
- Add database migration for new User fields
```

## Patrones Comunes de Agrupación

### Feature Full-Stack

1. Schema/entidades (base de datos)
2. API Backend (rutas y lógica)
3. Hooks Frontend (lógica de cliente)
4. Componentes UI (elementos visuales)
5. Implementación de páginas (integración final)

### Actualización de Configuración

1. Dependencias (package.json)
2. Archivos de config
3. Actualizaciones de código relacionadas

### Refactorización

1. Cambios de infraestructura
2. Migraciones de código
3. Limpieza/remociones

## Ejemplo Real Completo

```bash
# 1. Verificar estado
git status

# 2. Commitear dependencias
git add package.json pnpm-lock.yaml
git commit -m "Add authentication and query dependencies

- Add @tanstack/react-query for server state management
- Add @prisma/client, bcryptjs, and jsonwebtoken for auth
- Downgrade Prisma to v6.0.0 for compatibility"

# 3. Commitear schema y entidades
git add prisma/schema.prisma domain/entities/User.entity.ts prisma/migrations/
git commit -m "Update User schema with additional fields

- Add name, typeAccount, and country fields to User model
- Update Prisma schema generator configuration
- Add database migration for new User fields
- Update User entity interface to match schema"

# 4. Commitear infraestructura
git add interfaces/lib/ app/providers.tsx
git commit -m "Add backend infrastructure and providers

- Create Prisma client singleton
- Add API client utility with fetch wrapper
- Add users repository layer
- Setup React Query provider for client state"

# 5. Commitear rutas API
git add app/api/
git commit -m "Implement authentication API routes

- Add user registration endpoint with password hashing
- Add login endpoint with JWT token generation
- Add logout and session management endpoints
- Add password reset and forgot password flows
- Add company CRUD API routes"

# 6. Commitear hooks
git add interfaces/hooks/
git commit -m "Add authentication React hooks

- Create useRegister hook for user registration
- Create useLogin hook with form state management
- Create useLogout hook for session termination
- Create useSession hook for auth state checking
- Add useForgotPassword hook for password recovery"

# 7. Commitear componentes UI
git add app/ui/components/
git commit -m "Add onboarding UI components

- Create onboarding step components structure
- Add reusable onboarding component layout"

# 8. Commitear páginas
git add app/ui/pages/Register/page.tsx app/ui/pages/Admin/Dashboard/page.tsx app/ui/styles/
git commit -m "Implement registration and dashboard pages

- Build complete registration form with validation
- Add email confirmation and password strength checks
- Implement phone input with country code selector
- Create interactive admin dashboard with onboarding steps
- Update input styles for full width support"

# 9. Commitear integración
git add app/layout.tsx
git commit -m "Integrate providers into root layout

- Wrap application with React Query provider
- Enable global state management for auth and data fetching"

# 10. Verificar todos los commits
git log --oneline -9
```

## Vocabulario Útil en Inglés para Commits

### Acciones Comunes

- **Add**: Agregar
- **Update**: Actualizar
- **Remove/Delete**: Eliminar
- **Implement**: Implementar
- **Create**: Crear
- **Build**: Construir
- **Setup/Configure**: Configurar
- **Integrate**: Integrar
- **Refactor**: Refactorizar
- **Fix**: Arreglar
- **Improve**: Mejorar
- **Enhance**: Mejorar/Potenciar

### Sustantivos Comunes

- **authentication/auth**: autenticación
- **dependencies**: dependencias
- **schema**: esquema
- **entity/entities**: entidad/entidades
- **migration**: migración
- **endpoint**: endpoint/punto final
- **hook**: hook
- **component**: componente
- **page**: página
- **form**: formulario
- **validation**: validación
- **provider**: proveedor
- **layout**: diseño/estructura
- **route**: ruta
- **field**: campo

### Frases Útiles

- "with validation" - con validación
- "for password recovery" - para recuperación de contraseña
- "to match schema" - para coincidir con el schema
- "for full width support" - para soporte de ancho completo
- "with custom hooks" - con hooks personalizados

## Tips Importantes

- **No mezcles conceptos**: Mantén cambios de base de datos separados de cambios de UI
- **Commitea seguido**: Commits pequeños y enfocados son más fáciles de revisar y revertir
- **Prueba entre commits**: Asegúrate que cada commit deja el código en estado funcional
- **Escribe para revisores**: Tus mensajes deben contar una historia
- **Usa inglés consistente**: Es el estándar profesional internacional
- **Stagea incrementalmente**: Usa `git add <archivos-específicos>` en lugar de `git add .`

## Checklist de Verificación

Antes de considerar tus commits completos:

- [ ] Cada commit tiene un mensaje claro y descriptivo en inglés
- [ ] Los commits están ordenados por dependencia (base → features)
- [ ] No hay archivos no deseados commiteados (revisar `.gitignore`)
- [ ] Cada commit representa un cambio lógico
- [ ] El build/tests pasan después de cada commit (si aplica)
- [ ] Revisaste el historial con `git log`

## Archivos a Excluir Típicamente

Agrega a `.gitignore` si no están:

```gitignore
# IDE
.vscode/
.idea/

# Archivos de respaldo
*.bak
*.backup
*.old

# Environment
.env.local
.env.*.local

# Dependencias
node_modules/
```

## Comandos de Recuperación

Si cometes un error:

```bash
# Deshacer último commit (mantener cambios staged)
git reset --soft HEAD~1

# Deshacer último commit (mantener cambios unstaged)
git reset HEAD~1

# Deshacer último commit (descartar cambios - PELIGROSO)
git reset --hard HEAD~1

# Unstage archivos específicos
git restore --staged <archivo>

# Ver diferencia de un commit específico
git show <commit-hash>
```

## Comandos Útiles para Revisar

```bash
# Ver estado
git status

# Ver diferencias no stageadas
git diff

# Ver diferencias stageadas
git diff --cached

# Ver log resumido
git log --oneline -10

# Ver log con cambios
git log -p -2

# Ver archivos cambiados por commit
git log --stat

# Ver historial gráfico
git log --graph --oneline --all
```

---

**Recuerda**: Una buena organización de commits facilita el code review, hace el debugging más rápido y mejora la colaboración. ¡Tómate el tiempo de hacerlo bien!
