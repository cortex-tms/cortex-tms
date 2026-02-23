# FUTURE: Planned Enhancements

This is the **living backlog** for Cortex TMS. Tasks move from here to `NEXT-TASKS.md` when they become active.

**Last Updated**: 2026-02-21 (During v4.0.0 Strategic Repositioning)
**Source**: Benchmark findings + audit recommendations + community feedback

---

## 🎯 Post-v4.0 Immediate Priorities

### Phase 5: Organic Sync (v4.1 - High Priority)

**Timeline**: March 2026 (12-16h estimated)
**Status**: ⏸️ Planned
**Theme**: Automate documentation maintenance to prevent context rot

| Task                              | Description                                                                                          | Effort | Priority |
| :-------------------------------- | :--------------------------------------------------------------------------------------------------- | :----- | :------- |
| ~~**Git Hook Integration**~~      | ~~Shipped in v4.1~~ → `cortex-tms hooks install`                                                    | ✅      | ✅ Done   |
| **Staleness Detection v2**        | Robust git-history staleness checks (shallow clone handling, better messages, fewer false positives) | 4-5h   | 🟡 P1    |
| **Incremental Updates**           | AI updates only affected doc sections, not full regeneration                                         | 5-6h   | 🟡 P1    |
| **CI Templates (More Providers)** | Ready-to-copy CI snippets for GitHub/GitLab/Bitbucket; strict enforcement by default                 | 2h     | 🟡 P1    |

**Business Value**:

- Prevents context rot automatically (core differentiator)
- Reduces manual doc maintenance overhead
- Ensures governance docs stay current with code

**Acceptance Criteria**:

- [ ] Pre-commit hook catches outdated pattern docs
- [ ] Staleness checker identifies docs >30 days older than related code
- [ ] Incremental update workflow only modifies changed sections
- [ ] CI validation prevents PRs with stale docs

---

### Phase 6: Agent Ecosystem (v4.2 - High Priority)

**Timeline**: April 2026 (16-20h estimated)
**Status**: ⏸️ Planned
**Theme**: Multi-tool support and runtime agent integration

| Task                   | Description                                                                              | Effort | Priority |
| :--------------------- | :--------------------------------------------------------------------------------------- | :----- | :------- |
| **Multi-Tool Config**  | `cortex-tms init` generates CLAUDE.md + .cursorrules + .windsurfrules from single source | 6-8h   | 🟡 P1    |
| **MCP Server**         | Expose docs as MCP resources for any AI tool                                             | 8-10h  | 🟡 P1    |
| **Skills Integration** | Runtime agent hooks and custom skills support                                            | 4-6h   | 🟢 P2    |

**Business Value**:

- Expands addressable market beyond Claude Code users
- MCP server makes Cortex universal (any AI tool can use it)
- Skills integration enables advanced workflows

**Acceptance Criteria**:

- [ ] Single config generates rules for Cursor, Claude, Windsurf, Copilot
- [ ] MCP server exposes PATTERNS.md, ARCHITECTURE.md as resources
- [ ] Skills can query/update TMS docs at runtime

---

## 🔴 High Priority (Next 1-2 Months)

### Context Profile Enhancements (v4.1+)

**If/when context profiles ship (target v4.1), keep them explicitly secondary to governance**:

- **Profile Templates**: Pre-built profiles for common scenarios
  - `cortex-tms context bug-fix` - Minimal context for quick fixes
  - `cortex-tms context feature` - Full governance for new features
  - `cortex-tms context refactor` - Architecture + patterns only
  - **Effort**: 4-6h
  - **Priority**: 🟡 P1

- **Auto Profile Switching**: Detect task complexity and suggest profile
  - Analyze commit message, file count, affected areas
  - Suggest appropriate context profile
  - **Effort**: 6-8h
  - **Priority**: 🟢 P2

- **Custom Profiles**: User-defined context profiles
  - `cortex-tms context create <name>` - Define custom profile
  - Store in `.cortex/profiles/<name>.json`
  - **Effort**: 4-5h
  - **Priority**: 🟢 P2

---

### Archive Command Enhancements (v4.1+)

**Build on the archive command introduced in v4.0**:

- **Smart Archive Detection**: Auto-detect archivable content
  - Completed tasks in NEXT-TASKS.md
  - Old sprint retrospectives
  - Outdated ADRs (superseded by newer decisions)
  - **Effort**: 3-4h
  - **Priority**: 🟡 P1

- **Archive Index**: Searchable archive with metadata
  - Generate `docs/archive/INDEX.md` with links
  - Add timestamps, sprint numbers, categories
  - **Effort**: 2-3h
  - **Priority**: 🟢 P2

- **Archive Retrieval**: Bring archived content back when needed
  - `cortex-tms archive restore <sprint-id>`
  - Useful for referencing old decisions
  - **Effort**: 2-3h
  - **Priority**: 🟢 P2

---

### Migration Assistant (Biggest Adoption Barrier)

- **Automated Brownfield Migration**: Analyze existing repos and populate TMS templates
  - **Why**: "Biggest barrier to adoption" per Analysis Report
  - **Implementation**:
    ```bash
    cortex-tms migrate --from conventional-docs
    # Uses LLM to analyze README, extract patterns, populate templates
    ```
  - **Business Value**: Reduces migration from hours to minutes
  - **Effort**: 16-20h
  - **Priority**: 🟡 P1
  - **Trigger**: Validate demand first (wait for 10+ migration requests)
  - **Source**: Analysis Report Section 7.4

---

## 🟡 Medium Priority (2-4 Months)

### CLI Tool Enhancements

- **Interactive Template Selection**: Prompt users to choose which `docs/core/*.md` files they need
  - **Why**: Not all projects need `SCHEMA.md` or `TROUBLESHOOTING.md`
  - **Effort**: 4h
  - **Priority**: 🟢 P2

- **Detect Existing Package Manager**: Auto-detect if user uses npm/yarn/pnpm/bun
  - **Why**: Respect user's existing tooling
  - **Effort**: 2h
  - **Priority**: 🟢 P2

- **Safe File Merging**: Don't overwrite existing files without confirmation
  - **Why**: Brownfield projects may have existing `README.md` or `.github/` files
  - **Effort**: 3h
  - **Priority**: 🟡 P1

- **GitHub Actions Detection**: If `.github/workflows/` exists, offer to add TMS validation workflow
  - **Why**: Automate enforcement of line limits and structure
  - **Effort**: 4h
  - **Priority**: 🟢 P2

---

### Documentation Guides

- **QUICK-START.md**: 5-minute setup guide
  - **Why**: New users need fast onboarding
  - **Effort**: 2h
  - **Priority**: 🟡 P1

- **MIGRATION-GUIDE.md**: How to add TMS to existing projects
  - **Why**: Most users have brownfield projects
  - **Effort**: 3h
  - **Priority**: 🟡 P1

- **BEST-PRACTICES.md**: How to write effective DOMAIN-LOGIC, PATTERNS, etc.
  - **Why**: Quality of docs determines AI agent success
  - **Effort**: 3h
  - **Priority**: 🟢 P2

---

### Example Projects

- **examples/cli-tool/**: Node.js CLI application with TMS
  - **Why**: Shows TMS works for non-web projects
  - **Effort**: 4h
  - **Priority**: 🟢 P2

- **examples/api-service/**: Express + PostgreSQL API with TMS
  - **Why**: Demonstrates `SCHEMA.md` and `TROUBLESHOOTING.md` usage
  - **Effort**: 6h
  - **Priority**: 🟢 P2

---

## 🟡 Medium Priority: Community & Adoption

### Lower Adoption Friction

- **Minimalist Preset**
  - **Feature**: New scope `cortex-tms init --scope minimal`
  - **Why**: Reduces cognitive load for first-time users
  - **Implementation**: Only sets up:
    - `NEXT-TASKS.md` (task management)
    - `.github/copilot-instructions.md` (AI collaboration)
    - `docs/core/ARCHITECTURE.md` (system overview)
  - **Effort**: 4-6h
  - **Priority**: 🟢 P2

- **Video Demo / Screencast**
  - **Feature**: 2-3 minute demo of AI agent using TMS docs
  - **Why**: "Show, don't tell" - demonstrates value in 30 seconds
  - **Implementation**:
    - Record typical dev session with Claude/Copilot using TMS
    - Add to website landing page hero section
    - Include in README.md above fold
  - **Effort**: 2-3h
  - **Priority**: 🟡 P1

---

## 🟢 Low Priority (Nice to Have)

### VS Code Extension

- **TMS File Navigator**: Sidebar showing documentation structure
  - **Effort**: 12h
  - **Priority**: 🟢 P2

- **Snippet Library**: Quick insert for patterns, ADRs, tasks
  - **Effort**: 4h
  - **Priority**: 🟢 P2

- **Placeholder Detection**: Highlight bracket-syntax placeholders in templates
  - **Effort**: 3h
  - **Priority**: 🟢 P2

---

### Template Enhancements

- **Complete ARCHITECTURE.md template**: Add sections for deployment, security, scalability
  - **Effort**: 2h
  - **Priority**: 🟢 P2

- **Complete TROUBLESHOOTING.md template**: Add common framework gotchas
  - **Effort**: 2h
  - **Priority**: 🟢 P2

- **Complete SCHEMA.md template**: Add examples for SQL, NoSQL, GraphQL schemas
  - **Effort**: 3h
  - **Priority**: 🟢 P2

---

### Distribution Enhancements

- **Homebrew Formula**: `brew install cortex-tms`
  - **Effort**: 4h
  - **Priority**: 🟢 P2

- **Docker Image**: Containerized CLI tool
  - **Effort**: 3h
  - **Priority**: 🟢 P2

---

## 🔬 Experimental Ideas

### AI Agent Integration

- **Cursor Rules Generator**: Auto-generate `.cursorrules` from `copilot-instructions.md`
  - **Effort**: 4h
  - **Priority**: 🟢 P2

- **Copilot Chat Slash Commands**: `/tms-sprint`, `/tms-pattern`, `/tms-decision`
  - **Effort**: Unknown (requires GitHub partnership)
  - **Priority**: 🟢 P2

---

### Community Features

- **Pattern Library Marketplace**: Share/import patterns for specific frameworks
  - **Why**: Reduces onboarding time, creates community engagement
  - **Implementation**:
    ```bash
    cortex-tms patterns add @cortex-tms/react-patterns
    cortex-tms patterns add @mycompany/internal-patterns
    ```
  - **Technical**: Requires pattern versioning and conflict resolution
  - **Effort**: 20-24h
  - **Priority**: 🟢 P2
  - **Trigger**: Validate demand first (wait for 20+ custom patterns shared)

- **TMS Showcase**: Gallery of projects using TMS
  - **Effort**: 8h
  - **Priority**: 🟢 P2

---

## 🗑️ Removed / Deprecated Ideas

### Removed / Deprecated as part of the v4.0 Pivot (planned)

- ❌ **Token Counter Dashboard**: Remove (token savings claims invalidated)
- ❌ **Green Governance Metrics**: Remove (based on invalidated token-savings premise)
- ❌ **Auto-Tier Scoring**: Repurpose into Archive UX (deprecate, don't hard-break)
- ❌ **Cost Comparison Charts**: Remove (no longer claiming cost savings)
- ❌ **HOT/WARM/COLD Optimization**: Reframe as organizational structure only

### Still Rejected

- ❌ **YAML/JSON Templates**: Markdown is more human-readable
- ❌ **GUI Tool**: CLI-first philosophy; GUI adds complexity
- ❌ **Automatic Archiving**: Too risky; requires manual review
- ❌ **AI-Generated Docs**: Quality control is too difficult

---

## 📊 Audit Findings Summary (Updated for v4.0)

### Post-Benchmark Insights

**What Testing Proved**:

- ✅ Documentation governance improves code quality
- ✅ Pattern docs influence AI behavior positively
- ✅ Validation catches context rot (unique value)
- ❌ Token savings claims were invalidated (+15.8% more tokens)

**New Strategic Focus**:

1. **Quality Governance** - Validated by benchmark (better test coverage, pattern adherence)
2. **Context Rot Prevention** - No competitor offers this
3. **Optional Context Profiles** - Useful workflow helper, but not the core wedge

### Remaining High-Value Opportunities

**Category A: Definition of Done for v4.0 (do not claim complete until shipped)**

- [ ] Token/cost/"Green Governance" claims removed across docs + website
- [ ] CLI no longer exposes token counting UX (`status --tokens` removed)
- [ ] Staleness detection + strict CI enforcement works (or fails with actionable guidance)
- [ ] Deprecation path for `auto-tier` is documented and tested

**Category B: Next Priorities (v4.1-4.2)**

- Organic Sync (git hooks, staleness improvements)
- Agent Ecosystem (multi-tool support, MCP server)
- Migration Assistant (brownfield automation)

---

## 🎯 Long-Term Vision (6-12 Months)

### Advanced Features

- **AI Agent Performance Metrics**: Track before/after TMS adoption
  - Measure: hallucination rate, task completion time, file reads
  - **NOTE**: Focus on quality metrics, not token counts
  - **Effort**: 16h (research-heavy)
  - **Priority**: 🟢 P2

- **Multi-Language Support**: Templates in Spanish, French, Mandarin
  - **Effort**: 8h per language
  - **Priority**: 🟢 P2

- **TMS for Non-Code Projects**: Adapt for marketing, design, operations teams
  - **Effort**: 12h (requires research)
  - **Priority**: 🟢 P2

---

**See**: `NEXT-TASKS.md` for active sprint | `docs/archive/` for completed work

<!-- @cortex-tms-version 4.0.2 -->
