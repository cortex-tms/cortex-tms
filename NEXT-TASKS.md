# NEXT: v4.1 Sprint — Git Hooks, AGENTS.md, Governance Packs

**Last Updated**: 2026-02-24
**Status**: 🚧 In Progress — Git Hooks
**Current Version**: 4.0.2 (published 2026-02-23)

Sprint archive: `docs/archive/v4.0-sprint.md`

---

## 🏃 Active: Git Hook Integration (P0)

| # | Task | Status |
|:--|:-----|:-------|
| 1 | Add `hooks?` to `CortexConfig`, `skipStaleness?` to `ValidateCommandOptions` | ✅ Done |
| 2 | Fix `mergeConfig` to preserve `staleness` and `hooks` fields | ✅ Done |
| 3 | Add `skipStaleness` to `validateProject` options + validation schema | ✅ Done |
| 4 | Add `--skip-staleness` flag to `validate` command | ✅ Done |
| 5 | Create `src/commands/hooks.ts` (install / uninstall / status) | ✅ Done |
| 6 | Register `hooksCommand` in `src/cli.ts` | ✅ Done |
| 7 | Write tests (`src/__tests__/hooks.test.ts`) | ✅ Done |
| 8 | Update README, NEXT-TASKS, FUTURE-ENHANCEMENTS | ✅ Done |
| 9 | Full verification (build + lint + test + validate) | ✅ Done |

## 🗺️ Roadmap: v4.1 (March 2026)

- ~~Git hooks integration (`cortex-tms hooks install`)~~ ✅
- AGENTS.md template (multi-agent governance source-of-truth)
- Governance packs (Node / Python / Go presets)

## 🗺️ Roadmap: v4.2+

- MCP Server — expose governance to any AI tool
- Claude Code skills scaffolding (`/cortex-validate`, `/cortex-review`)

> Note: AGENTS.md (governance config) and Skills (runtime shortcuts) are distinct concepts.

---

<!-- @cortex-tms-version 4.0.2 -->
