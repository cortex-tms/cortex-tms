---
name: cortex-review
description: Review the current change against this project's PATTERNS.md, AGENTS.md, and ARCHITECTURE.md rules. Use when the user asks to review their diff against TMS conventions.
disable-model-invocation: true
allowed-tools: Read Grep Bash(git diff *) Bash(git log *)
---

# cortex-review

Review the current diff against this project's TMS governance rules.

## Current change

!`git diff HEAD 2>/dev/null || echo "(no diff available — not in a git repository or no commits yet)"`

## Instructions

Review the diff above against this project's TMS governance rules.

Read in order, most specific to most structural:
1. `PATTERNS.md` — code conventions
2. `AGENTS.md` — agent behaviour rules, trust levels, prohibitions
3. `ARCHITECTURE.md` — structural boundaries, import direction

If a governance doc is not present, note it as absent and continue reviewing against the docs that are available.

If the diff is empty or unavailable, say so and ask the user what they would like to review.

Report findings grouped by rule source with severity:
- 🟡 **Suggestion** — non-blocking, style or clarity
- 🔴 **Violation** — explicit prohibition or layer violation

If the diff is clean against all available governance docs, say so.
