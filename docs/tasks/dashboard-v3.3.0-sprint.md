# Dashboard Enhancements for Cortex TMS v3.3.0 (Revised)

**Target Release:** v3.3.0
**Branch:** `feat/terminal-dashboard` → `develop`
**Revised based on:** GPT-5.1 feedback (2026-02-02)

---

## Design Philosophy

**Focus on TMS-native metrics first.** The dashboard should reinforce what Cortex TMS is fundamentally about:
- Documentation health (file sizes, validation)
- AI context reduction (tiers, token efficiency)
- Code quality (Guardian reviews)

Features like sprint tracking and cost analytics are valuable but adjacent — they belong in later phases.

---

## Phased Approach

| Phase | Features | Priority |
|-------|----------|----------|
| **Phase 1 (v3.3.0)** | File Size Health + Guardian Status + Tab Navigation | Core |
| **Phase 2 (v3.3.1)** | Sprint Progress Card | Standard |
| **Phase 3 (v3.4.0)** | Cost Savings Card (opt-in) | Experimental |

---

## Phase 1: v3.3.0 Core Scope

### 1.1 File Size Health Card

**Why:** Directly reflects TMS validation rules and documentation hygiene. Strongly aligned with core TMS responsibilities.

**Integration:**
- Reuse/extend `.cortex/validation-cache.json` for line counts
- Share thresholds with `src/utils/validator.ts` (single source of truth)
- Use existing `DEFAULT_LINE_LIMITS` constants

**Color Coding:**
- 🟢 Green: < 80% of limit
- 🟡 Yellow: 80-100% of limit
- 🔴 Red: > limit

**New Files:**
- `src/ui/components/dashboard/FileSizeHealthCard.tsx`

**UI Mockup:**
```
┌──────────────────────────────────────────────────────────────────┐
│ 📏 FILE SIZE HEALTH                                              │
│                                                                  │
│ 🔴 NEXT-TASKS.md          342/300 lines  (114%)                  │
│ 🟡 docs/core/PATTERNS.md  245/300 lines  (82%)                   │
│ 🟢 CLAUDE.md              156/300 lines  (52%)                   │
│                                                                  │
│ 1 file over limit • Run: cortex-tms validate --fix               │
└──────────────────────────────────────────────────────────────────┘
```

**Graceful Degradation:**
- If no validation cache: "Run `cortex-tms validate` to check file sizes"

---

### 1.2 Guardian Status Card

**Why:** Integrates Guardian into the project health story. Encourages regular code reviews.

**Integration:**
- Read from `.cortex/guardian-cache.json` (new cache file)
- Modify `src/commands/review.ts` to write cache on completion
- Use ISO timestamps in JSON, convert to `Date` at UI boundary
- Writing cache must be backward-compatible (no behavior change if missing)

**Cache Format:**
```json
{
  "timestamp": "2026-02-03T10:30:00Z",
  "status": "minor_issues",
  "violationCount": 3,
  "highConfidenceCount": 1,
  "filesReviewed": 5
}
```

**New Files:**
- `src/ui/components/dashboard/GuardianStatusCard.tsx`

**UI Mockup:**
```
┌──────────────────────────────────────────────────────────────────┐
│ 🛡️  GUARDIAN CODE REVIEW                                         │
│                                                                  │
│ ⚠️  Minor Issues Found                                           │
│                                                                  │
│ Last review: 2 hours ago                                         │
│ Violations: 3 total (1 high-confidence)                          │
│                                                                  │
│ Run: cortex-tms review <file>                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Graceful Degradation:**
- If no cache: "Guardian has not been run yet"
- Shows prompt: "Run: `cortex-tms review <file>`"

---

### 1.3 Minimal Tab Navigation

**Why:** Needed once we have 5+ cards to avoid overly tall scrolling dashboard.

**Views:**
1. **Overview** (default) - Context reduction hero metric + Validation status
2. **Files** - Hot files + File distribution + File size health
3. **Health** - Validation status + Guardian status

**Implementation:**
- New component: `src/ui/components/dashboard/TabBar.tsx`
- Use Ink's `useInput` hook for keyboard handling
- Keep default experience simple - Overview shows the most important metric first

**Keyboard Shortcuts:**
- `1`, `2`, `3` - Jump to specific view
- `Tab` / `Shift+Tab` - Cycle views
- `q` - Quit dashboard
- `r` - Manual refresh

**Interaction with --live:**
- `r` triggers immediate refresh regardless of auto-refresh timer
- View state preserved during auto-refresh

**New Files:**
- `src/ui/components/dashboard/TabBar.tsx`

**UI Mockup:**
```
╔══════════════════════════════════════════════════════════════════╗
║                     🧠 CORTEX TMS DASHBOARD                      ║
║                                                                  ║
║  [1. Overview]    2. Files    3. Health         8:47:28 AM       ║
║  ────────────────────────────────────────────────────────────────║
║                                                                  ║
║  (Context Reduction hero metric always visible in Overview)      ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║  1/2/3: Views • Tab: Cycle • r: Refresh • q: Quit                ║
╚══════════════════════════════════════════════════════════════════╝
```

---

### 1.4 Bonus: Tier Hygiene Indicator (Optional)

**Why:** Shows how many files are missing explicit `@cortex-tier` tags. Reinforces proper TMS usage.

**Implementation:**
- Add to File Distribution card or as small note
- Count files using path inference vs explicit tags
- "12 files missing @cortex-tier tags"

---

## Architecture: DashboardData Layer

**Per GPT-5.1 feedback:** Keep `TMSStats` focused on TMS fundamentals. Build richer dashboard data separately.

### TMSStats (keep focused)
```typescript
// src/utils/stats-collector.ts - NO CHANGES to interface
export interface TMSStats {
  files: { hot, warm, cold, total };
  hotFiles: string[];
  validation: { status, violations, lastChecked };
  project: { name, hasTMS };
}
```

### New: DashboardData Layer
```typescript
// src/ui/utils/dashboard-data.ts (NEW FILE)
export interface DashboardData {
  // Base stats (from TMSStats)
  stats: TMSStats;

  // Derived/extended data for cards
  fileSizeHealth: FileSizeHealthItem[];
  guardian: GuardianCacheEntry | null;
  tierHygiene: { tagged: number; inferred: number };

  // Future phases (optional)
  sprint?: SprintInfo;
  savings?: SavingsEstimate;
}

export async function buildDashboardData(cwd: string): Promise<DashboardData> {
  const stats = await collectTMSStats(cwd);
  const fileSizeHealth = await getFileSizeHealth(cwd);
  const guardian = await readGuardianCache(cwd);
  const tierHygiene = await analyzeTierHygiene(cwd);

  return { stats, fileSizeHealth, guardian, tierHygiene };
}
```

**Benefits:**
- `stats-collector.ts` stays focused on filesystem/tier/validation facts
- Dashboard-specific computations isolated in UI layer
- Easier to add Phase 2/3 features without touching core

---

## Implementation Plan

### Step 1: DashboardData Layer
- Create `src/ui/utils/dashboard-data.ts`
- Implement `buildDashboardData()` function
- Reuse existing validators and caches

### Step 2: File Size Health Card
- Create `src/ui/components/dashboard/FileSizeHealthCard.tsx`
- Integrate with validation cache/validator
- Add graceful degradation

### Step 3: Guardian Status Card
- Create `src/ui/components/dashboard/GuardianStatusCard.tsx`
- Modify `src/commands/review.ts` to write cache
- Add graceful degradation

### Step 4: Tab Navigation
- Create `src/ui/components/dashboard/TabBar.tsx`
- Update `Dashboard.tsx` with view state and keyboard handling
- Organize existing cards into views

### Step 5: Integration & Testing
- Update `src/ui/index.tsx` to use `buildDashboardData()`
- Add tests for graceful degradation paths
- Manual testing across views

---

## Files Summary

### New Files (4)
```
src/ui/utils/dashboard-data.ts          # DashboardData layer
src/ui/components/dashboard/FileSizeHealthCard.tsx
src/ui/components/dashboard/GuardianStatusCard.tsx
src/ui/components/dashboard/TabBar.tsx
```

### Modified Files (3)
```
src/ui/index.tsx                  # Use buildDashboardData()
src/ui/components/Dashboard.tsx   # View state + keyboard + new cards
src/commands/review.ts            # Write guardian cache
```

---

## Verification Plan

### Unit Tests
- `dashboard-data.test.ts` - Test buildDashboardData with mocked caches
- Test file size health calculation
- Test guardian cache reading (present/missing/corrupt)
- Test tier hygiene analysis

### Graceful Degradation Tests (Critical)
- No validation cache → "Run cortex-tms validate"
- No guardian cache → "Guardian has not been run yet"
- Empty/corrupt caches → Fallback to safe defaults
- Non-TMS project → Existing "No TMS Detected" behavior

### Manual Testing
```bash
pnpm run build

# Test all views
node bin/cortex-tms.js dashboard

# Test keyboard navigation
# Press 1, 2, 3, Tab, r, q

# Test --live mode with view switching
node bin/cortex-tms.js dashboard --live
```

### Acceptance Criteria
- [ ] All 3 views render without errors
- [ ] Tab/number key navigation works
- [ ] File size health shows files near/over limits
- [ ] Guardian status reads from cache (or shows "not run yet")
- [ ] Context reduction hero metric stays at top of Overview
- [ ] Graceful degradation for all missing data scenarios
- [ ] All existing tests pass
- [ ] New tests cover degradation paths

---

## Estimated Effort

| Step | Effort |
|------|--------|
| DashboardData layer | 1 hour |
| File Size Health Card | 1-2 hours |
| Guardian Status Card | 1-2 hours |
| Tab Navigation | 2-3 hours |
| Testing & Polish | 1-2 hours |
| **Total Phase 1** | **6-10 hours** |

---

## Phase 2 & 3 (Deferred)

### Phase 2: Sprint Progress Card (v3.3.1)
- Requires robust `parseSprintInfo()` tolerant of varied NEXT-TASKS.md formats
- Must degrade to "No sprint data configured" explicitly
- Not assumed from arbitrary Markdown

### Phase 3: Cost Savings Card (v3.4.0 - Experimental)
- **Opt-in only** - behind config flag in `.cortexrc`
- Driven by explicit config: sessions/day, model, cost per 1K tokens
- Clearly labeled as **estimates**, not billing data
- Default: hidden/disabled

---

## Summary of GPT-5.1 Feedback Incorporated

| Feedback | How Addressed |
|----------|---------------|
| Focus on TMS-native metrics | Phase 1 = File Size + Guardian only |
| Sprint/Cost are adjacent, not core | Deferred to Phase 2/3 |
| Keep TMSStats focused | New DashboardData layer |
| Reuse validation cache | FileSizeHealth uses existing cache |
| Test graceful degradation | Explicit test cases added |
| Show "no data" states explicitly | Each card has degradation UI |
| Keep context reduction hero visible | Overview tab shows it first |
| Consider --simple flag | Noted for future (low priority) |
| Add Tier Hygiene indicator | Added as optional bonus |

---

## Sprint Plan: Dashboard v3.3.0 Enhancement

**Sprint Name:** Dashboard Health & Navigation (v3.3.0)
**Duration:** 2-3 days (6-10 hours total)
**Branch:** `feat/dashboard-v3.3.0` (from `feat/terminal-dashboard`)

### Sprint Goals
1. Add File Size Health monitoring to dashboard
2. Add Guardian code review status to dashboard
3. Implement tab-based navigation for organized views
4. Maintain 100% backward compatibility

---

### Task Breakdown

#### Foundation Tasks

**Task 1: Create DashboardData Layer**
- Create `src/ui/utils/dashboard-data.ts`
- Define `DashboardData` interface
- Implement `buildDashboardData(cwd)` function
- Add type definitions for FileSizeHealthItem, GuardianCacheEntry
- **Acceptance:** Function returns data with graceful fallbacks for missing caches
- **Time:** 1 hour

**Task 2: Add Helper Utilities**
- Implement `getFileSizeHealth(cwd)` - reads validation cache
- Implement `readGuardianCache(cwd)` - reads guardian cache with error handling
- Implement `analyzeTierHygiene(cwd)` - counts tagged vs inferred files
- **Acceptance:** All utilities handle missing/corrupt data gracefully
- **Time:** 1 hour

#### Card Implementation Tasks

**Task 3: File Size Health Card**
- Create `src/ui/components/dashboard/FileSizeHealthCard.tsx`
- Color-code files by health status (green/yellow/red)
- Show top 5 files closest to/over limits
- Add "Run: cortex-tms validate --fix" hint for violations
- Graceful state: "Run `cortex-tms validate` to check file sizes"
- **Acceptance:** Card renders with mock data and real validation cache
- **Time:** 1.5 hours

**Task 4: Guardian Status Card**
- Create `src/ui/components/dashboard/GuardianStatusCard.tsx`
- Display last review timestamp with "time ago" formatting
- Show violation counts with status emoji (✅/⚠️/❌)
- Add "Run: cortex-tms review <file>" hint
- Graceful state: "Guardian has not been run yet"
- **Acceptance:** Card renders with/without guardian cache
- **Time:** 1.5 hours

**Task 5: Guardian Cache Integration**
- Modify `src/commands/review.ts`
- Write `.cortex/guardian-cache.json` after review completes
- Ensure backward compatibility (no breaking changes)
- Use ISO timestamp format
- **Acceptance:** Review command works with/without cache write
- **Time:** 1 hour

#### Navigation Tasks

**Task 6: Tab Bar Component**
- Create `src/ui/components/dashboard/TabBar.tsx`
- Implement view tabs (Overview, Files, Health)
- Highlight active view
- Show keyboard shortcuts hint
- **Acceptance:** Tab bar renders with active state
- **Time:** 1 hour

**Task 7: Keyboard Navigation**
- Add `useInput` hook to Dashboard.tsx
- Implement keyboard shortcuts (1/2/3, Tab, Shift+Tab, q, r)
- Manage view state (useState)
- Handle interaction with --live mode
- **Acceptance:** All keyboard shortcuts work, view switches smoothly
- **Time:** 1.5 hours

**Task 8: View Organization**
- Reorganize cards into 3 views:
  - Overview: ContextReduction + Validation
  - Files: HotFiles + FileDistribution + FileSizeHealth
  - Health: Validation + Guardian
- Update component exports in dashboard/index.tsx
- Ensure context reduction hero stays at top
- **Acceptance:** All 3 views render correctly
- **Time:** 1 hour

#### Integration & Testing Tasks

**Task 9: Integration**
- Update `src/ui/index.tsx` to use `buildDashboardData()`
- Pass DashboardData through to Dashboard component
- Update Dashboard.tsx props interface
- **Acceptance:** Dashboard loads without errors
- **Time:** 0.5 hours

**Task 10: Unit Tests**
- Add `src/ui/utils/dashboard-data.test.ts`
- Test buildDashboardData with various cache states
- Test getFileSizeHealth with mock validation cache
- Test readGuardianCache with missing/corrupt files
- Test analyzeTierHygiene
- **Acceptance:** 100% coverage for dashboard-data utilities
- **Time:** 1.5 hours

**Task 11: Integration Tests**
- Update `src/__tests__/` with dashboard navigation tests
- Test view switching
- Test keyboard shortcuts
- Test graceful degradation scenarios
- **Acceptance:** All tests pass
- **Time:** 1 hour

**Task 12: Manual Testing & Polish**
- Test dashboard in real cortex-tms project
- Test with missing caches (fresh project)
- Test with validation violations
- Test with guardian results
- Test --live mode with view switching
- Fix any visual/UX issues
- **Acceptance:** Dashboard works flawlessly in all scenarios
- **Time:** 1 hour

---

### Task Dependencies

```
Task 1 (DashboardData) → Task 2 (Helpers) → Task 9 (Integration)
                       ↓
Task 3 (FileSize Card) ────────┐
Task 4 (Guardian Card) ────────┤→ Task 8 (View Org) → Task 11 (Tests)
Task 5 (Guardian Cache) ───────┤
Task 6 (TabBar) ────────────────┤
Task 7 (Keyboard Nav) ──────────┘
                                ↓
                         Task 12 (Polish)
```

---

### NEXT-TASKS.md Entry

```markdown
## 🎯 Current Sprint: Dashboard Health & Navigation (v3.3.0)

**Goal:** Enhance terminal dashboard with health monitoring and organized navigation

**Progress:** 0/12 tasks complete

### Foundation
- [ ] **Task 1:** Create DashboardData layer (1h)
- [ ] **Task 2:** Add helper utilities for cache reading (1h)

### Card Implementation
- [ ] **Task 3:** File Size Health Card component (1.5h)
- [ ] **Task 4:** Guardian Status Card component (1.5h)
- [ ] **Task 5:** Guardian cache integration in review.ts (1h)

### Navigation
- [ ] **Task 6:** Tab Bar component (1h)
- [ ] **Task 7:** Keyboard navigation with useInput (1.5h)
- [ ] **Task 8:** Organize cards into 3 views (1h)

### Integration & Testing
- [ ] **Task 9:** Integrate buildDashboardData into UI (0.5h)
- [ ] **Task 10:** Unit tests for dashboard-data utilities (1.5h)
- [ ] **Task 11:** Integration tests for navigation (1h)
- [ ] **Task 12:** Manual testing and polish (1h)

**Total Estimated Time:** 6-10 hours
**Target Completion:** 2-3 days
```

---

### Daily Breakdown Suggestion

**Day 1 (3-4 hours):**
- Tasks 1-2: Foundation
- Tasks 3-5: Card implementation
- Checkpoint: Cards render with mock/cached data

**Day 2 (2-3 hours):**
- Tasks 6-8: Navigation
- Task 9: Integration
- Checkpoint: All 3 views navigable

**Day 3 (1-3 hours):**
- Tasks 10-11: Testing
- Task 12: Polish
- Checkpoint: All tests pass, ready for review

---

### Success Criteria

- [ ] Dashboard shows File Size Health with color coding
- [ ] Dashboard shows Guardian status (or "not run yet")
- [ ] Tab navigation works (1/2/3 keys, Tab/Shift+Tab)
- [ ] All graceful degradation paths tested
- [ ] Context reduction hero metric stays prominent
- [ ] --live mode works with view switching
- [ ] All existing tests pass
- [ ] Code review approved
- [ ] Ready to merge to develop
