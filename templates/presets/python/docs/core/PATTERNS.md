# Code Patterns — [Project Name]

## Type Hints

Use type hints throughout. `from __future__ import annotations` is a useful
convention for forward references and is commonly added at the top of each module.

```python
from __future__ import annotations

from typing import TypeAlias

# Builtin generics (Python 3.9+)
def process(items: list[int]) -> dict[str, int]:
    return {str(i): i for i in items}

# Union with | (Python 3.10+)
def find(key: str) -> str | None:
    return store.get(key)

# Type alias
UserId: TypeAlias = str
```

## Error Handling

Define a base exception for the project; create domain-specific subclasses.
Raise at the source; catch and translate at boundaries (HTTP handler, CLI
entrypoint, queue consumer). Never swallow errors silently.

```python
class AppError(Exception):
    """Base exception for all application errors."""

class NotFoundError(AppError):
    def __init__(self, resource: str) -> None:
        super().__init__(f"{resource} not found")

class ValidationError(AppError):
    pass
```

<!-- Update for your project: list your project-specific error classes here -->

## Module Structure

Organise around concerns, not file types. Each module exports one primary
responsibility.

```
src/
  [project]/
    services/     ← business logic, no framework coupling
    routes/       ← HTTP handlers, thin — delegate to services
    models/       ← data models and schemas
    utils/        ← pure helpers with no side effects
    exceptions.py ← exception hierarchy
    config.py     ← environment variable loading
```

<!-- Update for your project: adjust directory layout to match your actual structure -->

## Environment Variables

Centralise config loading in `src/config.py` and validate at startup. Avoid
scattered `os.environ` reads throughout the codebase.

```python
# config.py — load once, validate, export typed config
import os

def _require(key: str) -> str:
    val = os.environ.get(key)
    if not val:
        raise RuntimeError(f"Missing required env var: {key}")
    return val

DATABASE_URL: str = _require("DATABASE_URL")
PORT: int = int(os.environ.get("PORT", "8000"))
```

## Testing

Use pytest with `conftest.py` for shared fixtures. Mirror `src/` structure in `tests/`.

```
tests/
  conftest.py         ← shared fixtures (db, client, etc.)
  unit/
    test_services.py
  integration/
    test_api.py
```

Prefer real behaviour over mocks — use in-memory databases (SQLite) or fixtures
rather than heavy mock patching.

## Async

Use `asyncio.run()` as the top-level entry point. Create concurrent tasks with
`asyncio.create_task()`; collect results with `asyncio.gather()`.

```python
import asyncio

async def main() -> None:
    task1 = asyncio.create_task(fetch(url1))
    task2 = asyncio.create_task(fetch(url2))
    results = await asyncio.gather(task1, task2)
    return results

if __name__ == "__main__":
    asyncio.run(main())
```

In `async def` functions, never call blocking I/O directly. Use
`asyncio.run_in_executor` or `anyio.to_thread.run_sync` to offload.

## Logging

Use the standard `logging` module. Never use `print()` in production code.

```python
import logging

logger = logging.getLogger(__name__)

def do_work() -> None:
    logger.info("Starting work")
    # ...
    logger.debug("Detail: %s", detail)
```

<!-- Update for your project: specify your log level convention and handler setup -->
