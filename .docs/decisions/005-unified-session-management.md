# Decisión: Unificación del Sistema de Sesión y Autenticación

**Fecha:** 15 de marzo de 2026
**Estado:** Aceptado

## Contexto
El sistema de sesión de Simplapp V2 estaba fragmentado: el hook `use-session` realizaba peticiones aisladas para obtener el usuario, mientras que el `SessionContext` solo se encargaba de mostrar un modal de expiración. Esta estructura causaba múltiples llamadas innecesarias a `/api/auth/session` en una sola carga de página y dificultaba la sincronización global del estado del usuario.

## Decisión
Hemos decidido centralizar todo el estado de la sesión en un único **SessionProvider** dentro de `apps/web/app/context/SessionContext.tsx`.

Las mejoras incluyen:
1. **Estado Global**: El `SessionContext` ahora es el dueño absoluto del objeto `user`, `loading` y `error`. Se encarga de hacer el fetch inicial al cargar la aplicación.
2. **Hook useSession Unificado**: El hook en `@simplapp/interfaces` ha sido refactorizado para ser un simple puente hacia el `SessionContext`, eliminando peticiones redundantes.
3. **Escucha Automática**: El contexto escucha globalmente el evento `session:expired` (disparado por el `apiClient` o `fetchWithAuth`) para mostrar el modal de re-login instantáneamente cuando el token expira.
4. **API de Usuario Simplificada**: Provee métodos claros como `refreshSession()` y `logout()` para toda la aplicación.

## Consecuencias Positivas
- **Rendimiento**: Se reduce drásticamente el tráfico a la API de auth, ya que la sesión se carga una sola vez y se comparte por Context API.
- **Consistencia**: Si un usuario actualiza su perfil o cambia de empresa, el cambio se refleja instantáneamente en toda la aplicación.
- **Seguridad**: El manejo centralizado del error 401 garantiza que cualquier fallo de autorización sea detectado y gestionado por el modal de sesión expirada de forma uniforme.

## Consecuencias Negativas
- Dependencia del Contexto: Los componentes que usan `useSession` deben estar obligatoriamente dentro del `SessionProvider`.
