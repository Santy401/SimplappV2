# Simplapp V2: Project Instructions

## Overview

This document contains the core rules and preferences for the Simplapp V2 project. **All AI agents** (Claude, Gemini, OpenCode, etc.) must adhere to these foundational principles.

For agent-specific operating instructions, refer to:

- `.agents/CLAUDE/instructions.md`: Deep architectural planning and complex logic refactoring.
- `.agents/GEMINI/instructions.md`: Iterative development, precise debugging, and tool usage.
- `.agents/REFACTOR/instructions.md`: Code refactoring specialist with proposal-first approach.

---

## Core Philosophies

- **Atomic Commits**: Group changes by logic and dependency. Never commit broken code.
- **English for Code/Git**: Use English for code (functions, variables, etc.) and commit messages. Spanish should be used for communication with the user.
- **Monorepo Architecture**:
  - `apps/web`: Next.js frontend and main API.
  - `packages/domain`: Core logic, entities, and business rules. No UI dependencies.
  - `packages/interfaces`: Shared hooks, API client, and high-level interfaces.
  - `packages/ui`: Shared design system and UI components.
- **Strict Typing**: Use TypeScript interfaces and enums from `@domain` to ensure consistency across the monorepo.
- **Directory Structure**: Read `.docs/architecture.md` for proper understanding of the documentation standard and refer directly to the subdirectories in `.docs/` instead of legacy loose files.

## Build and Quality

- **Validation**: Always run a full build (`pnpm build` at root) before pushing changes.
- **Monorepo Imports**: Cross-package imports should be handled via workspace aliases (e.g., `@domain/*`, `@ui/*`).
- **TSConfig Integrity**: Ensure `rootDir` and `include` paths in sub-packages allow for resolving dependencies correctly without including built files or unnecessary external code.

## Documentation References

We maintain professional, structured documentation in the `.docs/` directory.

- **Architecture**: `.docs/architecture.md`, `.docs/architecture/`
- **Guides**: `.docs/guides/` (commits, deployment, multitenant, skeletons)
- **API**: `.docs/api/endpoints.md`
- **Tech Stack**: `.docs/stack/technologies.md`
- **Workflows**: `.agents/CLAUDE/workflows/` and `.agents/GEMINI/workflows/`

## Mentorship & Learning Rules (The "Teacher" Mode)

The goal is to help the user understand the code so they can eventually handle issues independently.

1.  **Root Cause First**: Explain _why_ errors happened in plain language.
2.  **"Show, Don't Just Do"**: Explain the logic behind the solution.
3.  **Gradual Independence**: Describe steps for repetitive tasks and invite the user to try them first.
4.  **Reference Internal Docs**: Frequently refer to `.docs/` guides.
5.  **Code Comments for Learning**: Add educational comments explaining _functional_ intent.
6.  **Architecture Overviews**: Periodically offer to review the architecture (routing, SPA, etc.).
