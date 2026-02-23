---
name: release
description: Guide through the Cortex TMS release process — version bump, changelog, sync, tag, publish. Every step requires user approval.
disable-model-invocation: true
---

# Release

Guide the user through a Cortex TMS release.

## Pre-release Gate

Before starting, run the full quality gate:
1. `pnpm test` — must pass
2. `pnpm run lint` — must have 0 errors
3. `pnpm run build` — must succeed
4. `node bin/cortex-tms.js validate --strict` — must pass

If any step fails, STOP and report. Do not proceed with a broken release.

## Release Steps (each requires user approval)

1. **Bump version** — show the new version number and the command. Wait for approval.
   ```bash
   npm version [patch|minor|major]
   ```

2. **Sync version tags** — update all version markers across docs.
   ```bash
   node scripts/sync-project.js
   ```

3. **Update CHANGELOG.md** — draft release notes from commits since last tag. Show draft, wait for approval.

4. **Commit release** — show commit message, wait for approval.

5. **Create git tag** — show tag command, wait for approval.
   ```bash
   git tag v[version]
   ```

6. **Push** — show push command, wait for approval.
   ```bash
   git push origin main --tags
   ```

7. **Publish to NPM** — show publish command, wait for approval.
   ```bash
   npm publish
   ```

8. **Create GitHub release** — draft release notes, wait for approval.

## Rules

- NEVER skip a step
- NEVER proceed without explicit user approval at each gate
- If something fails mid-release, stop and explain how to recover

## Arguments

$ARGUMENTS
