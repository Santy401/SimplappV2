# AGENTS.md - Guidelines for AI Agents

This file provides instructions for AI agents operating in the SimplappV2 repository.

---

## 1. Build, Lint, and Test Commands

### Root Commands (run from project root with `pnpm`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all dev servers via Turbo |
| `pnpm dev:web` | Run Next.js web app only |
| `pnpm build` | Build all packages via Turbo |
| `pnpm check-types` | TypeScript type checking |
| `pnpm lint` | ESLint on all packages |
| `pnpm lint:fix` | Auto-fix ESLint issues |

### App-Specific Commands

```bash
# Web app (apps/web)
cd apps/web
pnpm dev          # Start dev server
pnpm build        # Build production
pnpm lint         # Lint web app

# Database
cd apps/web
pnpm db:seed      # Seed database
```

### Running Tests

Tests use Vitest. Run a single test file:

```bash
# Run specific test file
npx vitest run packages/domain/src/utils/billing.test.ts

# Run with watch mode
npx vitest packages/domain/src/utils/billing.test.ts

# Run all tests
npx vitest run
```

---

## 2. Code Style Guidelines

### General Principles

- **Language**: English for code (functions, variables, comments), Spanish for user communication
- **Commits**: Atomic commits grouping related changes. Never commit broken code.
- **Comments**: DO NOT add comments unless explicitly requested by the user

### TypeScript

- **Strict mode** enabled in `tsconfig.base.json`
- Use interfaces from `@domain` for shared types
- Avoid `any` (ESLint warns against it)
- Prefix unused variables with `_` (e.g., `_unusedParam`) to suppress warnings

### Imports and Aliases

Use workspace aliases for cross-package imports:

```typescript
// Correct
import { User } from '@domain/entities/user.entity';
import { Button } from '@ui/button';
import { useUsers } from '@interfaces/hooks/features/users';

// Avoid relative paths across packages
```

| Alias | Path |
|-------|------|
| `@domain/*` | `packages/domain/src/*` |
| `@interfaces/*` | `packages/interfaces/src/*` |
| `@ui/*` | `packages/ui/*` |

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Components**: PascalCase (e.g., `UserList.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUsers`)
- **Interfaces/Types**: PascalCase (e.g., `UserEntity`)
- **Enums**: PascalCase with PascalCase members

### Monorepo Structure

```
apps/
  web/              # Next.js frontend + API routes
packages/
  domain/           # Business logic, entities (no UI deps)
  interfaces/       # Hooks, API client, shared interfaces
  ui/               # Design system, UI components
```

### Error Handling

- Use try-catch in API routes
- Return appropriate HTTP status codes (401, 404, 500)
- Log errors with `console.error`
- Throw descriptive errors in mutations

### ESLint Rules

Configured in `eslint.config.mjs`:
- `@typescript-eslint/no-unused-vars`: warn
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/ban-ts-comment`: warn

---

## 3. Agent-Specific Instructions

### Claude (Architect)

- Located in `.agents/CLAUDE/`
- Handles architectural planning, complex refactors
- Always write plans before executing
- Refer to `.docs/architecture/` for context

### Gemini (Iterative Developer)

- Located in `.agents/GEMINI/`
- Handles rapid iteration, bug fixes
- Execute and verify changes with tests
- Stay in scope - focus on specific tasks

### Shared Rules

From `.agents/instructions.md`:
- Read `.docs/architecture.md` and subdirectories for context
- Use workflows from `.agents/CLAUDE/workflows/` when applicable
- Follow Teacher Mode: explain root causes, don't just fix

---

## 4. Key Documentation

| File | Purpose |
|------|---------|
| `.docs/architecture.md` | System design overview |
| `.docs/architecture/routing.md` | SPA routing via middleware |
| `.docs/architecture/data.md` | State management and DB |
| `.docs/guides/implementation.md` | Feature implementation guide |
| `.docs/guides/commits.md` | Commit conventions |
| `.docs/api/endpoints.md` | API documentation |

---

## 5. Before Committing

1. Run `pnpm build` to verify compilation
2. Run `pnpm check-types` for type safety
3. Run `pnpm lint` (or `pnpm lint:fix`)
4. Ensure no debug code or console.logs remain
