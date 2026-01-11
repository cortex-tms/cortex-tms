# Architecture Decisions (ADR)

This document records key architectural decisions made during Cortex TMS development.

---

## [2026-01-11] - Node.js CLI Tool (Not Shell Script)

**Context**: We needed a way to distribute and initialize Cortex TMS templates. Options were:
1. Simple shell script (`init-cortex.sh`)
2. Node.js CLI tool (`npx cortex-tms init`)
3. VS Code extension

**Decision**: Build a Node.js CLI tool as the primary distribution method.

**Reasoning**:
- **Universal**: Works on Windows, Mac, Linux (shell scripts are Unix-only)
- **Interactive**: Can use inquirer.js for rich prompts and customization
- **Logic**: Can detect existing project structure (package.json, git repo)
- **Familiar**: JavaScript/TypeScript developers are the primary audience
- **NPM ecosystem**: Publish to npm, users install with `npx` (no global install required)

**Trade-offs**:
- Requires Node.js runtime (acceptable for our audience)
- More complex than a shell script (but provides better UX)

---

## [2026-01-11] - Dual Distribution (NPM + GitHub Template)

**Context**: Users have two primary use cases:
1. **Greenfield**: Starting a new project from scratch
2. **Brownfield**: Adding TMS to an existing project

**Decision**: Support both via dual distribution:
- **GitHub Template Repository**: "Use this template" button for new projects
- **NPM Package**: `npx cortex-tms init` for existing projects

**Reasoning**:
- GitHub templates are ideal for greenfield (clone → start coding)
- NPM CLI is ideal for brownfield (detect existing structure → merge templates)
- Covering both scenarios maximizes adoption
- No single method handles both cases well

**Implementation**:
- Primary repo serves as GitHub template
- Same repo contains CLI tool in `bin/` directory
- CLI tool copies from `templates/` directory

---

## [2026-01-11] - pnpm as Standard Package Manager

**Context**: Project needs a package manager. Options: npm, yarn, pnpm, bun.

**Decision**: Use pnpm exclusively. Document it in all templates.

**Reasoning**:
- **Performance**: Faster installs than npm/yarn
- **Disk efficiency**: Symlinks to global store (saves disk space)
- **Strict**: Better dependency management than npm
- **Developer preference**: Project maintainer uses FN (Fast Node Manager) + pnpm

**User Impact**:
- Templates reference `pnpm` in commands
- CLI tool can detect user's package manager and adapt
- Not mandatory for end users (they can use npm if they want)

---

## [2026-01-11] - Framework-Agnostic Templates

**Context**: Users may build projects with:
- Next.js, React, Vue, Svelte (frontend)
- Express, Fastify, NestJS (backend)
- CLI tools (no framework)

**Decision**: Templates use placeholder syntax `[Description]` instead of hardcoding tech stacks.

**Reasoning**:
- TMS is a **structural pattern**, not a framework
- Hardcoding "Next.js" in templates limits adoption
- Placeholders make templates universally applicable
- Example projects can show specific implementations

**Exception**:
- `examples/` directory contains real implementations with specific tech stacks
- This provides both flexibility (templates) and guidance (examples)

---

## [2026-01-11] - Dogfooding Approach to Development

**Context**: We needed to validate that the TMS structure actually works.

**Decision**: Use Cortex TMS to build Cortex TMS itself.

**Reasoning**:
- **Real-world testing**: If the structure doesn't work for Cortex, it won't work for users
- **AI validation**: We test docs with Claude Code during development
- **Credibility**: "We use it ourselves" is more persuasive than "trust us"
- **Rapid iteration**: We discover issues immediately

**Impact**:
- Cortex's `NEXT-TASKS.md` tracks Cortex development
- Cortex's `docs/core/PATTERNS.md` documents template patterns
- Cortex's `.github/copilot-instructions.md` enforces TMS rules

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

## [2026-01-11] - Modular Template Selection

**Context**: Not all projects need all templates. For example:
- CLI tools don't need `SCHEMA.md` (no database)
- Simple libraries don't need `TROUBLESHOOTING.md`

**Decision**: CLI tool will prompt users to select which templates they need.

**Reasoning**:
- Flexibility over opinionation
- Reduces clutter in user projects
- Core templates (NEXT-TASKS, copilot-instructions) are mandatory
- Optional templates (SCHEMA, TROUBLESHOOTING) are selectable

**Future Implementation**:
```bash
? Which core docs do you need?
  ◉ ARCHITECTURE.md (Recommended)
  ◉ PATTERNS.md (Recommended)
  ◉ DOMAIN-LOGIC.md (Recommended)
  ◯ SCHEMA.md (For data-heavy apps)
  ◯ TROUBLESHOOTING.md (For framework gotchas)
```

---

## [2026-01-11] - Example Project: Next.js 15 + Shadcn

**Context**: We need a reference implementation to demonstrate TMS in action.

**Decision**: Build `examples/todo-app/` using:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Shadcn UI components

**Reasoning**:
- **AI agent sweet spot**: Claude Code, Copilot, and Cursor are highly optimized for this stack
- **Modern**: Represents current best practices (2026)
- **Popular**: Large audience using this stack
- **Demonstrable**: UI components provide visual validation of patterns

**Alternative stacks considered**:
- Vue 3 + Nuxt (smaller audience)
- Svelte + SvelteKit (less AI training data)
- Express API (no visual component)

**Outcome**: We can build this app using Claude Code while documenting patterns in real-time.

---

## [2026-01-11] - TypeScript for CLI, Markdown for Templates

**Context**: We needed to choose languages for:
1. CLI tool
2. Template files

**Decision**:
- CLI tool: **TypeScript** (compiled to JavaScript)
- Templates: **Markdown** (with placeholders)

**Reasoning**:

**TypeScript for CLI**:
- Type safety for file operations (reduces bugs)
- Better IDE support
- Compiles to Node.js-compatible JavaScript

**Markdown for Templates**:
- Universal format (readable by humans and AI agents)
- No runtime dependencies
- Easy to version control
- AI agents are trained on markdown documentation

**Alternative considered**: JSON or YAML for templates (rejected: less human-readable)

---

## [2026-01-11] - Strict Line Limits on HOT Files

**Context**: AI agents have limited context windows. Reading 1000-line files wastes tokens.

**Decision**: Enforce strict line limits on HOT tier files:
- `NEXT-TASKS.md`: 200 lines max
- `.github/copilot-instructions.md`: 100 lines max
- `docs/core/PATTERNS.md`: 500 lines max

**Reasoning**:
- **Performance**: Smaller files = faster AI comprehension
- **Focus**: Forces teams to prioritize what matters NOW
- **Archival**: Encourages moving completed work to `docs/archive/`

**Enforcement**:
- Manual (for now): Reviewers check file sizes
- Future: CLI validation tool or GitHub Action

**Trade-offs**:
- Requires discipline to archive aggressively
- Teams may resist at first (feels like "losing history")

---

## [2026-01-11] - Architecture Decision Record Format

**Context**: We needed a standard format for documenting decisions.

**Decision**: Use the ADR format shown in this file:
- **Date**: When the decision was made
- **Context**: What problem we were solving
- **Decision**: What we chose
- **Reasoning**: Why we chose it
- **Trade-offs** (optional): What we gave up

**Reasoning**:
- Lightweight (doesn't require special tools)
- Chronological (easy to see evolution of decisions)
- Justification-focused (helps future contributors understand "why")

**Reference**: Inspired by Michael Nygard's ADR format (https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

---

## Decision Log Summary

| Date | Decision | Status |
|:-----|:---------|:-------|
| 2026-01-11 | Node.js CLI Tool | ✅ Active |
| 2026-01-11 | Dual Distribution (NPM + GitHub) | ✅ Active |
| 2026-01-11 | pnpm as Standard | ✅ Active |
| 2026-01-11 | Framework-Agnostic Templates | ✅ Active |
| 2026-01-11 | Dogfooding Approach | ✅ Active |
| 2026-01-11 | Modular Template Selection | 🔜 Planned |
| 2026-01-11 | Next.js 15 + Shadcn Example | 🔜 Planned |
| 2026-01-11 | TypeScript for CLI | ✅ Active |
| 2026-01-11 | Strict Line Limits | ✅ Active |
| 2026-01-11 | ADR Format | ✅ Active |
