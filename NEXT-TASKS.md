# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-12
**Status**: 🟡 Active — TMS-424/425 queued, Phase 2 P0s closed
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archive: `docs/archive/v4.1-sprint.md`

---

## ✅ Closed

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

## 🟡 Phase 2 — P1 Remaining

### TMS-424 — Per-project `verify_env` support in ai-planner (P1)

**Goal**: Generalise the credential-strip fix. Some tests need explicit env
opt-outs (`CORTEX_SKIP_LLM_TESTS=1`) rather than blanket scrubbing.

**Done when**:
- `project.yaml` accepts `verify_env: { KEY: value }` block
- `step_8_verify` merges `verify_env` into the scrubbed subprocess env
- cortex-tms project config uses it where appropriate
- Schema validation rejects non-string values

**Lives in**: ai-planner (`runner/`)

---

### TMS-425 — Add accurate CLI-USAGE sections for missing commands (P1)

**Goal**: This is what TASK-004 was supposed to deliver before the model
invented content against a wrong-context prompt. Audit CLI commands missing
`CLI-USAGE` sections in their docs and add accurate ones, verified against
actual `--help` output.

**Done when**:
- Audit table lists every CLI command and whether its doc has a CLI-USAGE section
- Missing sections added with examples verified against real CLI output
- No invented flags, no fabricated examples — every snippet runs

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
