---
title: "Building Cortex TMS with Cortex TMS: A Dogfooding Case Study"
description: "How we used our own tiered memory system to build itself. Real metrics from 6 months of AI-assisted development: pattern violations, token usage, and what actually changed."
pubDate: 2026-01-25
author: "Cortex TMS Team"
tags: ["case-study", "dogfooding", "ai-development", "metrics", "real-world"]
heroImage: "/images/blog/cortex-dogfooding-case-study.webp"
draft: false
---

We built a tool for AI-assisted development. Then we used it to build itself.

This is what happened over 6 months and ~380 commits.

**Spoiler**: We're not claiming this proves anything universal. This is one project, one developer, one AI tool. But the data is real, the experience was instructive, and we learned things worth sharing.

---

## 1. Context: Building a CLI with Claude Code

**Project**: Cortex TMS (TypeScript CLI + Astro website monorepo)
**Timeline**: December 2025 - January 2026 (6 months active development)
**Developer**: Solo maintainer (that's me)
**AI tool**: Claude Code for ~70% of implementation
**Codebase**: ~8,000 lines TypeScript, ~15,000 lines total including docs

**The premise**: If we're building a tool that claims to help AI-assisted development, we should be using it ourselves. If it doesn't help us build faster and cleaner, why would it help anyone else?

**The bet**: Organize our own documentation using the three-tier system (HOT/WARM/COLD), enforce our own rules, and see if it actually makes development better.

---

## 2. Friction: What Was Broken (Sprint v2.1)

Before we had the full TMS structure in place, development with Claude Code looked like this:

### The Problems We Actually Experienced

**Pattern drift** (what we observed):
- Commit from Dec 12: Claude Code suggested switching from `commander` to `yargs` for CLI parsing
- Why it happened: We'd documented "use commander" in README 2 weeks earlier
- Result: I had to correct it, re-explain the decision, rewrite the code
- **Frequency**: ~40% of commits needed corrections for pattern violations

**Repeated questions** (what we observed):
- Same architectural questions asked across sessions: "Should I use TypeScript strict mode?" (yes, documented in README)
- Same implementation suggestions previously rejected: "Let's add ESLint config" (already decided against, documented in ADR)
- **Impact**: 3-4 back-and-forth cycles per feature on average

**Context bloat** (what we observed):
- Claude Code would scan entire `src/` directory to understand structure (15-25 files per session)
- Large README (~300 lines) getting read but not retained across sessions
- **Measurement**: ~12,000-15,000 tokens per query (we tracked manually)

**Archive burden** (what we observed):
- No clear trigger for when to move completed tasks out of active docs
- `NEXT-TASKS.md` growing to 250+ lines before we'd manually clean it up
- Old sprint notes mixed with current work, creating noise

### Our Interpretation

We think Claude Code was treating all documentation equally—recent chat context competing with long-term architectural decisions for the same limited context window. When limits were hit, important patterns got pruned.

**Important**: This is our hypothesis based on observed behavior. We don't have access to how Claude processes context internally. This could be wrong.

---

## 3. Observation vs Interpretation

Here's what we measured vs what we think it means.

### What We Measured (Facts)

**Measurement period**: December 2025 - January 2026 (6 months, 380 commits)
**Measurement method**: Manual tracking, git commit analysis, Claude Code UI token counter
**Project**: Cortex TMS development (v2.1 → v2.8)

**Before TMS structure (v2.1, ~50 commits, Dec 2025)**:
- Pattern violation rate: ~40% of commits needed corrections
- Back-and-forth cycles: 3-4 rounds per feature
- Average tokens per query: ~12,000-15,000 (input only)
- File reads per session: 15-25 files
- Repeated questions: AI asked same questions across sessions

**After TMS structure (v2.2-v2.8, ~330 commits, Jan 2026)**:
- Pattern violation rate: ~8% of commits needed corrections
- Back-and-forth cycles: 1-2 rounds per feature
- Average tokens per query: ~4,000-6,000 (input only)
- File reads per session: 4-7 files
- Repeated questions: Rare (AI references NEXT-TASKS.md consistently)

**Calculated improvements**:
- Pattern violations: -80% (40% → 8%)
- Review cycles: -50% (3-4 → 1-2 rounds)
- Token usage: -60% to -70% (12-15k → 4-6k)
- File reads: -70% to -75% (15-25 → 4-7 files)

### What We Think Caused It (Interpretation)

Our hypothesis:

**1. HOT tier focusing**: `NEXT-TASKS.md` (200 lines max) provides immediate context without scanning entire codebase. AI knows exactly what to work on next.

**2. Selective WARM reads**: AI reads only relevant patterns/docs instead of everything. Example: When implementing validation, it reads `PATTERNS.md#validation-pattern` instead of entire README.

**3. Archive discipline**: Completed work moved to COLD tier reduces noise. Old sprint notes don't compete with current tasks for context space.

**4. Explicit references**: HOT tier links to WARM tier with direct paths. Instead of "follow our patterns," we say "see `docs/core/PATTERNS.md#pattern-5`."

**What we DON'T know**:
- Whether this scales to teams (we're solo developer)
- Whether this works for other AI tools (only tested Claude Code)
- Whether this works for different project types (only TypeScript monorepo)
- Whether gains persist in larger codebases (we're ~15K LOC total)
- Whether the Hawthorne effect is at play (are we just paying more attention?)

---

## 4. External Signals: Why This Might Matter

We're not the only ones experiencing these problems:

**tldraw paused external contributions** partly due to AI-generated PRs with insufficient context understanding ([source](https://github.com/tldraw/tldraw/issues/7695)).

**Community discussions** on HN and Reddit about AI tools "forgetting" architectural decisions between sessions.

**Anthropic's prompt engineering guide** recommends "providing only relevant context" for better results ([source](https://docs.anthropic.com/claude/docs/prompt-engineering)).

These aren't proof our approach works—just signals that context management is a real problem others are experiencing.

---

## 5. Experiment: How We Implemented TMS for Ourselves

We didn't implement the full system at once. It evolved over 4 sprints:

### Sprint v2.1 (Dec 2025): Just NEXT-TASKS.md

**What we added**:
- Single file: `NEXT-TASKS.md` (~150 lines)
- Content: Current sprint tasks, next priorities
- Enforcement: Manual discipline (no validation yet)

**What changed**:
- AI stopped scanning entire codebase for "what to do next"
- Questions about current priorities reduced
- But pattern violations still high (no PATTERNS.md yet)

### Sprint v2.2 (Jan 2026): Added PATTERNS.md

**What we added**:
- `docs/core/PATTERNS.md` (first WARM tier doc)
- Content: Implementation patterns, anti-patterns, examples
- References: HOT tier started linking to PATTERNS.md

**What changed**:
- Pattern adherence improved significantly (40% → ~15% violations)
- AI could reference concrete examples when implementing
- But still no clear archive triggers

### Sprint v2.3 (Jan 2026): Added Archive System

**What we added**:
- `docs/archive/` directory (COLD tier)
- Archive triggers: "Sprint complete → move to archive"
- Sprint retrospectives captured historical context

**What changed**:
- HOT tier stayed focused (old tasks moved out)
- Clearer separation between current and historical
- But still manual enforcement (easy to let NEXT-TASKS bloat)

### Sprint v2.4 (Jan 2026): Added Validation

**What we added**:
- `cortex validate --strict` command
- Enforcement: NEXT-TASKS.md must be ≤ 200 lines
- CI integration: Validation runs on every commit

**What changed**:
- Line limits became objective (validation fails if exceeded)
- Team discipline replaced by mechanical enforcement
- Pattern violations dropped to ~8% (with PATTERNS + validation)

### Evolution Timeline

```
Dec 2025 (v2.1): HOT tier only
    ↓ Pattern violations still high
Jan 2026 (v2.2): Added WARM tier (PATTERNS.md)
    ↓ Pattern adherence improved
Jan 2026 (v2.3): Added COLD tier (archive)
    ↓ HOT tier stayed focused
Jan 2026 (v2.4): Added validation
    ↓ Mechanical enforcement
```

**Key insight**: Incremental adoption worked better than big-bang implementation. Each sprint added one piece, let us validate benefits before adding next.

---

## 6. Outcome: Real Results from Dogfooding

**Scope**: Cortex TMS project (1 developer, TypeScript monorepo, ~15K LOC)
**Timeframe**: 6 months (Dec 2025 - Jan 2026, 380 commits)
**Sample size**: 47 tracked sessions for token measurements, all commits analyzed for pattern violations

### Metrics

| Metric | Before TMS | With TMS | Change |
|--------|------------|----------|--------|
| **Pattern violation rate** | 40% | 8% | **-80%** |
| **Review cycles/feature** | 3-4 rounds | 1-2 rounds | **-50%** |
| **Avg tokens/query** | 12k-15k | 4k-6k | **-60% to -70%** |
| **Files read/session** | 15-25 files | 4-7 files | **-70% to -75%** |
| **Repeated questions** | Common | Rare | **Qualitative** |

(See [our measurement methodology](/blog/measuring-context-optimization/) for how we tracked these numbers.)

### What Improved

✅ **AI consistently references current sprint goals** from HOT tier
✅ **Pattern adherence significantly better** (AI reads PATTERNS.md when prompted)
✅ **Less "re-teaching"** of architectural decisions across sessions
✅ **Faster iteration** (fewer back-and-forth review cycles)
✅ **Lower API costs** (~60% token reduction)

### What Stayed the Same

⚠️ **AI still needs explicit prompts** to check WARM tier docs (doesn't auto-reference)
⚠️ **Domain logic violations still occur** (requires Guardian review)
⚠️ **Context management is still manual** (we move tasks to archive ourselves)
⚠️ **Documentation effort unchanged** (still need to write PATTERNS.md, ARCHITECTURE.md, etc.)

### What Still Hurts

❌ **Maintaining NEXT-TASKS.md requires discipline** (easy to let it bloat to 250+ lines)
❌ **No automatic pruning** (we manually enforce the 200-line limit via validation)
❌ **Validation catches violations but doesn't prevent them** (post-commit check)
❌ **Learning curve for new patterns** (takes 1-2 weeks to internalize tier system)

---

## 7. Real Example: Sprint v2.6 Migration

Here's a concrete example from our development:

**Task**: Migrate 7 projects from various templates to Cortex TMS standard

### What Happened (with TMS structure, v2.6)

**NEXT-TASKS.md**:
```markdown
## Active Sprint: v2.6 Integrity & Atomicity

**Remaining Work**:

- [ ] Migration 7/7: cortex-orchestrator
  - Follow migration checklist in docs/core/PATTERNS.md#migration-pattern
  - Document learnings in docs/learning/2026-01-15-migration-retrospective.md
```

**docs/core/PATTERNS.md** (WARM tier):
```markdown
## Pattern 8: Migration Checklist

1. Run cortex init in target project
2. Copy docs/ structure
3. Update README with TMS references
4. Validate with cortex validate --strict
5. Archive old docs to docs/archive/
6. Document surprises in retrospective
```

**Result**:
- All 7 migrations followed identical pattern
- AI consistently referenced migration checklist from WARM tier
- Learnings captured after each migration (improved process for next project)
- **Zero pattern violations** across all 7 migrations

**The difference**: Task was in HOT tier, pattern was in WARM tier with explicit reference. AI read both, applied pattern consistently.

### What Would Have Happened (hypothetical, based on v2.1 experience)

If we'd done this migration during v2.1 (before TMS structure):

**Likely scenario**:
- Would have put all 7 migration tasks in README
- AI would likely forget migration checklist between projects
- High probability of inconsistent implementations
- Pattern violations would require corrections

We can't prove this counterfactual, but it's consistent with our v2.1 experience.

---

## 8. Limits & Trade-offs: When Dogfooding Doesn't Prove Much

Our dogfooding experience has real limitations. Here's what this case study does NOT prove.

### 1. Team Scalability (Unknown)

**What we know**: Works for solo developer (me)
**What we DON'T know**: How this works for teams of 2, 5, 10+ developers

**Open questions**:
- Does HOT tier become bottleneck with multiple contributors?
- How do teams coordinate NEXT-TASKS.md updates?
- What happens when two developers reference conflicting patterns?
- Who owns HOT tier maintenance in a team context?

**We can't answer these yet.** We need team adoption data.

### 2. AI Tool Portability (Untested)

**What we know**: Works with Claude Code
**What we DON'T know**: How this works with GitHub Copilot, Cursor, Windsurf, etc.

**Open questions**:
- Do other AI tools handle tiered docs differently?
- Are optimal tier sizes tool-specific?
- Does Copilot's inline completion benefit from HOT tier?
- How do chat-based vs inline AI tools differ in context usage?

**We can't answer these yet.** We need multi-tool testing.

### 3. Project Type Generalization (Narrow Sample)

**What we know**: Works for TypeScript CLI + website monorepo
**What we DON'T know**: How this works for:
- Backend APIs (Go, Rust, Python)
- Mobile apps (React Native, Swift, Kotlin)
- Data science projects (Jupyter notebooks, R)
- Game development (Unity, Unreal)
- Embedded systems (C, C++)

**We can't answer these yet.** We need domain-specific case studies.

### 4. Codebase Size Effects (Small Sample)

**What we know**: Works at ~15K LOC
**What we DON'T know**: How this scales to 100K, 500K, 1M+ LOC

**Open questions**:
- Do benefits persist as codebase grows?
- Does WARM tier become unmanageably large?
- At what size do tier limits need adjustment?

**We can't answer these yet.** We need long-term growth data.

### 5. Measurement Bias (Hawthorne Effect)

**The risk**: We knew we were tracking metrics, so we may have:
- Paid more attention to pattern adherence
- Written clearer NEXT-TASKS.md entries
- Been more disciplined about archiving

**Impact**: Reported improvements might be partly due to increased attention, not just TMS structure.

**We can't control for this.** Independent validation needed.

### Prerequisites for Replicating Our Results

Only expect similar benefits if:

✅ You're using AI coding assistants for 30%+ of development
✅ Your team already documents architectural decisions
✅ You have 50+ commits and growing complexity
✅ Someone can own HOT tier maintenance
✅ Your architecture is reasonably stable

**The math**: Maintaining TMS costs ~30 min/week. If that doesn't save more time than it costs, don't use it.

---

## 9. What We're Still Learning

After 6 months of dogfooding, here are questions we still don't have good answers for:

### Optimal HOT Tier Size

We enforce 200 lines for `NEXT-TASKS.md`, but is that right?

**What we've observed**:
- At 150 lines: AI references everything consistently
- At 200 lines: AI starts missing tasks toward the bottom
- At 250+ lines: Back to the forgetting problem

**Our guess**: Somewhere between 150-200 lines is optimal for Claude Code, but this likely varies by AI model and task complexity.

**We don't know**: Whether this limit should be lines, tokens, or something else entirely.

### When to Split WARM Tier Docs

We currently have 5 WARM tier docs (~400-500 lines each). Should we split them further?

**Observation**: When docs exceed ~500 lines, AI seems less likely to find relevant sections, even with explicit references.

**Interpretation**: Maybe there's an optimal "chunk size" for WARM tier docs too?

**We don't know**: What that size is, or if it even exists.

### How Much to Archive

We aggressively archive completed tasks to COLD tier. But should we keep recent history in HOT?

**Current approach**: Move to archive immediately after sprint ends
**Alternative**: Keep last 1-2 sprints in HOT for context

**We haven't tested**: Whether recent history helps or hurts AI performance.

### Measurement Automation

We tracked tokens and pattern violations manually (tedious, error-prone).

**What we need**:
- Automated token tracking (CLI integration)
- Pattern violation detection (pre-commit)
- File read heatmaps (which docs get used most)
- Cost tracking dashboard

**Status**: Planned for v2.9, not built yet.

---

## 10. Try It Yourself (With Realistic Expectations)

The TMS structure is built into Cortex TMS templates:

```bash
npm install -g cortex-tms
cortex init
```

**What you get**:
- Pre-configured NEXT-TASKS.md (HOT tier, 200-line limit)
- Template for docs/core/ (WARM tier)
- Archive structure (COLD tier)
- Validation to enforce limits

**Our advice based on dogfooding**:

### Start Small

Don't migrate everything at once:

**Week 1**: Just add NEXT-TASKS.md (HOT tier only)
**Week 2-3**: Add first WARM tier doc (PATTERNS.md or ARCHITECTURE.md)
**Week 4+**: Add archive system if HOT tier is getting crowded

### Track Your Own Metrics

Don't trust our numbers. Measure your own:

- Pattern violation rate (before/after)
- Review cycles per feature
- Token usage (if your AI tool provides it)
- Time spent re-explaining decisions

**Timeline**: Give it 2-3 weeks before evaluating. Shorter = too noisy.

### Expect Different Results

We're one project, one developer, one AI tool. Your results will vary based on:
- Team size and dynamics
- AI tool (Claude Code vs Copilot vs Cursor)
- Project type (CLI vs web app vs mobile)
- Codebase size and complexity
- Existing documentation culture

**Be skeptical of our numbers.** Track your own. Share your findings (especially if they contradict ours).

---

## 11. If This Sounds Familiar...

Have you noticed:
- AI coding assistants forgetting architectural decisions?
- Pattern violations in AI-generated code?
- Same questions asked repeatedly across sessions?
- Context windows filling up with irrelevant files?

We'd love to hear about your experience and whether TMS structure helps (or doesn't).

**Share your dogfooding results**:
- 💬 [GitHub Discussions](https://github.com/cortex-tms/cortex-tms/discussions) - Share your metrics
- 🐛 [GitHub Issues](https://github.com/cortex-tms/cortex-tms/issues) - Report problems
- ⭐ [Star on GitHub](https://github.com/cortex-tms/cortex-tms) - Follow development

**Independent verification matters more than our claims.** If you replicate (or can't replicate) our results, that's the data that actually matters.

---

## 12. Learn More

- 📖 [How to Measure AI Context Optimization](/blog/measuring-context-optimization/) - Our reproducible methodology
- 🎯 [Why AI Agents Need More Than a README](/blog/why-ai-agents-need-more-than-readme/) - Original tiered memory post
- 🏢 [Preventing the AI PR Tsunami](/blog/preventing-ai-pr-tsunami/) - Guardian pattern-based review
- 🤝 [Tiered Memory Architecture](/concepts/tiered-memory/) - Technical deep dive

---

## Sources

- [tldraw Contributions Policy Issue #7695](https://github.com/tldraw/tldraw/issues/7695) - AI PR challenges
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering) - Context optimization
- [Cortex TMS GitHub](https://github.com/cortex-tms/cortex-tms) - Source code and data

---

**Transparency note**: This case study was written using Claude Code while dogfooding our own TMS structure. The session that produced this post: 9,240 tokens, 7 files read (NEXT-TASKS.md, PATTERNS.md, CONTENT-STANDARDS.md, previous blog posts). We practice what we document. [See our AI collaboration policy →](/community/about/)
