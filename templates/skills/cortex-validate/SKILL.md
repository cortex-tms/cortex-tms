---
name: cortex-validate
description: Run cortex-tms validate --strict and report grouped results. Diagnostic only — does not propose fixes.
disable-model-invocation: true
allowed-tools: Bash(npx -y cortex-tms validate *) Read
---

# cortex-validate

Run `npx -y cortex-tms validate --strict` via the Bash tool and report results.

## Steps

1. Run `npx -y cortex-tms validate --strict`
2. Present results grouped by check category:
   - **Mandatory Files** — required docs present or missing
   - **Configuration** — `.cortexrc` validity and scope
   - **Archive Status** — task archive health
   - **Recommendations** — non-blocking suggestions

## Rules

- Report only — do not propose fixes or make changes
- If all checks pass, say so clearly
- If any checks fail, list each failure with its severity
- Fix suggestions belong in `/cortex-review`, not here
