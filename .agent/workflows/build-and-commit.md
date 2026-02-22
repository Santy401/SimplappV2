---
description: Standardized process to validate build and perform atomic commits
---

// turbo-all
1. Validate Project Integrity
   - Run `pnpm build` from the repository root.
   - If build fails, identify the package causing the error and fix it before proceeding.

2. Group Changes Logically
   - Sort modified files following the dependency order defined in `.doc/GUIA_COMMITS.md`:
     1. Configuration and Dependencies
     2. Domain Entities and Schema
     3. Core Infrastructure/API Client
     4. Hooks and State Management
     5. UI Components
     6. Pages and Feature Implementation

3. Execute Atomic Commits
   - Use `git add` for each logical group.
   - Create commit messages in English using the format: `<Verb>: <Summary>`
   - Include bullet points for detailed changes.

4. Final Verification
   - Verify the commit history with `git log --oneline -N`.
   - Ensure the current branch is correctly named (e.g., `feature/...`, `fix/...`).
