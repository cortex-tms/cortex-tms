# AI Coding Agent Instructions — [Project Name]

## Stack

<!-- Update for your project: fill in your specifics -->
- **Runtime**: Node.js
- **Language**: TypeScript <!-- or JavaScript -->
- **Package manager**: <!-- npm | pnpm | yarn | bun -->
- **Framework**: <!-- e.g. Express, Fastify, Hono, none -->
- **Test runner**: <!-- e.g. Jest, Vitest -->

## Critical Rules

- Read `docs/core/PATTERNS.md` before writing any code.
- Read `docs/core/DOMAIN-LOGIC.md` for business rules and constraints.
- Async/await throughout — no raw Promise chains.
- No `process.env` reads outside `src/config.ts`.
- No `console.log` in production code — use the project logger.
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
- [ ] Tests added or updated and passing
- [ ] No untyped `any` introduced
- [ ] No secrets or credentials in diff
