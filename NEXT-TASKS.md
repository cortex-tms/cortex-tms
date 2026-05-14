# NEXT: v4.2 Sprint — Governance Pack + Agent Ecosystem

**Last Updated**: 2026-05-14
**Status**: 🟡 Active — Phases 3-4 closed, Phase 5 (Agent Skills) next
**Current Version**: 4.1.0 (published 2026-05-10) — package.json stays here until v4.2 ships

Sprint archives:
- Phase 5 (TMS-430): _in progress — see `docs/plans/tms-430-agent-skills.md`_
- Phase 4 (TMS-429): `docs/archive/v4.2-phase4-mcp.md`
- Phase 3 (TMS-420/426/427/428): `docs/archive/v4.2-phase3-sprint.md`
- Phase 2 (TMS-421–425): `docs/archive/v4.2-phase2-sprint.md`
- v4.1 sprint: `docs/archive/v4.1-sprint.md`

The v4.2 sprint carries two themes: governance pack expansion (Phases 1-3) and the agent
ecosystem (Phases 4-5). v4.2 release happens when Phase 5 closes — see CLAUDE.md Version
Management for the publish protocol.

---

## ✅ Closed

| Task | Phase | Closed | Commit | Archive |
|------|-------|--------|--------|---------|
| TMS-420 — Harden Node preset docs | 3 | 2026-05-12 | `a6bf33d` | Phase 3 |
| TMS-426 — Auto-detect Node package manager | 3 | 2026-05-12 | `75a685b` | Phase 3 |
| TMS-427 — Python governance preset | 3 | 2026-05-12 | `b165c78` | Phase 3 |
| TMS-428 — Go governance preset | 3 | 2026-05-13 | `ebbf2d0`, `b1b7498` | Phase 3 |
| TMS-429 — MCP Server (`cortex-tms mcp`) | 4 | 2026-05-14 | `94398d9`, `13896f5` | Phase 4 |

Full per-task summaries live in the linked archives. 459 tests passing, `validate --strict` clean.

---

## 🔜 Phase 5 — Agent Ecosystem (cont.)

### TMS-430 — Agent skills scaffolding (`/cortex-validate`, `/cortex-review`)

**Status**: Planning
**Plan**: `docs/plans/tms-430-agent-skills.md` _(scaffold — not yet reviewed)_
**Target release**: v4.2 (closing phase)

Scope hints (to be confirmed during planning):

- Ship one or more first-party Claude Code skills (`SKILL.md` + assets) that consume
  TMS governance docs at runtime
- Decide command UX: invoked by user as `/cortex-validate`, `/cortex-review`, or as
  scaffolded artifacts that users install into their own projects
- Define distribution: bundled with `cortex-tms` npm package, separate package, or
  published via skills marketplace
- Update `docs/core/ARCHITECTURE.md` Agent Skills Integration section once the runtime
  contract is locked

Touches command UX, install/scaffold behaviour, docs, and likely distribution assumptions.
Per CLAUDE.md: full plan with reviewer feedback before any code.

<!-- @cortex-tms-version 4.1.0 -->
