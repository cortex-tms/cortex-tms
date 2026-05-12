# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-12
**Status**: 🟡 Active — TMS-420 closed, Python pack next
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
with the real command.

---

## 🔜 Queued

- **TMS-426**: Auto-detect package manager during `init --preset node`
- Python governance pack (`--preset python`)
- Go governance pack (`--preset go`)
- MCP Server — expose governance to any AI tool at runtime
- Agent skills scaffolding (`/cortex-validate`, `/cortex-review`)

<!-- @cortex-tms-version 4.1.0 -->
