# AGENTS.md — Multi-Agent Governance

**Project**: [Project Name]
**Last Updated**: TBD
**Owner**: TBD

---

## Purpose

Single source of truth for all AI agents working in this project. Every agent —
Claude Code, Cursor, GitHub Copilot, Windsurf, or any other tool — reads this
file before taking action.

**Precedence**: This file takes priority over any tool-specific config (`CLAUDE.md`,
`.cursorrules`, Copilot instructions, etc.). If any agent instruction conflicts with
this file, follow `AGENTS.md` and escalate to a human.

---

## Active Agents & Roles

| Agent      | Tool              | Primary Role                   | Trust Level                  |
|:-----------|:------------------|:-------------------------------|:-----------------------------|
| Claude     | Anthropic Claude  | Implementation + planning      | High — with human approval   |
| Copilot    | GitHub Copilot    | Inline code completion         | Medium — suggestions only    |

> Update this table when adding or removing AI tools from the project.

---

## Capabilities Matrix

| Action                          | Any Agent | Requires Human Approval | Never |
|:--------------------------------|:---------:|:-----------------------:|:-----:|
| Edit feature code               | ✓         |                         |       |
| Refactor / rename               | ✓         |                         |       |
| Write or update tests           | ✓         |                         |       |
| Update documentation            | ✓         |                         |       |
| Add / remove dependencies       |           | ✓                       |       |
| Breaking API or schema changes  |           | ✓                       |       |
| Modify CI/CD pipelines          |           | ✓                       |       |
| Merge to main / protected branch|           |                         | ✓     |
| Force push                      |           |                         | ✓     |
| Publish releases (npm, PyPI…)   |           |                         | ✓     |
| Modify auth or security config  |           |                         | ✓     |

---

## Shared Conventions (All Agents Must Follow)

- Read `docs/core/PATTERNS.md` before writing any code
- Follow `docs/core/DOMAIN-LOGIC.md` for business rules
- Write tests for all new functionality
- No direct commits to `main`
- Never skip linting or test runs

---

## Handoff Protocol

| From           | To      | When                                              |
|:---------------|:--------|:--------------------------------------------------|
| Claude Code    | Human   | Blocked, ambiguous scope, or architecture decision needed |
| Claude Code    | Copilot | Inline completion during active editing session   |
| Any Agent      | Human   | Before any action in the "Requires Human Approval" column |

---

## Escalation Rules

Stop and ask a human when:

- A breaking change is required
- A new dependency must be selected
- A security concern is identified
- The task touches infrastructure or deployment
- Scope remains unclear after 2 attempts to clarify

---

## Universal Prohibitions

No agent, regardless of tool or trust level, may ever:

- Force push to any branch
- Merge code without human review
- Publish packages to registries independently
- Modify authentication, authorisation, or security configuration
- Commit secrets, credentials, or API keys

---

<!-- @cortex-tms-version 4.0.2 -->
