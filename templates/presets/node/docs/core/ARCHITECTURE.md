# Architecture — [Project Name]

## Project Type

<!-- Update for your project: check the one that applies, delete the rest -->

- [ ] API Service (REST / GraphQL)
- [ ] CLI Tool
- [ ] Background Worker / Job Processor
- [ ] Monorepo (list packages below)
- [ ] Library / SDK

## Directory Layout

<!-- Update for your project: replace with your actual structure -->

```
src/
  index.ts          ← entrypoint
  config.ts         ← env var loading and validation
  routes/           ← HTTP layer (thin handlers only)
  services/         ← business logic
  repositories/     ← data access
  utils/            ← pure helpers
  types/            ← shared TypeScript types
tests/
  unit/
  integration/
```

## Request / Data Flow

<!-- Update for your project: trace a typical request through the layers -->

```
Incoming request
  → Route handler (validation, auth)
  → Service (business logic)
  → Repository (data access)
  → Response
```

## Database

<!-- Update for your project: describe your database setup -->

- Engine: (e.g. PostgreSQL, SQLite, MongoDB)
- ORM / query builder: (e.g. Prisma, Drizzle, Knex, raw)
- Migration tool: (e.g. `prisma migrate`, `knex migrate`)
- Connection: pooled via env var `DATABASE_URL`

## Dependency Conventions

- **Runtime deps** go in `dependencies`.
- **Build/type/test tools** go in `devDependencies`.
- No circular imports between modules. Services do not import routes.
- External API clients are wrapped in a thin adapter so they can be stubbed in tests.

## Common Node Layouts (Reference)

### API Service

```
src/
  app.ts            ← Express/Fastify/Hono setup
  routes/
  middleware/
  services/
  db/
```

### CLI Tool

```
src/
  cli.ts            ← Commander/yargs entrypoint
  commands/
  utils/
bin/
  my-tool.js        ← executable shim
```

### Monorepo

```
packages/
  core/             ← shared logic
  api/              ← HTTP service
  cli/              ← CLI tool
  web/              ← frontend
pnpm-workspace.yaml (or turbo.json)
```

<!-- Update for your project: remove the layouts that don't apply -->

## Key Design Decisions

<!-- Update for your project: link to DECISIONS.md entries for major choices -->

- See `docs/core/DECISIONS.md` for rationale on framework, database, and deployment choices.
