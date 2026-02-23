/**
 * Cortex TMS CLI - Hooks Command
 *
 * Manages git hook integration for automatic documentation validation.
 * Installs a pre-commit hook that runs `cortex-tms validate` before every commit.
 */

import { Command } from "commander";
import chalk from "chalk";
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { hasConfig } from "../utils/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Marker comment used to identify hooks managed by cortex-tms
 */
const HOOK_MARKER = "# cortex-tms-hook";

/**
 * Read the current cortex-tms version from package.json
 */
function getCliVersion(): string {
  const packageJsonPath = join(__dirname, "../../package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

/**
 * Resolve the git hooks directory using git rev-parse.
 * Handles worktrees and core.hooksPath correctly.
 * Returns null if not in a git repo.
 */
function getGitHooksDir(cwd: string): string | null {
  try {
    const hooksPath = execSync("git rev-parse --git-path hooks", {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();

    // git rev-parse --git-path returns a relative path; resolve it
    return join(cwd, hooksPath);
  } catch {
    return null;
  }
}

/**
 * Check if a hook file exists and whether it belongs to us
 */
function getHookStatus(hookPath: string): {
  exists: boolean;
  isOurs: boolean;
  content: string | null;
} {
  if (!existsSync(hookPath)) {
    return { exists: false, isOurs: false, content: null };
  }

  const content = readFileSync(hookPath, "utf-8");
  return {
    exists: true,
    isOurs: content.includes(HOOK_MARKER),
    content,
  };
}

/**
 * Generate the pre-commit hook script.
 *
 * The script cd's to the repo root FIRST (resolved at runtime via git),
 * then resolves the binary. This ensures ./node_modules/.bin lookups
 * work regardless of where git invokes the hook from (e.g. .git/hooks,
 * .husky/_, or a custom core.hooksPath).
 */
function generateHookScript(options: {
  strict: boolean;
  skipStaleness: boolean;
  version: string;
}): string {
  const { strict, skipStaleness, version } = options;

  // Build validate flags
  const flags: string[] = [];
  if (strict) flags.push("--strict");
  if (skipStaleness) flags.push("--skip-staleness");
  const flagStr = flags.length > 0 ? " " + flags.join(" ") : "";

  return `#!/bin/sh
${HOOK_MARKER}
# Installed by cortex-tms v${version}
# Auto-validates documentation health before each commit.
# To reconfigure: cortex-tms hooks install [--strict] [--skip-staleness]
# To remove:      cortex-tms hooks uninstall

set -e

# Change to repo root first so node_modules/.bin resolves correctly
cd "$(git rev-parse --show-toplevel)"

# Resolve cortex-tms binary (local install > global > npx fallback)
if [ -x "./node_modules/.bin/cortex-tms" ]; then
  ./node_modules/.bin/cortex-tms validate${flagStr}
elif command -v cortex-tms >/dev/null 2>&1; then
  cortex-tms validate${flagStr}
else
  npx --yes cortex-tms@${version} validate${flagStr}
fi
`;
}

/**
 * Install subcommand
 */
function runInstall(cwd: string, options: {
  strict?: boolean;
  skipStaleness?: boolean;
  cortexVersion?: string;
}): void {
  // 1. Check for .cortexrc
  if (!hasConfig(cwd)) {
    console.error(
      chalk.red("\n❌ No .cortexrc found."),
      chalk.gray("\nRun"),
      chalk.cyan("cortex-tms init"),
      chalk.gray("first to set up your project.\n"),
    );
    process.exitCode = 1;
    return;
  }

  // 2. Resolve git hooks directory
  const hooksDir = getGitHooksDir(cwd);
  if (!hooksDir) {
    console.error(chalk.red("\n❌ Not a git repository.\n"));
    process.exitCode = 1;
    return;
  }

  const hookPath = join(hooksDir, "pre-commit");

  // 3. Check for foreign hooks
  const status = getHookStatus(hookPath);
  if (status.exists && !status.isOurs) {
    console.error(
      chalk.red("\n❌ A pre-commit hook already exists that wasn't installed by cortex-tms."),
      chalk.gray("\nBack up or remove"),
      chalk.cyan(hookPath),
      chalk.gray("and try again.\n"),
    );
    process.exitCode = 1;
    return;
  }

  // 4. Determine version
  const version = options.cortexVersion || getCliVersion();

  // 5. Generate and write hook
  const script = generateHookScript({
    strict: options.strict || false,
    skipStaleness: options.skipStaleness || false,
    version,
  });

  // Ensure hooks directory exists (it may not in a fresh repo)
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }

  writeFileSync(hookPath, script, { mode: 0o755 });

  // Build mode description
  const mode = options.strict ? "strict" : "default";
  const extras: string[] = [];
  if (options.skipStaleness) extras.push("staleness checks skipped");

  console.log(chalk.green(`\n✅ Pre-commit hook installed!`));
  console.log(chalk.gray(`   Path:    ${hookPath}`));
  console.log(chalk.gray(`   Mode:    ${mode}`));
  console.log(chalk.gray(`   Version: ${version}`));
  if (extras.length > 0) {
    console.log(chalk.gray(`   Options: ${extras.join(", ")}`));
  }
  console.log();
}

/**
 * Uninstall subcommand
 */
function runUninstall(cwd: string): void {
  const hooksDir = getGitHooksDir(cwd);
  if (!hooksDir) {
    console.error(chalk.red("\n❌ Not a git repository.\n"));
    process.exitCode = 1;
    return;
  }

  const hookPath = join(hooksDir, "pre-commit");
  const status = getHookStatus(hookPath);

  if (!status.exists) {
    console.log(chalk.yellow("\n⚠ No pre-commit hook found. Nothing to remove.\n"));
    return;
  }

  if (!status.isOurs) {
    console.error(
      chalk.red("\n❌ The pre-commit hook was not installed by cortex-tms."),
      chalk.gray("\nRefusing to remove a foreign hook.\n"),
    );
    process.exitCode = 1;
    return;
  }

  unlinkSync(hookPath);
  console.log(chalk.green("\n✅ Pre-commit hook removed.\n"));
}

/**
 * Status subcommand
 */
function runStatus(cwd: string): void {
  const hooksDir = getGitHooksDir(cwd);
  if (!hooksDir) {
    console.error(chalk.red("\n❌ Not a git repository.\n"));
    process.exitCode = 1;
    return;
  }

  const hookPath = join(hooksDir, "pre-commit");
  const status = getHookStatus(hookPath);

  console.log(chalk.bold.cyan("\n🔗 Git Hook Status\n"));

  if (!status.exists) {
    console.log(chalk.gray("  No pre-commit hook installed."));
    console.log(
      chalk.gray("\n  Run"),
      chalk.cyan("cortex-tms hooks install"),
      chalk.gray("to set one up.\n"),
    );
    return;
  }

  if (!status.isOurs) {
    console.log(chalk.yellow("  ⚠ Pre-commit hook exists but is NOT managed by cortex-tms."));
    console.log(chalk.gray(`  Path: ${hookPath}\n`));
    return;
  }

  // Parse our hook for details
  const content = status.content!;
  const isStrict = content.includes("--strict");
  const skipsStale = content.includes("--skip-staleness");
  const versionMatch = content.match(/cortex-tms@([\d.]+)/);
  const pinnedVersion = versionMatch ? versionMatch[1] : "unknown";

  console.log(chalk.green("  ✓ Pre-commit hook installed (managed by cortex-tms)"));
  console.log(chalk.gray(`  Path:    ${hookPath}`));
  console.log(chalk.gray(`  Mode:    ${isStrict ? "strict" : "default"}`));
  console.log(chalk.gray(`  Version: ${pinnedVersion}`));
  if (skipsStale) {
    console.log(chalk.gray(`  Options: staleness checks skipped`));
  }
  console.log();
}

/**
 * Create and configure the hooks command
 */
export function createHooksCommand(): Command {
  const hooks = new Command("hooks");

  hooks.description("Manage git hooks for automatic documentation validation");

  // hooks install
  hooks
    .command("install")
    .description("Install a pre-commit hook that validates docs before each commit")
    .option("-s, --strict", "Treat warnings as errors (block commit on warnings)")
    .option("--skip-staleness", "Skip staleness detection in the hook")
    .option(
      "--cortex-version <version>",
      "Pin a specific cortex-tms version for npx fallback",
    )
    .action((options) => {
      runInstall(process.cwd(), options);
    });

  // hooks uninstall
  hooks
    .command("uninstall")
    .description("Remove the cortex-tms pre-commit hook")
    .action(() => {
      runUninstall(process.cwd());
    });

  // hooks status
  hooks
    .command("status")
    .description("Show current git hook configuration")
    .action(() => {
      runStatus(process.cwd());
    });

  return hooks;
}

// Export the command
export const hooksCommand = createHooksCommand();
