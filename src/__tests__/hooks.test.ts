/**
 * Tests - Hooks Command
 *
 * Tests git hook installation, uninstallation, status reporting,
 * and edge cases (foreign hooks, missing .cortexrc, non-git repos).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "path";
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { execSync } from "child_process";
import { createTempDir, cleanupTempDir } from "./utils/temp-dir.js";
import { saveConfig, createConfigFromScope } from "../utils/config.js";

/**
 * Set up a temp directory as a git repo with .cortexrc
 */
async function createGitProject(dir: string): Promise<void> {
  execSync("git init", { cwd: dir, stdio: "pipe" });
  execSync("git config user.email test@test.com", { cwd: dir, stdio: "pipe" });
  execSync("git config user.name Test", { cwd: dir, stdio: "pipe" });

  const config = createConfigFromScope("standard", "test-project");
  await saveConfig(dir, config);
}

/**
 * Get the hooks directory for a git repo
 */
function getHooksDir(dir: string): string {
  return execSync("git rev-parse --git-path hooks", {
    cwd: dir,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

// Resolve bin path for CLI integration tests (ESM-compatible)
const __dirname_test = join(
  new URL(import.meta.url).pathname.replace(/\/[^/]+$/, ""),
);
const BIN = join(__dirname_test, "../../bin/cortex-tms.js");

function runHooks(cwd: string, args: string): { stdout: string; exitCode: number } {
  try {
    const stdout = execSync(`node "${BIN}" hooks ${args}`, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, NO_COLOR: "1" },
    });
    return { stdout, exitCode: 0 };
  } catch (error: any) {
    return {
      stdout: (error.stdout || "") + (error.stderr || ""),
      exitCode: error.status ?? 1,
    };
  }
}

// ============================================================================
// Tests
// ============================================================================

describe("hooks install", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("should install a pre-commit hook in a valid git project", async () => {
    await createGitProject(tempDir);

    const result = runHooks(tempDir, "install");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Pre-commit hook installed");

    // Verify hook file exists and is executable
    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    expect(existsSync(hookPath)).toBe(true);

    const content = readFileSync(hookPath, "utf-8");
    expect(content).toContain("# cortex-tms-hook");
    expect(content).toContain("validate");
  });

  it("should pin the current CLI version in the hook script", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install");

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    const content = readFileSync(hookPath, "utf-8");

    // Should contain a pinned npx version
    expect(content).toMatch(/npx --yes cortex-tms@[\d.]+/);
  });

  it("should include --strict flag when installed with --strict", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install --strict");

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    const content = readFileSync(hookPath, "utf-8");

    expect(content).toContain("--strict");
  });

  it("should include --skip-staleness flag when installed with --skip-staleness", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install --skip-staleness");

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    const content = readFileSync(hookPath, "utf-8");

    expect(content).toContain("--skip-staleness");
  });

  it("should allow custom version pinning with --cortex-version", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install --cortex-version 5.0.0");

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    const content = readFileSync(hookPath, "utf-8");

    expect(content).toContain("cortex-tms@5.0.0");
  });

  it("should refuse to install without .cortexrc", async () => {
    execSync("git init", { cwd: tempDir, stdio: "pipe" });

    const result = runHooks(tempDir, "install");
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toContain("No .cortexrc found");
  });

  it("should refuse to install in a non-git directory", async () => {
    // Write .cortexrc but no git init
    const config = createConfigFromScope("standard", "test");
    await saveConfig(tempDir, config);

    const result = runHooks(tempDir, "install");
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toContain("Not a git repository");
  });

  it("should refuse to overwrite a foreign pre-commit hook", async () => {
    await createGitProject(tempDir);

    // Create a foreign hook manually
    const hooksDir = join(tempDir, getHooksDir(tempDir));
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(join(hooksDir, "pre-commit"), "#!/bin/sh\necho foreign\n", {
      mode: 0o755,
    });

    const result = runHooks(tempDir, "install");
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toContain("wasn't installed by cortex-tms");
  });

  it("should overwrite our own hook on reinstall (upgrade)", async () => {
    await createGitProject(tempDir);

    // Install once
    runHooks(tempDir, "install");

    // Install again with --strict (should succeed, not refuse)
    const result = runHooks(tempDir, "install --strict");
    expect(result.exitCode).toBe(0);

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    const content = readFileSync(hookPath, "utf-8");
    expect(content).toContain("--strict");
  });
});

describe("hooks uninstall", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("should remove a cortex-tms hook", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install");

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    const hookPath = join(hooksDir, "pre-commit");
    expect(existsSync(hookPath)).toBe(true);

    const result = runHooks(tempDir, "uninstall");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Pre-commit hook removed");
    expect(existsSync(hookPath)).toBe(false);
  });

  it("should warn when no hook exists", async () => {
    await createGitProject(tempDir);

    const result = runHooks(tempDir, "uninstall");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("No pre-commit hook found");
  });

  it("should refuse to remove a foreign hook", async () => {
    await createGitProject(tempDir);

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(join(hooksDir, "pre-commit"), "#!/bin/sh\necho foreign\n", {
      mode: 0o755,
    });

    const result = runHooks(tempDir, "uninstall");
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toContain("not installed by cortex-tms");
  });
});

describe("hooks status", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("should report no hook when none is installed", async () => {
    await createGitProject(tempDir);

    const result = runHooks(tempDir, "status");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("No pre-commit hook installed");
  });

  it("should report installed hook details", async () => {
    await createGitProject(tempDir);
    runHooks(tempDir, "install --strict --skip-staleness");

    const result = runHooks(tempDir, "status");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("managed by cortex-tms");
    expect(result.stdout).toContain("strict");
    expect(result.stdout).toContain("staleness checks skipped");
  });

  it("should detect foreign hooks", async () => {
    await createGitProject(tempDir);

    const hooksDir = join(tempDir, getHooksDir(tempDir));
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(join(hooksDir, "pre-commit"), "#!/bin/sh\necho hi\n", {
      mode: 0o755,
    });

    const result = runHooks(tempDir, "status");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("NOT managed by cortex-tms");
  });
});

describe("validate --skip-staleness", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("should accept --skip-staleness flag without error", async () => {
    await createGitProject(tempDir);
    // Create minimal mandatory files
    writeFileSync(join(tempDir, "NEXT-TASKS.md"), "# Tasks\n");
    writeFileSync(join(tempDir, "CLAUDE.md"), "# Agent\n");
    mkdirSync(join(tempDir, ".github"), { recursive: true });
    writeFileSync(join(tempDir, ".github/copilot-instructions.md"), "# Instructions\n");

    const bin = BIN;
    try {
      const stdout = execSync(`node "${bin}" validate --skip-staleness`, {
        cwd: tempDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      // Should run without error — any result is fine
      expect(stdout).toContain("Validation");
    } catch (error: any) {
      // Even if validation fails (e.g., missing files), the flag should be accepted
      // It should NOT fail with "unknown option --skip-staleness"
      const output = (error.stdout || "") + (error.stderr || "");
      expect(output).not.toContain("unknown option");
    }
  });
});
