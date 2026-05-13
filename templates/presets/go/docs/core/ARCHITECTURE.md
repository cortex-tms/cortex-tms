# Architecture — [Project Name]

## Project Type

<!-- Update for your project: check the one that applies, delete the rest -->

- [ ] API Service (REST / gRPC)
- [ ] CLI Tool
- [ ] Background Worker / Job Processor
- [ ] Library / Package
- [ ] Data Pipeline / ETL
- [ ] Script / Automation

## Directory Layout

<!-- Update for your project: replace with your actual structure -->

Standard Go application layout:

```
cmd/
  [binary-name]/
    main.go         ← entrypoint; wires dependencies, starts server
internal/
  [domain]/
    service.go      ← business logic
    repository.go   ← data access interface + implementation
    model.go        ← domain types
  config/
    config.go       ← env var loading and validation at startup
  server/
    server.go       ← HTTP/gRPC server setup
go.mod              ← module path and Go version
go.sum              ← dependency checksums (never edit manually)
```

**`cmd/`** — one subdirectory per binary. `main.go` only wires and starts; no business logic.

**`internal/`** — private packages. The Go compiler enforces that nothing outside this
module can import from `internal/`. Use it for all application code.

**`pkg/`** — only use this for code intended to be imported by *external* projects.
Most applications and services should keep everything in `internal/`. Do not create
`pkg/` unless you have a concrete external consumer.

<!-- Update for your project: remove sections that don't apply to your layout -->

## Request / Data Flow

<!-- Update for your project: trace a typical request through the layers -->

```
Incoming request
  → HTTP handler (parse, validate, auth)
  → Service (business logic, context propagation)
  → Repository (data access)
  → Response
```

## Database

<!-- Update for your project: describe your database setup -->

- Driver: (e.g. `pgx/v5` for PostgreSQL, `modernc.org/sqlite`)
- Migrations: (e.g. `golang-migrate/migrate`, `goose`, manual SQL files)
- Connection: pool via `DATABASE_URL` environment variable

## Dependency Conventions

- All dependencies in `go.mod` — no vendoring unless required by policy
- Internal packages do not import from `cmd/` — dependency direction is inward
- No circular imports between packages (enforced at compile time)
- External clients (HTTP, database, queue) are wrapped behind interfaces so they
  can be substituted in tests

## Common Go Layouts (Reference)

### HTTP API Service

```
cmd/api/
  main.go           ← wire dependencies, start server
internal/
  handler/          ← HTTP handlers (thin — parse, delegate, respond)
  service/          ← business logic
  repository/       ← data access
  model/            ← domain types
  config/           ← env var loading
```

### CLI Tool

```
cmd/[tool]/
  main.go           ← cobra/flag setup, os.Exit
internal/
  command/          ← command implementations
  config/           ← config loading
```

### Library / Package

```
[package].go        ← public API surface (keep it small)
internal/           ← implementation details callers cannot import
example_test.go     ← runnable examples (appear in godoc)
```

<!-- Update for your project: remove the layouts that don't apply -->

## Key Design Decisions

<!-- Update for your project: link to DECISIONS.md entries for major choices -->

- See `docs/core/DECISIONS.md` for rationale on framework, database, and deployment choices.
