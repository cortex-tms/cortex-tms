---
name: new-command
description: Scaffold a new CLI command for Cortex TMS following the existing codebase patterns.
disable-model-invocation: true
---

# New Command

Scaffold a new CLI command for Cortex TMS.

## Before Writing Code

1. **Read existing patterns** — look at src/commands/archive.ts and src/commands/status.ts as reference implementations
2. **Read types** — check src/types/cli.ts for existing interfaces
3. **Read tests** — check src/__tests__/archive.test.ts for the test pattern
4. **Propose the command** — describe what it does, its subcommands/options, and which files will be created/modified. Follow Propose/Justify/Recommend. Wait for approval.

## Implementation Checklist

After the user approves the plan:

- [ ] Create `src/commands/<name>.ts` — export `createXCommand()` and `xCommand`
- [ ] Add types to `src/types/cli.ts` if needed
- [ ] Register in `src/cli.ts` — import and `program.addCommand()`
- [ ] Create `src/__tests__/<name>.test.ts` — follow existing test patterns
- [ ] Add section to `README.md` under CLI Commands
- [ ] Update `NEXT-TASKS.md` — check off the task

## Rules

- Match the exact patterns in existing commands (Commander.js, chalk, ora)
- Follow existing test patterns (vitest, createTempDir, runCommand)
- If the user asks a question, STOP and answer before continuing
- Show git diff before committing. Wait for approval.

## Arguments

$ARGUMENTS — the name and purpose of the new command
