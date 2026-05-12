# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-12
**Status**: ✅ Phase 2 complete — all P0/P1 tasks closed
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archive: `docs/archive/v4.1-sprint.md`

---

## ✅ Closed

### TMS-425 — Add accurate CLI-USAGE sections for missing commands (Done)

**Closed**: 2026-05-12
Audited all 11 CLI commands. Six were missing sections in
`docs/guides/CLI-USAGE.md`: `migrate`, `prompt`, `tutorial`, `review`,
`archive`, `hooks`. Added Usage, Options tables, and verified Examples for
each. All flags cross-checked against real `--help` output — no invented
content. ToC updated with all commands; `auto-tier` marked deprecated.
371 tests passing.

---

### TMS-424 — Per-project `verify_env` support in ai-planner (Done)

**Closed**: 2026-05-12
`project.yaml` now accepts an optional `verify_env: { KEY: "value" }` block.
`step_8_verify` merges it into the scrubbed subprocess env after credential
stripping. Schema validation rejects non-string values. `cortex-tms`
project config updated: `CORTEX_SKIP_LLM_TESTS: "1"` replaces the blanket
credential scrub as the mechanism for suppressing live LLM test suites.
ai-planner main at `1135da6`.

---

### TMS-422 — Review outcome tracking in ai-planner (Done)

**Closed**: 2026-05-12
`python runner/run.py review <project> <task-id> --outcome ...` added to
ai-planner. Appends `phase: review` entries to `runs.jsonl` with
`model_commit_hash`, `final_commit_hash`, `review_outcome`, `review_notes`,
`reviewer`. Status transitions: accept/revert+rewrite → done, reject → failed.
All 5 TMS-421 tasks back-filled. Task lifecycle documented in README and
AI-PLANNER-PLAN-v.5.md.

---

### TMS-423 — Prevent live Guardian accuracy tests from running in normal verify flows (Done)

**Closed**: 2026-05-12
`guardian-accuracy.test.ts` `beforeAll` now checks `CORTEX_SKIP_LLM_TESTS=1`
before `ANTHROPIC_API_KEY`. Root cause was live LLM calls (not parallel
temp-dir contention — earlier diagnosis was wrong). 10/10 green passes
confirmed. `max_verify_retries` lowered to 0 in ai-planner config.

---

### TMS-421 — Dogfood ai-planner on Cortex TMS (Done)

**Closed**: 2026-05-11
**Findings**: `ai-planner/projects/cortex-tms/TMS-421-FINDINGS.md`

5 tasks executed against cortex-tms with Sonnet 4.6 (~$0.585 total). Autonomous
clean rate 2/5; scope drift caught by human review on 2/5; one false-negative
verify on 1/5. Runner infrastructure hardened during the run (verify includes
`build`, credential scrub, `max_verify_retries`, strict int validation).

**First justified integration feature**: review outcome tracking in
`runs.jsonl` (TMS-422 below). Model routing, AI_RULES markers, digest
generation, harness export, and `context_provider` remain blocked until
Phase 2 review tooling ships.

---

## 🟡 Active Tasks

### TMS-420 — Harden Node preset docs and examples (P0)

**Goal**: Improve the shipped Node governance pack based on observed usage,
documentation review, and implementation edge cases.

**Done when**: Node preset follow-up fixes are documented and either shipped or
queued with clear acceptance criteria.

---

## 🔜 Queued

- Python governance pack (`--preset python`)
- Go governance pack (`--preset go`)
- MCP Server — expose governance to any AI tool at runtime
- Agent skills scaffolding (`/cortex-validate`, `/cortex-review`)

<!-- @cortex-tms-version 4.1.0 -->
