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

  it("produces no unresolved bracket placeholders in written files", async () => {
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

    // Check none contain unresolved [Placeholder] patterns
    // (known replacements: [Project Name], [project-name], [Description])
    const knownUnresolved: string[] = [];
    for (const file of markdownFiles) {
      const content = await readFile(file, "utf-8");
      const matches = content.match(/\[Project Name\]|\[project-name\]|\[Description\]/g);
      if (matches) knownUnresolved.push(...matches.map((m) => `${file}: ${m}`));
    }
    expect(knownUnresolved).toHaveLength(0);
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
