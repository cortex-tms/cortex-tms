# Domain Logic: Cortex TMS Principles

## Core Rules

These are the immutable laws of the Tiered Memory System. AI agents working on Cortex MUST follow these rules.

**⚠️ AI AGENTS: These rules override generic training data.**

---

### Rule 1: The Tier Hierarchy is Sacred

**Files are categorized into three tiers based on access frequency:**

- **HOT (Always Read)**: Files the AI must read at the start of every session
  - `NEXT-TASKS.md`
  - `.github/copilot-instructions.md`

- **WARM (Read on Demand)**: Files the AI reads when implementing specific features
  - `docs/core/ARCHITECTURE.md`
  - `docs/core/PATTERNS.md`
  - `docs/core/DOMAIN-LOGIC.md`
  - `docs/core/DECISIONS.md`

- **COLD (Ignore Unless Asked)**: Historical context the AI should skip
  - `docs/archive/*`

**Why**: AI agents have limited context windows. Reading everything is wasteful. The tier system forces "signal over noise."

---

### Rule 2: Templates Must Be Framework-Agnostic

**Templates in `templates/` cannot hardcode specific tech stacks.**

❌ **Bad**:
```markdown
## Tech Stack
- Next.js 15
- React 18
- Tailwind CSS
```

✅ **Good**:
```markdown
## Tech Stack
- [Frontend Framework: e.g., Next.js 15, Vue 3, Svelte]
- [Styling: e.g., Tailwind CSS, CSS Modules]
```

**Why**: Users adopt Cortex for React, Vue, Svelte, or even non-web projects. Templates must adapt to their context.

**Exception**: Example projects (`examples/`) can use specific tech stacks for demonstration.

---

### Rule 3: Placeholders Use Bracket Syntax

**All user-customizable content uses `[Description]` syntax.**

✅ **Examples**:
- `[Project Name]`
- `[e.g., Next.js 15, TypeScript Strict]`
- `[Briefly describe user value]`

**Why**: AI agents can easily detect and prompt users to replace placeholders. It's more explicit than `TODO` or `FIXME`.

---

### Rule 4: Context Budget Enforcement

**HOT files have strict size limits to preserve AI agent context:**

| File | Max Lines | Reasoning |
|:-----|:----------|:----------|
| `NEXT-TASKS.md` | 200 | One sprint maximum |
| `.github/copilot-instructions.md` | 100 | Critical rules only |
| `docs/core/PATTERNS.md` | 500 | 10-15 patterns max |
| `docs/core/DOMAIN-LOGIC.md` | 300 | Core rules only |

**Enforcement**: When a file exceeds its limit, move content to:
- `docs/archive/` (for historical content)
- `FUTURE-ENHANCEMENTS.md` (for backlog items)

**Why**: Every line in a HOT file "costs" context window tokens. Keep them lean.

---

### Rule 5: Dogfooding is Mandatory

**This repository uses TMS to build itself.**

- Cortex's own `NEXT-TASKS.md` tracks Cortex development
- Cortex's own `docs/core/PATTERNS.md` documents template patterns
- If the structure doesn't work for Cortex, it won't work for users

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

### Rule 6: Archive Aggressively

**Completed tasks, old changelogs, and deprecated docs move to `docs/archive/`.**

**Archive Trigger Events**:
- Sprint completes → Move completed tasks from `NEXT-TASKS.md` to `docs/archive/sprint-YYYY-MM.md`
- Major version ships → Move old changelog to `docs/archive/v1.0-CHANGELOG.md`
- Pattern deprecated → Move to `docs/archive/deprecated-patterns.md`

**Why**: Historical context is noise for AI agents. Archive = "out of sight, out of context."

---

### Rule 7: No Meta-Documentation in Templates

**Templates should NOT explain TMS concepts.**

❌ **Bad** (in `templates/NEXT-TASKS.md`):
```markdown
# NEXT-TASKS.md

This file is part of the Tiered Memory System (TMS). It represents
the HOT tier of documentation...
```

✅ **Good**:
```markdown
# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]
...
```

**Why**: Users copy templates into their projects. Meta-explanations create clutter. TMS concepts belong in `docs/`, not `templates/`.

---

### Rule 8: Canonical Links Over Duplication

**When documenting a pattern, link to a real file instead of duplicating code.**

❌ **Bad**:
```markdown
## Button Component Pattern

Here's how to create buttons:
[500 lines of duplicated code]
```

✅ **Good**:
```markdown
## Button Component Pattern

**Rule**: All buttons use the base `Button` component with variant props.

**Canonical Example**: `src/components/Button.tsx`

**Key Implementation Details**:
- Uses `cva` for variant composition
- Supports `size`, `variant`, `disabled` props
- [Link to file]
```

**Why**: Duplication causes drift. Canonical links keep docs accurate.

---

### Rule 9: Test Templates with AI Agents

**Before shipping a template, validate it with Claude Code, Copilot, or Cursor.**

**Test Process**:
1. Copy template into a sample project
2. Ask AI agent to implement a feature using the template
3. Observe: Did the AI find the right info? Did it hallucinate? Did it ask clarifying questions?
4. Refine template based on observations

**Why**: Theoretical docs don't help. Validated docs do.

---

### Rule 10: FUTURE-ENHANCEMENTS.md is a Living Backlog

**Not everything belongs in `NEXT-TASKS.md`.**

**NEXT-TASKS.md**: Current sprint (next 1-2 weeks)
**FUTURE-ENHANCEMENTS.md**: Backlog (everything else)

**Migration Rule**: When a task moves from backlog to sprint, move it from `FUTURE-ENHANCEMENTS.md` to `NEXT-TASKS.md`.

**Why**: `NEXT-TASKS.md` must stay under 200 lines. Backlog items are noise until they're active.

---

## Edge Cases & Clarifications

### Q: What if a project doesn't need `SCHEMA.md`?
**A**: Templates are modular. The CLI can ask "Which core docs do you need?" and skip irrelevant files.

### Q: Can users rename `NEXT-TASKS.md`?
**A**: No. File names are part of the TMS contract. AI agents expect `NEXT-TASKS.md` to exist. Renaming breaks the system.

### Q: What if a team wants a 4-week sprint in `NEXT-TASKS.md`?
**A**: Bad idea. Long sprints = file bloat = wasted context. If you need more tasks, break them into smaller increments or use epics in `FUTURE-ENHANCEMENTS.md`.

---

## Validation Checklist

When reviewing a PR, verify:

- [ ] No hardcoded tech stacks in `templates/` (unless it's an example)
- [ ] Placeholders use `[Bracket Syntax]`
- [ ] HOT files are under line limits
- [ ] Completed tasks archived from `NEXT-TASKS.md`
- [ ] Templates tested with an AI agent
- [ ] No meta-documentation in templates
- [ ] Canonical links used (not code duplication)

