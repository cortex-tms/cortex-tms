# NEXT: v4.0.0 - Strategic Repositioning

**Last Updated**: 2026-02-21 (Website alignment completed, archived to docs/archive/v4.0-phase1-website-alignment.md)
**Status**: 🚧 In Progress - Phase 1 (60% complete)
**Timeline**: Week of Feb 21-28, 2026 (Estimated 25-30h)

---

## 🎯 Strategic Context: Adapting to Model Evolution

**Community signal**: ⭐ **166 GitHub stars** (interest signal, not proof of adoption)

**Market Shift**: Modern AI models now handle **large context windows** with **improved reasoning capabilities**. Token optimization is _less often_ the primary bottleneck.

**The New Challenge**: As AI coding agents become more autonomous, the bottleneck shifts from "can the model see enough context?" to "will the output stay aligned with our standards over time?"

**Governance becomes critical**:

- **Code quality drift** - AI agents write inconsistent code without governance
- **Overengineering** - Agents add unnecessary complexity without human oversight
- **Pattern violations** - Agents ignore project conventions as codebases scale

**Strategic Pivot**: v4.0.0 repositions Cortex TMS to solve what matters with advanced models:

1. **Documentation Governance** - Validates that PATTERNS.md + CLAUDE.md stay current and structurally sound
2. **Human-in-the-Loop Controls** - Governance rules require human approval for critical decisions
3. **Anti-Overengineering** - Scope discipline and pattern documentation prevent unnecessary complexity
4. **Context Rot Prevention** - Validation ensures governance docs stay accurate as projects evolve
5. **Pragmatic Focus Control (Optional)** - Task-based "lite/full" context presets reduce cognitive overhead; **not a v4.0 requirement** and **not a token-savings claim**

**v4.0 Non-Negotiable Scope**: credibility comes from _validation_, not promises. v4.0 ships (1) removal of cost/token claims + (2) staleness detection + (3) CI/local validation flows. Everything else is secondary.

**Positioning note**: If your agent runtime supports “skills/tools” (capabilities), Cortex remains complementary: it governs _behavior and standards_ (patterns, scope limits, approvals, freshness), rather than adding runtime actions.

---

## 📋 Phase 1: Update Documentation (Priority P0 - Days 1-2)

### Task 1.1: Remove Token Savings from Core Documentation ⏳ IN PROGRESS

**Owner**: Agent
**Effort**: 3-4h
**Files to Update**:

- [ ] `README.md` - Remove all token %, context reduction claims, Green Governance
  - Remove "60-70% input token reduction" claims (lines 15, 19, 76, etc.)
  - Remove cost savings tables (lines 74-79)
  - Remove HOT/WARM/COLD token count examples (lines 82-86)
  - Remove "Measurement & Validation" section (lines 93-114)
  - Remove sustainability/Green Governance claims (lines 17, 435-442, 657-662)
- [ ] `package.json` - Update description to "Documentation scaffolder and governance platform for AI coding agents"
- [ ] `CLAUDE.md` - Remove any token optimization references
- [ ] `.github/copilot-instructions.md` - Remove token-related guidance

**New Hero Section for README** (minimal placeholder - full rewrite in Phase 4 after staleness ships):

```markdown
# Cortex TMS: Documentation Scaffolder & Governance for AI Coding Agents

⭐ 166+ GitHub Stars | Open source, community-driven

Validates governance documentation for AI coding agents.
Catch stale docs, maintain structure—in CI or locally.

> Full README rewrite in Phase 4 after staleness detection ships.
```

**Acceptance Criteria**:

- [ ] `git grep "60-70%" -- README.md docs/ website/src/` returns zero results
- [ ] `git grep "token savings" -- README.md docs/ website/src/` returns zero results
- [ ] `git grep "Green Governance" -- README.md docs/ website/src/` returns zero results
- [ ] README hero section focuses on quality governance

---

### Task 1.2: Update Website Content ✅ COMPLETED

**Completed**: 2026-02-21
**Effort**: 8h
**Owner**: Claude + User

**Summary**: Comprehensive website alignment with v4.0.0 quality governance focus.
- ✅ 22 files updated (+103, -227 lines)
- ✅ Pillars rewritten: Consistency, Freshness, Safety
- ✅ All token/cost claims removed from active content
- ✅ Website builds successfully, all tests pass

**Details**: See `docs/archive/v4.0-phase1-website-alignment.md`

---

## 📋 Phase 2: Simplify & Repurpose CLI (Priority P0 - Days 2-3)

### Task 2.1: Remove Token Counting from Status Command ⏸️ PENDING

**Owner**: TBD
**Effort**: 2-3h
**Depends On**: Task 1.1

**Implementation**:

- [ ] Remove `--tokens` flag from `src/commands/status.ts`
- [ ] Simplify `status` command to show:
  - Sprint health (current tasks, completion %)
  - Validation status (docs health)
- [ ] Remove or minimize `src/utils/token-counter.ts`
  - Keep basic file counting for internal metrics only
  - Remove model cost calculations
- [ ] Update `status` tests to remove token assertions
- [ ] Update `status` documentation

**Acceptance Criteria**:

- [ ] `cortex-tms status --tokens` throws "unknown option" error
- [ ] `cortex-tms status` shows sprint health only
- [ ] All status tests pass

---

### Task 2.2: Deprecate auto-tier, Create Archive Command ⏸️ PENDING

**Owner**: TBD
**Effort**: 3-4h
**Depends On**: Task 2.1

**Rationale**: `auto-tier` was a community-requested feature. Hard removal will frustrate users. Provide deprecation path.

**Implementation**:

- [ ] Create `src/commands/archive.ts` - new archive functionality
  - Auto-move completed tasks from NEXT-TASKS.md to docs/archive/
  - Move old/stale content appropriately
- [ ] Keep `auto-tier` as **deprecated alias** in `src/cli.ts`
  - Prints deprecation warning
  - Delegates to `archive` command
- [ ] Update tests: create `archive.test.ts`, update `auto-tier.test.ts` for deprecation

**New Command Signature**:

```bash
cortex-tms archive                  # Archive completed tasks
cortex-tms archive --dry-run        # Preview what would be archived
cortex-tms auto-tier                # DEPRECATED: prints warning, calls archive
```

**Acceptance Criteria**:

- [ ] `cortex-tms auto-tier` prints deprecation warning, then runs archive
- [ ] `cortex-tms archive` moves completed NEXT-TASKS items to docs/archive/
- [ ] Archive tests pass
- [ ] Deprecation path documented in CHANGELOG

---

## 📋 Phase 3: Add Staleness Detection (Priority P0 - Days 3-4)

### Task 3.1: Implement Staleness Detection in Validate ⏸️ PENDING

**Owner**: TBD
**Effort**: 4-5h
**Depends On**: Task 1.1

**Rationale**: This is a **key differentiator** (underserved niche in AI governance tooling). Makes governance concrete and measurable. Must ship in v4.0.0.

**Implementation**:

- [ ] Add `validateDocStaleness()` to `src/utils/validator.ts`
- [ ] For each governance doc (PATTERNS.md, ARCHITECTURE.md, DOMAIN-LOGIC.md):
  - Compute **doc freshness** using git history (not filesystem mtime):
    - `git log -1 --format=%ct -- <docPath>` → last commit timestamp touching that doc
  - Compute **code activity** using git history with **improved heuristics**:
    - `git log --format=%ct --no-merges -- <watchDir>` for each configured directory
    - **Exclude**: merge commits, commits touching only tests/configs/lockfiles
    - Count **meaningful commits** (not just timestamps)
  - If meaningful code commits > `thresholdDays` newer than doc freshness AND > `minCommits` threshold → flag as **stale**
- [ ] Add git utility: `getLastGitCommitEpochSeconds(pathSpec)` using `child_process.execSync`
- [ ] Handle shallow clones / missing history:
  - In normal mode: warn and skip staleness check if commit dates cannot be determined
  - In `--strict`: fail with actionable guidance (set `fetch-depth: 0` in CI or disable staleness)
- [ ] Make thresholds configurable in `.cortexrc` with **per-doc watchDirs**:
  ```json
  {
    "staleness": {
      "enabled": true,
      "thresholdDays": 30,
      "minCommits": 3,
      "docs": {
        "PATTERNS.md": ["src/"],
        "ARCHITECTURE.md": ["src/", "infrastructure/"],
        "DOMAIN-LOGIC.md": ["src/"]
      }
    }
  }
  ```
- [ ] Output behavior:
  - Normal mode: warning
  - `--strict` mode: error (fails CI)
- [ ] Update `validate-reusable.yml` workflow:
  - Ensure checkout uses `fetch-depth: 0` so doc commit dates are discoverable
  - Keep messaging explicit when history is missing

**Example Output**:

```
⚠️  Staleness Warning (v1 heuristic - temporal comparison only):
  - docs/core/PATTERNS.md last updated 45 days ago
  - src/ has 12 meaningful commits since then
  - Governance docs may be outdated

Note: Staleness v1 uses git timestamps to detect obvious drift.
It cannot detect semantic misalignment. Review recommended.
```

**Acceptance Criteria**:

- [ ] `cortex-tms validate` detects stale governance docs using improved heuristics
- [ ] `cortex-tms validate --strict` fails when docs stale >30 days AND >minCommits
- [ ] Threshold configurable via `.cortexrc` (per-doc watchDirs supported)
- [ ] Excludes merge commits, test-only commits from staleness calculation
- [ ] CI integration works (validate-reusable.yml with fetch-depth: 0)
- [ ] Tests cover staleness detection logic with improved heuristics
- [ ] Documentation updated with **v1 limitations acknowledgment**:
  - README: "Staleness v1 uses git timestamps as heuristic, catches obvious drift"
  - Validate help: Clarifies this is temporal comparison, not semantic analysis

---

## 📋 Phase 4: Update Documentation & Messaging (Priority P1 - Days 4-5)

### Task 4.1: Rewrite README with Validation-First Positioning ⏸️ PENDING

**Owner**: TBD
**Effort**: 3-4h
**Depends On**: Task 3.1

**New README Structure**:

1. **Hero**: "Governance for AI Coding Agents" (validation-focused)
2. **What it does**: Validates governance doc health, detects staleness, maintains structure
3. **Three Pillars**: Consistency / Freshness / Safety (NOT Cost/Quality/Sustainability)
4. **What it does NOT do**: Save tokens, replace code review, enforce code patterns directly
5. **Quick Start**: `npx cortex-tms init` → `validate --strict`
6. **Commands Reference**: All commands documented
7. **Community**: GitHub discussions, issues, contributing

**Three Pillars** (replacing Cost/Quality/Sustainability):

1. **Consistency** - Document patterns and conventions (AI reads and follows them)
2. **Freshness** - Detect stale docs before they mislead AI agents
3. **Safety** - Human approval gates and scope discipline (via CLAUDE.md rules)

**Remove**:

- All "60-70%" token claims
- Cost savings tables
- Green Governance / sustainability messaging
- Model-specific references (GPT-4, Claude Opus 4.6)
- "Trusted by teams worldwide" (166 stars don't justify this)

**Add**:

- Staleness detection as headline feature (acknowledge v1 limitations)
- CI integration examples
- What Cortex validates (documentation health: structure, freshness, completeness)
- Clear framing: "Staleness v1 catches obvious drift via timestamps, not semantic analysis"

**Acceptance Criteria**:

- [ ] README focuses on validation capabilities (what Cortex checks)
- [ ] Three pillars: Consistency / Freshness / Safety
- [ ] No token savings claims
- [ ] No model-specific version references
- [ ] Staleness detection prominently featured
- [ ] "Open source, community-driven" (not "trusted by teams")
- [ ] Clear about what "governance" means: doc validation, not code enforcement

---

### Task 4.2: Write Blog Post on the Repositioning ⏸️ PENDING

**Owner**: TBD
**Effort**: 2-3h
**Depends On**: Task 4.1

**Blog Post Outline**:

- Title: "Why We Removed Token Savings Claims (And What We're Building Instead)"
- Introduction: AI ecosystem evolved—large contexts, improved reasoning capabilities
- The Shift: Token limits no longer the bottleneck. New challenge: governance for autonomous agents
- Why Governance Matters: As agents get more powerful, guardrails become critical
- **What We're Building**:
  - Staleness detection (detects when governance docs go stale)
  - CI validation (structure + freshness checks in GitHub Actions)
  - Documentation health monitoring (not just templates)
  - Human oversight rules (CLAUDE.md approval gates for critical ops)
- Dogfooding Results: Governance documentation improved code quality, reduced drift
- Conclusion: Transparent repositioning, validation-first approach

**Tone**: Transparent, developer-focused, honest about the shift (not defensive)

**Acceptance Criteria**:

- [ ] Blog post published to website
- [ ] Full benchmark data included
- [ ] Positions evidence-based validation as competitive advantage

---

## 📋 Phase 5: Testing & Verification (Priority P0 - Day 5)

### Task 5.1: Update Tests for Changed Commands ⏸️ PENDING

**Owner**: TBD
**Effort**: 3-4h
**Depends On**: Task 3.1

**Test Updates Required**:

- [ ] Update `tests/commands/status.test.ts` - remove token flag tests
- [ ] Create `tests/commands/archive.test.ts` - archive behavior
- [ ] Update `tests/commands/auto-tier.test.ts` - assert deprecation warning + delegates to archive
- [ ] Update integration tests for new command set
- [ ] Remove token counter unit tests (or minimize)

**Verification Checklist**:

- [ ] `pnpm test` - all tests pass
- [ ] `pnpm run build` - clean build
- [ ] `cortex-tms init` - scaffolds docs correctly
- [ ] `cortex-tms validate --strict` - validates correctly (including staleness)
- [ ] `cortex-tms validate` - detects stale governance docs
- [ ] `cortex-tms archive` - moves completed tasks
- [ ] `cortex-tms auto-tier` - shows deprecation warning
- [ ] `git grep "60-70%" -- README.md docs/ website/src/` → zero results
- [ ] `git grep "token savings" -- README.md docs/ website/src/` → zero results
- [ ] `git grep "GPT-4\|Claude Opus" -- README.md docs/ website/src/` → zero model-specific references
- [ ] Run `cortex-tms validate --strict` on Cortex TMS itself (dogfooding)

**Acceptance Criteria**:

- [ ] All tests pass
- [ ] All verification checks green
- [ ] Documentation updated with quality-focused messaging

---

### Task 5.2: Prepare v4.0.0 Release Notes ⏸️ PENDING

**Owner**: TBD
**Effort**: 1-2h
**Depends On**: Task 5.1

**Release Notes Draft** (for CHANGELOG.md):

```markdown
# v4.0.0 - Quality-First Release (2026-02-28)

## 🎉 New Features

**Archive Management**:

- ✅ `cortex-tms archive` - Auto-archive completed tasks
- ✅ Keeps NEXT-TASKS.md focused on current sprint
- ✅ Prevents context bloat from historical content

## 🎯 Strategic Repositioning

**Context**: Modern AI models handle large contexts and have improved reasoning. The bottleneck shifts from token limits to code quality governance.

**Focus**: v4.0.0 repositions Cortex TMS for autonomous AI agents:

1. **Code Quality Governance** - Prevent drift, overengineering, and pattern violations
2. **Human-in-the-Loop Controls** - Require human approval for critical operations
3. **Staleness Detection** - Detect when governance docs go stale relative to code (NEW in v4.0)
4. **Validation in CI** - Check governance doc health in GitHub Actions, not just locally

## 📊 Quality Validation

Internal dogfooding (building Cortex with Cortex) suggests governance can improve output quality:

- ✅ **Better test coverage** - TMS tasks included regression tests, control tasks skipped them
- ✅ **Pattern adherence** - TMS tasks followed PATTERNS.md, control tasks violated conventions
- ✅ **No overengineering** - TMS scope discipline prevented unnecessary complexity
- ✅ **Governance effectiveness** - Human approval requirements prevented autonomous drift

**Key Insight**: With large context models, governance and human oversight help reduce drift and maintain consistency.

Read full dogfooding report: [blog post link]

## 🔄 Breaking Changes

**Simplified Commands**:

- Removed `cortex-tms status --tokens` flag (streamlined sprint dashboard)
- Deprecated `cortex-tms auto-tier` (kept as alias) and introduced `cortex-tms archive`

**Documentation Updates**:

- Refocused messaging on code quality improvements
- Updated value propositions for clarity

## 🔄 Migration Guide (v3.x → v4.0)

**Status Command**:

- `cortex-tms status` now shows sprint health only
- Token analysis features removed for simplicity

**Archive Command**:

- `cortex-tms auto-tier` is deprecated and now aliases to `cortex-tms archive`
- Use `cortex-tms archive` directly (auto-tier still works but shows deprecation warning)
- New focus: managing completed tasks and historical content

**New Workflows**:

- Run `cortex-tms validate --strict` in CI to check governance health (freshness + structure)
- Use `cortex-tms archive` to keep NEXT-TASKS focused and auditable

## 🚀 What's Next

v4.0.0 establishes Cortex TMS as **a governance validation layer for AI agents**.

**Shipped in v4.0** (target):

- ✅ Staleness detection (detect when governance docs go stale)
- ✅ CI validation (health checks in GitHub Actions)
- ✅ Deprecated auto-tier with migration path
- ✅ Validation-first messaging

**Coming in v4.1** (March 2026):

- Git hooks integration (`cortex-tms hooks install`)
- Incremental doc updates (only touched sections)
- Governance packs (Node/Python/etc presets)
- Optional context profiles (non-destructive, if demand is real)
- **AGENTS.md template** — multi-agent governance source-of-truth for teams using Claude Code + Copilot + Cursor simultaneously. Defines shared rules once; per-agent files (CLAUDE.md, copilot-instructions.md) derive from it. Fits existing template system with minimal changes.

**Future** (v4.2+):

- MCP Server - Expose governance to any AI tool
- Multi-tool config generation
- **Skills integration** — Claude Code skill scaffolding (e.g. `/cortex-validate`, `/cortex-review`). Narrow audience (Claude Code only), low adoption-barrier impact. Worth building once governance framework is proven and skills are a mainstream pattern.

> Note: AGENTS.md (governance config) and Skills (runtime shortcuts) are distinct concepts. Do not conflate when building.
```

**Acceptance Criteria**:

- [ ] CHANGELOG.md updated with v4.0.0 notes
- [ ] Migration guide included
- [ ] Breaking changes clearly documented

---

## 📊 Sprint Metrics

**Total Estimated Effort**: 25-30h (realistic estimate accounting for edge cases)
**Priority**: P0 (Foundational pivot - validation credibility)
**Success Criteria**:

- Documentation updated with validation-focused messaging
- Staleness detection shipped and working in CI
- All token savings claims removed
- Model-specific references removed
- All tests passing
- v4.0.0 ready for release

**Timeline**:

- Days 1-2: Phase 1 (clean foundation - remove token claims)
- Days 2-3: Phase 2 (simplify CLI, deprecate auto-tier)
- Days 3-4: Phase 3 (staleness detection - HEADLINE FEATURE)
- Days 4-5: Phase 4 (update docs & messaging - validation-first)
- Day 5: Phase 5 (testing & release prep)

**Deferred to v4.1**:

- Context profiles (needs non-destructive redesign)
- Git hooks integration
- Governance packs

---

## 🚦 Status Dashboard

| Phase                 | Status         | Progress |
| :-------------------- | :------------- | :------- |
| Phase 1: Strip Claims | 🚧 In Progress | 60%      |
| Phase 2: Simplify CLI | ⏸️ Pending     | 0%       |
| Phase 3: Staleness    | ⏸️ Pending     | 0%       |
| Phase 4: Messaging    | ⏸️ Pending     | 0%       |
| Phase 5: Testing      | ⏸️ Pending     | 0%       |

**Phase 1 Progress**:
- ✅ Task 1.2: Website content aligned (DONE - 2026-02-21)
- ⏳ Task 1.1: Core docs cleanup (README, package.json, CLAUDE.md) - IN PROGRESS

**Next Actions**:

1. Complete Task 1.1 (README.md, package.json, CLAUDE.md updates)
2. Move to Phase 2 (CLI simplification)

---

<!-- @cortex-tms-version 4.0.0 -->
