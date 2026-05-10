# Git & Project Management Standards

**Rule**: All commits, branches, and PRs must follow conventional engineering standards to maintain professional Git history and traceability.

---

## ✅ Branch Naming

**Format**: `[type]/[ID]-[description]`

**Types**:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code restructuring
- `chore/` - Maintenance tasks
- `test/` - Test additions/fixes

**ID (Optional)**:
- `[#123]` - GitHub Issue
- `[PROJ-123]` - Jira ticket
- `[LIN-123]` - Linear issue
- No ID if internal task

**Examples**:
```bash
✅ feat/TMS-42-cli-init-command
✅ fix/123-schema-validation
✅ docs/update-readme
✅ refactor/improve-error-handling
```

**Monorepo Variant**:
```bash
feat/[scope]-[ID]-[description]

Examples:
feat/cli-TMS-42-init
fix/docs-123-typo
```

---

## ✅ Conventional Commits

**Format**: `[type]([scope]): [ID] [subject]`

**Structure**:
- **type**: feat, fix, docs, style, refactor, test, chore
- **scope** (optional): Component/module affected
- **ID** (optional): Reference to ticket/issue
- **subject**: Imperative, present tense, max 50 chars

**Examples**:
```
✅ feat(cli): [TMS-42] add confirmation prompt for overwrites
✅ fix: [#101] handle null timestamps in schema
✅ docs: update installation instructions
✅ refactor(core): simplify validation logic
✅ chore: update dependencies
```

**Validation Pattern**:
```regex
^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: (\[.+\] )?(.{1,50})$
```

---

## ✅ Commit Body (For Complex Changes)

**Format**:
```
[type]([scope]): [ID] [subject]

[Body explaining WHAT changed and WHY]

[Footer with references]
```

**Example**:
```
feat(cli): [TMS-42] add safe file merge logic

Implement confirmation prompts before overwriting existing files.
Users can now choose: overwrite, skip, or merge for each conflict.

Fixes #42
Closes TMS-42
```

---

## ✅ Task Reference Linking

**In NEXT-TASKS.md**, add Ref column:

```markdown
| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :--- | :--- | :----- |
| Implement CLI init | [#101] | 4h | 🔴 HIGH | ⬜ Todo |
| Fix schema validation | [TMS-22] | 2h | 🟡 MED | ⬜ Todo |
| Update README | - | 1h | 🟢 LOW | ⬜ Todo |
```

**Convention**:
- `[#123]` = GitHub Issue
- `[PROJ-123]` = Jira/other PM tool
- `-` = No external reference (internal task)

---

## ✅ Pull Request Template

**Location**: `.github/PULL_REQUEST_TEMPLATE.md`

**Structure**:
```markdown
## 📝 Summary
[Brief description of changes]

## 🔗 Related References
- Fixes #[Issue ID]
- Related: [Jira/Linear ID]

## 📊 Changes
- [What was added/changed/removed]

## ✅ TMS Maintenance Checklist
- [ ] Task moved from `NEXT-TASKS.md` to `docs/archive/`
- [ ] `docs/core/` updated (Truth Syncing)
- [ ] Tests passing
- [ ] Documentation updated

## 🧪 Testing
[How to test these changes]
```

---

## ❌ Anti-Patterns

```bash
# ❌ Bad: Vague commits
git commit -m "update files"
git commit -m "fix bug"
git commit -m "changes"

# ❌ Bad: No type prefix
git commit -m "add new feature"

# ❌ Bad: Past tense
git commit -m "feat: added CLI init"

# ❌ Bad: Too long
git commit -m "feat: this is a very long commit message that exceeds the fifty character limit and is hard to read"
```

**Why it fails**: Vague history makes debugging impossible. Can't generate changelogs. Can't trace requirements.

---

## ✅ When to Branch vs Direct Commit

**Direct to Main** (allowed):
- Single developer projects
- Documentation-only changes
- Hotfixes (no CI/CD)
- Current Cortex TMS (Phase 1-2)

**Branch Required**:
- Multi-developer teams
- Production deployments
- Changes requiring review
- Experimental features

**AI Agent Rule**: If unsure, create a branch. Better safe than sorry.

---

## ✅ Branch Cleanup (Clean Trunk Policy)

**Rule**: Delete feature branches immediately after merging to maintain a "clean trunk."

**Why**: Merged branches are **Historical Noise**. The code is in `main`, the history is in the merge commit. Keeping stale branches wastes context and confuses AI agents.

### Automatic Cleanup (GitHub)

Enable "Automatically delete head branches" in repository settings:
- Navigate to: `Settings → General → Pull Requests`
- Check: ✅ "Automatically delete head branches"

### Manual Cleanup (Local)

After merging a PR:

```bash
# 1. Switch to main
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Delete the merged branch
git branch -d <feature-branch-name>

# Example:
git branch -d feat/TMS-221-custom-selection
```

**Safe Delete**: The `-d` flag only deletes if the branch is fully merged. Use `-D` (force delete) only if you're certain.

### Cleanup All Merged Branches

```bash
# List branches merged into main
git branch --merged main

# Delete all merged branches (except main)
git branch --merged main | grep -v "^\* main" | xargs -n 1 git branch -d
```

### AI Agent Protocol

When completing a task that involved a branch:
1. Merge to main (via PR or direct merge)
2. Immediately delete the local branch
3. Verify with `git branch` (should only show `main` and active branches)

**Exception**: Only keep branches that represent **Active Work**.

---

## ✅ Changelog Generation (Future)

With conventional commits, changelogs can be auto-generated:

```bash
# Extract all feat commits since last tag
git log v1.0.0..HEAD --grep="^feat" --oneline

# Output:
feat(cli): [TMS-42] add init command
feat(docs): [TMS-43] add quick start guide
```

**Tools**: conventional-changelog, semantic-release

---

## ✅ Co-Authorship

When AI assists with commits, use:

```
feat(cli): [TMS-42] add init command

Implemented interactive prompts for project setup.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Why**: Gives credit, tracks AI contribution, maintains transparency.

---

## 🔗 Validation Checklist

Before committing, verify:

- [ ] Branch name follows `type/ID-description` format
- [ ] Commit message follows conventional format
- [ ] Commit subject < 50 characters
- [ ] Imperative mood (add, not added)
- [ ] Reference ID included (if external task)
- [ ] Co-authorship added (if AI-assisted)

Before opening PR:

- [ ] PR title matches commit format
- [ ] PR description includes references
- [ ] TMS Maintenance Checklist complete
- [ ] Testing instructions provided

---

**References**:
- **Conventional Commits Spec**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/
- **Co-Authorship**: Git documentation on multiple authors

<!-- @cortex-tms-version 4.1.0 -->
