# Agent Instructions — [Project Name]

## Project Overview

[Description]

## Stack

<!-- Update for your project: fill in the specifics, remove unused lines -->

- **Runtime**: Node.js <!-- e.g. 20.x LTS -->
- **Language**: TypeScript <!-- or JavaScript -->
- **Package manager**: <!-- npm | pnpm | yarn | bun -->
- **Framework**: <!-- e.g. Express, Fastify, Hono, none -->
- **Test runner**: <!-- e.g. Jest, Vitest -->
- **Database**: <!-- e.g. PostgreSQL via Prisma, SQLite, none -->

## Commands

<!-- Update for your project: verify these match your package.json scripts -->

```bash
<package-manager> run test      # run test suite
<package-manager> run build     # compile TypeScript
<package-manager> run lint      # lint source files
<package-manager> run dev       # start development server
# Replace <package-manager> with: npm, pnpm, yarn, or bun
# For npm, `npm test` is also acceptable if your project defines a test script.
```

## Code Conventions

- Async/await throughout — no Promise chains
- Named exports, not default exports
- Typed errors thrown at source, caught at boundaries
- No `process.env` reads outside `config.ts`
- No `console.log` in production paths — use the project logger

## What Agents Must Not Do

- Do not modify `package-lock.json` / `pnpm-lock.yaml` manually
- Do not add runtime dependencies without updating the dependency conventions in `docs/core/ARCHITECTURE.md`
- Do not bypass the validation in `config.ts` by reading env vars directly
- Do not commit secrets, API keys, or credentials

<!-- Update for your project: add project-specific prohibitions here -->

## Key Files

| File | Purpose |
|------|---------|
| `src/config.ts` | Environment variable loading — edit here for new env vars |
| `docs/core/PATTERNS.md` | Code patterns — follow these when writing new code |
| `docs/core/ARCHITECTURE.md` | Project structure and layer boundaries |
| `docs/core/DECISIONS.md` | Why the major decisions were made |

<!-- Update for your project: adjust paths to match your actual structure -->

## Testing Guidance

- Unit tests live beside source files (`foo.test.ts`)
- Integration tests are in `tests/integration/`
- Tests must pass before committing: `<package-manager> run test`
- Do not mock what can be tested with in-memory fixtures
