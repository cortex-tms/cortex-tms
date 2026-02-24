#!/usr/bin/env node

/**
 * Cortex TMS - Git Guardian
 *
 * Intelligent pre-commit hook that enforces Git Protocol while allowing
 * emergency flexibility. Implements the "Doors vs Walls" philosophy.
 *
 * Philosophy:
 *   - Code changes to main: WALL (hard block)
 *   - Doc changes to main: WALL (hard block)
 *   - Emergency bypass: LOGGED (audit trail)
 *
 * Usage:
 *   Called automatically by Husky pre-commit hook
 *   Bypass: BYPASS_GUARDIAN=true git commit -m "message"
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Git Guardian
 */
class GitGuardian {
  constructor() {
    this.currentBranch = null;
    this.stagedFiles = [];
    this.codeFiles = [];
    this.docFiles = [];
    this.configFiles = [];
    this.bypass = process.env.BYPASS_GUARDIAN === 'true';
    this.logPath = path.join(ROOT_DIR, '.guardian-bypass.log');
  }

  /**
   * Main execution
   */
  execute() {
    try {
      // Get current branch
      this.currentBranch = this.exec('git branch --show-current').trim();

      // If not on main, allow all commits
      if (this.currentBranch !== 'main') {
        this.success('✓ Git Guardian: Feature branch detected, proceeding');
        process.exit(0);
      }

      // Get staged files
      this.stagedFiles = this.getStagedFiles();

      // If no staged files, nothing to guard
      if (this.stagedFiles.length === 0) {
        process.exit(0);
      }

      // Categorize files
      this.categorizeFiles();

      // Check bypass
      if (this.bypass) {
        this.handleBypass();
        process.exit(0);
      }

      // Apply guardian rules
      this.applyGuardianRules();

      process.exit(0);
    } catch (error) {
      // If guardian encounters an error, fail safe (allow commit with warning)
      this.warn('⚠️  Git Guardian encountered an error, allowing commit');
      this.warn(`   Error: ${error.message}`);
      process.exit(0);
    }
  }

  /**
   * Get list of staged files
   */
  getStagedFiles() {
    const output = this.exec('git diff --cached --name-only --diff-filter=ACM').trim();
    return output ? output.split('\n').filter(f => f.length > 0) : [];
  }

  /**
   * Categorize files by type
   */
  categorizeFiles() {
    const codeExtensions = ['.ts', '.js', '.tsx', '.jsx', '.mjs', '.cjs'];
    const docExtensions = ['.md', '.txt'];
    const configExtensions = ['.json', '.yaml', '.yml', '.toml'];

    for (const file of this.stagedFiles) {
      const ext = path.extname(file).toLowerCase();

      if (codeExtensions.includes(ext)) {
        this.codeFiles.push(file);
      } else if (docExtensions.includes(ext)) {
        this.docFiles.push(file);
      } else if (configExtensions.includes(ext)) {
        // package.json, tsconfig.json, etc.
        this.configFiles.push(file);
      }
    }
  }

  /**
   * Apply guardian rules based on file types
   */
  applyGuardianRules() {
    const hasCodeOrConfig = this.codeFiles.length > 0 || this.configFiles.length > 0;
    const hasDocsOnly = this.docFiles.length > 0 && !hasCodeOrConfig;

    if (hasCodeOrConfig) {
      // WALL: Block code/config changes to main
      this.blockCodeCommit();
    } else if (hasDocsOnly) {
      // DOOR: Warn about doc changes to main
      this.warnDocCommit();
    }
  }

  /**
   * Block code/config commits to main
   */
  blockCodeCommit() {
    const affectedFiles = [...this.codeFiles, ...this.configFiles];

    console.log('');
    this.error('❌ ERROR: Direct Code Commits to main are PROHIBITED');
    console.log('');
    this.detail(`   Affected Files (${affectedFiles.length}):`);

    affectedFiles.slice(0, 5).forEach(file => {
      this.detail(`   • ${file}`);
    });

    if (affectedFiles.length > 5) {
      this.detail(`   ... and ${affectedFiles.length - 5} more`);
    }

    console.log('');
    this.info('   💡 TO FIX:');
    this.detail('   1. Create a feature branch:');
    this.detail('      git checkout -b feat/TMS-xxx-description');
    console.log('');
    this.detail('   2. Commit your changes:');
    this.detail('      git commit -m "feat(scope): [TMS-xxx] subject"');
    console.log('');
    this.detail('   3. Merge when ready:');
    this.detail('      git checkout main');
    this.detail('      git merge feat/TMS-xxx-description --no-ff');
    console.log('');
    this.warn('   ⚠️  Emergency Bypass (use with caution):');
    this.detail('      BYPASS_GUARDIAN=true git commit -m "your message"');
    this.detail('      Note: Bypass will be logged to .guardian-bypass.log');
    console.log('');

    process.exit(1);
  }

  /**
   * Block doc commits to main (same wall as code commits)
   */
  warnDocCommit() {
    console.log('');
    this.error('❌ ERROR: Direct Documentation Commits to main are PROHIBITED');
    console.log('');
    this.detail(`   Affected Files (${this.docFiles.length}):`);

    this.docFiles.slice(0, 5).forEach(file => {
      this.detail(`   • ${file}`);
    });

    if (this.docFiles.length > 5) {
      this.detail(`   ... and ${this.docFiles.length - 5} more`);
    }

    console.log('');
    this.info('   💡 TO FIX:');
    this.detail('   1. Create a branch:');
    this.detail('      git checkout -b docs/description');
    console.log('');
    this.detail('   2. Commit your changes:');
    this.detail('      git commit -m "docs(scope): subject"');
    console.log('');
    this.detail('   3. Merge when ready:');
    this.detail('      git checkout main');
    this.detail('      git merge docs/description --no-ff');
    console.log('');
    this.warn('   ⚠️  Emergency Bypass (use with caution):');
    this.detail('      BYPASS_GUARDIAN=true git commit -m "your message"');
    this.detail('      Note: Bypass will be logged to .guardian-bypass.log');
    console.log('');

    process.exit(1);
  }

  /**
   * Handle bypass scenario
   */
  handleBypass() {
    console.log('');
    this.warn('⚠️  BYPASS ACTIVATED');
    console.log('');
    this.detail('   Git Guardian bypassed via BYPASS_GUARDIAN=true');
    this.detail(`   Branch: ${this.currentBranch}`);
    this.detail(`   Files: ${this.stagedFiles.length} staged`);
    console.log('');

    // Log bypass event
    this.logBypassEvent();

    this.info('   ℹ️  Bypass logged to .guardian-bypass.log');
    this.detail('   Review bypass log during retrospectives');
    console.log('');
  }

  /**
   * Log bypass event for audit trail
   */
  logBypassEvent() {
    const timestamp = new Date().toISOString();
    const user = this.exec('git config user.name').trim() || 'unknown';
    const email = this.exec('git config user.email').trim() || 'unknown';

    const logEntry = {
      timestamp,
      user: `${user} <${email}>`,
      branch: this.currentBranch,
      files: this.stagedFiles,
      categorization: {
        code: this.codeFiles,
        docs: this.docFiles,
        config: this.configFiles,
      },
    };

    // Read existing log or create new array
    let log = [];
    if (fs.existsSync(this.logPath)) {
      try {
        const content = fs.readFileSync(this.logPath, 'utf-8');
        log = JSON.parse(content);
      } catch (error) {
        // Invalid JSON, start fresh
        log = [];
      }
    }

    // Append new entry
    log.push(logEntry);

    // Write back to log file
    fs.writeFileSync(this.logPath, JSON.stringify(log, null, 2) + '\n');
  }

  /**
   * Execute shell command
   */
  exec(command) {
    try {
      return execSync(command, {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } catch (error) {
      throw new Error(`Command failed: ${command}`);
    }
  }

  /**
   * Logging helpers
   */
  error(msg) {
    console.log(chalk.red(msg));
  }

  warn(msg) {
    console.log(chalk.yellow(msg));
  }

  info(msg) {
    console.log(chalk.blue(msg));
  }

  success(msg) {
    console.log(chalk.green(msg));
  }

  detail(msg) {
    console.log(chalk.gray(msg));
  }
}

/**
 * Main entry point
 */
function main() {
  const guardian = new GitGuardian();
  guardian.execute();
}

main();
