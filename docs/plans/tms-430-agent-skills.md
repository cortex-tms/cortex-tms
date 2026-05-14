# TMS-430: Agent Skills Scaffolding — Implementation Plan

**Status**: ✅ Complete — Step 8 verified 2026-05-15, all six checks passed
**Author**: Claude (Opus 4.7 planning)
**Date**: 2026-05-14 (v1 scaffold) · v2 Q1-Q6 lock · v3 mechanism + skill design lock · v4 official-doc verification · 2026-05-15 implementation
**Branch**: `feat/tms-430-agent-skills`
**Estimate**: 6-8h implementation (excludes manual Claude Code verification)
**Prior reviews integrated**:
- Pass 1: GPT-5.5 + Kimi K2.6 — Q1-Q6 locks
- Pass 2: Codex GPT-5.5 (mechanism challenge) + OpenCode Kimi K2.6 (skill design)
- Pass 3: Claude Opus 4.7 — verified Q3 install path and frontmatter semantics against
  official Claude Code docs at https://code.claude.com/docs/en/skills

---

## Goal

Ship first-party Claude Code skills that turn TMS governance docs into invocable agent
capabilities. The original queued bullet names two:

- **`/cortex-validate`** — agent-driven validation, surfacing `cortex-tms validate --strict`
  output in a Claude Code session
- **`/cortex-review`** — agent-driven code/PR review against the project's `PATTERNS.md`,
  `AGENTS.md`, and `ARCHITECTURE.md`

**Success criteria**:

- A user who runs `cortex-tms init --with-skills` in a project gets `/cortex-validate`
  and `/cortex-review` invocations working in Claude Code after accepting the
  workspace trust dialog
- Both skills carry `disable-model-invocation: true` — zero context cost until invoked
- Zero new write-tool exposure — shipped skills read + recommend, never mutate

---

## Mechanism — Skills (the unified slash-command surface)

Per the official Claude Code docs: *"Custom commands have been merged into skills.
A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md`
both create `/deploy` and work the same way."*

We ship as Skills (the recommended modern form):

- **Directory name = slash command**: `.claude/skills/cortex-validate/SKILL.md` →
  `/cortex-validate`
- **`disable-model-invocation: true`** prevents auto-loading by Claude; description
  is excluded from context until the user types `/cortex-validate`. **Zero token cost
  in idle sessions.**
- **`allowed-tools` frontmatter** pre-approves specific tool calls per skill (not a
  sandbox — other tools fall back to the user's permission settings)
- **Body loads only on invocation** — long governance procedural content stays out of
  the system prompt until needed
- The legacy `.claude/commands/<name>.md` form keeps working but lacks supporting-file
  directories, lifecycle control, and automatic activation — Skills wins on every
  dimension that matters for TMS-430

Path of empirical verification: 6 maintainer skills under `.claude/skills/` in this
repo already work via `/skill-name` slash invocation; official docs confirm the same
mechanism applies to user-installed project skills.

Reference: https://code.claude.com/docs/en/skills

---

## Locked decisions (reviewer passes 1 + 2 + 3, 2026-05-14)

| # | Question | Decision |
|---|----------|----------|
| Q1 | Distribution | Bundled with `cortex-tms` npm package, opt-in via `cortex-tms init --with-skills` |
| Q2 | Docs source at runtime | Direct file reads from the user's project. No MCP coupling in v1 |
| Q3 | Install location | `.claude/skills/cortex-<skill>/SKILL.md` — official documented project-skill path; directory name becomes slash command |
| Q4 | Guardian Skill relationship | No current Guardian Skill artifact in the repo; archived references in `docs/core/ARCHITECTURE.md` and `docs/archive/plans/agent-skills-integration.md` are stale. Design fresh; clean up the stale architecture reference |
| Q5 | `--with-skills` default | Opt-in (off by default). Non-Claude-Code users see no change to `init` |
| Q6 | Versioning | Manual `init --with-skills` re-run for v1; defer auto-migration to a future task |

**Naming**: shipped skills use the `cortex-` prefix to prevent collisions with
user-authored or maintainer-local skills sharing common names. This repo's local
`.claude/skills/validate/` is a working example of the collision risk.

---

## Architecture

```
templates/skills/                            ← shipped, copied by `init --with-skills`
├── cortex-validate/SKILL.md
└── cortex-review/SKILL.md

.claude/skills/                              ← maintainer-only, NOT shipped
├── implement/  plan/      release/
├── new-command/ sync/     validate/         ← cortex-tms development tooling;
                                               kept as pattern reference for TMS-430
```

- **Source of truth**: `templates/skills/cortex-<name>/SKILL.md` in the cortex-tms repo
- **Install target**: `<user-project>/.claude/skills/cortex-<name>/`
- **Doc access at runtime**: each SKILL.md instructs the agent to read the project's
  `PATTERNS.md`, `AGENTS.md`, etc. directly via the agent's file-read tool. No
  cortex-tms runtime API, no MCP dependency.
- **Workspace trust**: project skills' `allowed-tools` only take effect after the user
  accepts Claude Code's workspace trust dialog for the project folder. Document this
  in the user-facing install message.

**Skill body design principle**: keep each SKILL.md lean. Official docs recommend
under 500 lines, with detailed references moved to sibling files. TMS-430 v1 skills
target ~30 lines (no sibling files) — matches the maintainer-skill average.

---

## Skill specifications

### `cortex-validate` — diagnostic, report-only

**Frontmatter** (official syntax: `allowed-tools` is space-separated; `npx -y` matches
TMS-429's `--print-config` pattern so the skill works regardless of whether
`cortex-tms` is on the user's `PATH`):

```yaml
---
name: cortex-validate
description: Run cortex-tms validate --strict and report grouped results. Diagnostic only — does not propose fixes.
disable-model-invocation: true
allowed-tools: Bash(npx -y cortex-tms validate *) Read
---
```

**Body shape** (~15-25 lines): instruct the agent to run
`npx -y cortex-tms validate --strict` via the `Bash` tool and present results grouped
by check category (Mandatory Files / Configuration / Archive Status / Recommendations).
On pass, confirm health. On fail, list each failure with severity. **No fix
suggestions** — that's `/cortex-review`'s territory. Clean diagnostic ↔ remediation
boundary.

**On `allowed-tools` semantics**: this is a *pre-approval list*, not a sandbox. Per
the official docs: *"It does not restrict which tools are available: every tool
remains callable, and your permission settings still govern tools that are not
listed."* So `Bash(npx -y cortex-tms validate *)` only means *that exact shape* runs
without per-use prompts — any other Bash invocation falls back to the user's normal
permission settings and triggers an approval dialog. We pre-approve narrowly to
minimise friction without granting broad shell access.

### `cortex-review` — code review against TMS governance

**Frontmatter**:

```yaml
---
name: cortex-review
description: Review the current change against this project's PATTERNS.md, AGENTS.md, and ARCHITECTURE.md rules. Use when the user asks to review their diff against TMS conventions.
disable-model-invocation: true
allowed-tools: Read Grep Bash(git diff *) Bash(git log *)
---
```

**Body uses dynamic context injection** (per official-doc pattern): bake the diff
directly into the prompt so the agent sees actual change content rather than running
git itself. The injection uses a shell fallback so it degrades gracefully when git is
absent or the repo has no commits yet:

```markdown
## Current change

!`git diff HEAD 2>/dev/null || echo "(no diff available — not in a git repository or no commits yet)"`

## Instructions

Review the diff above against this project's TMS governance rules.

Read in order, most specific to most structural:
1. `PATTERNS.md` — code conventions
2. `AGENTS.md` — agent behaviour rules, trust levels, prohibitions
3. `ARCHITECTURE.md` — structural boundaries, import direction

If a governance doc is not present, note it as absent and continue reviewing against
the docs that are available.

If the diff is empty or unavailable, say so and ask the user what they would like to review.

Report findings grouped by rule source with severity:
🟡 Suggestion — non-blocking, style/clarity
🔴 Violation — explicit prohibition or layer violation
```

**Tool budget rationale**:
- `Read` for source files + governance docs
- `Grep` for finding cross-references when a rule says "see also X"
- `Bash(git diff *)` and `Bash(git log *)` are pre-approved — other Bash invocations
  remain governed by the user's normal Claude Code permission settings (see semantics
  note on `cortex-validate`)
- No `Glob` — `Grep` covers reference-finding without breadth-search noise

---

## Dependencies

None at runtime. Skills are markdown; Claude Code is the host. A small build-time
check is in scope to validate SKILL.md frontmatter shape during the npm packaging
step.

---

## CLI surface

- **New flag**: `cortex-tms init --with-skills`
  - Copies every `templates/skills/cortex-*/` directory into
    `<project>/.claude/skills/cortex-*/`
  - Routes every destination path through `validateSafePath` (from TMS-429)
  - **Refuses to clobber** any pre-existing skill directory with the same name;
    prints a named conflict message instead of silently overwriting
  - Default: **off**. Existing `init` users see no change unless they pass the flag
  - On success, prints a note about Claude Code's workspace trust dialog: skills
    take effect after the user accepts trust for the project
- No new top-level command. Skills are invoked through Claude Code itself.

---

## Test strategy

- **Unit**: SKILL.md frontmatter validation (name, description present, lengths sane,
  `disable-model-invocation: true`, expected `allowed-tools` per skill, space-separated
  tool syntax)
- **E2E**: `init --with-skills` copies the right files to the right location; no copy
  when flag absent; refuses to clobber pre-existing skills with the same name; routes
  every destination through `validateSafePath`
- **Content tests**: each shipped skill mentions the TMS doc files it depends on
  (`PATTERNS.md`, `AGENTS.md`, `ARCHITECTURE.md`). Drift between skill prompts and the
  doc surface they consume should fail CI
- **No runtime agent test** — Claude Code behaviour can't be unit-tested. Manual
  verification in a Claude Code session before close

---

## Risks & mitigations

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Skill prompts drift from doc content over time | Content tests link skill ↔ doc surface; CI flags doc changes that don't touch the corresponding skill |
| 2 | `--with-skills` writes outside the project directory (path traversal) | Reuse `validateSafePath` from TMS-429 |
| 3 | Name collision with user's pre-existing `.claude/skills/cortex-validate/` | Refuse to clobber; print named conflict; document recovery path |
| 4 | Stale `docs/core/ARCHITECTURE.md` Agent Skills section misleads readers | Cleanup is in scope — see §Stale doc cleanup |
| 5 | `allowed-tools` doesn't activate until user accepts workspace trust dialog | Documented in install-success message; not a bug but a UX expectation to set |
| 6 | Future Claude Code versions change Skills convention | Pin to current `.claude/skills/<name>/SKILL.md` format; cite official docs URL in code comments for traceability |
| 7 | User has `disableSkillShellExecution: true` in settings, breaking `cortex-review`'s `!`git diff HEAD`` injection | Document the requirement; fall back to explicit `Bash(git diff *)` invocation if the injection-disabled setting becomes a known recurring blocker (defer for v1) |

---

## Stale doc cleanup (in scope)

- `docs/core/ARCHITECTURE.md` lines ~201-229: "Agent Skills Integration" section
  references `tmp/guardian-skill/SKILL.md` which is not present in the current repo.
  Replace with text describing TMS-430's shipped skills + the maintainer-skills
  reference structure. **Avoid overcommitting** to future skills-registry / marketplace
  / plugin-distribution behaviour
- `docs/archive/plans/agent-skills-integration.md`: **leave as-is**. Archive artifact
  edits are out of policy

---

## Out of scope (explicit)

- Skills for any IDE other than Claude Code
- Plugin distribution (`<plugin>/skills/<name>/SKILL.md`) — viable future surface but
  not v1; bundled + opt-in flag is enough to validate the design
- Legacy `.claude/commands/<name>.md` form — Skills is the unified mechanism; the
  legacy path still works but offers no advantages for our use case
- Write-action skills (e.g. `/cortex-archive-task` that mutates `NEXT-TASKS.md`)
- Skills marketplace publishing automation
- Per-preset skill variants — one set of shipped skills, language-agnostic
- Maintainer-skill clones (`/cortex-plan`, `/cortex-implement`, etc.) — those are
  development tools for the cortex-tms project, not user-facing capabilities
- A third skill in v1 (scope confirmed at exactly two: cortex-validate + cortex-review)
- Auto-migration of installed skills after `npm update` (Q6 deferred)
- MCP server as the doc-access path for shipped skills (Q2 deferred)

---

## Implementation order

1. Read the 6 maintainer skills as concrete pattern reference (confirm
   `disable-model-invocation`, `allowed-tools` syntax, body conventions)
2. Write `templates/skills/cortex-validate/SKILL.md` per §Skill specifications
3. Add `--with-skills` install path + `validateSafePath` integration + tests +
   workspace-trust install message
4. Write `templates/skills/cortex-review/SKILL.md` per §Skill specifications
   (dynamic context injection with `2>/dev/null` fallback for no-git/no-HEAD safety)
5. Rewrite `docs/core/ARCHITECTURE.md` Agent Skills Integration section
6. Update README with `--with-skills` flag + skill invocation examples + trust note
7. Content tests linking each shipped skill to its referenced doc surface
8. Manual verification in Claude Code session against a test project (the spike
   GPT-5.5 originally proposed — required before close). Must cover three scenarios:
   a. **Normal git repo with commits** — `/cortex-review` shows diff; `/cortex-validate` reports health
   b. **Fresh git repo with no commits** (no HEAD) — `/cortex-review` shows fallback message, does not error
   c. **Non-git folder** — `/cortex-review` shows fallback message, does not error
9. `node bin/cortex-tms.js validate --strict` + full test suite
10. Close & archive as v4.2 Phase 5 (`docs/archive/v4.2-phase5-skills.md`)

---

## Open questions

None. All decisions locked, implementation complete, Step 8 verified. Closed 2026-05-15.

---

## Prior-review traceability

### Pass 1 — 2026-05-14 (GPT-5.5 + Kimi K2.6)

Both reviewers approved scaffold update. Q1-Q6 locked per the table above.

- **GPT-5.5**: Guardian Skill described as "not present as a current artifact"
  rather than "defunct." Cleanup avoids overcommitting to future registry behaviour.
- **GPT-5.5**: keep each SKILL.md lean; no surrounding README/quickstart files
- **Kimi**: shipped skills use `cortex-` prefix (collision prevention)

### Pass 2 — 2026-05-14 (Codex GPT-5.5 + OpenCode Kimi K2.6)

- **Codex GPT-5.5 blocker raised**: Q3 install path was asserted, not verified for
  the public end-user contract. Demanded either external verification or a physical
  spike before commit. **Correct on principle.**
- **Kimi 4-question answers integrated as §Skill specifications**: cortex-validate
  report-only; cortex-review input scope `git diff HEAD` + doc reading order
  PATTERNS → AGENTS → ARCHITECTURE; scope confirmed at 2 skills; tool budgets locked

### Pass 3 — 2026-05-14 (Claude Opus 4.7, official-docs verification)

Verified all v3 mechanism claims against https://code.claude.com/docs/en/skills via
WebFetch. Key findings:

1. **Skills and slash commands are unified**, not alternatives. *"A file at
   `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both
   create `/deploy` and work the same way."* v3's §Mechanism choice framing was
   structurally wrong; v4 rewrites it as "Skills, the unified slash-command surface."
2. **Q3 install path empirically and officially confirmed**:
   `.claude/skills/<skill-name>/SKILL.md` is the documented project-scope path; the
   directory name becomes the slash command.
3. **v3 claim about slash commands "full body always in system prompt" was wrong** —
   official behaviour for both forms: descriptions in context, body on invocation.
   `disable-model-invocation: true` removes the description from context too, giving
   zero idle token cost. v4 corrects this.
4. **`allowed-tools` is space-separated** in official examples (maintainer skills use
   commas, which apparently works but isn't documented). v4 uses space-separated in
   shipped skills.
5. **Workspace trust dialog required**: `allowed-tools` only activates after the user
   accepts project trust. Added as Risk #5 and to the install-success message.
6. **Dynamic context injection** via `` !`<command>` `` in SKILL.md body is the
   official pattern for "the agent should see X data when this runs." v4 adopts it
   for `cortex-review` to embed `git diff HEAD` directly rather than instructing the
   agent to run git.
7. **`disableSkillShellExecution` setting** can disable the `!` injection; added as
   Risk #7 with a deferred fallback plan.

### Pass 4 — 2026-05-14 (GPT-5.5 follow-up on v4)

GPT-5.5 caught three precision errors in v4's first cut:

1. **`allowed-tools` is a pre-approval list, not a sandbox.** Original wording
   ("the skill cannot run arbitrary shell commands") overclaimed security. Reworded
   with the official-doc quote: pre-approved tool calls skip prompts; other tools
   fall back to the user's permission settings.
2. **`npx -y cortex-tms validate --strict`** is the robust shipped invocation since
   users who installed via `npx` won't have `cortex-tms` on `PATH`. Matches the
   pattern TMS-429 already uses in `--print-config` output.
3. **Spacing in `Bash(git diff *)`** — official examples use space before the wildcard
   (`Bash(git add *)`, `Bash(git commit *)`); v4 originally had no space.

All three corrections applied; v4 is the post-correction state.
