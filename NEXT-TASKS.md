# NEXT: Upcoming Tasks (v2.4 cycle)

## 🎉 v2.3 "Confidence & Comfort" Sprint Complete!

**Achievements**:
- ✅ Status Dashboard with visual progress bars and health metrics
- ✅ VS Code Snippet Library (12 snippets for rapid documentation)
- ✅ Self-Healing Validation with `--fix` flag
- ✅ Dry Run Preview with `--dry-run` for safe exploration
- ✅ Non-Interactive Mode with `--scope` for CI/CD

**Sprint Closed**: 2026-01-13
**Release**: [v2.3.0](https://github.com/jantonca/cortex-tms/releases/tag/v2.3.0)

---

## Active Sprint: v2.4 - Migration & Interaction Scaling

**Why this matters**: As the template library grows, users need visibility into their file versions and ways to interact with AI agents more effectively. This sprint delivers a migration auditor for version awareness and a prompt engine for streamlined AI collaboration.

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Migration Auditor** - Version tagging & `migrate` command | [TMS-236] | 6h | 🔴 HIGH | ✅ Done |
| **Prompt Engine** - CLI command & `PROMPTS.md` | [TMS-240] | 4h | 🔴 HIGH | 🔄 In Progress |
| **Interactive Tutorial** - In-CLI onboarding walkthrough | [TMS-238] | 3h | 🟡 MED | ⬜ Todo |

**Phase 1 Complete**: Migration Auditor shipped with version detection, customization analysis, and status reporting.

---

## 📋 v2.3 Sprint Completed (2026-01-13)

| Task | Ref | Status |
| :--- | :--- | :----- |
| **Release v2.2.0** - NPM Publish & GitHub Release | [#24] | ✅ Done |
| **Template Audit & Sync** - Update todo-app to v2.2.0 | [TMS-230] | ✅ Done |
| **Dry Run Preview** - Add `--dry-run` and `--scope` flags | [TMS-231] | ✅ Done |
| **Validation Fix** - Add `--fix` flag to `validate` | [TMS-233] | ✅ Done |
| **VS Code Snippets** - TMS snippet library for docs | [TMS-234] | ✅ Done |
| **Status Command** - Add `cortex-tms status` dashboard | [TMS-235] | ✅ Done |

---

## ✅ v2.3 Definition of Done (Complete)
- [x] Users can preview all file changes before committing (`--dry-run`).
- [x] Non-interactive mode works in CI/CD environments (`--scope` flag).
- [x] Validation command can auto-fix common issues (`--fix`).
- [x] VS Code users have snippet library for rapid TMS documentation.
- [x] Status command provides project health dashboard with scope, tasks, and validation results.

**Archive**: See `docs/archive/sprint-v2.3-confidence-comfort.md` for full sprint retrospective.

---

## 🎯 Definition of Done (v2.4)
- [x] Templates include machine-readable version metadata for detection.
- [x] Migration command detects version status and identifies customizations.
- [x] Version conflicts are clearly reported with upgrade guidance.
- [ ] Prompt engine provides project-aware AI interaction templates.
- [ ] First-time users can complete an interactive tutorial inside the CLI.

## 📦 v2.5 Backlog
| Task | Ref | Priority | Notes |
| :--- | :--- | :------- | :--- |
| **Auto-Upgrade Logic** - `migrate --apply` with backups | [TMS-236-P2] | 🟡 MED | Automatic template upgrades |
| **Rollback System** - `migrate --rollback` | [TMS-236-P3] | 🟢 LOW | Undo migration changes |

---

## 🗂️ Sprint Archive Links

- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) - Status Dashboard, Snippets, Self-Healing
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) - CI/CD, Custom Init, Branch Hygiene
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) - CLI Launch, Validation Engine, Template System

<!-- @cortex-tms-version 2.3.0 -->
