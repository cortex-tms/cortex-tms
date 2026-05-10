# AGENTS.md — Multi-Agent Governance

**Project**: [Project Name]
**Last Updated**: TBD
**Owner**: TBD

---

## Purpose

Single source of truth for all AI agents working in this project. Every agent —
Claude Code, Cursor, GitHub Copilot, Windsurf, OpenCode, or any other tool — reads
this file before taking action.

**Precedence**: This file takes priority over any tool-specific config (`CLAUDE.md`,
`.cursorrules`, Copilot instructions, etc.). If any agent instruction conflicts with
this file, follow `AGENTS.md` and escalate to a human.

---

## Active Agents & Roles

<!-- Update for your project: list only the agents actually in use -->

| Agent | Tool | Primary Role | Trust Level |
|:------|:-----|:-------------|:------------|
| (agent 1) | | | |
| (agent 2) | | | |

> Update this table when adding or removing AI tools from the project.

---

## Capabilities Matrix

| Action | Any Agent | Requires Human Approval | Never |
|:-------|:---------:|:-----------------------:|:-----:|
| Edit feature code | ✓ | | |
| Refactor / rename | ✓ | | |
| Write or update tests | ✓ | | |
| Update documentation | ✓ | | |
| Add / remove npm dependencies | | ✓ | |
| Breaking API or schema changes | | ✓ | |
| Modify CI/CD pipelines | | ✓ | |
| Merge to main / protected branch | | | ✓ |
| Force push | | | ✓ |
| Publish to npm | | | ✓ |
| Modify auth or security config | | | ✓ |

---

## Shared Conventions (All Agents Must Follow)

- Read `docs/core/PATTERNS.md` before writing any code
- Follow `docs/core/DOMAIN-LOGIC.md` for business rules
- Async/await throughout — no raw Promise chains
- No `process.env` reads outside `src/config.ts`
- Write tests for all new functionality
- No direct commits to `main`
- Never skip linting or test runs

<!-- Update for your project: add Node-specific prohibitions here -->

---

## Handoff Protocol

When handing off between agents or sessions:

1. Document current state in `NEXT-TASKS.md`
2. Commit or stash in-progress work
3. Note any open decisions or blockers as comments in the relevant file

---

## Escalation Rules

Escalate to a human when:

- A change would affect more than 3 unrelated files
- A dependency with a security advisory must be added
- The business rule in `DOMAIN-LOGIC.md` is ambiguous or missing
- A breaking change to the public API or database schema is required
