<p align="center">
  <img src="website/public/logo.svg" alt="Cortex TMS Logo" width="200"/>
</p>

<h1 align="center">Cortex TMS</h1>

<p align="center">
  <strong>Documentation Governance for AI Coding Agents</strong>
</p>

<p align="center">
  ⭐ 166+ GitHub Stars | Open source, community-driven
</p>

[![npm version](https://img.shields.io/npm/v/cortex-tms.svg?style=flat-square)](https://www.npmjs.com/package/cortex-tms)
[![npm downloads](https://img.shields.io/npm/dm/cortex-tms.svg?style=flat-square)](https://www.npmjs.com/package/cortex-tms)
[![license](https://img.shields.io/npm/l/cortex-tms.svg?style=flat-square)](https://github.com/cortex-tms/cortex-tms/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/cortex-tms.svg?style=flat-square)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/cortex-tms/cortex-tms.svg?style=flat-square)](https://github.com/cortex-tms/cortex-tms/stargazers)

---

## What is Cortex TMS?

Cortex TMS scaffolds and validates governance documentation for AI coding agents. As AI models get more powerful and autonomous, they need clear, current governance docs to stay aligned with your project standards.

**The Challenge**: Modern AI agents handle large context windows and can work autonomously—but without governance, they drift from your standards, overengineer solutions, and write inconsistent code.

**The Solution**: Cortex TMS provides:
- 📋 **Documentation scaffolding** - Templates for PATTERNS.md, ARCHITECTURE.md, CLAUDE.md
- ✅ **Staleness detection** - Detects when governance docs go stale relative to code changes (v4.0)
- 🔍 **Structure validation** - Automated health checks in CI or locally
- 📦 **Archive management** - Keep task lists focused and maintainable

---

## Three Pillars

### 1. 📋 Consistency - Document Your Standards

Scaffold governance docs that AI agents actually read:
- `PATTERNS.md` - Code patterns and conventions
- `CLAUDE.md` - Agent workflow rules (git protocol, scope discipline, human approval gates)
- `ARCHITECTURE.md` - System design and tech stack
- `DOMAIN-LOGIC.md` - Business rules and constraints

**Result**: AI writes code that follows YOUR patterns, not random conventions from its training data.

### 2. 🔍 Freshness - Detect Staleness

New in v4.0: Git-based staleness detection catches when docs go stale:

```bash
cortex-tms validate

⚠️  Doc Staleness
    PATTERNS.md may be outdated
    Doc is 45 days older than code with 12 meaningful commits
    Code: 2026-02-20
    Doc:  2026-01-06

    Review docs/core/PATTERNS.md to ensure it reflects current codebase
```

**How it works**: Compares doc modification dates vs code commit activity. Flags stale docs before they mislead AI agents.

**Note**: Staleness v1 uses git timestamps (temporal comparison only). Cannot detect semantic misalignment. Future versions will add semantic analysis.

### 3. 🛡️ Safety - Human Oversight

`CLAUDE.md` governance rules require human approval for critical operations:
- Git commits/pushes require approval
- Scope discipline prevents overengineering
- Pattern adherence enforced through validation

**Result**: AI agents stay powerful but don't run wild.

---

## What Cortex Does (and Doesn't Do)

### ✅ What Cortex Does

- **Scaffolds governance docs** - Templates for common project documentation
- **Validates doc health** - Checks structure, freshness, completeness
- **Detects staleness** - Flags when docs are outdated relative to code (v4.0)
- **Enforces size limits** - Keeps docs focused and scannable
- **Archives completed tasks** - Maintains clean NEXT-TASKS.md
- **Works in CI/CD** - GitHub Actions validation templates included

### ❌ What Cortex Does NOT Do

- **Not a token optimizer** - Validates documentation health, not context size
- **Not code enforcement** - Validates DOCUMENTATION health, not code directly
- **Not a replacement for code review** - Complements human review, doesn't replace it
- **Not semantic analysis (yet)** - Staleness v1 uses timestamps, not AI-powered diff analysis

---

## Quick Start

```bash
# Initialize governance docs in your project
npx cortex-tms@latest init

# Validate doc health (including staleness detection)
npx cortex-tms@latest validate

# Strict mode (warnings = errors, for CI)
npx cortex-tms@latest validate --strict

# Check project status
npx cortex-tms@latest status

# Archive completed tasks
npx cortex-tms@latest archive --dry-run
```

**Installation**: No installation required with `npx`. For frequent use: `npm install -g cortex-tms@latest`

---

## CLI Commands

### `cortex-tms init`

Scaffold TMS documentation structure with interactive scope selection.

```bash
cortex-tms init                    # Interactive mode
cortex-tms init --scope standard   # Non-interactive
cortex-tms init --dry-run          # Preview changes
```

### `cortex-tms validate`

Verify project TMS health with automated checks.

```bash
cortex-tms validate         # Check project health
cortex-tms validate --fix   # Auto-repair missing files
cortex-tms validate --strict # Strict mode (warnings = errors)
```

**What it checks:**
- ✅ Mandatory files exist (NEXT-TASKS.md, CLAUDE.md, copilot-instructions.md)
- ✅ File size limits (Rule 4: HOT files < 200 lines)
- ✅ Placeholder completion (no `[Project Name]` markers left)
- ✅ Archive status (completed tasks should be archived)
- ✅ **Doc staleness** (NEW in v4.0) - governance docs current with code

### `cortex-tms status`

Text summary of project health and sprint progress.

```bash
cortex-tms status  # Health summary with progress bars
```

Shows: project identity, validation status, sprint progress, backlog size.

### `cortex-tms dashboard` ✨ New in v4.0

Full-screen interactive terminal UI for governance health monitoring.

```bash
cortex-tms dashboard        # Interactive dashboard (navigate with 1/2/3 keys)
cortex-tms dashboard --live # Auto-refresh every 5 seconds
```

**Three views** (switch with number keys):
- **1 — Overview**: Governance health score (0–100), staleness status, sprint progress
- **2 — Files**: HOT files list, HOT/WARM/COLD distribution, file size health
- **3 — Health**: Validation status, Guardian violation summary

### `cortex-tms archive`

Archive completed tasks and old content.

```bash
cortex-tms archive           # Archive completed tasks
cortex-tms archive --dry-run # Preview what would be archived
```

Archives completed tasks from NEXT-TASKS.md to `docs/archive/` with timestamp.

**Note**: `cortex-tms auto-tier` is deprecated—use `archive` instead.

### `cortex-tms migrate`

Intelligent version management—detect outdated templates and upgrade safely.

```bash
cortex-tms migrate                    # Analyze version status
cortex-tms migrate --apply            # Auto-upgrade OUTDATED files
cortex-tms migrate --rollback         # Restore from backup
```

### `cortex-tms prompt`

Access project-aware AI prompts from the Essential 7 library.

```bash
cortex-tms prompt              # Interactive selection
cortex-tms prompt init-session # Auto-copies to clipboard
```

### `cortex-tms review` 🛡️

Guardian: AI-powered semantic validation against project patterns.

```bash
cortex-tms review src/index.ts              # Validate against PATTERNS.md
cortex-tms review src/index.ts --safe       # High-confidence violations only
```

### `cortex-tms tutorial`

Interactive walkthrough teaching the Cortex Way.

```bash
cortex-tms tutorial  # 5-lesson guided tour (~15 minutes)
```

---

## Documentation Structure

| Folder / File                     | Purpose                                | Tier                      |
| :-------------------------------- | :------------------------------------- | :------------------------ |
| `NEXT-TASKS.md`                   | Active sprint and current focus        | **HOT** (Always Read)     |
| `PROMPTS.md`                      | AI interaction templates (Essential 7) | **HOT** (Always Read)     |
| `CLAUDE.md`                       | CLI commands & workflow config         | **HOT** (Always Read)     |
| `.github/copilot-instructions.md` | Global guardrails and critical rules   | **HOT** (Always Read)     |
| `FUTURE-ENHANCEMENTS.md`          | Living backlog (not current sprint)    | **PLANNING**              |
| `docs/core/ARCHITECTURE.md`       | System design & tech stack             | **WARM** (Read on Demand) |
| `docs/core/PATTERNS.md`           | Canonical code examples (Do/Don't)     | **WARM** (Read on Demand) |
| `docs/core/DOMAIN-LOGIC.md`       | Immutable project rules                | **WARM** (Read on Demand) |
| `docs/core/GIT-STANDARDS.md`      | Git & PM conventions                   | **WARM** (Read on Demand) |
| `docs/core/DECISIONS.md`          | Architecture Decision Records          | **WARM** (Read on Demand) |
| `docs/core/GLOSSARY.md`           | Project terminology                    | **WARM** (Read on Demand) |
| `docs/archive/`                   | Historical changelogs                  | **COLD** (Ignore)         |

**HOT/WARM/COLD System**: Organizes docs by access frequency (not token optimization). Helps AI find what's relevant for each task.

---

## Staleness Detection Configuration

Configure staleness thresholds in `.cortexrc`:

```json
{
  "version": "4.0.0",
  "scope": "standard",
  "staleness": {
    "enabled": true,
    "thresholdDays": 30,
    "minCommits": 3,
    "docs": {
      "docs/core/PATTERNS.md": ["src/"],
      "docs/core/ARCHITECTURE.md": ["src/", "infrastructure/"],
      "docs/core/DOMAIN-LOGIC.md": ["src/"]
    }
  }
}
```

**How it works**:
- Compares doc last modified date vs code commit activity
- Flags stale if: `daysSinceDocUpdate > thresholdDays AND meaningfulCommits >= minCommits`
- Excludes merge commits, test-only changes, lockfile-only changes

**Limitations (v1)**:
- Temporal comparison only (git timestamps)
- Cannot detect semantic misalignment
- Requires full git history (not shallow clones)

**CI Setup**: Ensure `fetch-depth: 0` in GitHub Actions to enable staleness detection.

---

## CI/CD Integration

Add to `.github/workflows/validate.yml`:

```yaml
name: Cortex TMS Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for staleness detection

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Validate TMS Health
        run: npx cortex-tms@latest validate --strict
```

**Strict mode**: Warnings become errors, failing the build if:
- Governance docs are stale
- File size limits exceeded
- Mandatory files missing
- Placeholders not replaced

---

## What's New in v4.0

**🎯 Strategic Repositioning**: Quality governance over token optimization

**Context**: Modern AI models handle large contexts and improved reasoning. The bottleneck shifted from "can AI see enough?" to "will AI stay aligned with project standards?"

### New Features

**Staleness Detection** (v4.0):
- ✅ Git-based freshness checks for governance docs
- ✅ Configurable thresholds (days + commit count)
- ✅ Per-doc watch directories
- ✅ Exclude merges, test-only, lockfile-only commits
- ✅ CI-ready (with `fetch-depth: 0`)

**Archive Command**:
- ✅ `cortex-tms archive` - Archive completed tasks
- ✅ Replaces deprecated `auto-tier` command
- ✅ Dry-run mode for previewing changes

**Simplified Status**:
- ✅ Removed `--tokens` flag (streamlined to governance focus)
- ✅ Shows: project health, sprint progress, backlog

### Breaking Changes

**Removed**:
- ❌ `cortex-tms status --tokens` flag
- ❌ Token counting and cost analysis features

**Deprecated**:
- ⚠️ `cortex-tms auto-tier` → Use `cortex-tms archive` (still works with warning)

**Migration**:
- Status command: Use `cortex-tms status` (no flags needed)
- Archive tasks: Use `cortex-tms archive` instead of `auto-tier`

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## When to Use Cortex TMS

### ✅ Good Fit

- **Multi-file projects** - Complex codebases with established patterns
- **Team projects** - Multiple developers + AI agents need consistency
- **Long-running projects** - Documentation drift is a real risk
- **AI-heavy workflows** - Using Claude Code, Cursor, Copilot extensively
- **Quality-focused** - You value consistent code over speed

### ⚠️ Maybe Not

- **Single-file projects** - Overhead may outweigh benefits
- **Throwaway prototypes** - Documentation governance not worth setup time
- **Solo dev, simple project** - Mental model may be sufficient
- **Pure exploration** - Constraints may slow discovery

**Start simple**: Use `--scope nano` for minimal setup, expand as needed.

---

## Developer Experience

- **Instant Setup**: `npx cortex-tms init` - 60 seconds to governance docs
- **Zero Config**: Works out of the box with sensible defaults
- **CI Ready**: GitHub Actions templates included
- **Production Grade**: 316 tests (97% pass rate), enterprise-grade security (v3.2)
- **Open Source**: MIT license, community-driven

**Tested With**: Claude Code, GitHub Copilot (in VS Code). Architecture supports any AI tool.

---

## Community & Support

### Get Help

- **[GitHub Discussions](https://github.com/cortex-tms/cortex-tms/discussions)** - Ask questions, share ideas
  - [Q&A](https://github.com/cortex-tms/cortex-tms/discussions/categories/q-a) - Get help from community
  - [Ideas](https://github.com/cortex-tms/cortex-tms/discussions/categories/ideas) - Suggest features
  - [Show and Tell](https://github.com/cortex-tms/cortex-tms/discussions/categories/show-and-tell) - Share projects

### Report Issues

- **[Bug Reports](https://github.com/cortex-tms/cortex-tms/issues/new)** - Found a bug? Let us know
- **[Security Issues](https://github.com/cortex-tms/cortex-tms/security/advisories/new)** - Responsible disclosure

### Contributing

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Community Guide](docs/COMMUNITY.md)** - Community guidelines

**Star us on GitHub** ⭐ if Cortex TMS helps your AI development workflow!

---

## Roadmap

**v4.0** (Current - Feb 2026):
- ✅ Staleness detection (git-based, v1)
- ✅ Archive command
- ✅ Validation-first positioning
- ✅ Token claims removed

**v4.1** (Planned - Mar 2026):
- 🔄 Git hooks integration (`cortex-tms hooks install`)
- 🔄 Staleness v2 (improved heuristics, fewer false positives)
- 🔄 Incremental doc updates

**v4.2+** (Future):
- 📋 MCP Server (expose docs to any AI tool)
- 📋 Multi-tool config generation (.cursorrules, .windsurfrules)
- 📋 Skills integration

See [FUTURE-ENHANCEMENTS.md](FUTURE-ENHANCEMENTS.md) for full roadmap.

---

## License

MIT - See [LICENSE](LICENSE) for details

---

## Status

**Version**: 4.0.1
**Last Updated**: 2026-02-21
**Current Sprint**: v4.0 - "Quality Governance & Staleness Detection"

<!-- @cortex-tms-version 4.0.1 -->
