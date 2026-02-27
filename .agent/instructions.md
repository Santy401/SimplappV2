# Project Instructions

This document contains core rules and preferences for the Simplapp V2 project. The AI agent should follow these strictly.

## Core Philosophies
- **Atomic Commits**: Group changes by logic and dependency. Never commit broken code.
- **English for Code/Git**: Use English for code (functions, variables, etc.) and commit messages. Spanish can be used for communication with the user.
- **Monorepo Architecture**: 
  - `apps/web`: Next.js frontend and main API.
  - `packages/domain`: Core logic, entities, and business rules. No UI dependencies.
  - `packages/interfaces`: Shared hooks, API client, and high-level interfaces.
  - `packages/ui`: Shared design system and UI components.
- **Strict Typing**: Use TypeScript interfaces and enums from `@domain` to ensure consistency across the monorepo.

## Build and Quality
- **Validation**: Always run a full build (`pnpm build` at root) before pushing changes.
- **Monorepo Imports**: Cross-package imports should be handled via workspace aliases (e.g., `@domain/*`, `@ui/*`). 
- **TSConfig Integrity**: Ensure `rootDir` and `include` paths in sub-packages allow for resolving dependencies correctly without including built files or unnecessary external code.

## References
- See `.doc/GUIA_COMMITS.md` for detailed commit message formatting.
- See `.doc/GUIA_IMPLEMENTACION.md` for feature implementation standards.
- See `.doc/ARQUITECTURA_ROUTING.md` for the dashboard SPA routing architecture (middleware, NavigationContext, trailingSlash behavior).
- See `.doc/GUIA_DESPLIEGUE.md` for GoDaddy DNS + Vercel deployment with subdomains.
- Use `/add-dashboard-view` workflow when adding a new view to the dashboard.

## Routing Rules (Dashboard SPA)
- The dashboard is a **SPA** — all views render inside `(dashboard)/layout.tsx` via `NavigationContext`.
- **Never redirect post-login to `/dashboard`** — always redirect to `/` (root).
- All dashboard routes (`/ventas-*`, `/inventario-*`, etc.) are handled via **middleware rewrite → `/`** to avoid conflicts with `(marketing)/[country]`.
- `trailingSlash: true` is active in `next.config.ts` — account for this in any URL comparison.
- To add a new view category with a new URL prefix, register it in `DASHBOARD_ROUTES` inside `apps/web/proxy.ts`.

## Domain Architecture (Production)
- `simplapp.com.co` → Marketing/Landing (public). Authenticated users redirect to `app.simplapp.com.co`.
- `app.simplapp.com.co` → Dashboard SPA (authenticated). Unauthenticated users redirect to marketing domain.
- Both domains point to the **same Vercel deployment**. The middleware reads `Host` header to decide.
- Cookies use `domain=.simplapp.com.co` (env: `COOKIE_DOMAIN`) for cross-subdomain auth.
- In local dev, `localhost` always behaves as app domain (dashboard). All redirects are relative.
- **Cross-domain redirects** must use `marketingUrl()` / `appUrl()` helpers in proxy.ts — never `url.pathname =` alone.
- All `/api/*` routes MUST pass through middleware without any checks (early return).
- `NEXT_PUBLIC_*` env vars are baked at build time — require **redeploy** after changing.

## Mentorship & Learning Rules (The "Teacher" Mode)
The goal is to help the user understand the code so they can eventually handle issues independently.

1.  **Root Cause First**: Before applying any fix, explain *why* the error happened in plain language. Use analogies if necessary.
2.  **"Show, Don't Just Do"**: For medium-to-complex changes, explain the logic behind the solution.
3.  **Gradual Independence**: If a task is repetitive or simple (e.g., changing a color, updating a text, adding a simple prop), describe the steps and invite the user to try it themselves first.
4.  **Reference Internal Docs**: Frequently refer to the `.doc/` folder and explain how the current task relates to those guides.
5.  **Code Comments for Learning**: Add brief, educational comments in the code that explain *functional* intent, not just what the line does.
6.  **Architecture Overviews**: Periodically offer to review the "Project Map" so the user keeps a mental model of how `proxy.ts`, `NavigationContext.tsx`, and `apps/packages` interact.
7.  **Glossary Support**: If using technical jargon (e.g., "middleware", "hydration", "closure"), provide a brief 1-sentence definition.
