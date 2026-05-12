# Code Patterns — [Project Name]

## Async / Await

All async operations use `async/await`. Avoid mixing Promise chains with `await`.

```typescript
// preferred
async function fetchUser(id: string) {
  const user = await db.findById(id);
  return user;
}
```

Error handling wraps the async call, not the individual awaits inside:

```typescript
try {
  const result = await doWork();
} catch (err) {
  // handle at boundary
}
```

## Error Handling

Throw typed errors at the source; catch and translate at boundaries (HTTP handler, CLI entrypoint, queue consumer). Never swallow errors silently.

```typescript
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}
```

<!-- Update for your project: list your project-specific error classes here -->

## Module Structure

Each module exports one primary concern. Named exports are preferred over default exports for discoverability.

```
src/
  services/     ← business logic, no framework coupling
  routes/       ← HTTP handlers, thin — delegate to services
  utils/        ← pure helpers with no side effects
  types/        ← shared TypeScript interfaces and types
```

<!-- Update for your project: adjust directory layout to match your actual structure -->

## Environment Variables

All env vars are read and validated at startup in a single `config.ts` (or `config.js`). No `process.env` reads scattered through business logic.

```ts
// config.ts — read once, validate, export typed config
export const config = {
  port: parseInt(process.env.PORT ?? "3000", 10),
  dbUrl: requireEnv("DATABASE_URL"),
};

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}
```

## Testing

<!-- Update for your project: Jest or Vitest (delete the one you don't use) -->

**Jest**: `jest.config.js` at root. Unit tests colocated with source (`foo.test.ts` beside `foo.ts`). Integration tests in `tests/integration/`.

**Vitest**: `vitest.config.ts` at root. Same file placement conventions.

Mocks are kept minimal — prefer testing real behaviour with in-memory or SQLite fixtures over heavy mocking.

## Dependency Injection

Avoid singleton modules that import each other directly. Pass dependencies as constructor arguments or function parameters so tests can substitute them cleanly.

## Logging

Use a structured logger (e.g. `pino`, `winston`). Never use `console.log` in production code paths.

<!-- Update for your project: specify your chosen logger and log levels convention -->
