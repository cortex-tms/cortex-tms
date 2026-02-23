---
name: sync
description: Synchronize task files and source-of-truth documents. Update NEXT-TASKS.md, FUTURE-ENHANCEMENTS.md, README, and CHANGELOG to reflect current project state.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Sync

Synchronize Cortex TMS task files and documentation.

## Steps

1. **Read current state** — check NEXT-TASKS.md, FUTURE-ENHANCEMENTS.md, README.md, CHANGELOG.md, package.json
2. **Update NEXT-TASKS.md** — mark completed items, remove stale tasks, add new items if discussed
3. **Update FUTURE-ENHANCEMENTS.md** — sync status markers (Planned/In Progress/Complete)
4. **Truth-sync source-of-truth files** — ensure README, CHANGELOG reflect what actually shipped
5. **Archive if needed** — move completed sprint content to docs/archive/
6. **Run validation** — `node bin/cortex-tms.js validate --strict` to confirm health
7. **Show changes** — run git diff and present for approval. Do not commit without approval.

## Rules

- Do not modify src/, bin/, templates/, or any code files
- Follow the Propose/Justify/Recommend framework for any non-obvious changes
- If unsure whether something should be archived or updated, ask the user

## Arguments

$ARGUMENTS
