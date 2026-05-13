# AI Coding Agent Instructions — [Project Name]

## Stack

<!-- Update for your project: fill in your specifics -->
- **Runtime**: Go <!-- e.g. 1.21, 1.22, 1.23 -->
- **Module path**: <!-- e.g. github.com/user/repo -->
- **Framework**: <!-- e.g. net/http (stdlib), Gin, Echo, Chi, none -->
- **Test runner**: go test

## Critical Rules

- Read `docs/core/PATTERNS.md` before writing any code.
- Read `docs/core/DOMAIN-LOGIC.md` for business rules and constraints.
- `context.Context` is the first parameter in every function that performs I/O.
- Return errors explicitly — never use `panic` in production code paths.
- Wrap errors: `fmt.Errorf("operation: %w", err)` — preserve the chain.
- Accept interfaces, return concrete types.
- `defer` immediately after acquiring any resource (file, lock, cancel func).
- No global mutable state — pass dependencies explicitly.
- Never edit `go.mod` or `go.sum` manually — use `go get` and `go mod tidy`.
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
- [ ] Tests added or updated and passing (`go test ./...`)
- [ ] `go vet ./...` passes with no warnings
- [ ] `gofmt -w .` applied (or `gofmt -l .` shows no diff)
- [ ] No secrets or credentials in diff
