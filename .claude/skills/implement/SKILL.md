---
name: implement
description: Implement an approved plan. Write code, tests, and docs following the sprint checklist in NEXT-TASKS.md.
disable-model-invocation: true
---

# Implement

You are implementing an approved plan for Cortex TMS.

## Rules

1. **Read NEXT-TASKS.md first** — find the active sprint checklist. If there is no approved plan, STOP and tell the user to run /plan first.
2. **Follow the checklist** — implement items in order. Check them off as you complete each one.
3. **Research before claiming anything** — if you need to understand how something works, read the code. Do not guess. Do not speculate.
4. **Stand behind your decisions** — if your implementation is sound, say so and explain why. Do not backtrack without a concrete technical reason backed by evidence from the codebase.
5. **If the user asks a question** — STOP implementation immediately. Answer the question clearly and completely. Resume only when the user says to continue.
6. **Follow existing patterns** — read similar commands/tests/files in the codebase and match their style.
7. **Show changes before committing** — run git diff and present it. Wait for approval before any git command.

## Git Protocol

- Show every git command before running it
- Wait for explicit user approval
- Use conventional commit format
- Include Co-Authored-By

## Arguments

$ARGUMENTS
