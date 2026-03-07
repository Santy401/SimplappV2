# Simplapp V2: Project Architecture & Documentation

This directory contains the central documentation for the Simplapp V2 project. The documentation is divided into specialized folders to maintain a clean and professional structure.

## 📌 Directory Structure

### 1. `architecture/`

Contains high-level system design, data flows, and routing principles.

- **[Data Architecture & Contexts](architecture/data.md)**: Explains the persistent state, global contexts (`NavigationContext`, `AppStateContext`), database structure, and security.
- **[Routing Architecture (SPA)](architecture/routing.md)**: Details how the Next.js Dashboard SPA works, the middleware proxy, and URL rewrites.

### 2. `api/`

Contains backend documentation.

- **[API Endpoints](api/endpoints.md)**: Details authentication flows (double token), business endpoints, and rate limiting.

### 3. `guides/`

Contains operational guides and step-by-step procedures for development.

- **[Commits & Version Control](guides/commits.md)**: Rules for writing atomic commits and branch naming.
- **[Deployment](guides/deployment.md)**: How the project is deployed using Vercel, DNS configurations, and environment variables.
- **[Implementation Rules](guides/implementation.md)**: Coding standards, component creation, and best practices.
- **[Multitenant Approach](guides/multitenant.md)**: How the system handles multiple companies and users.
- **[UI Skeletons](guides/skeletons.md)**: Guidelines for loading states and perceived performance.

### 4. `stack/`

Contains information about the tools used.

- **[Technologies](stack/technologies.md)**: Overview of the tech stack (Next.js, Tailwind, Prisma, TanStack Query, etc.).

### 5. `runbooks/`

Contains specific incident responses, complex fixes, and operational scripts.

- **fixes/fix-list-price-delete-refresh.md**: Post-mortem and fix documentation for the price list deletion bug.

---

## 🤖 AI Agents Usage

This project uses two specialized AI agents to assist in development. Their instructions and workflows are located in the `.agent/` directory.

- **Claude (`.agent/CLAUDE/`)**: Used for architectural planning, complex refactors, and writing initial feature designs. It acts as the "Architect".
- **Gemini (`.agent/GEMINI/`)**: Used for rapid iteration, bug fixing, tool execution, and navigating the filesystem. It acts as the "Iterative Developer".

Always adhere to the instructions located in `.agent/instructions.md`.
