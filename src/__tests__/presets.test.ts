/**
 * Governance Presets — Unit + E2E Tests
 *
 * Covers: preset resolution, walker exclusion, .cortexrc storage,
 * placeholder safety, invalid preset rejection, and both --minimal
 * and --scope nano code paths.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "path";
import { readFile } from "fs/promises";
import fs from "fs-extra";
import { createTempDir, cleanupTempDir, fileExists } from "./utils/temp-dir.js";
import {
  getTemplatesDir,
  getPresetDir,
  resolveTemplateSource,
  getTemplateFiles,
  copyTemplates,
  generateReplacements,
} from "../utils/templates.js";
import { runCommand, expectSuccess, expectFailure } from "./utils/cli-runner.js";
import { initOptionsSchema, validateOptions } from "../utils/validation.js";

// ---------------------------------------------------------------------------
// Unit — preset directory resolution
// ---------------------------------------------------------------------------

describe("getPresetDir", () => {
  it("returns a path ending in templates/presets/<preset>", () => {
    const dir = getPresetDir("node");
    expect(dir).toMatch(/templates[/\\]presets[/\\]node$/);
  });
});

describe("resolveTemplateSource", () => {
  it("returns base source when no preset is given", async () => {
    const base = "/tmp/base/CLAUDE.md";
    const result = await resolveTemplateSource(base, "CLAUDE.md", undefined);
    expect(result).toBe(base);
  });

  it("returns preset source when preset file exists", async () => {
    const presetDir = getPresetDir("node");
    const presetFile = join(presetDir, "CLAUDE.md");
    // The node preset CLAUDE.md was created as part of this feature
    const exists = await fs.pathExists(presetFile);
    expect(exists).toBe(true);

    const base = join(getTemplatesDir(), "CLAUDE.md");
    const result = await resolveTemplateSource(base, "CLAUDE.md", "node");
    expect(result).toBe(presetFile);
  });

  it("falls back to base source when preset does not override the file", async () => {
    // PROMPTS.md has no node preset override
    const base = join(getTemplatesDir(), "PROMPTS.md");
    const result = await resolveTemplateSource(base, "PROMPTS.md", "node");
    expect(result).toBe(base);
  });
});

// ---------------------------------------------------------------------------
// Unit — walker excludes presets/
// ---------------------------------------------------------------------------

describe("getTemplateFiles", () => {
  it("does not include any file with a destination starting with presets/", async () => {
    const templatesDir = getTemplatesDir();
    const files = await getTemplateFiles(templatesDir);
    const presetDestinations = files.filter((f) =>
      f.destination.startsWith("presets/"),
    );
    expect(presetDestinations).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Unit — Zod schema rejects invalid preset
// ---------------------------------------------------------------------------

describe("initOptionsSchema — preset validation", () => {
  it("accepts 'node' as a valid preset", () => {
    expect(() =>
      validateOptions(initOptionsSchema, { preset: "node" }, "init"),
    ).not.toThrow();
  });

  it("rejects an unknown preset string", () => {
    expect(() =>
      validateOptions(initOptionsSchema, { preset: "ruby" }, "init"),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Unit — copyTemplates uses preset override
// ---------------------------------------------------------------------------

describe("copyTemplates with preset", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("copies Node preset CLAUDE.md instead of base CLAUDE.md", async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements("my-node-app");

    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: "nano", // nano includes CLAUDE.md
      overwrite: true,
      preset: "node",
    });

    const written = await readFile(join(tempDir, "CLAUDE.md"), "utf-8");
    // Node preset CLAUDE.md contains Node-specific stack section
    expect(written).toContain("Stack");
    expect(written).toContain("Runtime");
  });

  it("uses base template for files not overridden by preset", async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements("my-node-app");

    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: "nano",
      overwrite: true,
      preset: "node",
    });

    // NEXT-TASKS.md has no node preset override — base template is used
    const exists = await fileExists(join(tempDir, "NEXT-TASKS.md"));
    expect(exists).toBe(true);
  });

  it("known template placeholders are fully replaced in all written files", async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements("my-node-app", "A Node.js project");

    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: "standard",
      overwrite: true,
      preset: "node",
    });

    // Collect all written markdown files
    const markdownFiles: string[] = [];
    async function walk(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else if (entry.name.endsWith(".md")) markdownFiles.push(full);
      }
    }
    await walk(tempDir);

    // Verify the 3 known template placeholders are all resolved
    const unresolvedKnown: string[] = [];
    for (const file of markdownFiles) {
      const content = await readFile(file, "utf-8");
      const matches = content.match(/\[Project Name\]|\[project-name\]|\[Description\]/g);
      if (matches) unresolvedKnown.push(...matches.map((m) => `${file}: ${m}`));
    }
    expect(unresolvedKnown).toHaveLength(0);
  });

  it("preset-overridden agent files contain no unresolved [e.g., ...] hints", async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements("my-node-app", "A Node.js project");

    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: "standard",
      overwrite: true,
      preset: "node",
    });

    // Agent-facing files overridden by the node preset should not contain
    // generic [e.g., ...] hints — those belong in base templates only
    const agentFiles = [
      join(tempDir, ".github/copilot-instructions.md"),
      join(tempDir, "AGENTS.md"),
      join(tempDir, "CLAUDE.md"),
    ];

    for (const file of agentFiles) {
      const exists = await fs.pathExists(file);
      if (!exists) continue;
      const content = await readFile(file, "utf-8");
      // [e.g., ...] patterns indicate unfilled generic hints from the base template
      const egs = content.match(/\[e\.g\.,/g);
      expect(egs, `Found [e.g., hints in ${file} — preset should pre-fill these`).toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// E2E — init --preset node via CLI
// ---------------------------------------------------------------------------

describe("init E2E — --preset node", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("succeeds with --preset node --scope standard --force", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--preset", "node", "--force"],
      tempDir,
    );
    expectSuccess(result);
  });

  it("records preset in .cortexrc metadata", async () => {
    await runCommand(
      "init",
      ["--scope", "standard", "--preset", "node", "--force"],
      tempDir,
    );

    const raw = await readFile(join(tempDir, ".cortexrc"), "utf-8");
    const config = JSON.parse(raw);
    expect(config.metadata?.preset).toBe("node");
  });

  it("--preset node --minimal uses nano scope (--minimal code path)", async () => {
    const result = await runCommand(
      "init",
      ["--minimal", "--preset", "node", "--force"],
      tempDir,
    );
    expectSuccess(result);

    const raw = await readFile(join(tempDir, ".cortexrc"), "utf-8");
    const config = JSON.parse(raw);
    expect(config.scope).toBe("nano");
    expect(config.metadata?.preset).toBe("node");
  });

  it("--preset node --scope nano uses nano scope (--scope code path)", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "nano", "--preset", "node", "--force"],
      tempDir,
    );
    expectSuccess(result);

    const raw = await readFile(join(tempDir, ".cortexrc"), "utf-8");
    const config = JSON.parse(raw);
    expect(config.scope).toBe("nano");
    expect(config.metadata?.preset).toBe("node");
  });

  it("--preset node --dry-run exits 0 and reports files without writing", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--preset", "node", "--force", "--dry-run"],
      tempDir,
    );
    expectSuccess(result);
    // Dry run should not create .cortexrc
    const cortexrcExists = await fileExists(join(tempDir, ".cortexrc"));
    expect(cortexrcExists).toBe(false);
  });

  it("rejects an invalid preset with a non-zero exit code", async () => {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--preset", "ruby", "--force"],
      tempDir,
    );
    expectFailure(result);
  });
});

describe("Node preset — package manager substitution", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  async function initNodePreset(dir: string): Promise<void> {
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--preset", "node", "--force"],
      dir,
    );
    expectSuccess(result);
  }

  async function readGeneratedClaude(dir: string): Promise<string> {
    return readFile(join(dir, "CLAUDE.md"), "utf8");
  }

  it("substitutes pnpm when pnpm-lock.yaml is present", async () => {
    await fs.writeFile(join(tempDir, "pnpm-lock.yaml"), "");
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("pnpm run test");
    expect(claude).toContain("pnpm run build");
    expect(claude).not.toContain("<package-manager>");
  });

  it("substitutes yarn when yarn.lock is present", async () => {
    await fs.writeFile(join(tempDir, "yarn.lock"), "");
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("yarn run test");
    expect(claude).not.toContain("<package-manager>");
  });

  it("substitutes npm when package-lock.json is present", async () => {
    await fs.writeFile(join(tempDir, "package-lock.json"), "{}");
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("npm run test");
    expect(claude).not.toContain("<package-manager>");
  });

  it("substitutes bun when bun.lockb is present", async () => {
    await fs.writeFile(join(tempDir, "bun.lockb"), "");
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("bun run test");
    expect(claude).not.toContain("<package-manager>");
  });

  it("packageManager field takes priority over lockfile", async () => {
    await fs.writeFile(
      join(tempDir, "package.json"),
      JSON.stringify({ packageManager: "pnpm@8.6.0" }),
    );
    await fs.writeFile(join(tempDir, "package-lock.json"), "{}");
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("pnpm run test");
    expect(claude).not.toMatch(/^npm run test/m);
  });

  it("leaves <package-manager> literal when nothing is detected", async () => {
    await initNodePreset(tempDir);
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).toContain("<package-manager>");
  });

  it("does not substitute <package-manager> without --preset node", async () => {
    await fs.writeFile(join(tempDir, "pnpm-lock.yaml"), "");
    const result = await runCommand(
      "init",
      ["--scope", "standard", "--force"],
      tempDir,
    );
    expectSuccess(result);
    // Base CLAUDE.md has no <package-manager> tokens — file should be clean
    const claude = await readGeneratedClaude(tempDir);
    expect(claude).not.toContain("<package-manager>");
    expect(claude).not.toContain("pnpm run test");
  });
});
