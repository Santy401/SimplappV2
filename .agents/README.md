# .agents — AI Agents Configuration

This directory contains specialized AI agents for working on Simplapp V2.

## Structure

```
.agents/
├── instructions.md          # Core rules for ALL agents (start here)
├── CLAUDE/                  # Architect & Deep Reasoner
│   ├── instructions.md
│   └── workflows/           # Reusable workflow templates
├── GEMINI/                  # Iterative Developer & Debugger
│   ├── instructions.md
│   └── workflows/
├── REFACTOR/                # Code Refactoring Specialist
│   └── instructions.md
├── DEBUG/                   # Bug Investigation Specialist
│   └── instructions.md
└── skills/                  # Specialized skill libraries
    ├── code-refactoring/
    └── interface-design/
```

## Agent Selection Guide

| Task | Agent | Why |
|------|-------|-----|
| New feature architecture | CLAUDE | Deep planning, long context |
| Complex refactoring | REFACTOR | Proposal-first approach |
| Bug investigation | DEBUG | Root cause analysis |
| Quick iteration | GEMINI | Fast execution, terminal access |
| General coding | Any | Core rules apply to all |

## Adding a New Agent

1. Create `agents/{NAME}/instructions.md`
2. Define role, methodology, and limits
3. Include **The Proposal Protocol** if the agent modifies code
4. Add to this index

## For OpenCode Users

OpenCode will automatically read `CLAUDE.md` in the project root. This provides the same context as the `.agents/` directory.
