# Diagrama de Flujo - Sistema de Manejo de Sesiones

## 🔄 Flujo Principal de Autenticación

```mermaid
graph TD
    A[Usuario hace Request API] --> B{¿Respuesta 401?}
    B -->|No| C[Retornar datos]
    B -->|Sí| D{¿Es endpoint /auth/refresh?}
    D -->|Sí| E[Sesión Expirada]
    D -->|No| F{¿Es primer intento?}
    F -->|No| E
    F -->|Sí| G[Intentar Refresh Token]
    G --> H{¿Refresh exitoso?}
    H -->|Sí| I[Reintentar Request Original]
    H -->|No| E
    I --> J{¿Respuesta OK?}
    J -->|Sí| C
    J -->|No| E
    E --> K[Disparar evento 'session:expired']
    K --> L[SessionContext muestra Modal]
    L --> M[Usuario hace clic en 'Iniciar Sesión']
    M --> N[Redirigir a /login]
```

## 🔐 Flujo de Refresh Token

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Component
    participant API as apiClient
    participant S as Server
    participant SC as SessionContext
    participant M as Modal

    U->>C: Navega a página
    C->>API: GET /api/bills
    API->>S: Request con access-token
    S-->>API: 401 Unauthorized
    
    Note over API: Detecta 401, intenta refresh
    
    API->>S: POST /api/auth/refresh
    
    alt Refresh Exitoso
        S-->>API: 200 OK + nuevo token
        Note over API: Reintenta request original
        API->>S: GET /api/bills (con nuevo token)
        S-->>API: 200 OK + datos
        API-->>C: Datos
        C-->>U: Muestra datos
    else Refresh Falla
        S-->>API: 401 Unauthorized
        API->>SC: Dispara 'session:expired'
        SC->>M: Muestra modal
        M-->>U: "Sesión Expirada"
        U->>M: Click "Iniciar Sesión"
        M->>U: Redirige a /login
    end
```

## 🎯 Flujo de SessionContext

```mermaid
stateDiagram-v2
    [*] --> NoAutenticado
    NoAutenticado --> Autenticado: Login exitoso
    Autenticado --> TokenExpirado: Access token expira
    TokenExpirado --> Autenticado: Refresh exitoso
    TokenExpirado --> SesionExpirada: Refresh falla
    SesionExpirada --> MostrarModal: Disparar evento
    MostrarModal --> NoAutenticado: Usuario hace login
    
    note right of NoAutenticado
        wasAuthenticated = false
        Modal NO se muestra
    end note
    
    note right of Autenticado
        wasAuthenticated = true
        Usuario navega normalmente
    end note
    
    note right of SesionExpirada
        wasAuthenticated = true
        Modal SÍ se muestra
    end note
```

## 🔄 Flujo de Múltiples Requests Simultáneos

```mermaid
sequenceDiagram
    participant R1 as Request 1
    participant R2 as Request 2
    participant R3 as Request 3
    participant API as apiClient
    participant S as Server

    par Requests Simultáneos
        R1->>API: GET /api/bills
        R2->>API: GET /api/sellers
        R3->>API: GET /api/stores
    end

    par Todos reciben 401
        API->>S: Request 1
        S-->>API: 401
        API->>S: Request 2
        S-->>API: 401
        API->>S: Request 3
        S-->>API: 401
    end

    Note over API: isRefreshing = true
    Note over API: refreshPromise creada

    API->>S: POST /api/auth/refresh
    
    Note over R2,R3: Esperan la misma promesa
    
    S-->>API: 200 OK + nuevo token
    
    Note over API: isRefreshing = false
    
    par Reintentar todos
        API->>S: GET /api/bills (retry)
        API->>S: GET /api/sellers (retry)
        API->>S: GET /api/stores (retry)
    end

    par Respuestas exitosas
        S-->>API: 200 + bills
        S-->>API: 200 + sellers
        S-->>API: 200 + stores
    end

    par Retornar datos
        API-->>R1: bills data
        API-->>R2: sellers data
        API-->>R3: stores data
    end
```

## 📱 Flujo de Componentes

```mermaid
graph LR
    A[App Root] --> B[SessionProvider]
    B --> C[useSession Hook]
    B --> D[SessionExpiredModal]
    C --> E[apiClient]
    E --> F[API Endpoints]
    
    G[useBill Hook] --> E
    H[useSeller Hook] --> E
    I[useStore Hook] --> E
    
    E -.->|Evento| B
    
    style B fill:#a855f7
    style E fill:#6366f1
    style D fill:#ef4444
```

## 🎨 Estados del Modal

```mermaid
stateDiagram-v2
    [*] --> Cerrado: isOpen = false
    Cerrado --> Abierto: session:expired event
    Abierto --> Cerrado: Usuario hace login
    
    note right of Cerrado
        Modal no visible
        Usuario navega normalmente
    end note
    
    note right of Abierto
        Modal visible
        Backdrop no clickeable
        Usuario DEBE hacer login
    end note
```

## 🔍 Decisiones del apiClient

```mermaid
flowchart TD
    A[Request API] --> B{Status Code}
    B -->|200-299| C[Retornar datos]
    B -->|401| D{¿Es /auth/refresh?}
    B -->|Otro error| E[Lanzar error]
    
    D -->|Sí| F[Sesión expirada]
    D -->|No| G{¿retryCount > 0?}
    
    G -->|Sí| F
    G -->|No| H{¿isRefreshing?}
    
    H -->|Sí| I[Esperar refreshPromise]
    H -->|No| J[Iniciar refresh]
    
    I --> K{¿Refresh exitoso?}
    J --> K
    
    K -->|Sí| L[Retry request con retryCount+1]
    K -->|No| F
    
    L --> A
    F --> M[Disparar session:expired]
    M --> N[Mostrar modal]
    
    style F fill:#ef4444
    style C fill:#10b981
    style N fill:#f59e0b
```

## 📊 Ciclo de Vida del Token

```mermaid
gantt
    title Ciclo de Vida de Tokens
    dateFormat mm:ss
    axisFormat %M:%S
    
    section Access Token
    Token válido           :active, a1, 00:00, 15m
    Token expirado         :crit, a2, 15:00, 1m
    
    section Refresh Token
    Token válido           :active, r1, 00:00, 7d
    
    section Acciones
    Refresh automático     :milestone, 15:00, 0m
    Mostrar modal          :crit, milestone, 7d, 0m
```

## 🎯 Puntos de Decisión Clave

```mermaid
mindmap
  root((apiClient))
    Detectar 401
      ¿Es /auth/refresh?
        Sí → Sesión expirada
        No → Continuar
      ¿retryCount > 0?
        Sí → Sesión expirada
        No → Intentar refresh
    Refresh Token
      ¿isRefreshing?
        Sí → Esperar promesa
        No → Crear promesa
      ¿Refresh exitoso?
        Sí → Retry request
        No → Sesión expirada
    Sesión Expirada
      Disparar evento
      Limpiar estado
      Mostrar modal
```

---

## 📝 Leyenda de Colores

- 🟢 **Verde**: Flujo exitoso
- 🔴 **Rojo**: Error o sesión expirada
- 🟣 **Morado**: Componentes principales
- 🔵 **Azul**: Servicios y utilidades
- 🟡 **Amarillo**: Acciones del usuario

---

## 🔗 Referencias

- [Implementación Detallada](./session-management-implementation.md)
- [Resumen Ejecutivo](./session-implementation-summary.md)
