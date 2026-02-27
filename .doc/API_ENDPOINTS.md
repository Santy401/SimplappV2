# Documentación de la API - Simplapp V2

## 🔑 Autenticación
La API utiliza un sistema de **doble token** mediante cookies `httpOnly`:
- `access-token`: Expira en 15 minutos.
- `refresh-token`: Expira en 7 días y permite renovar el `access-token`.

---

## 👤 Endpoints de Auth
### `POST /api/auth/login`
Inicia sesión de usuario.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: Cookies `access-token` y `refresh-token`.

### `POST /api/auth/register`
Registra un nuevo usuario.
- **Body**: `{ "email": "...", "password": "...", "name": "...", "phone": "...", "typeAccount": "..." }`

### `POST /api/auth/logout`
Limpia las cookies de sesión y revoca el refresh token en DB.

### `GET /api/auth/session`
Retorna los datos del usuario y la empresa actual.
- **Response**: `SessionResponse` (ve `route.ts` para el esquema completo).

---

## 🏢 Endpoints de Negocio
Todos los endpoints requieren estar autenticado.

### `GET /api/clients`
Listado de clientes con paginación y búsqueda.
- **Query Params**:
  - `page`: Número de página (default 1).
  - `search`: Término de búsqueda (opcional).
- **Response**: `{ "data": [...], "meta": { "total": 100, ... } }`

### `POST /api/clients`
Crea un cliente.
- **Body**: Ver esquema `Client` en Prisma.

### `GET /api/export`
Genera un archivo CSV de una entidad.
- **Query Params**: `entity=clients|products|sellers|stores`

---

## 🛡️ Límites (Rate Limiting)
- **Login**: 10 intentos / 15 min.
- **Registro**: 5 registros / 1 hora.
- **Exportación**: 10 archivos / 1 min.
- **Refresh**: 30 renovaciones / 15 min.
