/**
 * Tests - AGENTS.md Template
 *
 * Tests for the AGENTS.md multi-agent governance template:
 * - Template file exists with required sections
 * - init --scope standard/enterprise copies AGENTS.md
 * - init --scope nano does NOT copy AGENTS.md
 * - Placeholder [Project Name] is replaced on copy
 * - validate emits info recommendation when AGENTS.md is missing (standard)
 * - validate does NOT emit recommendation for nano scope
 * - validate --strict exits 0 when only AGENTS.md is missing
 * - Missing AGENTS.md does not reduce the "Passed: X" count
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join, dirname } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { createTempDir, cleanupTempDir } from "./utils/temp-dir.js";
import { validateProject } from "../utils/validator.js";
import { saveConfig, createConfigFromScope } from "../utils/config.js";

const __dirname_test = dirname(fileURLToPath(import.meta.url));
const BIN = join(__dirname_test, "../../bin/cortex-tms.js");
const TEMPLATES_DIR = join(__dirname_test, "../../templates");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runCli(
  cwd: string,
  args: string,
): { stdout: string; exitCode: number } {
  try {
    const stdout = execSync(`node "${BIN}" ${args}`, {
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

/**
 * Initialise a temp dir as a TMS project with the given scope.
 * Runs `cortex-tms init --scope <scope> --force` non-interactively.
 */
function initProject(dir: string, scope: string): void {
  runCli(dir, `init --scope ${scope} --force`);
}

/**
 * Write a minimal .cortexrc for the given scope without running init
 * (useful when we need to test validate without copying templates).
 */
async function writeConfig(dir: string, scope: string): Promise<void> {
  const config = createConfigFromScope(
    scope as "nano" | "standard" | "enterprise",
    "test-project",
  );
  await saveConfig(dir, config);
}

/**
 * Write the mandatory files for a standard-scope project so that validate
 * only produces the AGENTS.md recommendation, not missing-file errors.
 */
function writeMandatoryFiles(dir: string): void {
  const files = [
    "NEXT-TASKS.md",
    "CLAUDE.md",
    ".github/copilot-instructions.md",
  ];
  for (const file of files) {
    const filePath = join(dir, file);
    // Ensure parent directory exists
    execSync(`mkdir -p "${dirname(filePath)}"`, { stdio: "pipe" });
    if (!existsSync(filePath)) {
      writeFileSync(filePath, `# ${file}\n`, "utf-8");
    }
  }
}

// ---------------------------------------------------------------------------
// Suite 1: Template file
// ---------------------------------------------------------------------------

describe("AGENTS.md template file", () => {
  it("template file exists at templates/AGENTS.md", () => {
    const templatePath = join(TEMPLATES_DIR, "AGENTS.md");
    expect(existsSync(templatePath)).toBe(true);
  });

  it("template contains required sections", () => {
    const templatePath = join(TEMPLATES_DIR, "AGENTS.md");
    const content = readFileSync(templatePath, "utf-8");

    expect(content).toContain("## Purpose");
    expect(content).toContain("## Active Agents & Roles");
    expect(content).toContain("## Capabilities Matrix");
    expect(content).toContain("## Shared Conventions");
    expect(content).toContain("## Handoff Protocol");
    expect(content).toContain("## Escalation Rules");
    expect(content).toContain("## Universal Prohibitions");
  });

  it("template contains a Precedence clause", () => {
    const templatePath = join(TEMPLATES_DIR, "AGENTS.md");
    const content = readFileSync(templatePath, "utf-8");

    expect(content).toContain("Precedence");
    expect(content).toContain("CLAUDE.md");
  });

  it("template uses [Project Name] as the only bracket placeholder", () => {
    const templatePath = join(TEMPLATES_DIR, "AGENTS.md");
    const content = readFileSync(templatePath, "utf-8");

    // Only [Project Name] should be a bracket placeholder
    const placeholders = content.match(/\[([A-Z][a-zA-Z\s]+)\](?!\()/g) ?? [];
    expect(placeholders).toEqual(["[Project Name]"]);
  });

  it("template uses TBD literals for human-only fields (not bracket syntax)", () => {
    const templatePath = join(TEMPLATES_DIR, "AGENTS.md");
    const content = readFileSync(templatePath, "utf-8");

    expect(content).toContain("**Last Updated**: TBD");
    expect(content).toContain("**Owner**: TBD");
  });
});

// ---------------------------------------------------------------------------
// Suite 2: init command copies AGENTS.md correctly
// ---------------------------------------------------------------------------

describe("init --scope standard", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("copies AGENTS.md into the project", () => {
    initProject(tempDir, "standard");
    expect(existsSync(join(tempDir, "AGENTS.md"))).toBe(true);
  });

  it("replaces [Project Name] placeholder in the copied file", () => {
    initProject(tempDir, "standard");
    const content = readFileSync(join(tempDir, "AGENTS.md"), "utf-8");

    // [Project Name] should be replaced (no raw bracket placeholder remaining)
    expect(content).not.toContain("[Project Name]");
    // The project name derived from the temp directory should appear
    expect(content).toMatch(/\*\*Project\*\*:/);
  });
});

describe("init --scope enterprise", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("copies AGENTS.md into the project", () => {
    initProject(tempDir, "enterprise");
    expect(existsSync(join(tempDir, "AGENTS.md"))).toBe(true);
  });
});

describe("init --scope nano", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("does NOT copy AGENTS.md (nano scope is intentionally minimal)", () => {
    initProject(tempDir, "nano");
    expect(existsSync(join(tempDir, "AGENTS.md"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Suite 3: validate recommendations
// ---------------------------------------------------------------------------

describe("validate recommendations — standard scope", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeConfig(tempDir, "standard");
    writeMandatoryFiles(tempDir);
    // Deliberately do NOT create AGENTS.md
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("emits an info recommendation when AGENTS.md is missing", async () => {
    const result = await validateProject(tempDir, { skipStaleness: true });
    const agentsCheck = result.checks.find((c) =>
      c.name.startsWith("Recommended: AGENTS.md"),
    );
    expect(agentsCheck).toBeDefined();
    expect(agentsCheck?.level).toBe("info");
    expect(agentsCheck?.message).toContain("AGENTS.md");
  });

  it("recommendation check has passed:true — does not reduce the Passed count", async () => {
    const result = await validateProject(tempDir, { skipStaleness: true });
    const agentsCheck = result.checks.find((c) =>
      c.name.startsWith("Recommended: AGENTS.md"),
    );
    expect(agentsCheck?.passed).toBe(true);

    // Passed count should equal all checks (no false-positives from recommendation)
    const passedCount = result.checks.filter((c) => c.passed).length;
    expect(passedCount).toBe(result.summary.total);
  });

  it("validate --strict exits 0 when AGENTS.md is the only missing item", () => {
    const result = runCli(tempDir, "validate --strict --skip-staleness");
    expect(result.exitCode).toBe(0);
  });

  it("validate output shows the Recommendations section", () => {
    const result = runCli(tempDir, "validate --skip-staleness");
    expect(result.stdout).toContain("Recommendations");
    expect(result.stdout).toContain("AGENTS.md");
  });
});

describe("validate recommendations — nano scope", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeConfig(tempDir, "nano");
    // Write only nano mandatory files
    writeFileSync(join(tempDir, "NEXT-TASKS.md"), "# Tasks\n", "utf-8");
    writeFileSync(join(tempDir, "CLAUDE.md"), "# Claude\n", "utf-8");
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("does NOT emit AGENTS.md recommendation for nano scope", async () => {
    const result = await validateProject(tempDir, { skipStaleness: true });
    const agentsCheck = result.checks.find((c) =>
      c.name.startsWith("Recommended: AGENTS.md"),
    );
    expect(agentsCheck).toBeUndefined();
  });
});
