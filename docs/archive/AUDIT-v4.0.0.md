<!-- @cortex-tms-version 4.0.2 -->

## Cortex TMS v4.0.0 — Post‑release audit report

**Audit date:** 2026-02-22

### Scope & intent

This audit focuses on:

- CLI runtime behavior (exit codes, UX)
- Validation engine correctness/false positives
- Git-based doc staleness logic (high-level behavior)
- Project health: tests, build, lint
- Documentation + website claim accuracy vs implementation

This report is evidence-driven (commands run + code references) and includes recommended fixes.

---

## Executive summary

### What’s solid

- **Test suite is healthy**: `npm test` passes (342 total; 324 passed; 18 skipped; 0 failed).
- **CLI build is healthy**: `npm run cli:build` succeeds.
- Core v4.0 “governance” direction is present in code: validation engine + git staleness utilities exist and are tested.

### What’s risky / misleading right now

1. **CRITICAL — `--help` / `--version` exit with code 1** (should be 0). This breaks scripting and gives a “failure” signal in CI.
2. **CRITICAL — `validate --strict` fails in this repo by default** due to placeholder detection on `README.md` plus strict-mode treatment of warnings as errors.
3. **HIGH — Website docs still pin/install and examples to `3.1.0`** (numerous places), and include at least one outdated roadmap claim (“v2.8 cross-project features”).
4. **HIGH — Lint is broken out-of-the-box** (ESLint v9 configured as dependency, but missing `eslint.config.*`).

---

## Evidence snapshot (commands & observed outputs)

All commands run from repo root.

### CLI exit codes

- `node bin/cortex-tms.js --version; echo EXIT:$?`
  - Output: `4.0.0`
  - **EXIT: 1**
- `node bin/cortex-tms.js --help >/dev/null; echo EXIT:$?`
  - **EXIT: 1**

### Validation

- `node bin/cortex-tms.js validate --strict`
  - Warning: `NEXT-TASKS.md exceeds recommended line limit`
  - Error: `README.md is incomplete (contains placeholder text)`
  - **Strict mode fails** (warnings treated as errors)
  - Exit code: **1**

### Tests

- `npm test` (Vitest)
  - **Test Files:** 20 passed | 1 skipped (21)
  - **Tests:** 324 passed | 18 skipped (342)
  - No failing tests observed.

Notes:

- `guardian-accuracy.test.ts` prints that `ANTHROPIC_API_KEY` is not set and skips the accuracy assertion (expected in environments without keys).
- `auto-tier-e2e.test.ts` is skipped (entire file).

### Build

- `npm run cli:build`
  - `tsc -p tsconfig.cli.json` succeeded.

### Lint

- `npm run lint`
  - ESLint 9.39.2 error: **missing `eslint.config.(js|mjs|cjs)`**
  - Lint cannot be run successfully as shipped.

### Website docs version drift

- `grep -RIn "3\.1\.0" website/src/content | head`
  - Multiple hits including:
    - `website/src/content/docs/getting-started/installation.mdx`
    - `website/src/content/docs/getting-started/quick-start.mdx`
    - several `website/src/content/docs/reference/cli/*.mdx`
- `grep -n "v2\.8" website/src/content/docs/getting-started/quick-start.mdx`
  - Found line referencing “v2.8 cross-project features like `cortex list`”.

---

## Findings & recommendations (prioritized)

### CRITICAL-1 — `--help`/`--version` exit code is 1 (should be 0)

**Impact**

- Shell scripts/CI treat `cortex-tms --help` and `--version` as failures.
- “Failure exit code” breaks common conventions and tooling.

**Evidence**

- `node bin/cortex-tms.js --version` prints correct version but exits `1`.
- `node bin/cortex-tms.js --help` exits `1`.

**Likely root cause (code)**

- `src/cli.ts` calls `program.exitOverride()` and then unconditionally `process.exit(1)` for Commander-thrown control flow errors.
  - See `src/cli.ts` lines ~84–112.
  - Commander uses exceptions internally for help/version output when `exitOverride()` is enabled; these should map to exit code `0`.

**Recommendation**

- Handle Commander “help displayed” / “version displayed” cases explicitly and exit `0`.
- Ensure invalid usage remains `exit 1`.

---

### CRITICAL-2 — Placeholder validation flags repo README and fails strict validation

**Impact**

- `validate --strict` fails in the project that publishes the tool, which undermines confidence.
- Placeholder scanning currently includes `README.md`, and the README contains a placeholder marker example.

**Evidence**

- `validate --strict` reports: `README.md is incomplete (contains placeholder text)`.
- `README.md` contains `no `[Project Name]` markers left` (inside backticks).

**Mechanism (code)**

- Placeholder regex: `src/utils/validator.ts` defines:
  - `const PLACEHOLDER_PATTERN = /\[([A-Z][a-zA-Z\s]+)\](?!\()/g;`
- Placeholder checks scan `README.md` as part of `filesToScan` in `validatePlaceholders()`.

**Why this is a problem**

- The regex does **not** exclude inline code spans or fenced code blocks. As a result, documentation examples that show placeholders (in code formatting) are treated as incomplete.

**Recommendation options (choose one)**

1. **Exclude code spans/blocks** from placeholder scanning (most correct, best UX).
2. **Stop scanning README.md** by default (but you likely want README validation; better to fix parser).
3. **Make placeholder check “warning” in non-strict**, and in strict only fail when placeholder appears outside code blocks.

Also consider adding `validation.ignoreFiles` in `.cortexrc` for the CLI repo itself, but fix the engine first.

---

### HIGH-1 — Website documentation still references `3.1.0` and contains outdated claims

**Impact**

- Users will install an old version or see incorrect output.
- Mismatch between NPM release (4.0.0) and docs reduces trust.

**Evidence**

- `website/src/content/docs/getting-started/installation.mdx` contains multiple `cortex-tms@3.1.0` install lines and “Output: 3.1.0”.
- Multiple `website/src/content/docs/reference/cli/*.mdx` reference `3.1.0` as version in JSON snippets and command examples.
- `website/src/content/docs/getting-started/quick-start.mdx` includes: “prepares you for v2.8 cross-project features like `cortex list`” (line ~63).

**Recommendation**

- Replace hard-coded install pins and sample outputs with `4.0.0` (or better: remove pinning entirely and show `@latest` + add a note about reproducibility).
- Search/replace version tags in website docs where appropriate.
- Remove or correct outdated roadmap references (v2.8 mention) unless still accurate and intentionally historical.

---

### HIGH-2 — `npm run lint` is broken (ESLint v9 config missing)

**Impact**

- Contributors can’t lint; CI lint steps (if added) will fail.
- Signals incomplete release packaging.

**Evidence**

- ESLint 9.39.2: “couldn’t find eslint.config.(js|mjs|cjs)”.

**Recommendation**

- Add a flat-config `eslint.config.js` (or downgrade to ESLint v8 with `.eslintrc`), and ensure `npm run lint` passes.

---

### MEDIUM — `validate --strict` treating warnings as errors is correct, but repo defaults may be too strict

**Observation**

- Strict mode currently fails because there is 1 warning and strict treats warnings as errors (expected).

**Recommendation**

- Keep strict semantics; instead ensure the _canonical repo_ passes strict by default, or document that strict is intended for CI and the repo must comply.
- Consider separating “recommended line limit” warnings from strict failures (e.g., strict fails only for “hard” warnings).

---

### MEDIUM — Deprecated `auto-tier` behavior and docs alignment

**Observation**

- `auto-tier` remains as a deprecated alias and delegates to `archive`.
- This is good for backwards compatibility, but docs must clearly state behavior, and tests should keep ensuring the alias is safe.

**Code reference**

- `src/cli.ts` defines an `auto-tier` command and delegates to `archiveCommand.parseAsync(...)`.

---

## Documentation/claims audit checklist (v4.0.0)

### Claims that match implementation (based on code + tests)

- Validation engine exists and checks:
  - mandatory files
  - config existence
  - file size limits
  - placeholders / AI-DRAFT markers
  - archive status
- Git-based staleness utilities exist (tested) and are integrated into validation.

### Claims that are currently misleading

- Website examples installing/running `3.1.0` while NPM package is `4.0.0`.
- README indicates placeholder completion check with an inline placeholder example, which causes validation failure.
- Lint command present but not runnable.

---

## Recommended remediation plan (fast, high ROI)

1. **Fix Commander exit code mapping** (help/version exit 0).
2. **Fix placeholder scanner** to ignore inline code and fenced blocks (or parse markdown AST and scan only text nodes).
3. **Make the repo pass `validate --strict`** (remove/escape the placeholder example in README, and address NEXT-TASKS line warning or adjust rule).
4. **Update website docs version pins** from `3.1.0` to `4.0.0` (or `@latest`).
5. **Restore lint** by adding `eslint.config.js` (ESLint v9 flat config).

---

## Addendum — Current repo state (health + improvement backlog)

This section captures additional **repo-level state** observed while cross-checking workflows, `.cortexrc`, and the v4.0 governance implementation. It’s intended to help prioritize improvements beyond the core audit findings.

### CI/workflows: strict validation vs shallow clones (staleness)

- **Staleness detection is enabled by default in the validator** (`enabled !== false`), and in shallow clones it emits a check: “Shallow clone detected — staleness check skipped”.
- The repo’s `TMS Validation` workflow (`.github/workflows/tms-validate.yml`) uses `actions/checkout@v4` with default settings (no `fetch-depth: 0`). In many cases, that means a **shallow clone**, which triggers the staleness warning.
- Because CI runs `node bin/cortex-tms.js validate --strict`, **the shallow-clone staleness warning can fail CI** (strict treats warnings as errors).

**Recommendation**

- Update workflows that run `validate --strict` to use full history checkout (`fetch-depth: 0`).
- In the reusable workflow (`validate-reusable.yml`), consider documenting the `fetch-depth: 0` requirement for callers. Optionally, reclassify “shallow clone / staleness skipped” from `warning` → `info` if you want strict mode to mean “content policy only” rather than “CI environment correctness”.

### CI/workflows: runtime version consistency

- The workflows currently use different Node versions in different places (e.g., PR checks use Node 22 while other flows use Node 20). The package `engines` allows `>=18`.

**Recommendation**

- Standardize on a single baseline Node version for CI (typically 20), or use a small matrix (18/20/22) if broad compatibility is a product goal.

### Package manager usage consistency

- Root `package.json` scripts are pnpm-first (`build` → `pnpm run cli:build`, website scripts use `pnpm --filter ...`). CI also uses pnpm.

**Recommendation**

- Ensure docs/examples consistently prefer `pnpm` for contributor workflows, or explicitly state that `npm` is acceptable but CI uses pnpm.

### `.cortexrc` version clarity

- `.cortexrc` uses `"version": "1.0.0"` which matches the **config schema version** in `src/utils/config.ts` (`CONFIG_VERSION = '1.0.0'`). This is distinct from the NPM package version `4.0.0`.

**Recommendation**

- Clarify in README/docs that `.cortexrc.version` is a **config schema version**, not the CLI package version, to avoid confusion for users.

### Git staleness heuristic notes (behavior + performance)

- Behavior is intentionally conservative: doc is marked stale only if **both** the age threshold is exceeded and a minimum count of “meaningful commits” is exceeded.
- Implementation uses a per-commit `git diff-tree` loop to decide meaningful commits; this may become slow on large histories.

**Recommendation**

- Consider early-exit once `minCommits` is reached (to cap runtime).
- Consider a more robust shallow-detection mechanism than checking `.git/shallow` (some environments use worktrees/submodules).

### Consolidated priority list (repo improvement backlog)

**P0 (breaks users/CI):**

1. Fix CLI `--help` / `--version` exit codes.
2. Fix placeholder scanning false positives (ignore inline + fenced code at minimum; ideally parse Markdown).
3. Make strict CI reliable: full git history in validation workflows, or adjust strict/staleness behavior.

**P1 (DX/quality gates):**

4. Restore linting with ESLint v9 flat config.
5. Standardize CI Node version(s) and package-manager guidance.

**P2 (trust/docs):**

6. Update website docs that pin old versions (`3.1.0`) and remove outdated references.
7. Ensure the canonical repo passes `validate --strict` out-of-the-box to reinforce product trust.

## Notes / limitations

- This audit report is based on direct local runs and reading the current repo contents on 2026-02-22.
- I did **not** change code or docs as part of writing this report; this file is purely the audit output.
