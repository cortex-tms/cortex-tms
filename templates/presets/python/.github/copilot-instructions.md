# AI Coding Agent Instructions — [Project Name]

## Stack

<!-- Update for your project: fill in your specifics -->
- **Runtime**: Python <!-- e.g. 3.11, 3.12 -->
- **Package manager**: <!-- pip | poetry | uv | pipenv | conda -->
- **Framework**: <!-- e.g. FastAPI, Django, Flask, none -->
- **Test runner**: pytest

## Critical Rules

- Read `docs/core/PATTERNS.md` before writing any code.
- Read `docs/core/DOMAIN-LOGIC.md` for business rules and constraints.
- `from __future__ import annotations` is a useful convention for forward references.
- In `async def` functions: never block with synchronous I/O — use `asyncio.run_in_executor` or `anyio.to_thread`.
- Centralise config loading in `src/config.py` — no scattered `os.environ` reads.
- No `print()` in production code — use the `logging` module.
- Never use bare `except:` — always catch specific exception types.
- Never store secrets or API keys in source code.

<!-- Update for your project: add project-specific rules here -->

## Read Order

Before proposing changes, read in this order:

1. `NEXT-TASKS.md` — active sprint context
2. `docs/core/DOMAIN-LOGIC.md` — business rules
3. `docs/core/PATTERNS.md` — coding conventions
4. `docs/core/ARCHITECTURE.md` — structural boundaries

## Pre-Submission Checklist

- [ ] Logic verified against `DOMAIN-LOGIC.md`
- [ ] Tests added or updated and passing
- [ ] No untyped function signatures introduced
- [ ] No secrets or credentials in diff
