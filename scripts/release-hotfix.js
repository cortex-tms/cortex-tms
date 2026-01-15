#!/usr/bin/env node

/**
 * Cortex TMS - Emergency Hotfix Path
 *
 * Quick commit workflow for emergency documentation fixes on main branch.
 * Uses Git Guardian bypass internally for streamlined UX.
 *
 * Philosophy:
 *   - For urgent doc fixes that can't wait for full release cycle
 *   - Validates docs-only commits (safety check)
 *   - Commits directly to main using BYPASS_GUARDIAN
 *   - Logs to audit trail for retrospectives
 *
 * Usage:
 *   pnpm run release:hotfix --message "fix: typo in README"
 *   pnpm run release:hotfix -m "docs: update installation steps" --push
 *
 * Use Cases:
 *   - Critical typo in published docs
 *   - Broken link in README
 *   - Urgent clarification needed
 *   - Post-release documentation updates
 */

import { execSync } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// ANSI color helpers
const log = {
  info: (msg) => console.log(chalk.blue(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  error: (msg) => console.log(chalk.red(msg)),
  step: (msg) => console.log(chalk.cyan(`\n${msg}`)),
  detail: (msg) => console.log(chalk.gray(`  ${msg}`)),
};

/**
 * Emergency Hotfix Handler
 */
class HotfixPath {
  constructor(options = {}) {
    this.message = options.message || '';
    this.push = options.push || false;
    this.projectRoot = ROOT_DIR;
  }

  /**
   * Main execution
   */
  execute() {
    try {
      log.step('🚑 Cortex TMS - Emergency Hotfix Path\n');

      // Validation
      this.validateMessage();
      this.validateBranch();
      this.validateStagedFiles();
      this.validateDocsOnly();

      // Execute hotfix
      this.commitChanges();

      if (this.push) {
        this.pushToRemote();
      }

      // Success
      log.step('✅ Hotfix Complete!\n');
      log.success('Emergency documentation fix committed');
      log.detail('Changes committed directly to main branch');
      log.detail('Bypass logged to .guardian-bypass.log for retrospective');

      if (this.push) {
        log.detail('Changes pushed to origin/main');
      } else {
        log.warn('Changes NOT pushed (use --push to push automatically)');
      }

      console.log('');

    } catch (error) {
      log.step('❌ Hotfix Failed\n');
      log.error(error.message);
      console.log('');
      process.exit(1);
    }
  }

  /**
   * Validate commit message provided
   */
  validateMessage() {
    if (!this.message) {
      throw new Error('Commit message required. Use --message or -m flag');
    }

    log.detail(`Message: ${this.message}`);
  }

  /**
   * Validate we're on main branch
   */
  validateBranch() {
    const branch = this.exec('git branch --show-current').trim();

    if (branch !== 'main') {
      throw new Error(`Must be on main branch (currently on: ${branch})`);
    }

    log.detail('✓ On main branch');
  }

  /**
   * Validate there are staged changes
   */
  validateStagedFiles() {
    const staged = this.exec('git diff --cached --name-only').trim();

    if (!staged) {
      throw new Error('No staged changes found. Stage files with: git add <files>');
    }

    const files = staged.split('\n').filter(f => f.length > 0);
    log.detail(`✓ ${files.length} file(s) staged`);

    this.stagedFiles = files;
  }

  /**
   * Validate staged changes are docs-only (safety check)
   */
  validateDocsOnly() {
    const docExtensions = ['.md', '.txt'];
    const codeExtensions = ['.ts', '.js', '.tsx', '.jsx', '.mjs', '.cjs', '.json', '.yaml', '.yml'];

    const nonDocFiles = this.stagedFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return !docExtensions.includes(ext);
    });

    if (nonDocFiles.length > 0) {
      const codeFiles = nonDocFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return codeExtensions.includes(ext);
      });

      if (codeFiles.length > 0) {
        log.warn('\n⚠️  WARNING: Non-documentation files detected:');
        codeFiles.slice(0, 5).forEach(file => log.detail(`  • ${file}`));

        if (codeFiles.length > 5) {
          log.detail(`  ... and ${codeFiles.length - 5} more`);
        }

        throw new Error(
          'Hotfix path is for DOCS ONLY. For code changes, use feature branch workflow.'
        );
      }

      // Allow other file types (images, configs) with warning
      log.warn('\n⚠️  Non-markdown files detected (allowed):');
      nonDocFiles.slice(0, 3).forEach(file => log.detail(`  • ${file}`));
      log.detail('');
    }

    log.detail('✓ Documentation-only changes');
  }

  /**
   * Commit changes using BYPASS_GUARDIAN
   */
  commitChanges() {
    log.step('📝 Committing Changes');

    try {
      // Set BYPASS_GUARDIAN environment variable
      const env = { ...process.env, BYPASS_GUARDIAN: 'true' };

      execSync(`git commit -m "${this.message.replace(/"/g, '\\"')}"`, {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        stdio: 'inherit',
        env,
      });

      log.success('✓ Changes committed');
    } catch (error) {
      throw new Error('Git commit failed');
    }
  }

  /**
   * Push to remote
   */
  pushToRemote() {
    log.step('🚀 Pushing to Remote');

    try {
      this.exec('git push origin main');
      log.success('✓ Pushed to origin/main');
    } catch (error) {
      throw new Error('Git push failed. Push manually with: git push origin main');
    }
  }

  /**
   * Execute shell command
   */
  exec(command) {
    try {
      return execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } catch (error) {
      throw new Error(`Command failed: ${command}`);
    }
  }
}

/**
 * CLI Entry Point
 */
function main() {
  const args = process.argv.slice(2);

  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Cortex TMS - Emergency Hotfix Path

Quick commit workflow for urgent documentation fixes on main branch.

Usage:
  pnpm run release:hotfix --message "commit message"
  pnpm run release:hotfix -m "commit message" --push

Options:
  --message, -m    Commit message (required)
  --push          Push to origin/main after commit (optional)
  --help, -h      Show this help message

Examples:
  pnpm run release:hotfix -m "docs: fix typo in README"
  pnpm run release:hotfix -m "docs: update install steps" --push

Safety Features:
  - Validates main branch
  - Validates docs-only changes (blocks code files)
  - Uses BYPASS_GUARDIAN internally (logged to audit trail)
  - Requires staged changes

When to Use:
  ✓ Critical typo in published documentation
  ✓ Broken link that needs immediate fix
  ✓ Post-release documentation clarification
  ✗ Code changes (use feature branch workflow)
  ✗ Version bumps (use full release process)

Best Practice:
  For non-urgent changes, use feature branches:
  → git checkout -b docs/fix-description
  → git commit -m "docs: fix description"
  → git checkout main && git merge docs/fix-description --no-ff
`);
    process.exit(0);
  }

  // Parse arguments
  let message = '';
  let push = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--message' || arg === '-m') {
      message = args[i + 1] || '';
      i++; // Skip next arg
    } else if (arg === '--push') {
      push = true;
    }
  }

  // Execute hotfix
  const hotfix = new HotfixPath({ message, push });
  hotfix.execute();
}

main();
