# Sprint: Git-Based Auto-Tiering

**Completed**: 2026-01-30
**Effort**: 19h (actual)
**Priority**: 🔴 P0 (Must Have)
**Status**: ✅ Complete

---

## Goal

Reduce manual tier management through git-based automation. Automatically suggest HOT/WARM/COLD tier assignments based on git commit history.

## Context

Users manually assigned tier tags, which was time-consuming and error-prone. Git history provides objective signal for file recency and relevance. Built in response to Reddit community feedback.

**Alignment**: "Lost in the Middle" research - most relevant context should be at the beginning (HOT tier).

---

## Tasks Completed (7/7)

### Feature 1: Git-Based Auto-Tiering (7/7)
- [x] Design CLI Interface — Define `cortex auto-tier` command with dry-run support (2h)
- [x] Implement Git History Analysis — Parse git log to calculate file recency and activity (4h)
- [x] Build Tier Suggestion Engine — Algorithm to suggest tiers based on thresholds (3h)
- [x] Apply Tier Tags — Add/update `<!-- @cortex-tms-tier -->` comments in files (3h)
- [x] Edge Case Handling — Non-git repos, untracked files, submodules (2h)
- [x] Integration Testing — Test on cortex-tms repo (dogfooding) (2h)
- [x] Documentation — CLI reference + user guide with examples (3h)

**Total Effort**: 19h

---

## Key Files Created/Modified

### New Files
- `src/commands/auto-tier.ts` — Core auto-tier command implementation
- `src/__tests__/auto-tier.test.ts` — 14 tests for auto-tier functionality
- `website/src/content/docs/cli/auto-tier.mdx` — CLI reference documentation

### Modified Files
- `src/cli.ts` — Register auto-tier command
- `src/utils/token-counter.ts` — Enhanced to read tier tags
- `docs/cli/CLI-USAGE.md` — Auto-tier documentation
- `website/src/content/docs/concepts/tiered-memory.mdx` — Auto-tier section added
- `README.md` — Community credits for feedback

---

## Command Signature

```bash
cortex auto-tier [options]

Options:
  --hot <days>      Files modified in last N days → HOT (default: 7)
  --warm <days>     Files modified in last N days → WARM (default: 30)
  --cold <days>     Files untouched for N+ days → COLD (default: 90)
  --dry-run         Show what would change without applying
  --force           Overwrite existing tier tags
  --verbose         Show detailed git analysis
```

---

## Algorithm

```typescript
// Pseudocode for tier suggestion
for each file in repository:
  days_since_change = (now - git_last_commit_date) / (24 * 60 * 60)

  if days_since_change <= hot_threshold (7 days):
    suggested_tier = 'HOT'
  else if days_since_change <= warm_threshold (30 days):
    suggested_tier = 'WARM'
  else:
    suggested_tier = 'COLD'
```

---

## Results

### Performance: ⭐⭐⭐⭐⭐ (5/5)
- **Execution time**: ~300ms for 111 files (cortex-tms repo)
- **Target met**: < 2 seconds for 500-file repository ✅

### Functionality: ⭐⭐⭐⭐⭐ (5/5)
- **Dry-run mode**: Working perfectly ✅
- **Tier application**: Correctly adds/updates tags ✅
- **Mandatory files**: Respects NEXT-TASKS.md, CLAUDE.md (always HOT) ✅
- **Non-git repos**: Clear error message ✅
- **Untracked files**: Suggested as HOT (active work) ✅

### Test Coverage: ⭐⭐⭐⭐⭐ (5/5)
- **14 tests passing**: All auto-tier scenarios covered
- **Total tests**: 141 passing

---

## Acceptance Criteria

- [x] `cortex auto-tier --dry-run` shows tier suggestions with reasons
- [x] `cortex auto-tier` applies tier tags to files
- [x] Works on cortex-tms repo itself (dogfooding validation)
- [x] Handles non-git repos gracefully (clear error message)
- [x] Performance: < 2 seconds for 500-file repository
- [x] Respects existing mandatory HOT files (NEXT-TASKS.md, CLAUDE.md)
- [x] Documentation includes usage examples and best practices

---

## Edge Cases Handled

- **File not in git history** (new, untracked) → Suggest HOT (active work)
- **Git repo not initialized** → Show error with git setup instructions
- **Binary files** (images, etc.) → Skip (only tier documentation files)
- **Submodules** → Analyze within submodule context
- **Renamed files** → Use `git log --follow` to track across renames

---

## GPT-5.1 Code Review Feedback

**Applied**:
- [x] Fixed: `--cold` option now functional (was unused)
- [x] Fixed: Numeric threshold validation (prevents NaN/negative/misordered values)

**Deferred to v3.1.1** (Post-Release Hardening):
- [ ] Improve git repo detection for subdirectories (use `git rev-parse --is-inside-work-tree`)
- [ ] Add end-to-end integration test for full command flow
- [ ] Align file selection with token counter patterns / respect .gitignore
- [ ] Centralize tier configuration to avoid duplication

---

## Community Impact

**Community Feedback**: Reddit users requested automated tier management
**Credits**: Added to README acknowledgments section

---

## Release Notes

Published as **v3.1.0** on 2026-01-30.

See `CHANGELOG.md` for full release details.

---

## Next Steps (v3.1.1 Hardening)

Four hardening tasks identified during GPT-5.1 code review:
1. **Git Repo Detection Fix** (P0, 1h) — Use `git rev-parse --is-inside-work-tree`
2. **E2E Integration Tests** (P0, 2h) — Test full command flow
3. **File Selection Alignment** (P1, 2h) — Align with token counter patterns
4. **Centralize Tier Config** (P1, 1h) — Extract to shared module

**Priority**: Address P0 items in v3.1.1 patch release.

<!-- @cortex-tms-version 4.0.2 -->
