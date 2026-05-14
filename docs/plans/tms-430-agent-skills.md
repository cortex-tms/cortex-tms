# TMS-430: Agent Skills Scaffolding — Implementation Plan

**Status**: 🟡 Scaffold — design not yet locked, awaiting reviewer passes
**Author**: Claude (Opus 4.7 planning)
**Date**: 2026-05-14 (scaffold)
**Branch**: _not yet created_ — proposed `feat/tms-430-agent-skills`
**Estimate**: TBD (depends on distribution decision — see §Open questions)
**Prior reviews integrated**: _none yet — scaffold pre-review_

---

## Goal

Ship first-party Claude Code skills that turn TMS governance docs into invocable agent
capabilities. The original queued bullet calls out two:

- **`/cortex-validate`** — agent-driven validation, consuming the same checks as
  `cortex-tms validate --strict`
- **`/cortex-review`** — agent-driven code/PR review against the project's `PATTERNS.md`,
  `ARCHITECTURE.md`, and `AGENTS.md` rules

**Success criteria** _(draft — confirm during reviewer pass)_:

- A user can invoke `/cortex-validate` or `/cortex-review` in Claude Code against a
  project initialised by `cortex-tms init` and get a meaningful, doc-grounded response.
- Skill metadata is small enough to live in the system prompt without bloat; full
  `SKILL.md` content loads only when the skill is selected.
- Skills are discoverable through the chosen install / scaffold flow (see §Distribution)
  without ad-hoc per-project wiring on top of it.
- _Zero new write-tool exposure_ — skills are read + recommend, not read + mutate.

---

## Architecture

_Draft — to be refined once distribution decision lands._

Two questions drive the architecture:

1. **Where do skills live in the source tree?** Likely `skills/<skill-name>/SKILL.md`,
   sibling to `templates/`. Build step copies them into the published npm tarball.
2. **How do skills consume TMS docs at runtime?** Two viable paths:
   - **Path A — direct file reads**: Skill instructs the agent to read `PATTERNS.md`,
     `AGENTS.md`, etc. from the project root. Simple, no runtime dependency.
   - **Path B — via TMS-429 MCP server**: Skill instructs the agent to call MCP
     resources (`cortex://patterns`, `cortex://agents`). Couples skills to MCP setup
     but unifies the read path.

   Recommend Path A for v1 — skills should work even when MCP isn't configured.
   Path B can be a later optimisation if it shows real benefit.

3. **What's the skill's actual procedural content?** Each `SKILL.md` must answer:
   "given this project's TMS docs, here's the exact prompt to run for validate / review."
   This is the hard design work — the skill's value is the *prompt engineering*, not the
   plumbing.

---

## Dependencies

- _None expected at runtime_ — skills are markdown + optional scripts; Claude Code is the
  host. The cortex-tms package only needs to ship the skill files and (maybe) install them.
- Possibly a small build-time helper to validate `SKILL.md` frontmatter shape.

---

## Distribution (open — see §Open questions)

The big undecided question. Three plausible models:

| Model | Pro | Con |
|-------|-----|-----|
| **A. Bundled in npm package, opt-in install via `cortex-tms init --with-skills`** | Single package, one install. Skills version-locked to TMS. | Users without Claude Code carry dead weight. |
| **B. Separate `@cortex-tms/skills` package** | Clean separation; non-Claude users unaffected. | Two packages to publish, version drift risk. |
| **C. Published only to skills marketplace / Anthropic registry** | Standard distribution; no npm dual-purpose. | Loses tight coupling with `cortex-tms init`. |

Recommendation lean: **A**, gated by an `init` flag. Lowest friction, easiest discovery,
matches the "ecosystem-in-one-package" identity. But this is the highest-leverage decision
in the whole task — reviewers should weigh in before code.

---

## CLI surface

_Draft._

- `cortex-tms init` — new optional flag `--with-skills` (or `--skills`) that copies the
  skill folders into the user's project (location TBD: `.claude/skills/`? top-level
  `skills/`?).
- _No new top-level command_ for now. Skills are invoked through Claude Code itself
  (`/cortex-validate`), not through cortex-tms.

---

## Test strategy

_Draft._

- Unit: SKILL.md frontmatter validation (name, description present, length within
  Anthropic guidance).
- E2E: `init --with-skills` copies the right files to the right location; doesn't
  copy when flag absent; doesn't clobber pre-existing skill files.
- Content tests: each skill mentions the TMS doc files it depends on (catches a skill
  drifting from the doc surface it's supposed to consume).
- _No runtime agent test_ — we can't unit-test "does Claude Code do the right thing
  with this prompt." Manual verification via Claude Code session before close.

---

## Risks & mitigations

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Skill prompts drift from actual `PATTERNS.md` content over time | Content tests link skill ↔ doc; CI flags when doc changes without skill review |
| 2 | Distribution choice ages badly (e.g. Anthropic publishes a registry mid-sprint) | Defer the publish step; ship bundled-only v1; revisit in next phase |
| 3 | Skills duplicate Guardian Skill's job (`docs/archive/plans/agent-skills-integration.md`) | Review Guardian Skill v0.2.0 before designing `/cortex-validate` — may be a wrapper, not a new thing |
| 4 | `--with-skills` writes files outside the project directory (path traversal) | Reuse `validateSafePath` from TMS-429 |

---

## Out of scope (draft)

- Skills for any IDE other than Claude Code
- Write-action skills (e.g. `/cortex-archive-task` that mutates `NEXT-TASKS.md`)
- Skills marketplace publishing automation
- Per-preset skill variants (one set of skills, language-agnostic)

---

## Implementation order

_Cannot lock until §Open questions are answered._ Provisional:

1. Reviewer pass on open questions (GPT-5.5 + Kimi)
2. Lock distribution model, file locations, scope
3. Audit existing Guardian Skill — decide reuse vs new
4. Write `SKILL.md` for `/cortex-validate` first (smaller surface)
5. Add `--with-skills` install path + tests
6. Write `SKILL.md` for `/cortex-review`
7. Manual verification in Claude Code
8. README + ARCHITECTURE.md updates
9. Validate strict + full test suite
10. Close & archive (Phase 5)

---

## Open questions

These block the next planning pass — reviewers should answer or push back on each:

1. **Distribution**: A (bundled + flag), B (separate package), or C (marketplace)?
   Recommend A; what changes that?
2. **Skill consumes docs via**: direct file read (Path A) or MCP server (Path B)?
   Recommend A; what changes that?
3. **Install location**: `.claude/skills/<name>/` (Claude-Code-conventional) or
   top-level `skills/`? Anthropic's docs should be the tiebreaker — needs verification.
4. **Relationship to Guardian Skill**: is `/cortex-validate` a wrapper around the
   existing Guardian Skill (which already has `--output-json`), or a new skill that
   calls `cortex-tms validate` directly? Decision affects ~half the design.
5. **`--with-skills` default**: opt-in via flag, or default-on with `--no-skills` opt-out?
   Affects every existing `init` user's next experience.
6. **Skill versioning**: how do we tell a user their installed skill files are stale
   after `npm update`? Or do we just expect them to re-run `init --with-skills`?

---

## Prior-review traceability

_To be populated after reviewer passes._
