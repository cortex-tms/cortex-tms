# Architecture — [Project Name]

## Project Type

<!-- Update for your project: check the one that applies, delete the rest -->

- [ ] API Service (REST / GraphQL)
- [ ] CLI Tool
- [ ] Data Pipeline / ETL
- [ ] Background Worker / Job Processor
- [ ] Library / Package
- [ ] Script / Automation

## Directory Layout

<!-- Update for your project: replace with your actual structure -->

```
src/
  [project]/
    __init__.py     ← version, main API exports
    config.py       ← env var loading and validation
    routes/         ← HTTP layer (thin handlers only)
    services/       ← business logic
    models/         ← data models and schemas
    utils/          ← pure helpers
    exceptions.py   ← exception hierarchy
tests/
  conftest.py       ← shared fixtures
  unit/
  integration/
pyproject.toml      ← single source of truth for deps + build config
```

## Request / Data Flow

<!-- Update for your project: trace a typical request through the layers -->

```
Incoming request
  → Route handler (validation, auth)
  → Service (business logic)
  → Repository / model (data access)
  → Response
```

## Database

<!-- Update for your project: describe your database setup -->

- Engine: (e.g. PostgreSQL, SQLite, MongoDB)
- ORM / query builder: (e.g. SQLAlchemy, Django ORM, raw psycopg)
- Migration tool: (e.g. Alembic, Django migrations)
- Connection: pooled via env var `DATABASE_URL`

## Dependency Conventions

- Runtime deps in `[project.dependencies]` in `pyproject.toml`.
- Dev/test deps in `[project.optional-dependencies]` or `[tool.poetry.group.dev]`.
- No circular imports between modules. Services do not import routes.
- External API clients are wrapped in a thin adapter so they can be stubbed in tests.

## Common Python Layouts (Reference)

### FastAPI Service

```
src/[project]/
  main.py           ← FastAPI app setup, lifespan, routers
  routes/
  services/
  models/           ← Pydantic schemas + ORM models
  db/               ← session, engine, base
```

### CLI Tool (Click / Typer)

```
src/[project]/
  cli.py            ← Click/Typer entrypoint
  commands/
  utils/
pyproject.toml      ← [project.scripts] entry point
```

### Library / Package

```
src/[project]/
  __init__.py       ← public API surface
  core/
  utils/
tests/
  unit/
  integration/
```

<!-- Update for your project: remove the layouts that don't apply -->

## Key Design Decisions

<!-- Update for your project: link to DECISIONS.md entries for major choices -->

- See `docs/core/DECISIONS.md` for rationale on framework, database, and deployment choices.
