# NEXT: Upcoming Tasks

**Current Sprint**: v3.1.1 Auto-Tier Hardening (Jan 30 - Feb 2)
**Previous Sprint**: [v3.1 Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-30 (Post v3.1.0 Release)

---

## 🎯 v3.1.1 Patch Release Focus

**Timeline**: 2-3 days
**Status**: 🚧 Active Development
**Theme**: Auto-Tier Production Hardening
**Goal**: Address critical P0 issues from GPT-5.1 code review before v3.2

### Critical Hardening Tasks (P0 - Must Complete)

Address GPT-5.1 code review feedback to improve production readiness.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Git Repo Detection Fix** | Use `git rev-parse --is-inside-work-tree` for subdirectory support | 1h | 🔴 P0 | ⏸️ Next |
| **E2E Integration Tests** | Test full command flow with varied git histories | 2h | 🔴 P0 | ⏸️ Next |

**Total Effort**: ~3h (critical for production)

**Details**:
- **Git detection**: Currently fails from subdirectories; should match git's behavior
  - Problem: `fs.existsSync('.git')` only works from repo root
  - Solution: Use `git rev-parse --is-inside-work-tree` (works anywhere in repo)
  - Files: `src/commands/auto-tier.ts`
- **E2E tests**: Add tests that invoke command with faked commit dates (`GIT_AUTHOR_DATE`)
  - Add integration tests for full auto-tier workflow
  - Test scenarios: fresh files, old files, mixed ages, dry-run mode
  - Files: `src/__tests__/auto-tier.test.ts` or new `src/__tests__/auto-tier-integration.test.ts`

**Acceptance Criteria**:
- [ ] Auto-tier works when run from any subdirectory within git repo
- [ ] E2E tests cover complete command workflow
- [ ] All existing tests continue to pass
- [ ] Documentation updated if command behavior changes

---

### Nice-to-Have Tasks (P1 - Deferred to v3.2)

These tasks improve code quality but are not blocking for v3.1.1 release.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **File Selection Alignment** | Align auto-tier file selection with token counter patterns | 2h | 🟡 P1 | ⏸️ v3.2 |
| **Centralize Tier Config** | Extract tier patterns/mandatory files to shared module | 1h | 🟡 P1 | ⏸️ v3.2 |

**Rationale for Deferral**: These are code quality improvements, not user-facing bugs. Ship P0 fixes quickly, then address P1 in v3.2.

---

## 📋 Deferred Items (v3.2+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

### v3.2 Planning Options

**Option A: Auto-Tier Polish & Performance** (9-12h)
- Batched git log for large repos
- Parallel file processing
- Respect .gitignore
- Better error messages
- File selection alignment (from v3.1.1 P1)
- Centralize tier config (from v3.1.1 P1)

**Option B: Code Quality & Security** (13-17h)
- Centralize error handling (remove `process.exit()` calls)
- Add Zod input validation
- Add integration/E2E tests
- File path traversal protection
- Guardian API key redaction
- npm audit CI integration

**Decision Point**: Choose after v3.1.1 ships.

### Feature Backlog
- Configuration file support (`.cortexrc.json` for auto-tier)
- Guardian GitHub Action & PR Bot (TMS-287)
- Guardian Enhancements (TECH-2) - watch mode, better errors
- Migration Experience (TMS-277-282) - dry-run, better progress
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics
- Benchmark Suite (prove "3-5x faster" claim)

---

## 🗂️ Sprint Archive

- **v3.1**: [Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete (Jan 30, 2026)
- **v3.0**: [AI-Powered Onboarding](docs/archive/sprint-v3.0-boot-1.md) ✅ Complete (Jan 26-27, 2026)
- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 3.1.1 -->
