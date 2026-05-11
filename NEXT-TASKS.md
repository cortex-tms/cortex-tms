# NEXT: v4.2 Sprint — Governance Pack Expansion

**Last Updated**: 2026-05-10
**Status**: 🟡 Active — Prepare next governance pack priorities
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archive: `docs/archive/v4.1-sprint.md`

---

## 🔴 Gate Task (blocks all integration work)

### TMS-421 — Dogfood ai-planner on Cortex TMS (P0)

**Goal**: Run 5 real ai-planner tasks against Cortex TMS before building any integration features.
No Cortex integration features until this completes and produces findings.

**Done when**:
- ai-planner project config exists for cortex-tms ✅
- verify_sequence: [install, test] confirmed ✅
- 5 task files written and run ✅
- 3+ tasks reach `review` or `done`
- Findings report written covering all 5 runs (template below)
- First justified integration feature identified (or confirmed unnecessary)

**Findings report — track per task**:
```
task_id | complexity | input_tokens | output_tokens | cost_usd
json_retry_count | verification_result | human_review_result
notes: convention miss / over-edit / insufficient context / good
```

**Decision gate after 5 runs**:
- Complexity-1 passes cleanly → test Kimi/Haiku replay
- Sonnet fails simple tasks → fix task/context/runner before cheaper models
- Install dominates runtime → add dependency cache or setup_sequence
- JSON retries happen → improve output contract before adding agents
- Human review catches real issues → add Codex reviewer (Phase 3)

**Phase 2 model config shape** (do not implement before findings):
```yaml
models:
  default: sonnet
  profiles:
    sonnet:
      provider: anthropic
      id: claude-sonnet-4-6
      input_per_million: 3.00
      output_per_million: 15.00
    fast:
      provider: openai_compatible
      id: <fast-model-id>
      base_url: <provider-base-url>
      api_key_env: FAST_MODEL_API_KEY
  routing:
    complexity_1: sonnet
    complexity_2: sonnet
```

**Blocks**: AI_RULES markers, digest generation, harness export, context_provider contract, model routing refactor.

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
