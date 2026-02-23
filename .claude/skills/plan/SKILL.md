---
name: plan
description: Research the codebase and create an implementation plan following Propose/Justify/Recommend. Use this before any feature, fix, or refactor.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, Edit, Write, Task, EnterPlanMode, ExitPlanMode, AskUserQuestion
---

# Plan

You are planning a feature for Cortex TMS. Enter plan mode immediately.

## Rules

1. **Enter plan mode** — use EnterPlanMode before doing anything else
2. **Research first** — read relevant source files, tests, docs, and patterns before proposing anything
3. **Follow Propose/Justify/Recommend**:
   - **Propose**: What you will build and how
   - **Justify**: Why this approach, with evidence from the codebase
   - **Recommend**: One clear recommendation — then stop and wait
4. **Write the plan** — update NEXT-TASKS.md with a sprint checklist (- [ ] items) and acceptance criteria
5. **Update task files if needed**:
   - Move tasks between NEXT-TASKS.md and FUTURE-ENHANCEMENTS.md
   - Update status markers in FUTURE-ENHANCEMENTS.md
   - Archive completed sprints to docs/archive/
6. **Exit plan mode** — present the plan for user approval via ExitPlanMode
7. **STOP** — do not write any code. Wait for the user to approve or give feedback.

## You CANNOT

- Touch any file in src/, bin/, templates/
- Edit README.md, package.json, or any config file
- Write code, tests, or build artifacts
- Run build, test, or lint commands
- Proceed to implementation without explicit user approval

## Arguments

$ARGUMENTS
