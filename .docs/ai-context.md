# SimplappV2 - Codebase Context for AI Agents

> **IMPORTANT**: This document provides comprehensive context about SimplappV2 for AI agents. Read this before making significant changes to understand the architecture, patterns, and conventions.

## Quick Reference

| Category | Details |
|----------|---------|
| **Stack** | Next.js 16, TypeScript, Prisma, PostgreSQL, Turborepo |
| **Package Manager** | pnpm |
| **Monorepo** | apps/web, packages/domain, packages/interfaces, packages/ui |
| **Auth** | JWT (jose) with 15min access + 7day refresh tokens |
| **Forms** | React Hook Form + Zod |
| **Data Fetching** | React Query (TanStack Query) |
| **Multitenancy** | Company-scoped data via `companyId` |

---

## Directory Structure

```
SimplappV2/
├── apps/web/                 # Next.js application
│   ├── app/                 # App Router pages
│   │   ├── (auth)/          # Public auth routes
│   │   ├── (dashboard)/     # Protected routes with Sidebar
│   │   ├── api/             # API routes
│   │   └── context/         # React contexts
│   ├── lib/                 # Utilities
│   ├── middleware/          # Next.js middleware
│   └── prisma/              # Database schema
├── packages/
│   ├── domain/              # Business logic & types
│   │   ├── entities/        # TypeScript interfaces
│   │   ├── schemas/         # Zod validation schemas
│   │   └── utils/           # Calculation utilities
│   ├── interfaces/           # Hooks & services
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── repositories/    # Data access patterns
│   │   └── services/        # API services
│   └── ui/                  # Shared components
│       ├── atoms/            # Button, Input, etc.
│       ├── molecules/        # FormBill, DataTable, etc.
│       ├── organisms/        # Sidebar, Dashboard, etc.
│       ├── hooks/            # Table hooks
│       └── config/           # Column definitions
└── .docs/                   # Project documentation
```

---

## Domain Entities

### Core Models

| Entity | File | Key Fields |
|--------|------|------------|
| **User** | packages/domain/entities/User.entity.ts | id, email, password, name, country, onboardingCompleted |
| **Company** | packages/domain/entities/Company.entity.ts | companyName, identificationNumber, vatCondition, currency |
| **Bill** | packages/domain/entities/Bill.entity.ts | number, status, total, balance, dianStatus, cufe |
| **BillItem** | packages/domain/entities/Bill.entity.ts | productId, quantity, price, taxRate, discount |
| **Client** | packages/domain/entities/Client.entity.ts | firstName, firstLastName, identificationNumber, email |
| **Product** | packages/domain/entities/Product.entity.ts | name, code, cost, basePrice, taxRate, trackStock |
| **Seller** | packages/domain/entities/Seller.entity.ts | name, identification |
| **Store** | packages/domain/entities/Store.entity.ts | name, address (warehouse) |
| **ListPrice** | packages/domain/entities/ListPrice.entity.ts | name, type, percentage |
| **Payment** | packages/domain/entities/Bill.entity.ts | amount, method, date, accountId |
| **BankAccount** | packages/domain/entities/Bill.entity.ts | name, type, balance, currency |

### Key Enums

```typescript
// Bill Status
enum BillStatus { DRAFT, ISSUED, PAID, PARTIALLY_PAID, CANCELLED }

// DIAN Status (Colombian Tax Authority)
enum DianStatus { PENDING, SENT, ACCEPTED, REJECTED }

// Payment Methods
enum PaymentMethod { CASH, CREDIT_CARD, DEBIT_CARD, TRANSFER, CHECK, DEPOSIT, CREDIT }

// User Roles
enum UserRole { OWNER, ADMIN, ACCOUNTANT, EMPLOYEE }
```

---

## Pages & Routes

### Public Routes
| Route | Purpose |
|-------|---------|
| `/[country]` | Landing page |
| `/[country]/Login` | Login |
| `/[country]/Register` | Registration |
| `/[country]/ForgotPassword` | Password recovery |

### Protected Routes (Dashboard)

| Route | Module | Purpose |
|-------|--------|---------|
| `/dashboard` | Core | Main dashboard with widgets |
| `/Onboarding` | Core | Setup wizard |
| `/profile-settings` | Settings | User profile |

#### Sales Module
| Route | Purpose |
|-------|---------|
| `/ventas/facturacion` | Bills listing |
| `/ventas/facturacion/create` | Create bill |
| `/ventas/facturacion/edit/[id]` | Edit bill |
| `/ventas/facturacion/view/[id]` | View bill |
| `/ventas/clientes` | Clients |
| `/ventas/productos` | Products |
| `/ventas/vendedor` | Sellers |
| `/ventas/pagos` | Payments |

#### Inventory Module
| Route | Purpose |
|-------|---------|
| `/inventario/precios` | Price lists |
| `/inventario/bodega` | Warehouse/stock |

---

## API Routes

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Login |
| `/api/auth/register` | POST | Register |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/session` | GET | Get session |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/auth/onboarding` | POST | Complete onboarding |
| `/api/auth/forgot-password` | POST | Request reset |
| `/api/auth/switch-company` | POST | Switch company |

### Bills
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bills` | GET, POST | List/create |
| `/api/bills/[id]` | GET, PUT, DELETE | Operations |
| `/api/bills/[id]/issue` | POST | Issue (DIAN) |
| `/api/bills/[id]/payments` | GET, POST | Payments |
| `/api/bills/[id]/cancel` | POST | Cancel |

### CRUD Resources
| Endpoint | Methods |
|----------|---------|
| `/api/clients` | GET, POST |
| `/api/clients/[id]` | GET, PUT, DELETE |
| `/api/products` | GET, POST |
| `/api/products/[id]` | GET, PUT, DELETE |
| `/api/sellers` | GET, POST |
| `/api/sellers/[id]` | GET, PUT, DELETE |
| `/api/stores` | GET, POST |
| `/api/stores/[id]` | GET, PUT, DELETE |
| `/api/list-prices` | GET, POST |
| `/api/list-prices/[id]` | GET, PUT, DELETE |

### DIAN (Colombian Tax Authority)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dian/send/[billId]` | POST | Send invoice |
| `/api/dian/status/[billId]` | GET | Check status |

---

## Components (packages/ui)

### Atoms
| Component | Purpose |
|-----------|---------|
| `Button` | Primary action button (variants: primary, secondary, outline, ghost) |
| `Input` | Text input with label support |
| `InputCurrency` | Formatted currency input |
| `Label` | Form label |
| `Select` | Dropdown (Radix UI based) |
| `Badge` | Status badges |
| `Skeleton` | Loading placeholder |

### Molecules
| Component | Purpose |
|-----------|---------|
| `FormBill` | Complete bill creation form with items table |
| `FormSection` | Grouped form sections |
| `DataTable` | Table with search, pagination, selection |
| `ModernTable` | Modern styled table variant |
| `PaymentModal` | Record payment modal |
| `PaymentBillModal` | Bill payment modal |
| `BillPreview` | Invoice preview |
| `QuickCreateModal` | Quick entity creation |
| `SessionExpiredModal` | Auth timeout modal |

### Organisms
| Component | Purpose |
|-----------|---------|
| `Sidebar` | Navigation sidebar with collapsible menu |
| `Navbar` | Top navigation bar |
| `GlobalSearch` | Command palette (Cmd+K) |
| `NotificationDropdown` | Notification panel |
| `Dashboard` | Drag-and-drop widget dashboard |
| `Onboarding` | Multi-step setup wizard |
| `SettingsModal` | Settings container |
| `ProfileSettings` | Profile form |
| `CompanySettings` | Company form |

---

## Hooks (packages/interfaces)

### Auth
| Hook | Returns |
|------|---------|
| `useSession()` | `{ user, isLoading, isAuthenticated, refresh, logout }` |
| `useLogin()` | Form handlers for login |
| `useRegister()` | Form handlers for registration |
| `useLogout()` | Logout function |

### CRUD (Standard Pattern)
Each entity has a pattern like `useClients()`, `useProducts()`, etc.

```typescript
// Standard CRUD hook returns:
{
  data,           // Array of entities
  isLoading,      // Loading state
  error,          // Error message or null
  refetch,        // Manual refetch function
  createEntity,   // Create function
  updateEntity,   // Update function
  deleteEntity,   // Delete function
}
```

### Table Hooks
| Hook | Purpose |
|------|---------|
| `useBillTable` | Bill table configuration |
| `useClientTable` | Client table configuration |
| `useProductTable` | Product table configuration |

---

## Key Patterns

### 1. Form Validation (Zod + React Hook Form)

**Schema Definition (packages/domain/src/schemas/):**
```typescript
export const createClientSchema = z.object({
  firstName: z.string().min(1, 'Requerido'),
  firstLastName: z.string().min(1, 'Requerido'),
  identificationNumber: z.string().min(1, 'Requerido'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});
```

**Usage in Hook:**
```typescript
const { register, handleSubmit, errors } = useForm<CreateClientDto>({
  resolver: zodResolver(createClientSchema),
});
```

### 2. API Route Pattern

```typescript
// apps/web/app/api/clients/route.ts
export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId, companyId } = auth;

  const clients = await prisma.client.findMany({
    where: { companyId, deletedAt: null },
  });

  return NextResponse.json({ data: clients });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = createClientSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { ...parsed.data, companyId: auth.companyId },
  });

  return NextResponse.json({ data: client }, { status: 201 });
}
```

### 3. React Query Pattern

```typescript
// packages/interfaces/src/hooks/features/Clients/useClient.ts
export function useClients() {
  const queryClient = useQueryClient();
  const CLIENTS_KEY = ['clients'];

  const { data, isLoading, error } = useQuery({
    queryKey: CLIENTS_KEY,
    queryFn: async () => {
      const res = await fetch('/api/clients');
      const json = await res.json();
      return json.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateClientDto) => {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS_KEY }),
  });

  return {
    clients: data as Client[],
    isLoading,
    error: error?.message ?? null,
    createClient: createMutation.mutateAsync,
  };
}
```

### 4. Multitenancy

Every data query MUST include `companyId`:

```typescript
const clients = await prisma.client.findMany({
  where: { companyId, deletedAt: null },
});
```

### 5. Billing Calculations

```typescript
// packages/domain/src/utils/billing.ts
export const calculateItemTotals = (item: {
  price: number;
  quantity: number;
  discountPercentage: number;
  taxRate: number;
}) => {
  const baseSubtotal = item.price * item.quantity;
  const discountAmount = baseSubtotal * (item.discountPercentage / 100);
  const taxableSubtotal = baseSubtotal - discountAmount;
  const taxAmount = taxableSubtotal * (item.taxRate / 100);
  const total = taxableSubtotal + taxAmount;

  return { baseSubtotal, discountAmount, taxableSubtotal, taxAmount, total };
};
```

### 6. Session Management

- Access token: 15 minutes (cookie: `access-token`)
- Refresh token: 7 days (cookie: `refresh-token`)
- User context available via `useSession()` hook

---

## Build Commands

```bash
pnpm dev          # Start development
pnpm build        # Full monorepo build
pnpm check-types  # TypeScript validation
pnpm lint         # ESLint
pnpm turbo clean  # Clear cache
```

---

## Important Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file - AI agent context |
| `.agents/instructions.md` | Agent rules |
| `.docs/architecture.md` | System architecture |
| `.docs/guides/` | Implementation guides |
| `apps/web/next.config.ts` | Next.js config |
| `turbo.json` | Turborepo config |
| `prisma/schema.prisma` | Database schema |

---

## Conventions

### Code Style
- **Commits**: English, atomic, grouped by logic
- **Variables/Functions**: English (camelCase)
- **Comments**: Spanish for context, English for code
- **Communication**: Spanish with user

### File Naming
- Components: PascalCase (`Dashboard.tsx`)
- Utilities: camelCase (`billing.ts`)
- Schemas: camelCase (`auth.schema.ts`)
- Routes: kebab-case (`create-bill/page.tsx`)

### Type Imports
Always import from `@domain` for shared types:
```typescript
import { type Client, type CreateClientDto } from '@domain/entities/Client.entity';
```
