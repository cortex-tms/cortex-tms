# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands (Cortex TMS Project)

- **Install dependencies**: `pnpm install`
- **Test**: `pnpm test`
- **Lint**: `pnpm run lint`
- **Build**: `pnpm run build`
- **CLI Development**: `pnpm run dev` (watch mode)

**IMPORTANT**: This project uses `pnpm` exclusively. Never use `npm` or `yarn`.

## 🛠 Operational Loop

1. Read `NEXT-TASKS.md` to understand the current objective and sprint.
2. Cross-reference `docs/core/PATTERNS.md` for template design patterns.
3. If unsure of TMS terminology, check `docs/core/GLOSSARY.md`.
4. Before implementing, check `docs/core/DOMAIN-LOGIC.md` for TMS principles.
5. Test templates by copying them to a sample project (dogfooding).

## 🧪 Development Workflow

1. **Template Changes**: Always validate templates work in isolation
2. **CLI Changes**: Test with `npx . init` in a sample directory
3. **Documentation**: Update relevant `docs/core/` files immediately
4. **Commit**: Only commit when tests pass and templates are validated
