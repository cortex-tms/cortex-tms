---
name: validate
description: Run the full quality gate — tests, lint, build, and cortex-tms validate --strict.
disable-model-invocation: true
allowed-tools: Bash, Read
---

# Validate

Run the full Cortex TMS quality gate and report results.

## Steps

1. `pnpm test` — report pass/fail count
2. `pnpm run lint` — report errors and warnings
3. `pnpm run build` — report success or failure
4. `node bin/cortex-tms.js validate --strict` — report check results

## Rules

- Run all four steps regardless of failures
- Report results clearly with pass/fail for each step
- Do not fix anything — just report
- If everything passes, say so. If something fails, show the relevant output.

## Arguments

$ARGUMENTS
