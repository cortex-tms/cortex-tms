# Domain Logic — [Project Name]

## Overview

<!-- Update for your project: describe the core domain in 2-3 sentences -->

## Key Domain Concepts

<!-- Update for your project: list and define your domain entities -->

| Term | Definition |
|------|------------|
| (example) | Replace with your domain terms |

## Node.js Runtime Conventions

### Event Loop Awareness

CPU-bound work is offloaded to worker threads or a job queue — never blocked in the main thread. I/O operations are async throughout.

### Streaming

Large data sets are streamed rather than buffered in memory. Node.js readable/writable streams or `AsyncIterable` are used for file and network I/O.

### Package Manager

<!-- Update for your project: npm, pnpm, yarn, or bun — delete the ones that don't apply -->

- **npm**: lockfile is `package-lock.json`. CI uses `npm ci`.
- **pnpm**: lockfile is `pnpm-lock.yaml`. CI uses `pnpm install --frozen-lockfile`.
- **yarn**: lockfile is `yarn.lock`. CI uses `yarn install --frozen-lockfile`.
- **bun**: lockfile is `bun.lockb`. CI uses `bun install --frozen-lockfile`.

### Versioning

Follows semver. Breaking changes bump the major version. Internal tooling follows the Node.js LTS release schedule.

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
