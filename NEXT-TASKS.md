# NEXT: v4.2 Sprint — Governance Pack + Agent Ecosystem

**Last Updated**: 2026-05-15
**Status**: ✅ Sprint complete — all 5 phases closed. Ready for v4.2 release.
**Current Version**: 4.1.0 (published 2026-05-10) — bump to 4.2.0 per release checklist

Sprint archives:
- Phase 5 (TMS-430): `docs/archive/v4.2-phase5-skills.md`
- Phase 4 (TMS-429): `docs/archive/v4.2-phase4-mcp.md`
- Phase 3 (TMS-420/426/427/428): `docs/archive/v4.2-phase3-sprint.md`
- Phase 2 (TMS-421–425): `docs/archive/v4.2-phase2-sprint.md`
- v4.1 sprint: `docs/archive/v4.1-sprint.md`

---

## ✅ Closed

| Task | Phase | Closed | Commit | Archive |
|------|-------|--------|--------|---------|
| TMS-420 — Harden Node preset docs | 3 | 2026-05-12 | `a6bf33d` | Phase 3 |
| TMS-426 — Auto-detect Node package manager | 3 | 2026-05-12 | `75a685b` | Phase 3 |
| TMS-427 — Python governance preset | 3 | 2026-05-12 | `b165c78` | Phase 3 |
| TMS-428 — Go governance preset | 3 | 2026-05-13 | `ebbf2d0`, `b1b7498` | Phase 3 |
| TMS-429 — MCP Server (`cortex-tms mcp`) | 4 | 2026-05-14 | `94398d9`, `13896f5` | Phase 4 |
| TMS-430 — Agent skills (`/cortex-validate`, `/cortex-review`) | 5 | 2026-05-15 | _pending PR_ | Phase 5 |

Full per-task summaries live in the linked archives. 504 tests passing, `validate --strict` clean.

---

## 🚀 Next: v4.2 Release

v4.2 sprint is complete. Follow the release checklist in CLAUDE.md Version Management:

1. Bump `package.json` → `4.2.0`
2. `node scripts/sync-project.js`
3. Update `CHANGELOG.md`
4. `git tag v4.2.0 && git push origin v4.2.0`
5. `npm publish`
6. GitHub release with changelog

<!-- @cortex-tms-version 4.1.0 -->
