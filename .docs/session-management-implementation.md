# Sistema de Manejo de Sesiones - Implementación

## 📋 Resumen

Se ha implementado un sistema robusto de manejo de sesiones que:
- ✅ Detecta automáticamente cuando el token de acceso expira
- ✅ Intenta refrescar el token automáticamente UNA vez
- ✅ Muestra un modal cuando el refresh falla (sesión expirada definitivamente)
- ✅ Previene navegación con errores cuando la sesión es inválida
- ✅ No muestra el modal en páginas públicas (solo si el usuario estaba autenticado)

## 🔧 Componentes Modificados

### 1. **apiClient** (`packages/interfaces/lib/api-client.ts`)

**Mejoras implementadas:**
- **Refresh automático de tokens**: Cuando recibe un error 401, intenta refrescar el token automáticamente
- **Prevención de loops**: Solo intenta refrescar UNA vez por petición
- **Manejo de concurrencia**: Si múltiples peticiones fallan simultáneamente, solo se hace un refresh
- **Evento de sesión expirada**: Dispara `session:expired` cuando el refresh falla

**Flujo:**
```
Petición API → 401 Error
    ↓
¿Es el primer intento?
    ↓ Sí
Intentar refresh token
    ↓
¿Refresh exitoso?
    ↓ Sí                    ↓ No
Reintentar petición    Disparar evento
    ↓                  'session:expired'
Retornar datos         Mostrar modal
```

**Características clave:**
```typescript
// Previene múltiples refreshes simultáneos
private isRefreshing: boolean = false;
private refreshPromise: Promise<boolean> | null = null;

// Intenta refrescar automáticamente
if (response.status === 401 && !endpoint.includes('/auth/refresh') && retryCount === 0) {
  const refreshSuccess = await this.refreshToken();
  if (refreshSuccess) {
    return this.request<T>(endpoint, options, retryCount + 1);
  } else {
    this.dispatchSessionExpired();
  }
}
```

### 2. **useSession** (`packages/interfaces/src/hooks/features/auth/use-session.ts`)

**Mejoras implementadas:**
- **No reintentar en errores de sesión**: Si el error es "Session expired", no hace retry
- **Manejo inteligente de errores**: Distingue entre errores de red y errores de autenticación
- **Propagación correcta de errores**: Lanza el error en lugar de retornar null para sesiones expiradas

**Características clave:**
```typescript
retry: (failureCount, error: any) => {
  // No reintentar si es un error de sesión expirada
  if (error?.message === 'Session expired') {
    return false;
  }
  // Solo reintentar una vez para otros errores
  return failureCount < 1;
}
```

### 3. **SessionContext** (`apps/web/app/context/SessionContext.tsx`)

**Mejoras implementadas:**
- **Tracking de autenticación previa**: Solo muestra el modal si el usuario ESTABA autenticado
- **Escucha del evento global**: Responde al evento `session:expired` del apiClient
- **Prevención de falsos positivos**: No muestra el modal en páginas públicas

**Características clave:**
```typescript
// Rastrear si el usuario estuvo autenticado
const [wasAuthenticated, setWasAuthenticated] = useState(false);

// Solo mostrar modal si perdió la sesión DESPUÉS de estar autenticado
useEffect(() => {
  if (!isLoading && !isAuthenticated && wasAuthenticated) {
    handleSessionExpired();
  }
}, [isAuthenticated, isLoading, wasAuthenticated]);

// Escuchar evento del apiClient
useEffect(() => {
  window.addEventListener('session:expired', handleSessionExpiredEvent);
  return () => window.removeEventListener('session:expired', handleSessionExpiredEvent);
}, []);
```

### 4. **SessionExpiredModal** (`packages/ui/src/molecules/SessionExpiredModal.tsx`)

**Mejoras implementadas:**
- **Modal no dismissible**: No se puede cerrar haciendo clic fuera
- **Backdrop más oscuro**: Mejor contraste visual (60% opacity)
- **Mensaje más claro**: Indica que debe iniciar sesión para continuar

## 🎯 Casos de Uso

### Caso 1: Token de acceso expira durante navegación
```
Usuario navega → API request → 401
    ↓
apiClient intenta refresh automáticamente
    ↓
Refresh exitoso → Usuario continúa navegando (sin interrupciones)
```

### Caso 2: Token de acceso Y refresh token expiran
```
Usuario navega → API request → 401
    ↓
apiClient intenta refresh → 401 (refresh también expiró)
    ↓
Dispara evento 'session:expired'
    ↓
SessionContext muestra modal
    ↓
Usuario debe iniciar sesión nuevamente
```

### Caso 3: Usuario en página pública
```
Usuario en /login o /register
    ↓
No está autenticado (wasAuthenticated = false)
    ↓
Modal NO se muestra
```

### Caso 4: Múltiples peticiones simultáneas con token expirado
```
3 peticiones API simultáneas → Todas reciben 401
    ↓
Primera petición inicia refresh (isRefreshing = true)
    ↓
Peticiones 2 y 3 esperan la misma promesa de refresh
    ↓
Refresh exitoso → Las 3 peticiones se reintentan con nuevo token
```

## 🔒 Seguridad

1. **Tokens en cookies httpOnly**: Los tokens no son accesibles desde JavaScript
2. **Refresh limitado**: Solo se intenta refrescar UNA vez por petición
3. **Evento de sesión expirada**: Limpia el estado de la aplicación cuando la sesión expira
4. **Modal forzoso**: El usuario DEBE iniciar sesión, no puede cerrar el modal

## 🧪 Testing Manual

Para probar la implementación:

1. **Probar refresh automático:**
   - Iniciar sesión
   - Esperar 15 minutos (expiración del access token)
   - Navegar a cualquier página
   - Debería refrescar automáticamente sin mostrar modal

2. **Probar sesión expirada:**
   - Iniciar sesión
   - Borrar manualmente la cookie `refresh-token` desde DevTools
   - Navegar a cualquier página
   - Debería mostrar el modal de sesión expirada

3. **Probar páginas públicas:**
   - Ir a `/login` sin estar autenticado
   - No debería mostrar el modal

4. **Probar múltiples peticiones:**
   - Abrir DevTools → Network tab
   - Borrar la cookie `access-token`
   - Navegar a una página que haga múltiples peticiones API
   - Debería ver solo UN request a `/api/auth/refresh`

## 📝 Notas Técnicas

### Tiempos de expiración actuales:
- **Access Token**: 15 minutos
- **Refresh Token**: 7 días

### Eventos personalizados:
- `session:expired`: Disparado cuando el refresh falla o el token es inválido

### Dependencias:
- `@tanstack/react-query`: Para manejo de cache y reintentos
- `next/navigation`: Para redirección al login

## 🚀 Próximas Mejoras Sugeridas

1. **Refresh proactivo**: Refrescar el token antes de que expire (ej: a los 14 minutos)
2. **Notificación de sesión próxima a expirar**: Avisar al usuario 5 minutos antes
3. **Persistencia de ruta**: Redirigir al usuario a la página donde estaba después de login
4. **Métricas**: Trackear cuántas veces se refresca el token vs cuántas veces expira
5. **Logout en múltiples tabs**: Sincronizar logout entre pestañas usando BroadcastChannel

## 🐛 Troubleshooting

### El modal aparece en páginas públicas
- Verificar que `wasAuthenticated` se inicializa en `false`
- Verificar que el SessionProvider no se renderiza en rutas públicas

### El refresh no funciona
- Verificar que las cookies tienen `credentials: 'include'`
- Verificar que el endpoint `/api/auth/refresh` retorna 200
- Verificar que las cookies se están enviando correctamente

### Múltiples modales aparecen
- Verificar que solo hay un `SessionProvider` en la aplicación
- Verificar que el evento `session:expired` no se dispara múltiples veces

### El token no se refresca automáticamente
- Verificar que el `apiClient` detecta correctamente el 401
- Verificar que `retryCount` se está pasando correctamente
- Verificar logs en consola para ver el flujo de refresh
