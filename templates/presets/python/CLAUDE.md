# Agent Instructions — [Project Name]

## Project Overview

[Description]

## Stack

<!-- Update for your project: fill in the specifics, remove unused lines -->

- **Runtime**: Python <!-- e.g. 3.11, 3.12 -->
- **Package manager**: <!-- pip | poetry | uv | pipenv | conda -->
- **Framework**: <!-- e.g. FastAPI, Django, Flask, none -->
- **Test runner**: pytest
- **Database**: <!-- e.g. PostgreSQL via SQLAlchemy, SQLite, none -->

## Commands

<!-- Update for your project: keep the row that matches your package manager, delete the rest -->

| Task | pip / venv | poetry | uv | pipenv | conda |
|------|-----------|--------|-----|--------|-------|
| Run tests | `pytest` | `poetry run pytest` | `uv run pytest` | `pipenv run pytest` | `pytest` |
| Lint | `ruff check .` | `poetry run ruff check .` | `uv run ruff check .` | `pipenv run ruff check .` | `ruff check .` |
| Format | `ruff format .` | `poetry run ruff format .` | `uv run ruff format .` | `pipenv run ruff format .` | `ruff format .` |
| Type check | `mypy src/` | `poetry run mypy src/` | `uv run mypy src/` | `pipenv run mypy src/` | `mypy src/` |

Tests must pass before committing.

## Code Conventions

- Type hints throughout — `from __future__ import annotations` is a useful convention for forward references
- In `async def` functions: never block with synchronous I/O — use `asyncio.run_in_executor` or `anyio.to_thread`
- Custom exceptions raised at source, caught and translated at boundaries
- Centralize config loading in `src/config.py` and validate at startup — no scattered `os.environ` reads
- No `print()` in production paths — use the `logging` module

## Key Files

| File | Purpose |
|------|---------|
| `src/config.py` | Environment variable loading — edit here for new env vars |
| `docs/core/PATTERNS.md` | Code patterns — follow these when writing new code |
| `docs/core/ARCHITECTURE.md` | Project structure and layer boundaries |
| `docs/core/DECISIONS.md` | Why the major decisions were made |

<!-- Update for your project: adjust paths to match your actual structure -->

## Testing Guidance

- Tests live in `tests/` mirroring `src/` structure
- Unit tests in `tests/unit/`, integration tests in `tests/integration/`
- Run with pytest (exact command depends on your package manager — see Commands table above)
- Use `conftest.py` for shared fixtures; prefer real in-memory fixtures over mocks
