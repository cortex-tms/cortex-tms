# Domain Logic — [Project Name]

## Overview

<!-- Update for your project: describe the core domain in 2-3 sentences -->

## Key Domain Concepts

<!-- Update for your project: list and define your domain entities -->

| Term | Definition |
|------|------------|
| (example) | Replace with your domain terms |

## Python Runtime Conventions

### GIL Awareness

CPU-bound work is offloaded to `ProcessPoolExecutor` — never run in the main
thread or event loop. I/O-bound concurrency uses `asyncio` or `ThreadPoolExecutor`.

### Async I/O

In `async def` functions, blocking I/O calls must be wrapped in
`asyncio.run_in_executor` (or `anyio.to_thread.run_sync`). Calling blocking
I/O directly inside an async function stalls the event loop.

### Package Manager

<!-- Update for your project: delete the rows that don't apply -->

| Manager | Lock file | CI install command |
|---------|------------|-------------------|
| pip | `requirements.txt` | `pip install -r requirements.txt` |
| poetry | `poetry.lock` | `poetry install --no-root` |
| uv | `uv.lock` | `uv sync --frozen` |
| pipenv | `Pipfile.lock` | `pipenv install --deploy` |
| conda | `conda-lock.yml` | `conda-lock install` |

### Versioning

Follows semver. Breaking changes bump the major version. Target Python versions
follow the CPython EOL schedule — drop a version once it reaches end-of-life.

## Business Rules

<!-- Update for your project: document the non-obvious rules that the codebase enforces -->

1. (example rule — replace this)

## External Integrations

<!-- Update for your project: list third-party services, APIs, or databases this project depends on -->

| Service | Purpose | Credentials |
|---------|---------|-------------|
| (example) | | env var: |

## Known Constraints

<!-- Update for your project: document hard limits, rate limits, or invariants AI agents must not violate -->
