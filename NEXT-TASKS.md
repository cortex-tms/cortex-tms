# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-12
**Status**: 🟡 Active — TMS-427 closed, Go pack next
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archives:
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

## 🔜 Queued

- Go governance pack (`--preset go`)
- MCP Server — expose governance to any AI tool at runtime
- Agent skills scaffolding (`/cortex-validate`, `/cortex-review`)

<!-- @cortex-tms-version 4.1.0 -->
