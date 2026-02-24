# NEXT: v4.1 Sprint — Git Hooks, AGENTS.md, Governance Packs

**Last Updated**: 2026-02-24
**Status**: 🚧 In Progress — AGENTS.md Template
**Current Version**: 4.0.2 (published 2026-02-23)

Sprint archive: `docs/archive/v4.0-sprint.md`
Implementation plan: `docs/plans/agents-md-plan.md`

---

## ✅ Complete: Git Hook Integration

~~Git hooks integration (`cortex-tms hooks install`)~~ — shipped in v4.1 sprint.

---

## 🏃 Active: AGENTS.md Template (P0)

| # | Task | Status |
|:--|:-----|:-------|
| 1 | Create `templates/AGENTS.md` (governance template) | ✅ Done |
| 2 | Add `"AGENTS.md"` to `LineLimits` interface (`src/types/cli.ts`) | ✅ Done |
| 3 | Add to `standard`/`enterprise` scope presets + line limit (`src/utils/config.ts`) | ✅ Done |
| 4 | Add `validateRecommendedFiles` + wire into `validateProject` (`src/utils/validator.ts`) | ✅ Done |
| 5 | Add `💡 Recommendations` display section (`src/commands/validate.ts`) | ✅ Done |
| 6 | Write tests — `src/__tests__/agents.test.ts` (14 tests, 354 passing total) | ✅ Done |
| 7 | Update `FUTURE-ENHANCEMENTS.md` + full verification (build + lint + test + validate) | ✅ Done |

## 🗺️ Roadmap: v4.1 (March 2026)

- ~~Git hooks integration (`cortex-tms hooks install`)~~ ✅
- ~~AGENTS.md template (multi-agent governance source-of-truth)~~ ✅
- Governance packs (Node / Python / Go presets)

## 🗺️ Roadmap: v4.2+

- MCP Server — expose governance to any AI tool
- Claude Code skills scaffolding (`/cortex-validate`, `/cortex-review`)

> Note: AGENTS.md (governance config) and Skills (runtime shortcuts) are distinct concepts.

---

<!-- @cortex-tms-version 4.0.2 -->
