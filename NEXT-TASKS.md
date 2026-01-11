# NEXT: Upcoming Tasks

## Active Sprint: Foundation - Build Cortex TMS v2.0 Boilerplate

**Why this matters**: Transform Cortex TMS from concept to production-ready developer tool that can be used to bootstrap AI-optimized projects. Using the "dogfooding" approach, we'll validate the TMS structure by using it to build itself.

| Task | Effort | Priority | Status |
| :--- | :----- | :------- | :----- |
| **Phase 1: Dogfood the System** - Apply TMS to Cortex itself | 2h | 🔴 HIGH | ✅ In Progress |
| **Phase 2: Complete Template Library** - Fill all template files with real content | 4h | 🔴 HIGH | ⬜ Todo |
| **Phase 3: Build Example App** - Next.js 15 + Shadcn todo app | 6h | 🔴 HIGH | ⬜ Todo |
| **Phase 4: Create CLI Tool** - Node.js CLI for `npx cortex-tms init` | 4h | 🟡 MED | ⬜ Todo |
| **Phase 5: Documentation** - Quick Start, Migration Guide, Best Practices | 3h | 🟡 MED | ⬜ Todo |
| **Phase 6: Distribution** - GitHub Template + NPM Package | 2h | 🟢 LOW | ⬜ Todo |

---

## 📋 Current Focus: Phase 1 - Dogfooding

### Immediate Tasks (This Session)
- [x] Update `NEXT-TASKS.md` with implementation plan
- [ ] Update `.github/copilot-instructions.md` with Cortex-specific rules
- [ ] Update `CLAUDE.md` with pnpm commands
- [ ] Create `docs/core/ARCHITECTURE.md` for Cortex TMS
- [ ] Update `docs/core/DOMAIN-LOGIC.md` with TMS principles
- [ ] Update `docs/core/PATTERNS.md` with template patterns
- [ ] Update `docs/core/DECISIONS.md` with ADRs (Node.js CLI, GitHub Template)
- [ ] Create `FUTURE-ENHANCEMENTS.md`
- [ ] Update `README.md` to reflect current state

---

## 🎯 Definition of Done (Phase 1)

- [ ] All `docs/core/` files populated with Cortex TMS-specific content
- [ ] `.github/copilot-instructions.md` reflects actual tech stack (Node.js, pnpm)
- [ ] `CLAUDE.md` uses pnpm commands exclusively
- [ ] `NEXT-TASKS.md` tracks actual development progress
- [ ] System is "ready" for AI agents to work on Phase 2

---

## 🚀 Next Sprint Preview: Phase 2 - Template Library

Once Phase 1 completes, we'll:
1. Complete all `templates/docs/core/*.md` files with comprehensive examples
2. Add missing `templates/FUTURE-ENHANCEMENTS.md`
3. Add missing `templates/README.md` (project-specific)
4. Test templates by copying them into a sample project
