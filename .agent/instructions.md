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
