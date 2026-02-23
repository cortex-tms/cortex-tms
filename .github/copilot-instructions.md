# AI Pair Programmer: Collaboration Protocol (Cortex TMS v2.1.1)

## ⚡ CRITICAL RULES (ZERO TOLERANCE)

### Git Protocol (Mandatory - No Exceptions)
1. **Branch First**: ALL work MUST start on a branch using format `type/ID-description` or `type/description`
2. **Never Direct Main**: NEVER commit directly to `main` unless explicitly instructed by the user
3. **Conventional Commits**: ALL commits MUST follow `type(scope): [ID] subject` format
4. **Co-Authorship**: ALL commits MUST include `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
5. **Validate Before Commit**: Run `node bin/cortex-tms.js validate` before every commit
6. **See Full Spec**: Read `docs/core/GIT-STANDARDS.md` for complete rules

### Project Essentials
- **Project Type**: Developer tool / CLI / Boilerplate system (Cortex TMS)
- **Tech Stack**: Node.js, TypeScript, pnpm (package manager)
- **Node Version Manager**: FN (Fast Node Manager) is used
- **Package Manager**: ALWAYS use `pnpm` (never npm or yarn)
- **Conventions**: Favor simplicity and clarity in template design
- **Types**: Use TypeScript for CLI tools; templates should be framework-agnostic
- **Meta-Project**: This repo uses TMS to build TMS (dogfooding approach)

## 🏗️ Technical Map (Read Order)

AI agents MUST follow this order before proposing code:

1. `NEXT-TASKS.md` (Current sprint and immediate tasks)
2. `docs/core/DOMAIN-LOGIC.md` (TMS principles and rules)
3. `docs/core/PATTERNS.md` (Template design patterns)
4. `docs/core/GIT-STANDARDS.md` (Git & PM conventions - read before commits)
5. `docs/core/ARCHITECTURE.md` (System design)

## 🎯 Project-Specific Rules

### Template Files (`templates/`)
- Templates MUST use placeholder syntax: `[Description]`
- Templates MUST be framework-agnostic (users customize them)
- Templates MUST include inline documentation comments
- Never hardcode specific tech stacks in templates

### CLI Tool (`bin/`, `src/`)
- CLI MUST work with `npx cortex-tms init`
- CLI MUST detect existing project structure
- CLI MUST ask before overwriting files
- CLI output MUST be friendly and clear

### Documentation (`docs/`)
- Docs MUST follow the TMS Tier system (HOT/WARM/COLD)
- Examples MUST be real (not theoretical)
- Guides MUST be tested on actual projects

## 🔧 Development Protocol

1. **Plan before code** — Every feature starts with a written plan. No code before user approval.
2. **Stand behind technical decisions** — Back opinions with evidence. No backtracking without a concrete technical reason.
3. **Research before guessing** — If unsure, read the codebase first. Don't speculate.

## 🚫 Prohibitions

- Never use `npm` commands (use `pnpm` exclusively)
- Never create templates with hardcoded tech stacks
- Never implement features not listed in `NEXT-TASKS.md` without asking
- Never skip the "dogfooding" validation step
- **Never over-engineer beyond explicit user request** (see Scope Discipline below)

## 🎯 Scope Discipline

**Philosophy**: Preserve comprehensive thinking, add clarification checkpoints.

**BEFORE starting work, match output to request scale:**
- "improve a bit" / "check X" = 1-3 focused changes
- "enhance X and Y" = 5-10 improvements for X and Y only
- "redesign" / "comprehensive" = Multi-phase planning allowed

**If scope unclear, ASK FIRST:**
- "Just [specific request] or also [related areas]?"
- "Simple version or detailed strategy?"

**Propose, don't assume:**
- Start with minimal solution
- Mention expansion opportunities: "I also see X, Y - want those?"
- Let user pull more, don't push everything

**Anti-pattern examples:**
- ❌ User asks for homepage improvements → You create full site redesign + marketing strategy
- ❌ User says "simple plan" → You write 4 versions totaling 80KB
- ✅ User asks for homepage improvements → You list 5 specific changes, ask if they want details

## ✔️ Pre-Submission Checklist

- [ ] Logic verified against `docs/core/DOMAIN-LOGIC.md`
- [ ] Templates tested by copying to a sample project
- [ ] CLI commands use `pnpm` (not npm)
- [ ] Documentation updated in `docs/core/`
- [ ] Changes follow patterns in `docs/core/PATTERNS.md`

## 🧹 Post-Task Protocol

After completing a task, follow the **Maintenance Protocol** in `CLAUDE.md`:
1. Archive completed tasks
2. Update source of truth (Truth Syncing)
3. Suggest next priority (if < 3 tasks)
4. Follow Git & commit standards

**Exception**: Small tasks (typos, formatting) only require git commit.

**Git Standards**:
- Format: `type(scope): [ID] subject`
- Add co-authorship: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
- See: `docs/core/GIT-STANDARDS.md`
