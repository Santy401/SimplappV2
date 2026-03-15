# Decisión: Implementación del Patrón Repository/Service

**Fecha:** 15 de marzo de 2026
**Estado:** Aceptado

## Contexto
El acceso a los datos a través de Prisma se realizaba directamente en archivos dentro de `lib/` (ej. `lib/users.ts`), mezclando la lógica de negocio con las consultas a la base de datos. Esta estructura hacía que el código fuera difícil de testear de forma aislada y acoplaba fuertemente la aplicación a Prisma como ORM.

## Decisión
Hemos decidido adoptar una arquitectura de capas basada en el **Patrón Repository/Service** dentro del paquete `@simplapp/interfaces`.

La estructura se divide en:
1. **Capas de Repositorio (`src/repositories/`)**:
   - Clases que encapsulan todas las interacciones con Prisma.
   - Reciben opcionalmente un cliente de transacción (`txClient`) para permitir orquestación de transacciones desde capas superiores.
2. **Capas de Servicio (`src/services/`)**:
   - Clases que orquestan uno o varios repositorios.
   - Contienen la **Lógica de Negocio** pura (ej. "Al registrar un usuario, crea también su empresa por defecto y vincula el ID de sesión").
   - Gestionan las transacciones de base de datos a nivel de lógica de dominio.

## Consecuencias Positivas
- **Desacoplamiento**: Los componentes y hooks de la aplicación web ya no necesitan conocer los detalles de Prisma. Solo hablan con los servicios.
- **Testeabilidad**: Ahora es posible hacer "mocking" de los repositorios para testear los servicios sin necesidad de una base de datos real.
- **Reutilización**: La lógica compleja (como el registro multi-entidad) está encapsulada en un solo lugar (`AuthService`) y puede ser usada por cualquier consumidor.
- **Mantenibilidad**: Si el esquema de Prisma cambia, solo necesitamos actualizar el Repositorio correspondiente, no toda la aplicación.

## Estado de Implementación
- [x] **Módulo Auth/User**: UserRepository y AuthService implementados.
- [x] **Módulo Client**: ClientRepository y ClientService implementados para gestión de clientes por compañía.
- [x] **Módulo Bill**: BillRepository y BillService implementados con lógica de numeración correlativa y estados de factura.
- [ ] **Módulo Product**: (Próximamente).
