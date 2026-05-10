# NEXT: v4.2 Sprint — MCP Server

**Last Updated**: 2026-05-10
**Status**: 🔜 Planning — MCP Server
**Current Version**: 4.1.0 (published 2026-05-10)

Sprint archive: `docs/archive/v4.1-sprint.md`

---

## ✅ Shipped in v4.1

- ~~Git hooks integration (`cortex-tms hooks install`)~~ ✅
- ~~AGENTS.md template (multi-agent governance source-of-truth)~~ ✅
- ~~Governance Packs (`cortex-tms init --preset node`)~~ ✅

---

## 🔜 Next: MCP Server (P0)

Expose project governance rules, patterns, decisions, and staleness status
through the Model Context Protocol — making Cortex TMS runtime infrastructure
rather than a setup-only tool.

> No tasks defined yet — validate Governance Packs with real users first,
> then plan MCP on top of proven content.

**Prerequisite**: Recruit 5 real users across ecosystems. Observe where they
edit, hesitate, or abandon after `init --preset node`. That feedback informs
both Python/Go packs and MCP content priorities.

## 🗺️ Roadmap: v4.2+

- MCP Server — expose governance to any AI tool at runtime
- Python governance pack (`--preset python`)
- Go governance pack (`--preset go`)
- Claude Code skills scaffolding (`/cortex-validate`, `/cortex-review`)

> Note: AGENTS.md (governance config) and Skills (runtime shortcuts) are distinct concepts.

---

<!-- @cortex-tms-version 4.1.0 -->
