# Code Patterns — [Project Name]

## Error Handling

Return errors explicitly. Wrap with `fmt.Errorf` to preserve the chain; use `errors.Is`
and `errors.As` to inspect at boundaries.

```go
// Wrap errors at each layer to preserve context
func (s *UserService) FindByID(ctx context.Context, id string) (*User, error) {
    u, err := s.repo.Get(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("UserService.FindByID %q: %w", id, err)
    }
    return u, nil
}

// Inspect at the boundary (handler, CLI entrypoint)
if errors.Is(err, ErrNotFound) {
    http.Error(w, "not found", http.StatusNotFound)
    return
}
```

Define sentinel errors and custom error types in a central `errors.go`:

```go
var ErrNotFound = errors.New("not found")
var ErrConflict = errors.New("conflict")

type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation: %s: %s", e.Field, e.Message)
}
```

<!-- Update for your project: list your project-specific sentinel errors here -->

## Interfaces

Accept interfaces, return concrete types. Define interfaces in the package that *uses*
them, not in the package that implements them.

```go
// Defined in the service package (consumer), not the repo package (implementor)
type UserRepository interface {
    Get(ctx context.Context, id string) (*User, error)
    Save(ctx context.Context, u *User) error
}

type UserService struct {
    repo UserRepository // accepts any implementation
}
```

Keep interfaces small — one or two methods. Compose larger interfaces from smaller ones.

## Context

`context.Context` is the first parameter in every function that performs I/O,
calls an external service, or may need to be cancelled.

```go
func (r *pgUserRepo) Get(ctx context.Context, id string) (*User, error) {
    row := r.db.QueryRowContext(ctx, "SELECT id, name FROM users WHERE id = $1", id)
    // ...
}
```

Never store context in a struct. Pass it through the call chain.

## Goroutines and Concurrency

Use `errgroup.Group` for fan-out with error collection:

```go
import "golang.org/x/sync/errgroup"

g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { return fetchA(ctx) })
g.Go(func() error { return fetchB(ctx) })
if err := g.Wait(); err != nil {
    return fmt.Errorf("concurrent fetch: %w", err)
}
```

Always ensure goroutines can exit — pass context or a done channel. Never start a
goroutine without a clear ownership and termination path.

## Resource Cleanup

Use `defer` for all cleanup immediately after acquiring the resource:

```go
f, err := os.Open(path)
if err != nil {
    return fmt.Errorf("open %q: %w", path, err)
}
defer f.Close()
```

For `sync.Mutex`, defer the unlock immediately after locking:

```go
mu.Lock()
defer mu.Unlock()
```

## Testing

Run the full test suite with `go test ./...` before every commit. Use `go test -v ./...`
for verbose output. Table-driven tests are idiomatic — use `t.Run` for subtests:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 1, 2, 3},
        {"zero", 0, 0, 0},
        {"negative", -1, -2, -3},
    }
    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got := Add(tc.a, tc.b)
            if got != tc.want {
                t.Errorf("Add(%d, %d) = %d; want %d", tc.a, tc.b, got, tc.want)
            }
        })
    }
}
```

Use `t.Helper()` in assertion helpers so failure lines point to the caller:

```go
func assertEqual[T comparable](t *testing.T, got, want T) {
    t.Helper()
    if got != want {
        t.Errorf("got %v; want %v", got, want)
    }
}
```

## Logging

Use `log/slog` (Go 1.21+) for structured logging. Never use `fmt.Println` in
production code.

```go
import "log/slog"

slog.Info("user created", "id", u.ID, "email", u.Email)
slog.Error("database query failed", "err", err, "query", q)
```

<!-- Update for your project: specify your log level convention and handler setup -->
