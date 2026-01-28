# NEXT: Upcoming Tasks

**Current Sprint**: v3.1 Code Quality & Security (Jan 28 - TBD)
**Previous Sprint**: [v3.0 AI-Powered Onboarding](docs/archive/sprint-v3.0-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-28 (Post-Opus Audit Task Extraction)

---

## 🎯 v3.1 Development Focus

**Timeline**: 2-3 weeks
**Status**: 🚧 Planning
**Theme**: Code Quality & Security Hardening

### Code Quality & Security (Audit-Driven)

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Centralize Error Handling** | [AUDIT-1] | 2-3h | 🔴 HIGH | ⏸️ Planned |
| **Add Zod Input Validation** | [AUDIT-2] | 2-3h | 🔴 HIGH | ⏸️ Planned |
| **Add Integration/E2E Tests** | [AUDIT-3] | 6-8h | 🔴 HIGH | ⏸️ Planned |
| **Add npm audit to CI** | [AUDIT-4] | 30m | 🔴 HIGH | ⏸️ Planned |
| **File Path Traversal Protection** | [AUDIT-5] | 1-2h | 🟡 MED | ⏸️ Planned |
| **Guardian API Key Redaction** | [AUDIT-6] | 1-2h | 🟡 MED | ⏸️ Planned |

---

## v3.1 Task Details

### Centralize Error Handling [AUDIT-1]

**Goal**: Replace direct `process.exit(1)` calls with proper error throwing

**Why**:
- Commands currently use `process.exit(1)` directly, preventing proper testing and cleanup
- Makes CLI testing difficult (process termination can't be caught)
- Prevents cleanup handlers from running

**Implementation**:
- Throw errors from command functions instead of exiting
- Catch errors at CLI entry point (`bin/cortex-tms.js`)
- Add proper error cleanup/logging at top level
- Update tests to expect thrown errors

**Files**:
- `src/commands/*.ts` (all command files)
- `bin/cortex-tms.js` (entry point error handling)

**Impact**: Improved reliability + testability

**Source**: Opus 4.5 Audit Section 3.4

---

### Add Zod Input Validation [AUDIT-2]

**Goal**: Add runtime validation for CLI user inputs

**Why**:
- CLI currently trusts user input without validation
- Security risk at system boundary
- Prevents type errors and invalid configurations

**Implementation**:
- Install Zod as dependency
- Create `src/utils/schemas.ts` with validation schemas
- Add validation for init prompts (project name, scope, etc.)
- Add validation for config file values
- Return helpful error messages on validation failure

**Files**:
- `src/commands/init.ts` (init prompt validation)
- `src/utils/schemas.ts` (new file for Zod schemas)
- `src/types/cli.ts` (update types as needed)

**Impact**: Security + robustness at system boundaries

**Source**: Opus 4.5 Audit Section 3.5

---

### Add Integration/E2E Tests [AUDIT-3]

**Goal**: Add end-to-end CLI workflow tests

**Why**:
- Current tests focus on individual functions
- Missing tests for complete command workflows
- Need to catch regressions at command boundaries
- Improve confidence in releases

**Implementation**:
- Create new test suite `tests/e2e/` or `tests/integration/`
- Test actual CLI commands (init, validate, status, migrate)
- Use temporary test directories
- Test command interactions and side effects
- Test error scenarios and edge cases

**Examples**:
- Full init → validate → status workflow
- Migration with real template files
- Error handling across command chains

**Files**:
- New directory: `tests/e2e/` or `tests/integration/`
- May need test utilities in `tests/helpers/`

**Impact**: Higher confidence in releases, catch regressions

**Source**: Opus 4.5 Audit Section 4.3

---

### Add npm audit to CI [AUDIT-4]

**Goal**: Add dependency vulnerability scanning to CI pipeline

**Why**:
- No current dependency scanning in CI
- Supply chain security risk
- Industry best practice

**Implementation**:
- Add `npm audit --audit-level=high` step to CI workflow
- Configure to fail on high/critical vulnerabilities
- Add to `.github/workflows/*.yml` (main CI workflow)
- Document in README

**Files**:
- `.github/workflows/ci.yml` (or main workflow file)

**Impact**: Supply chain security

**Source**: Opus 4.5 Audit Section 9

---

### File Path Traversal Protection [AUDIT-5]

**Goal**: Validate template paths to prevent path traversal attacks

**Why**:
- Template paths not validated against project root
- Potential security risk in template processing
- Could allow reading/writing files outside project

**Implementation**:
- Add path validation in `src/utils/templates.ts`
- Ensure all paths resolve within project root
- Use `path.resolve()` and check against root
- Add tests for malicious paths

**Files**:
- `src/utils/templates.ts`
- New tests for path validation

**Impact**: Security hardening

**Source**: Opus 4.5 Audit Section 9

---

### Guardian API Key Redaction [AUDIT-6]

**Goal**: Ensure Guardian never exposes API keys in logs or errors

**Why**:
- API keys stored in environment variables
- Risk of accidental exposure in logs/error output
- Security best practice for BYOK features

**Implementation**:
- Audit Guardian-related code for console.log/error output
- Redact API keys from any log messages
- Add tests to verify redaction
- Document secure key handling

**Files**:
- Guardian-related files in `src/`
- Guardian command files
- Error handling for Guardian features

**Impact**: Security for Guardian BYOK users

**Source**: Opus 4.5 Audit Section 9

---

## v3.0 Completed Items Reference

All v3.0 sprint details moved to archive. See `docs/archive/sprint-v3.0-jan-2026.md` for:
- Website Performance Optimization [TECH-1]
- AI-Assisted Bootstrap Onboarding [BOOT-1]
- Reusable GitHub Action [GPT5-REC-3]
- Prerelease Version Fix [TMS-272]
- Bootstrap Blog Examples [BOOT-EXP]

---

## 📋 Deferred Items (v3.2+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

### Lower Priority Technical Debt (Audit Findings)
- Hardcoded Strings / Localization - Premature (no i18n demand)
- Snapshot Tests for CLI Output - Brittle during active development
- Monorepo Separation - Working fine at current scale
- Core Package Extraction - Wait for second consumer
- Cursor-Specific Optimizations - Low priority, IDE-agnostic by design

### Feature Backlog
- Guardian GitHub Action & PR Bot (TMS-287)
- Guardian Enhancements (TECH-2) - watch mode, better errors
- Migration Experience (TMS-277-282) - dry-run, better progress
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics

---

## 🗂️ Sprint Archive

- **v3.0**: [AI-Powered Onboarding](docs/archive/sprint-v3.0-jan-2026.md) ✅ Complete (Jan 26-27, 2026)
- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 3.0.0 -->
