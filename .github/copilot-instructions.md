# AI Pair Programmer: Collaboration Protocol (Cortex TMS v2.0)

## ⚡ Critical Rules (Always Apply)

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
4. `docs/core/ARCHITECTURE.md` (System design)

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

## 🚫 Prohibitions

- Never use `npm` commands (use `pnpm` exclusively)
- Never create templates with hardcoded tech stacks
- Never implement features not listed in `NEXT-TASKS.md` without asking
- Never skip the "dogfooding" validation step

## ✔️ Pre-Submission Checklist

- [ ] Logic verified against `docs/core/DOMAIN-LOGIC.md`
- [ ] Templates tested by copying to a sample project
- [ ] CLI commands use `pnpm` (not npm)
- [ ] Documentation updated in `docs/core/`
- [ ] Changes follow patterns in `docs/core/PATTERNS.md`

## 🧹 Post-Task Protocol (Maintenance Loop)

After completing a task, the AI MUST execute these steps in order:

### Step 1: Verify Archive-Ready
- [ ] Tests passing (if applicable)
- [ ] Changes committed to git
- [ ] Documentation updated (Truth Syncing complete)

### Step 2: Update Source of Truth (Truth Syncing)

Before archiving, update the relevant documentation:

| What Changed | Update This File | Section |
|:-------------|:----------------|:--------|
| Milestone reached | `README.md` | Current Phase |
| Architecture change | `docs/core/ARCHITECTURE.md` | Relevant section |
| Rule change | `docs/core/DOMAIN-LOGIC.md` | Specific rule |
| New pattern | `docs/core/PATTERNS.md` | Add pattern entry |
| New decision | `docs/core/DECISIONS.md` | Add ADR |
| Tech stack change | `docs/core/ARCHITECTURE.md` | Tech decisions |

### Step 3: Archive Completed Task
- Move task from `NEXT-TASKS.md` to `docs/archive/sprint-YYYY-MM.md`
- Include completion date and outcome summary
- Reference which docs were updated (Truth Syncing)

### Step 4: Suggest Next Priority (If Applicable)
- If `NEXT-TASKS.md` has < 3 active tasks, ask user:
  > "Sprint is light (X tasks remaining). Should I promote tasks from FUTURE-ENHANCEMENTS.md?"
- Wait for user approval before promoting

**Critical Rule**: Never archive a task without completing Truth Syncing first. Outdated documentation is worse than no documentation.
