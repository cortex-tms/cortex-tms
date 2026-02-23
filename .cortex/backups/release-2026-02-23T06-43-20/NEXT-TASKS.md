# NEXT: Post-v4.0.0 — Audit Fixes & Quality

**Last Updated**: 2026-02-22
**Status**: 🚧 In Progress
**Branch**: fix/audit-v4.0.0

Sprint archive: `docs/archive/v4.0-sprint.md`

---

## 🎯 Context

v4.0.0 published to NPM on 2026-02-22. This sprint addresses post-release audit findings
(see `docs/archive/AUDIT-v4.0.0.md`) and ensures code quality standards.

---

## ✅ Completed Audit Fixes

| Fix | Description | Status |
| :-- | :---------- | :----- |
| #1  | `--help`/`--version` exit code 0 | ✅ DONE |
| #2  | ESLint v9 flat config (`eslint.config.mjs`) | ✅ DONE |
| #3  | CI workflows use `fetch-depth: 0` for staleness | ✅ DONE |
| #4  | Website docs version drift (3.1.0 → 4.0.0) | ✅ DONE |
| #5  | Placeholder scanner ignores code blocks | ✅ DONE |
| #6  | `.cortexrc` schema version clarity in docs | ✅ DONE |

---

## 📋 Active

### Archive sprint, merge fix branch ⏳ IN PROGRESS

- [x] Archive v4.0 sprint to `docs/archive/v4.0-sprint.md`
- [ ] Commit all audit fixes on `fix/audit-v4.0.0`
- [ ] Merge to main, push

---

## 🗺️ Roadmap: v4.1 (March 2026)

- Git hooks integration (`cortex-tms hooks install`)
- AGENTS.md template (multi-agent governance source-of-truth)
- Governance packs (Node / Python / Go presets)

## 🗺️ Roadmap: v4.2+

- MCP Server — expose governance to any AI tool
- Claude Code skills scaffolding (`/cortex-validate`, `/cortex-review`)

> Note: AGENTS.md (governance config) and Skills (runtime shortcuts) are distinct concepts.

---

<!-- @cortex-tms-version 4.0.1 -->
