# Start Here: 5-Minute Quick Start

**Goal**: Get productive with Cortex TMS in 5 minutes

---

## The Golden Path (Recommended for 90% of users)

### Step 1: Initialize (30 seconds)

```bash
cortex-tms init --scope standard
```

This creates 9 documentation files in your project.

### Step 2: Validate (30 seconds)

```bash
cortex-tms validate
```

This checks your setup. You'll see some warnings about placeholders - that's normal.

### Step 3: Start AI session (2 minutes)

```bash
cortex-tms prompt init-session
```

Copy the output and paste it into:
- Claude Code (opens automatically)
- Cursor AI (Cmd+L / Ctrl+L)
- GitHub Copilot Chat

Your AI will now focus on the HOT tier (active sprint + patterns) instead of trying to read your entire codebase at once.

### Step 4: See your savings (30 seconds)

```bash
cortex-tms status
```

Look for the "💰 Context Savings (Estimate)" section - this shows how much context you're saving.

### Step 5: Code! (rest of your day)

Use your AI tool normally. It now has:
- ✅ Focused context around your HOT tier
- ✅ Your active sprint tasks
- ✅ Your code patterns
- ✅ No archived files or noise

---

## What's Next?

- **Fill placeholders**: Run `cortex-tms validate` and fix warnings
- **Update tasks**: Edit NEXT-TASKS.md with your actual sprint
- **Customize patterns**: Edit docs/core/PATTERNS.md
- **Learn more**: https://cortex-tms.org

---

## Other Paths (Advanced)

- **Existing project**: See [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)
- **Custom setup**: See CLI-USAGE.md for all options
- **Team setup**: See BEST-PRACTICES.md for team workflows

---

**Questions?** Open a [GitHub Discussion](https://github.com/cortex-tms/cortex-tms/discussions)
