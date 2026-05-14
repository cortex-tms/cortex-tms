# TMS-429: MCP Server — Implementation Plan

**Status**: 🟢 Audit pass 3 complete — implementing
**Author**: Claude (Opus 4.7 planning)
**Date**: 2026-05-14
**Branch**: `feat/tms-429-mcp-server`
**Estimate**: 8–10h (matches FUTURE-ENHANCEMENTS PRD)
**Prior reviews integrated**:
- Pass 1: GPT-5.5 (6 points) + Kimi K2.6 (3 gaps + observations)
- Pass 2: GPT-5.5 (5 amendments: 2 medium, 3 low) + Kimi K2.6 (approved with 1 non-blocking note)
- Pass 3: GPT-4.1 (3 amendments: 1 medium, 2 low) + Kimi K2.6 (A+ grade, no blockers)

---

## Goal

Ship `cortex-tms mcp` — a read-only STDIO MCP (Model Context Protocol) server that exposes the
project's TMS governance docs as resources to any AI tool that speaks MCP (Claude Desktop, Cursor,
Windsurf today; future clients automatically).

**Success criteria**:
- A Claude Desktop / Cursor / Windsurf instance configured to use `cortex-tms mcp` can list and
  read this project's governance files (PATTERNS.md, ARCHITECTURE.md, etc.) at runtime.
- No write tools exposed — read-only first cut.
- `cortex-tms mcp --print-config` emits paste-ready config snippets for the three supported
  clients plus a documented Copilot stub.

---

## Architecture

Two-module split for testability:

```
src/utils/resources.ts   ← pure: discovers exposable files from .cortexrc + disk
src/commands/mcp.ts      ← thin wiring: SDK + stdio transport, no business logic
```

The pure/wiring split is the key design decision — it keeps protocol concerns isolated from
"which files should be exposed." Unit tests hit `resources.ts` without the SDK; integration tests
hit `mcp.ts` end-to-end via subprocess.

---

## Dependency

- **Package**: `@modelcontextprotocol/sdk`
- **Version pin**: `^1.29.0` (latest stable v1.x as of 2026-05-14; v2 is pre-alpha and not
  recommended for production per the SDK README)
- **Engine match**: SDK requires Node `>=18`; `cortex-tms` already requires `>=18.0.0`
- **Runtime cost**: ~1 dep added to every install. Acceptable given existing footprint
  (chalk, ora, commander, inquirer, zod, react/ink).

---

## Resource contract

Each TMS file becomes one MCP resource. URI scheme is `cortex://<slug>`. The default disk paths
below assume `.cortexrc` defaults; the actual resolved path uses `config.paths.docs` for `docs/core/*`
entries and `config.paths.tasks` for `NEXT-TASKS.md` (see §Honoring .cortexrc.paths below).

This table is the **canonical allowlist** — `discoverResources` must filter all candidates through
this set. Files outside this list (e.g. arbitrary entries in `customFiles`) are silently excluded
even if they exist on disk. This protects against `.cortexrc` edits that try to expose `.env`,
secrets, or unrelated source files via the MCP surface.

| Slug (URI: `cortex://<slug>`) | Default disk path | mimeType | Notes |
|------|-----|----------|-------|
| `next-tasks` | `<paths.tasks>` (default `NEXT-TASKS.md`) | text/markdown | |
| `claude` | `CLAUDE.md` | text/markdown | |
| `agents` | `AGENTS.md` | text/markdown | |
| `prompts` | `PROMPTS.md` | text/markdown | |
| `future-enhancements` | `FUTURE-ENHANCEMENTS.md` | text/markdown | |
| `copilot-instructions` | `.github/copilot-instructions.md` | text/markdown | |
| `patterns` | `<paths.docs>/PATTERNS.md` | text/markdown | |
| `architecture` | `<paths.docs>/ARCHITECTURE.md` | text/markdown | |
| `domain-logic` | `<paths.docs>/DOMAIN-LOGIC.md` | text/markdown | |
| `decisions` | `<paths.docs>/DECISIONS.md` | text/markdown | |
| `troubleshooting` | `<paths.docs>/TROUBLESHOOTING.md` | text/markdown | exists in templates |
| `glossary` | `<paths.docs>/GLOSSARY.md` | text/markdown | exists in templates |
| `schema` | `<paths.docs>/SCHEMA.md` | text/markdown | exists in templates |

All entries: "available if present in project" — only files that pass existence check are advertised.

**Behavior**:
- Slugs are stable identifiers — AI tools can rely on them across projects.
- `resources/read` reads from disk on every call (supports live editing during a session — no
  stale caches).
- **Path safety**: use the existing `validateSafePath(filePath, cwd)` from `src/utils/validation.ts:232`
  rather than hand-rolled `startsWith` checks. That helper does separator-aware boundary checking
  (e.g. correctly rejects `/tmp/project2` against base `/tmp/project`).
- **Allowlist enforcement**: `customFiles` from `.cortexrc.metadata` is intersected with the
  canonical slug list above. Entries not in the allowlist are dropped (optionally logged to stderr
  during server startup for operator visibility — not during steady-state).
- No write tools, no prompts, no sampling. `tools/list` returns `[]` (verified by regression test).

---

## Resource discovery — `src/utils/resources.ts`

Async function signature (matches the repo's existing `loadConfig` pattern):

```ts
export async function discoverResources(cwd: string): Promise<Resource[]>
```

**Static module-level allowlist**: define `RESOURCE_REGISTRY` — a record keyed by canonical slug
(`next-tasks`, `claude`, `agents`, ...) where each entry holds `{relativePath, name, description}`.
Entries for `<paths.docs>`-based files use a `docsRelativePath` (e.g. `PATTERNS.md`) that gets
joined with `config.paths.docs` at resolution time; the `next-tasks` entry honors
`config.paths.tasks`.

**Algorithm**:
1. `await loadConfig(cwd)`. If null → throw `CortexConfigMissingError` (a new error class in
   `src/utils/errors.ts`).
2. Look up `getScopePreset(config.scope)` → `{mandatoryFiles, optionalFiles}`.
3. **Slugify scope files**: map each scope file (e.g. `"docs/core/PATTERNS.md"`) to its canonical
   slug via a lookup table (the inverse of `RESOURCE_REGISTRY`). Files in the scope preset that
   don't match any registry entry are dropped (defensive — shouldn't happen with current presets).
4. **Custom scope override**: if `scope === "custom"`, replace the slug list with
   `config.metadata?.customFiles ?? []` mapped through the same slugifier — entries that don't
   resolve to a registry slug are dropped (this is the allowlist filter). `customFiles` is
   interpreted as **canonical TMS template paths** (e.g. `"docs/core/PATTERNS.md"`), not
   resolved disk paths. A user who renames their docs folder and puts that path in `customFiles`
   will have it silently dropped; they should use `config.paths.docs` to remap the docs root
   instead.
5. **Resolve each surviving slug** to its disk path using `config.paths.docs` / `config.paths.tasks`
   as appropriate.
6. **Path safety**: for each resolved path, call `validateSafePath(path, cwd)` from
   `src/utils/validation.ts`. Reject any that fail.
7. **Existence check**: `await fs.pathExists(resolvedPath)` — drop any missing files.
8. Return `Resource[]` with `{uri, name, description, mimeType: "text/markdown", path}`.

**I/O footprint**: one `.cortexrc` read + N async existence checks. No network, no SDK imports.
Trivially unit-testable with seeded tempdirs.

**Why async**: matches `loadConfig` (already async via `readFile`), avoids sync/async mismatch in
the `mcp.ts` handlers which are async by SDK convention.

---

## Honoring `.cortexrc.paths`

The `CortexConfig` type supports custom paths:

```ts
config.paths.docs    // default "docs/core"
config.paths.tasks   // default "NEXT-TASKS.md"
config.paths.archive // default "docs/archive" — not used by MCP
```

`discoverResources` honors these when resolving disk paths. URI slugs stay stable regardless of
where the file lives — a project with `paths.docs = "documentation/core"` still exposes
`cortex://patterns`, the server just reads from `documentation/core/PATTERNS.md`.

This keeps the contract uniform for AI clients while respecting per-project layout choices.
`paths.archive` is intentionally ignored — archive files aren't governance docs and shouldn't
be exposed.

---

## STDIO discipline (the critical constraint)

**stdout is protocol wire. Nothing else writes to it.**

Concrete rules for `src/commands/mcp.ts`:
- Does **not** import `chalk`, `ora`, or anything that defaults to stdout.
- Errors and diagnostics use `process.stderr.write(...)` — never `console.log` / `console.error`
  (the latter is fine but consistency = stderr-direct).
- Missing `.cortexrc` → stderr message + `process.exit(1)` **before** the SDK transport starts.
- No "server started" banner, no startup messages. Silence on success after SDK takeover.

**Verification**:
- Static check in test: `mcp.ts` source must not contain `chalk`, `ora`, `console.log`, or
  `process.stdout.write` (the SDK owns stdout).
- Integration test: subprocess + MCP client confirms the protocol handshake completes — any
  stdout pollution would corrupt it and fail this test.

---

## `--print-config` flag

`cortex-tms mcp --print-config` writes human-readable **config snippets** (not a single valid JSON
document) to stdout and exits `0`. **Does not start the server.**

The output is intentionally a mix of labeled `#` comment headers and per-client JSON blocks so a
user can scan it, locate their client, and copy-paste just that block into their config file. If a
caller wants machine-readable output, that's a separate feature — explicitly out of scope here.

**Output**:

```
# Claude Desktop  (~/Library/Application Support/Claude/claude_desktop_config.json on macOS)
{
  "mcpServers": {
    "cortex-tms": {
      "command": "npx",
      "args": ["-y", "cortex-tms", "mcp"],
      "cwd": "<detected project root>"
    }
  }
}

# Cursor  (.cursor/mcp.json in your project)
{
  "mcpServers": {
    "cortex-tms": {
      "command": "npx",
      "args": ["cortex-tms", "mcp"]
    }
  }
}

# Windsurf  (~/.codeium/windsurf/mcp_config.json)
{
  "mcpServers": {
    "cortex-tms": {
      "command": "npx",
      "args": ["cortex-tms", "mcp"]
    }
  }
}

# GitHub Copilot: MCP support not yet available from Microsoft —
#   see https://docs.github.com/copilot for updates.
```

**Decisions**:
- `npx` over direct `cortex-tms` — matches `@modelcontextprotocol/server-*` convention; more
  portable (Claude Desktop spawn environment may not have user's PATH).
- `cwd` in Claude Desktop block uses the detected project root (where `--print-config` was
  invoked). Cursor reads its config from project-root `.cursor/mcp.json` so `cwd` is implicit.
- Labels in `#` comments so the output is scannable; the JSON blocks themselves are valid for
  copy-paste.
- Copilot stub is documentation, not a config block — signals universal intent without
  shipping a speculative format.

---

## File changes

**New files**:
- `src/utils/resources.ts` — discovery logic
- `src/commands/mcp.ts` — command + STDIO wiring + `--print-config`
- `src/__tests__/mcp.test.ts` — unit + integration tests

**Modified files**:
- `package.json` — add `@modelcontextprotocol/sdk@^1.29.0`
- `src/cli.ts` — register `mcp` command
- `src/types/cli.ts` — `McpCommandOptions` interface
- `src/utils/validation.ts` — Zod schema for mcp options (`{printConfig?: boolean}`)
- `src/utils/errors.ts` — add `CortexConfigMissingError` class (re-using existing error pattern
  in this file)
- `README.md` — document command, resource table, paste-in client config snippets
- `NEXT-TASKS.md` — closure entry on completion

---

## Test strategy

### Unit tests (fast, deterministic; no subprocess, no SDK)

Target: `discoverResources()` and `--print-config` snippet shape.

- `nano` scope: returns subset matching `mandatoryFiles` (when files exist)
- `standard` scope: returns mandatory + existing optional files
- `enterprise` scope: returns full set when all files seeded
- `custom` scope: honors `config.metadata.customFiles`
- Missing `.cortexrc` → throws `CortexConfigMissingError`
- Optional files that don't exist on disk are excluded from result
- URIs follow `cortex://<slug>` pattern; slugs match the contract table above
- **Path safety** (uses `validateSafePath`): a `customFiles` entry like `../../etc/passwd` is
  dropped (not throws — silent drop, since allowlist filter already rejects it)
- **Sibling-prefix safety**: project at `/tmp/p` does not expose files from `/tmp/p2`
  (regression test for the bug `validateSafePath` was specifically built to prevent)
- **Allowlist enforcement**: a `customFiles` entry like `secrets.env` (not in the canonical
  resource list) is dropped, even if the file exists on disk
- **Honoring `paths.docs`**: a project with `config.paths.docs = "documentation/core"` and a
  seeded `documentation/core/PATTERNS.md` exposes `cortex://patterns` (same URI, different disk
  path)
- **Honoring `paths.tasks`**: a project with `config.paths.tasks = "TODO.md"` and a seeded
  `TODO.md` exposes `cortex://next-tasks`
- `--print-config` output: contains all three labeled sections (Claude Desktop / Cursor /
  Windsurf), each JSON block parses individually, `cwd` field reflects the invocation directory,
  Copilot stub comment present

### Integration tests (subprocess + MCP SDK client)

For each test:
1. Spawn `node bin/cortex-tms.js mcp` in a tempdir with a seeded `.cortexrc` + governance files
2. Connect using SDK's `StdioClientTransport` + `Client`
3. Make protocol calls and assert
4. `afterEach`: kill subprocess, clean tempdir

Assertions:
- `client.listResources()` → returns expected URIs for the configured scope
- `client.readResource({uri: "cortex://patterns"})` → returns the seeded markdown content
- `client.listTools()` → `[]` (regression: no write tools)
- `client.listPrompts()` → `[]` (regression: no prompts surface)

**Timeouts**: 10s per integration test (generous to absorb subprocess startup).

### Regression / static checks

- Source-level grep on `src/commands/mcp.ts` for `chalk`, `ora`, `console.log`,
  `process.stdout.write` — must find none.

---

## Risks & mitigations

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Accidental stdout pollution breaks protocol | Static grep test + end-to-end subprocess test. Both must pass. |
| 2 | Integration tests join existing flaky-timeout pattern in `integration.test.ts` | Generous 10s timeouts; explicit subprocess cleanup in afterEach; isolated tempdirs per test; consider serial pool if flaking observed. |
| 3 | SDK API surface differs from 1.29.0 docs | Spike step (15min throwaway hello-world) before building discovery wiring — confirms minimum example works against the actual installed version. |
| 4 | `.cortexrc` discovery from arbitrary spawn cwd | Use `process.cwd()` only; rely on MCP client `cwd` field; document this clearly in `--print-config` and README. |
| 5 | Adding a runtime dep that every `cortex-tms` install carries even when MCP is unused | Acceptable per Kimi's analysis given existing dep footprint; SDK is small and well-maintained. Not lazy-loaded for now (can be revisited if startup time regresses). |

---

## Out of scope (explicit)

- HTTP / SSE transport
- Write tools (e.g. update `NEXT-TASKS.md`, archive task, run validate)
- Resource subscriptions / change notifications
- MCP prompts surface
- MCP sampling surface
- Windsurf / Copilot config in `--print-config` beyond what's specified above
- Agent skills scaffolding (`/cortex-validate`, `/cortex-review`) — separate queued task

---

## Implementation order

1. **Spike** (~15min throwaway) — minimal hello-world MCP server against installed SDK 1.29.0,
   confirm protocol handshake works
2. **`resources.ts`** — pure discovery + unit tests (TDD)
3. **`mcp.ts`** — wire SDK + stdio + `--print-config`
4. **`cli.ts` / `types/cli.ts` / `validation.ts`** — register command + schema
5. **Integration tests** — subprocess + MCP client
6. **Stdout regression grep** — static check
7. **README** — usage + config block + resource table
8. **Build + full test suite** — verify nothing else broke
9. **Validate strict** — clean
10. **Close & archive**

---

## Open questions

None. The two reviewers (GPT-5.5 and Kimi K2.6) converged on Option 2 for client coverage
(Claude Desktop + Cursor + Windsurf, Copilot as a documented stub). All other design decisions
have been made and recorded above.

---

## Prior-review traceability

Confirmation that each piece of feedback is addressed:

### Pass 1

**GPT-5.5**:
1. SDK version pin → §Dependency (`^1.29.0` with stability rationale)
2. STDIO is correct → §Architecture confirms
3. Dynamic resource listing → §Resource discovery
4. stdout protocol-clean → §STDIO discipline (with static + e2e verification)
5. Resource contract → §Resource contract (URI, mimeType, path safety)
6. Stronger tests → §Test strategy (unit per scope, missing-file, MCP client integration,
   no-write-tools regression)

**Kimi K2.6**:
1. `--print-config` flag → §--print-config flag (full spec)
2. README in scope → §File changes (modified files list)
3. Test strategy explicit → §Test strategy (unit + integration with subprocess + SDK client)
4. Observation — command naming `cortex-tms mcp` flat → adopted, decided
5. Observation — missing `.cortexrc` error → §STDIO discipline (stderr + exit 1 before
   transport starts)
6. Observation — dependency footprint → §Dependency (noted acceptable)

### Pass 2

**GPT-5.5 amendments**:
1. (Medium) Use existing `validateSafePath` not hand-rolled `startsWith` → §Resource contract +
   §Resource discovery now explicitly cite `validateSafePath` at `src/utils/validation.ts:232`
2. (Medium) Custom scope must use allowlist, not arbitrary `customFiles` → §Resource contract
   establishes canonical allowlist; §Resource discovery step 4 filters `customFiles` through it
3. (Low/medium) `--print-config` not valid JSON; clarify as snippets → §`--print-config` flag
   intro rewritten to call them "config snippets" with explicit out-of-scope note for
   machine-readable output
4. (Low) `.cortexrc.paths` ignored → new §Honoring `.cortexrc.paths` section; discovery resolves
   docs under `config.paths.docs` and tasks under `config.paths.tasks`
5. (Low) Sync vs async deliberate choice → §Resource discovery now `async`; rationale recorded

**Kimi K2.6**:
- (Non-blocking note) TROUBLESHOOTING.md / SCHEMA.md may not exist → verified they DO exist in
  `templates/docs/core/`; added "exists in templates" notes in §Resource contract table; the
  "Available if present in project" caveat already handled absent files

<!-- @cortex-tms-version 4.1.0 -->
