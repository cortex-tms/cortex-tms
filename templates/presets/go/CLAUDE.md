# Agent Instructions — [Project Name]

## Project Overview

[Description]

## Stack

<!-- Update for your project: fill in the specifics, remove unused lines -->

- **Runtime**: Go <!-- e.g. 1.21, 1.22, 1.23 -->
- **Module path**: <!-- e.g. github.com/user/repo — replace with your go.mod module path -->
- **Framework**: <!-- e.g. net/http (stdlib), Gin, Echo, Chi, none -->
- **Test runner**: go test
- **Database**: <!-- e.g. PostgreSQL via pgx, SQLite via modernc, none -->

## Commands

| Task | Command |
|------|---------|
| Run tests | `go test ./...` |
| Run tests (verbose) | `go test -v ./...` |
| Build | `go build ./...` |
| Format | `gofmt -w .` |
| Lint | `golangci-lint run` |
| Vet | `go vet ./...` |
| Tidy modules | `go mod tidy` |

Tests must pass before committing.

## Code Conventions

- `context.Context` is the first parameter in every function that does I/O or calls external services
- Errors are returned explicitly — never use `panic` in production code paths
- Wrap errors with `fmt.Errorf("operation: %w", err)` to preserve the chain
- Accept interfaces, return concrete types — keeps callers flexible, implementations explicit
- `defer` for all resource cleanup (file closes, mutex unlocks, cancel functions)
- No global mutable state — pass dependencies explicitly via function parameters or a struct

## Key Files

| File | Purpose |
|------|---------|
| `go.mod` | Module path and dependency versions — never edit manually, use `go get` |
| `docs/core/PATTERNS.md` | Code patterns — follow these when writing new code |
| `docs/core/ARCHITECTURE.md` | Project structure and layer boundaries |
| `docs/core/DECISIONS.md` | Why the major decisions were made |

<!-- Update for your project: adjust paths to match your actual structure -->

## Testing Guidance

- Tests live alongside production code: `foo.go` → `foo_test.go`
- Use `_test` package suffix for black-box tests (`package foo_test`)
- Table-driven tests are idiomatic — use `t.Run` for subtests
- Use `t.Helper()` in test helper functions
- Prefer real behaviour over mocks; use interfaces to substitute in tests
