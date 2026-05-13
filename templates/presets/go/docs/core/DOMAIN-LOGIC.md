# Domain Logic — [Project Name]

## Overview

<!-- Update for your project: describe the core domain in 2-3 sentences -->

## Key Domain Concepts

<!-- Update for your project: list and define your domain entities -->

| Term | Definition |
|------|------------|
| (example) | Replace with your domain terms |

## Go Runtime Conventions

### Module Path

<!-- Update for your project: replace with your actual module path -->

This project's module path is declared in `go.mod`:

```
module github.com/[org]/[repo]
```

All internal imports use this path. Never edit `go.mod` or `go.sum` manually —
use `go get` to add or update dependencies and `go mod tidy` to remove unused ones.

### Context Propagation

`context.Context` carries request-scoped values, deadlines, and cancellation signals.
Pass it as the first argument to every function that performs I/O. Do not store
context in structs.

Cancellation propagates automatically: if the parent context is cancelled (e.g.
the HTTP request is abandoned), all downstream operations sharing that context
will be cancelled too.

### Error Model

Errors are values in Go — functions return `(T, error)`. The error chain is built
with `fmt.Errorf("... : %w", err)` and inspected with `errors.Is` / `errors.As`.

Sentinel errors (e.g. `ErrNotFound`) live in the package that owns the concept.
Callers match against them without needing to import implementation details.

### Dependency Management

| Command | Purpose |
|---------|---------|
| `go get module@version` | Add or upgrade a dependency |
| `go mod tidy` | Remove unused dependencies, sync go.sum |
| `go mod download` | Pre-fetch dependencies (CI cache) |
| `go mod verify` | Verify checksums against go.sum |

### Versioning

Follows semver. Breaking changes require a major version bump and a new module
path suffix (e.g. `/v2`). Minor and patch versions are backward-compatible.

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
