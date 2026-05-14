# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-13
**Status**: 🟡 Active — TMS-428 closed, MCP Server next
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archives:
- Phase 3 (TMS-420/426/427/428): `docs/archive/v4.2-phase3-sprint.md`
- Phase 2 (TMS-421–425): `docs/archive/v4.2-phase2-sprint.md`
- v4.1 sprint: `docs/archive/v4.1-sprint.md`

---

## ✅ Closed

### TMS-420 — Harden Node preset docs and examples (Done)

**Closed**: 2026-05-12
Fixed four concrete issues found by codebase audit + GPT-5.5/Kimi review.
Commit: `a6bf33d`.

- `CLAUDE.md`: replaced npm-only commands with `<package-manager>` placeholders;
  added note that `npm test` is acceptable for npm projects
- `AGENTS.md`: fixed "npm dependencies" → "Node.js dependencies" in matrix;
  replaced TODO stub with pre-filled Node prohibitions (ESM/require,
  process.env, lock files, event loop blocking); added missing Universal
  Prohibitions section (present in base template but stripped from node preset)
- `PATTERNS.md`: changed all three `js` code blocks → `typescript`; added
  `resource: string` type annotation to `NotFoundError` constructor
- `DOMAIN-LOGIC.md`: removed 3 trailing placeholder stubs from Event Loop,
  Streaming, and Versioning sections

371 tests passing. validate --strict clean.

**Queued follow-up (TMS-426)**: auto-detect `packageManager` field from
`package.json` during `init --preset node` and substitute `<package-manager>`
with the real command. ✅ Closed 2026-05-12.

---

## ✅ Closed

### TMS-426 — Auto-detect package manager during `init --preset node` (Done)

**Closed**: 2026-05-12
Commit: `75a685b`.

- New `src/utils/package-manager.ts`: `detectPackageManager()` reads
  `package.json` `packageManager` field first, falls back to lockfile
  detection (`pnpm-lock.yaml` → `yarn.lock` → `package-lock.json` → `bun.lockb`)
- `generateReplacements()` accepts optional `packageManager` arg; adds
  `"package-manager"` key to replacements map
- `replacePlaceholders()` gains angle-bracket allowlist (`ANGLE_BRACKET_KEYS`);
  `<package-manager>` is substituted in node preset templates
- `init --preset node` detects and injects package manager automatically;
  falls back to `<package-manager>` literal when nothing is detected
- 15 unit tests for `detectPackageManager`; 7 E2E tests for substitution
  behaviour; 3 unit tests for angle-bracket allowlist

396 tests passing. validate --strict clean.

---

## ✅ Closed

### TMS-427 — Python governance preset (`--preset python`) (Done)

**Closed**: 2026-05-12
Commit: `b165c78`.

- 6 new template files in `templates/presets/python/`: CLAUDE.md, AGENTS.md,
  PATTERNS.md, DOMAIN-LOGIC.md, ARCHITECTURE.md, copilot-instructions.md
- Templates target modern Python 3.11+ conventions: type hints, asyncio,
  ruff/mypy/pytest, src layout, commands table (PM auto-detection deferred TMS-428)
- `GovernancePreset` type, Zod enum, and CLI help text extended to include `"python"`
- 13 new tests: unit (preset dir, schema validation), E2E (scope, metadata,
  dry-run, regression), cross-contamination (no Node strings in Python files)

409 tests passing. validate --strict clean.

---

## ✅ Closed

### TMS-428 — Go governance preset (`--preset go`) (Done)

**Closed**: 2026-05-13
Commit: `ebbf2d0`.

- 6 new template files in `templates/presets/go/`: CLAUDE.md, AGENTS.md,
  .github/copilot-instructions.md, docs/core/PATTERNS.md,
  docs/core/DOMAIN-LOGIC.md, docs/core/ARCHITECTURE.md
- Templates target Go 1.21+ conventions: context.Context propagation,
  explicit error returns, fmt.Errorf wrapping, errgroup goroutines,
  log/slog, go test ./..., gofmt, golangci-lint, go.mod/go.sum rules
- ARCHITECTURE.md documents cmd/ + internal/ standard layout; pkg/ noted
  as library-only with actionable guidance on when to use it
- `GovernancePreset` type, Zod enum, and CLI help text extended to include `"go"`
- README.md fixed: added python and go preset examples; corrected
  "Available presets: node" → "node, python, go"
- 23 new tests: unit (preset dir, all 6 files exist, schema validation),
  E2E (scope, metadata, minimal, nano, dry-run, regression), cross-
  contamination (Go terms present; no Node/Python markers in all 6 files)

432 tests passing. validate --strict clean.

---

### TMS-429 — MCP Server (`cortex-tms mcp`) (Done)

**Closed**: 2026-05-14
Commit: `94398d9`.

- `src/utils/resources.ts`: pure discovery, canonical allowlist (13 URIs),
  `validateSafePath` integration, honors `.cortexrc` `paths.docs`/`paths.tasks`
- `src/commands/mcp.ts`: read-only STDIO server, `--print-config` snippets
  (`npx -y`), package.json version, `validateOptions` wired, early config check
- `@modelcontextprotocol/sdk@^1.29.0` added
- README: resource table + client config quick reference (Claude Desktop,
  Cursor, Windsurf, Copilot stub)
- 27 tests: all 4 scopes, path safety, allowlist intersection, custom paths,
  full integration via SDK `Client` + `StdioClientTransport`, static regression

459 tests passing. validate --strict clean.

---

## 🔜 Queued

- Agent skills scaffolding (`/cortex-validate`, `/cortex-review`)

<!-- @cortex-tms-version 4.1.0 -->
