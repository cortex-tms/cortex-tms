/**
 * TMS-430: Agent Skills Tests
 *
 * Unit: SKILL.md frontmatter validity for each shipped skill.
 * E2E: init --with-skills copies skills, respects flag absence, refuses clobber.
 * Content: each skill references the TMS governance docs it depends on.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, mkdir, writeFile } from "fs/promises";
import { createTempDir, cleanupTempDir, fileExists } from "./utils/temp-dir.js";
import { runCommand, expectSuccess } from "./utils/cli-runner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// src/__tests__/skills.test.ts → ../../ brings us to project root
const PROJECT_ROOT = join(__dirname, "../../");
const SKILLS_TEMPLATES_DIR = join(PROJECT_ROOT, "templates/skills");

// ============================================================================
// Helpers
// ============================================================================

async function readSkillFile(skillDir: string): Promise<string> {
  return readFile(join(SKILLS_TEMPLATES_DIR, skillDir, "SKILL.md"), "utf-8");
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    result[key] = value;
  }
  return result;
}

const STANDARD_CORTEXRC = JSON.stringify({
  version: "1.0.0",
  scope: "standard",
  paths: { docs: "docs/core", tasks: "NEXT-TASKS.md", archive: "docs/archive" },
  limits: {},
  validation: { ignorePatterns: [], ignoreFiles: [] },
});

// ============================================================================
// Unit — SKILL.md frontmatter
// ============================================================================

describe("Shipped SKILL.md frontmatter", () => {
  const SKILLS = ["cortex-validate", "cortex-review"];

  for (const skillDir of SKILLS) {
    describe(`${skillDir}/SKILL.md`, () => {
      let content: string;
      let fm: Record<string, string>;

      beforeEach(async () => {
        content = await readSkillFile(skillDir);
        fm = parseFrontmatter(content);
      });

      it("has a non-empty name field", () => {
        expect(fm["name"]).toBeTruthy();
      });

      it("name matches directory name", () => {
        expect(fm["name"]).toBe(skillDir);
      });

      it("has a non-empty description", () => {
        expect(fm["description"]).toBeTruthy();
        expect(fm["description"].length).toBeGreaterThan(10);
      });

      it("description is under 200 characters", () => {
        expect(fm["description"].length).toBeLessThan(200);
      });

      it("sets disable-model-invocation: true", () => {
        expect(fm["disable-model-invocation"]).toBe("true");
      });

      it("has an allowed-tools field", () => {
        expect(fm["allowed-tools"]).toBeTruthy();
      });

      it("allowed-tools uses space-separated syntax (not comma-separated)", () => {
        // Official docs use space separation; commas are undocumented
        expect(fm["allowed-tools"]).not.toMatch(/,/);
      });

      it("body is present after frontmatter", () => {
        const body = content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
        expect(body.length).toBeGreaterThan(0);
      });

      it("body is under 500 lines (official docs recommendation)", () => {
        const lineCount = content.split("\n").length;
        expect(lineCount).toBeLessThan(500);
      });
    });
  }

  describe("cortex-validate specific", () => {
    it("allowed-tools includes Bash(npx -y cortex-tms validate *)", async () => {
      const content = await readSkillFile("cortex-validate");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Bash(npx -y cortex-tms validate");
    });

    it("allowed-tools includes Read", async () => {
      const content = await readSkillFile("cortex-validate");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Read");
    });
  });

  describe("cortex-review specific", () => {
    it("allowed-tools includes Read", async () => {
      const content = await readSkillFile("cortex-review");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Read");
    });

    it("allowed-tools includes Grep", async () => {
      const content = await readSkillFile("cortex-review");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Grep");
    });

    it("allowed-tools includes Bash(git diff *)", async () => {
      const content = await readSkillFile("cortex-review");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Bash(git diff");
    });

    it("allowed-tools includes Bash(git log *)", async () => {
      const content = await readSkillFile("cortex-review");
      const fm = parseFrontmatter(content);
      expect(fm["allowed-tools"]).toContain("Bash(git log");
    });
  });
});

// ============================================================================
// Content — skills reference their governance doc dependencies
// ============================================================================

describe("Skill content — governance doc references", () => {
  it("cortex-review body references PATTERNS.md", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toContain("PATTERNS.md");
  });

  it("cortex-review body references AGENTS.md", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toContain("AGENTS.md");
  });

  it("cortex-review body references ARCHITECTURE.md", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toContain("ARCHITECTURE.md");
  });

  it("cortex-validate body references validate --strict", async () => {
    const content = await readSkillFile("cortex-validate");
    expect(content).toContain("validate --strict");
  });

  it("cortex-review git injection uses 2>/dev/null fallback (no-git safety)", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toContain("2>/dev/null");
  });

  it("cortex-review instructs agent to handle absent governance docs gracefully", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toMatch(/not present|absent/i);
  });

  it("cortex-review instructs agent to handle empty or unavailable diff", async () => {
    const content = await readSkillFile("cortex-review");
    expect(content).toMatch(/empty|unavailable/i);
  });
});

// ============================================================================
// E2E — init --with-skills
// ============================================================================

describe("init --with-skills E2E", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeFile(join(tempDir, ".cortexrc"), STANDARD_CORTEXRC);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("copies cortex-validate skill when --with-skills is passed", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(
      await fileExists(
        join(tempDir, ".claude", "skills", "cortex-validate", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("copies cortex-review skill when --with-skills is passed", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(
      await fileExists(
        join(tempDir, ".claude", "skills", "cortex-review", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("does NOT copy skills when --with-skills is absent", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force"],
      tempDir,
    );
    expectSuccess(result);
    expect(
      await fileExists(join(tempDir, ".claude", "skills", "cortex-validate")),
    ).toBe(false);
    expect(
      await fileExists(join(tempDir, ".claude", "skills", "cortex-review")),
    ).toBe(false);
  });

  it("stdout mentions workspace trust dialog after skill install", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(result.stdout.toLowerCase()).toMatch(/trust/i);
  });

  it("refuses to clobber a pre-existing skill directory", async () => {
    // Pre-seed a cortex-validate skill directory
    const existingSkillDir = join(
      tempDir,
      ".claude",
      "skills",
      "cortex-validate",
    );
    await mkdir(existingSkillDir, { recursive: true });
    await writeFile(
      join(existingSkillDir, "SKILL.md"),
      "---\nname: cortex-validate\n---\n# existing",
    );

    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);

    // The pre-existing file must NOT be overwritten
    const content = await readFile(
      join(existingSkillDir, "SKILL.md"),
      "utf-8",
    );
    expect(content).toContain("# existing");

    // Output should mention the conflict
    expect(result.stdout.toLowerCase()).toMatch(/conflict|skip|already exists/i);
  });

  it("installs cortex-review even when cortex-validate already exists", async () => {
    // Pre-seed only cortex-validate
    const existingSkillDir = join(
      tempDir,
      ".claude",
      "skills",
      "cortex-validate",
    );
    await mkdir(existingSkillDir, { recursive: true });
    await writeFile(
      join(existingSkillDir, "SKILL.md"),
      "---\nname: cortex-validate\n---\n# existing",
    );

    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);

    // cortex-review should still be installed
    expect(
      await fileExists(
        join(tempDir, ".claude", "skills", "cortex-review", "SKILL.md"),
      ),
    ).toBe(true);
  });

  it("installed SKILL.md content matches the template source", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);

    const installed = await readFile(
      join(tempDir, ".claude", "skills", "cortex-validate", "SKILL.md"),
      "utf-8",
    );
    const template = await readFile(
      join(SKILLS_TEMPLATES_DIR, "cortex-validate", "SKILL.md"),
      "utf-8",
    );
    expect(installed).toBe(template);
  });
});

// ============================================================================
// Dry-run preview — --dry-run --with-skills
// ============================================================================

describe("init --dry-run --with-skills preview", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeFile(join(tempDir, ".cortexrc"), STANDARD_CORTEXRC);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("exits 0 in dry-run mode", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--dry-run", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
  });

  it("reports cortex-validate would be created", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--dry-run", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(result.stdout).toContain("cortex-validate");
    expect(result.stdout).toMatch(/would create|would skip/i);
  });

  it("reports cortex-review would be created", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--dry-run", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(result.stdout).toContain("cortex-review");
  });

  it("does not write any skill files in dry-run mode", async () => {
    await runCommand(
      "init",
      ["--scope", "standard", "--force", "--dry-run", "--with-skills"],
      tempDir,
    );
    expect(
      await fileExists(join(tempDir, ".claude", "skills", "cortex-validate")),
    ).toBe(false);
    expect(
      await fileExists(join(tempDir, ".claude", "skills", "cortex-review")),
    ).toBe(false);
  });

  it("reports 'would skip' for pre-existing skill in dry-run mode", async () => {
    const existingSkillDir = join(tempDir, ".claude", "skills", "cortex-validate");
    await mkdir(existingSkillDir, { recursive: true });
    await writeFile(join(existingSkillDir, "SKILL.md"), "---\nname: cortex-validate\n---\n# existing");

    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force", "--dry-run", "--with-skills"],
      tempDir,
    );
    expectSuccess(result);
    expect(result.stdout).toMatch(/would skip/i);
  });
});

// ============================================================================
// Path safety — validateSafePath used for every skill destination
// ============================================================================

describe("skills path safety (unit)", () => {
  it("validateSafePath rejects a path that traverses above the project dir", async () => {
    const { validateSafePath } = await import("../utils/validation.js");
    const base = "/tmp/project";
    const traversal = "../../etc/passwd";
    const result = validateSafePath(traversal, base);
    expect(result.isValid).toBe(false);
  });

  it("validateSafePath accepts a valid nested skill path", async () => {
    const { validateSafePath } = await import("../utils/validation.js");
    const base = "/tmp/project";
    const valid = ".claude/skills/cortex-validate";
    const result = validateSafePath(valid, base);
    expect(result.isValid).toBe(true);
    expect(result.resolvedPath).toContain("cortex-validate");
  });
});
