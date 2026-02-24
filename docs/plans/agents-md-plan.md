# Plan: AGENTS.md Template — Multi-Agent Governance

**Branch**: `feat/agents-md-template`
**Sprint**: v4.1
**Effort estimate**: ~4-5h
**Status**: 📋 Pending approval
**Last revised**: 2026-02-24 (post-feedback)

---

## What & Why

Modern teams use multiple AI coding agents simultaneously — Claude Code, Cursor, GitHub Copilot, Windsurf. Each reads a different config file (`CLAUDE.md`, `.cursorrules`, etc.), but there's no shared source of truth that answers:

- *Which agents are authorised in this project?*
- *What is each agent's role and scope?*
- *What are the handoff rules between agents?*
- *What can no agent do, regardless of tool?*

**AGENTS.md** fills that gap. It acts as the human-readable governance layer above any specific AI tool config.

This is distinct from what already exists:
- `CLAUDE.md` → persona + workflow for **Claude Code specifically**
- `.github/copilot-instructions.md` → instructions for **Copilot specifically**
- `docs/core/AI-COLLABORATION-POLICY.md` → internal policy doc (not agent-readable)
- `AGENTS.md` → **tool-agnostic registry and governance contract for all agents**

**Positioning note**: This is governance-by-convention, not a security boundary. Value is highest for teams with multiple tools; solo devs with one tool should see it as optional background noise — which is exactly how the validation is designed.

---

## Scope

Template + init wiring + light validation signal + tests. No new CLI command.

1. New template file `templates/AGENTS.md`
2. Wire into scope presets (standard + enterprise)
3. Add line limit
4. Soft validation hint when AGENTS.md is missing
5. Tests (including strict-mode behaviour)
6. Update NEXT-TASKS.md and FUTURE-ENHANCEMENTS.md

---

## Implementation Tasks

### Task 1 — Create `templates/AGENTS.md`

Rich, opinionated template. Placeholder policy:
- `[Project Name]` — auto-filled by `init` via `replacePlaceholders` ✓
- Human-only fields (`Last Updated`, `Owner`) use **`TBD` literals** — not bracket syntax

**Why not `[Date]` for Last Updated?** The `replacePlaceholders` function only handles `[Key]` bracket syntax — an HTML comment or other marker won't be auto-replaced. More importantly, `Last Updated` should be set every time AGENTS.md changes, not just at init time. `TBD` is honest and consistent with our stated placeholder philosophy.

Template structure:

```markdown
# AGENTS.md — Multi-Agent Governance

**Project**: [Project Name]
**Last Updated**: TBD
**Owner**: TBD

## Purpose
Single source of truth for all AI agents in this project. Every agent (Claude Code,
Cursor, Copilot, etc.) reads this file before taking action.

**Precedence**: This file > any tool-specific config (CLAUDE.md, .cursorrules, etc.)
If any agent instruction conflicts with this file, follow AGENTS.md and escalate.

## Active Agents & Roles
| Agent      | Tool              | Primary Role              | Trust Level                |
|:-----------|:------------------|:--------------------------|:---------------------------|
| Claude     | Anthropic Claude  | Implementation + planning | High — with human approval |
| Copilot    | GitHub Copilot    | Inline code completion    | Medium — suggestions only  |

## Capabilities Matrix
| Action                        | Any Agent | Requires Human Approval | Never |
|:------------------------------|:---------:|:-----------------------:|:-----:|
| Edit feature code             | ✓         |                         |       |
| Refactor / rename             | ✓         |                         |       |
| Add/remove dependencies       |           | ✓                       |       |
| Breaking changes              |           | ✓                       |       |
| Merge to main                 |           |                         | ✓     |
| Force push                    |           |                         | ✓     |
| Publish releases              |           |                         | ✓     |
| Modify security policies      |           |                         | ✓     |

## Shared Conventions (All Agents Must Follow)
- Read PATTERNS.md before writing any code
- Follow DOMAIN-LOGIC.md for business rules
- Write tests for all new functionality
- No direct commits to main

## Handoff Protocol
- **Claude Code → Copilot**: For inline completion during review sessions
- **Any Agent → Human**: When blocked, scope is ambiguous, or architecture is affected

## Escalation Rules — Stop and ask a human when:
- A breaking change is required
- A new dependency must be selected
- A security concern is identified
- Scope remains unclear after 2 attempts to clarify

## Universal Prohibitions (No Agent, Ever)
- Force push to any protected branch
- Merge code without human review
- Publish to npm/PyPI/etc. independently
- Modify authentication or security configuration
```

---

### Task 2 — Add to Scope Presets (`src/utils/config.ts`)

Add `"AGENTS.md"` to:
- `standard.optionalFiles`
- `enterprise.optionalFiles`

**Not** added to `nano` (intentionally minimal by design).

---

### Task 3 — Add Line Limit

Add `"AGENTS.md": 300` to:
- `DEFAULT_LINE_LIMITS` in `src/utils/config.ts`
- `DEFAULT_LINE_LIMITS` in `src/utils/validator.ts`
- `LineLimits` interface in `src/types/cli.ts`

300 lines: enough for ~5–6 agents with full detail, stays lean.

---

### Task 4 — Validation Check (`src/utils/validator.ts`)

**Validation semantics decision**: Use `passed: true, level: "info"`.

**Rationale (from reading the validator source)**:
- `summary.passed` counts `checks.filter(c => c.passed).length` — so `passed: false` would reduce this count, causing "Passed: 9/10" while the overall result says "Validation passed". That's confusing UX.
- `summary.errors` and `summary.warnings` never count `info` level — so strict mode is already safe.
- `passed: true, level: "info"` is the existing pattern for soft suggestions (see "Consider archiving completed tasks soon" check at validator.ts:420–428).

**Implementation**: new `validateRecommendedFiles` function called from `validateProject`:

```ts
function validateRecommendedFiles(cwd: string, scope?: string): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  // AGENTS.md recommended for standard/enterprise scope
  if (scope === 'standard' || scope === 'enterprise') {
    const agentsPath = join(cwd, 'AGENTS.md');
    if (!existsSync(agentsPath)) {
      checks.push({
        name: 'Recommended: AGENTS.md',
        passed: true,       // ← does NOT reduce passed count
        level: 'info',      // ← never affects strict mode
        message: 'AGENTS.md not found — recommended for multi-agent projects',
        details: 'Run cortex-tms init or create AGENTS.md to define agent roles and boundaries.',
        file: 'AGENTS.md',
      });
    }
  }

  return checks;
}
```

Wire into `validateProject()` alongside existing checks.

---

### Task 4b — Display Section (`src/commands/validate.ts`)

**Critical gap found**: The validate command renders checks via hardcoded `c.name.startsWith()` category filters. Checks not matching any filter are silently computed but never shown to the user. The new "Recommended: AGENTS.md" check falls into none of the existing categories.

**Fix**: Add a `recommendedChecks` display block after the archive section:

```ts
// After archiveChecks display block (~line 238)
const recommendedChecks = result.checks.filter((c) =>
  c.name.startsWith("Recommended:")
);

if (recommendedChecks.length > 0) {
  console.log(chalk.bold("\n💡 Recommendations"));
  recommendedChecks.forEach((check) => {
    console.log(formatCheck(check, options.verbose || false));
  });
}
```

With `passed: true, level: "info"`, `formatCheck` renders the green ✓ emoji with gray text — visible but clearly non-critical.

**Note**: The recommendations section is always shown (not gated by `--verbose`). This is intentional — a soft recommendation that only appears under verbose would be invisible to most users, defeating the purpose.

**Follow-up issue identified**: Staleness checks (`Doc Staleness`, `Doc Freshness`) are also not matched by any display category and are silently dropped from output. This is a pre-existing bug, not introduced by this PR. File a follow-up task after this PR merges.

---

### Task 5 — Write Tests (`src/__tests__/agents.test.ts`)

Tests to cover:

| # | Test | Type |
|---|------|------|
| 1 | Template file `templates/AGENTS.md` exists | Unit |
| 2 | Template contains required sections (Purpose, Capabilities Matrix, etc.) | Unit |
| 3 | `init --scope standard` copies AGENTS.md | Integration (CLI) |
| 4 | `init --scope enterprise` copies AGENTS.md | Integration (CLI) |
| 5 | `init --scope nano` does NOT copy AGENTS.md | Integration (CLI) |
| 6 | Placeholder `[Project Name]` is replaced in copied file | Integration (CLI) |
| 7 | `validate` emits info check when AGENTS.md missing (standard scope) | Integration (CLI) |
| 8 | `validate` does NOT emit AGENTS.md check for nano scope | Integration (CLI) |
| 9 | `validate --strict` does NOT fail solely because AGENTS.md is missing | Integration (CLI) |
| 10 | Missing AGENTS.md does not reduce the "Passed: X" count | Unit (validator) |

Pattern: follows `hooks.test.ts` style — temp dirs, `execSync` via CLI binary.

---

### Task 6 — Update `NEXT-TASKS.md`

Mark AGENTS.md task as Active with sub-task table.

---

### Task 7 — Update `FUTURE-ENHANCEMENTS.md`

Remove the `AGENTS.md template` entry under Phase 6 (Agent Ecosystem) to avoid duplication now that it's active.

---

## Files Changed (Summary)

| File | Change |
|------|--------|
| `templates/AGENTS.md` | **CREATE** — governance template |
| `src/utils/config.ts` | **EDIT** — add to standard/enterprise optionalFiles; add line limit |
| `src/utils/validator.ts` | **EDIT** — add line limit constant; add `validateRecommendedFiles` function |
| `src/commands/validate.ts` | **EDIT** — add "💡 Recommendations" display section |
| `src/types/cli.ts` | **EDIT** — add `"AGENTS.md"` to `LineLimits` interface |
| `src/__tests__/agents.test.ts` | **CREATE** — 10-test suite |
| `NEXT-TASKS.md` | **EDIT** — mark active, add sub-tasks |
| `FUTURE-ENHANCEMENTS.md` | **EDIT** — remove duplicate entry |

---

## Out of Scope (Not in This PR)

- New `cortex-tms agents` command
- Auto-generating AGENTS.md from `.cortexrc`
- Multi-tool config generation (CLAUDE.md + .cursorrules from single source)
- Adding AGENTS.md to `validatePlaceholders` file scan list

---

## Definition of Done

- [ ] `templates/AGENTS.md` created with Precedence, Capabilities Matrix, Escalation, Prohibitions sections
- [ ] Only `[Project Name]` used as a bracket placeholder; human-only fields use plain `TBD`
- [ ] Included in `standard` and `enterprise` scope presets
- [ ] Line limit set to 300 in both `config.ts` and `validator.ts`
- [ ] Info-level check uses `passed: true` — does not reduce "Passed: X" count
- [ ] `cortex-tms validate --strict` in a standard-scope repo without `AGENTS.md` exits 0 AND output clearly shows the recommendation (test #9 covers this)
- [ ] All 10 new tests pass
- [ ] All existing tests still pass (`pnpm test`)
- [ ] Build passes (`pnpm run build`)
- [ ] Lint passes (`pnpm run lint`)
- [ ] Recommend check is visible in `cortex-tms validate` output (not silently dropped)
- [ ] NEXT-TASKS.md updated; FUTURE-ENHANCEMENTS.md deduplicated

---

<!-- @cortex-tms-version 4.0.2 -->
