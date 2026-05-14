/**
 * TMS-429: MCP Server Tests
 *
 * Unit tests for discoverResources() and --print-config output shape.
 * Integration tests for the full MCP server via subprocess + SDK client.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdir, writeFile } from "fs/promises";
import { createTempDir, cleanupTempDir } from "./utils/temp-dir.js";
import { discoverResources } from "../utils/resources.js";
import { CortexConfigMissingError } from "../utils/errors.js";
import { runCommand } from "./utils/cli-runner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// src/__tests__/mcp.test.ts → ../../ brings us to project root
const CLI_PATH = join(__dirname, "../../bin/cortex-tms.js");

// ============================================================================
// Helpers
// ============================================================================

const STANDARD_CORTEXRC = JSON.stringify({
  version: "1.0.0",
  scope: "standard",
  paths: { docs: "docs/core", tasks: "NEXT-TASKS.md", archive: "docs/archive" },
  limits: {},
  validation: { ignorePatterns: [], ignoreFiles: [] },
});

async function seedFile(dir: string, rel: string, content = "# content") {
  const full = join(dir, rel);
  await mkdir(join(full, ".."), { recursive: true });
  await writeFile(full, content, "utf-8");
}

async function writeConfig(dir: string, config: object) {
  await writeFile(join(dir, ".cortexrc"), JSON.stringify(config), "utf-8");
}

// ============================================================================
// Unit — discoverResources()
// ============================================================================

describe("discoverResources()", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("throws CortexConfigMissingError when no .cortexrc exists", async () => {
    await expect(discoverResources(tempDir)).rejects.toBeInstanceOf(
      CortexConfigMissingError,
    );
  });

  it("nano scope: returns only mandatory files that exist", async () => {
    await writeConfig(tempDir, { version: "1.0.0", scope: "nano" });
    await seedFile(tempDir, "NEXT-TASKS.md");
    await seedFile(tempDir, "CLAUDE.md");

    const resources = await discoverResources(tempDir);
    const uris = resources.map((r) => r.uri).sort();

    expect(uris).toEqual(["cortex://claude", "cortex://next-tasks"]);
  });

  it("nano scope: excludes files that do not exist on disk", async () => {
    await writeConfig(tempDir, { version: "1.0.0", scope: "nano" });
    await seedFile(tempDir, "NEXT-TASKS.md");
    // CLAUDE.md intentionally absent

    const resources = await discoverResources(tempDir);
    expect(resources.map((r) => r.uri)).toEqual(["cortex://next-tasks"]);
  });

  it("standard scope: returns mandatory + existing optional files", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "standard",
      paths: { docs: "docs/core", tasks: "NEXT-TASKS.md" },
    });
    await seedFile(tempDir, "NEXT-TASKS.md");
    await seedFile(tempDir, "CLAUDE.md");
    await seedFile(tempDir, ".github/copilot-instructions.md");
    await seedFile(tempDir, "docs/core/PATTERNS.md");
    // ARCHITECTURE.md deliberately absent

    const resources = await discoverResources(tempDir);
    const uris = resources.map((r) => r.uri).sort();

    expect(uris).toContain("cortex://next-tasks");
    expect(uris).toContain("cortex://claude");
    expect(uris).toContain("cortex://copilot-instructions");
    expect(uris).toContain("cortex://patterns");
    expect(uris).not.toContain("cortex://architecture");
  });

  it("enterprise scope: returns full set when all files seeded", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "enterprise",
      paths: { docs: "docs/core", tasks: "NEXT-TASKS.md" },
    });
    const enterpriseFiles = [
      "NEXT-TASKS.md",
      "CLAUDE.md",
      ".github/copilot-instructions.md",
      "PROMPTS.md",
      "FUTURE-ENHANCEMENTS.md",
      "AGENTS.md",
      "docs/core/ARCHITECTURE.md",
      "docs/core/PATTERNS.md",
      "docs/core/DOMAIN-LOGIC.md",
      "docs/core/DECISIONS.md",
      "docs/core/TROUBLESHOOTING.md",
      "docs/core/GLOSSARY.md",
      "docs/core/SCHEMA.md",
    ];
    for (const f of enterpriseFiles) await seedFile(tempDir, f);

    const resources = await discoverResources(tempDir);
    expect(resources.length).toBe(enterpriseFiles.length);
  });

  it("custom scope: honors config.metadata.customFiles (allowlist intersection)", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "custom",
      metadata: {
        customFiles: ["NEXT-TASKS.md", "docs/core/PATTERNS.md"],
      },
    });
    await seedFile(tempDir, "NEXT-TASKS.md");
    await seedFile(tempDir, "docs/core/PATTERNS.md");

    const resources = await discoverResources(tempDir);
    const uris = resources.map((r) => r.uri).sort();
    expect(uris).toEqual(["cortex://next-tasks", "cortex://patterns"]);
  });

  it("custom scope: drops customFiles entries not in the canonical allowlist", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "custom",
      metadata: {
        customFiles: ["NEXT-TASKS.md", "secrets.env", "src/index.ts"],
      },
    });
    await seedFile(tempDir, "NEXT-TASKS.md");
    await seedFile(tempDir, "secrets.env");
    await seedFile(tempDir, "src/index.ts");

    const resources = await discoverResources(tempDir);
    const uris = resources.map((r) => r.uri);
    expect(uris).toEqual(["cortex://next-tasks"]);
  });

  it("URIs follow cortex://<slug> scheme", async () => {
    await writeConfig(tempDir, { version: "1.0.0", scope: "nano" });
    await seedFile(tempDir, "NEXT-TASKS.md");
    await seedFile(tempDir, "CLAUDE.md");

    const resources = await discoverResources(tempDir);
    for (const r of resources) {
      expect(r.uri).toMatch(/^cortex:\/\/[a-z][a-z0-9-]*$/);
    }
  });

  it("path safety: drops ../../etc/passwd traversal attempts in customFiles", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "custom",
      metadata: {
        // This maps to no canonical slug so it's dropped at the allowlist stage
        customFiles: ["../../etc/passwd"],
      },
    });

    const resources = await discoverResources(tempDir);
    expect(resources).toHaveLength(0);
  });

  it("sibling-prefix safety: /tmp/project does not expose /tmp/project2 files", async () => {
    // The validateSafePath helper must correctly reject sibling paths.
    // This is covered by the allowlist (no sibling paths would map to a slug),
    // but we verify the path safety layer too via a direct test.
    const { validateSafePath } = await import("../utils/validation.js");

    const base = "/tmp/project";
    const sibling = "/tmp/project2/secret.md";

    const result = validateSafePath(sibling, base);
    expect(result.isValid).toBe(false);
  });

  it("honors config.paths.docs for docs-relative resources", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "standard",
      paths: { docs: "documentation/core", tasks: "NEXT-TASKS.md" },
    });
    await seedFile(tempDir, "documentation/core/PATTERNS.md", "# Patterns");

    const resources = await discoverResources(tempDir);
    const patternsResource = resources.find(
      (r) => r.uri === "cortex://patterns",
    );
    expect(patternsResource).toBeDefined();
    expect(patternsResource!.path).toContain("documentation/core/PATTERNS.md");
  });

  it("honors config.paths.tasks for next-tasks resource", async () => {
    await writeConfig(tempDir, {
      version: "1.0.0",
      scope: "nano",
      paths: { docs: "docs/core", tasks: "TODO.md" },
    });
    await seedFile(tempDir, "TODO.md", "# Tasks");

    const resources = await discoverResources(tempDir);
    const tasksResource = resources.find((r) => r.uri === "cortex://next-tasks");
    expect(tasksResource).toBeDefined();
    expect(tasksResource!.path).toContain("TODO.md");
  });

  it("resource objects contain name, description, mimeType, and path", async () => {
    await writeConfig(tempDir, { version: "1.0.0", scope: "nano" });
    await seedFile(tempDir, "NEXT-TASKS.md", "# Tasks");

    const resources = await discoverResources(tempDir);
    const r = resources[0];
    expect(r.name).toBeDefined();
    expect(r.description).toBeDefined();
    expect(r.mimeType).toBe("text/markdown");
    expect(r.path).toContain(tempDir);
  });
});

// ============================================================================
// --print-config output shape
// ============================================================================

describe("cortex-tms mcp --print-config", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeFile(join(tempDir, ".cortexrc"), STANDARD_CORTEXRC);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("exits 0 and outputs config snippets", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBeTruthy();
  });

  it("output contains Claude Desktop section", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.stdout).toContain("Claude Desktop");
  });

  it("output contains Cursor section", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.stdout).toContain("Cursor");
  });

  it("output contains Windsurf section", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.stdout).toContain("Windsurf");
  });

  it("output contains Copilot stub comment", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.stdout).toContain("Copilot");
  });

  it("each JSON block in output is individually parseable and contains -y flag", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);

    // Split output by "# " header lines, extract sections that start with "{"
    const sections = result.stdout
      .split(/^# /m)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("{") || s.includes("\n{"));

    // Extract the JSON part from each section (everything from first "{" to end)
    const parsedBlocks = sections
      .map((s) => {
        const start = s.indexOf("{");
        if (start === -1) return null;
        try {
          return JSON.parse(s.slice(start));
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    expect(parsedBlocks.length).toBeGreaterThanOrEqual(2);

    // Each block must have mcpServers.cortex-tms with -y flag
    for (const block of parsedBlocks) {
      const server = (block as Record<string, Record<string, {command: string; args: string[]}>>)
        ?.mcpServers?.["cortex-tms"];
      expect(server).toBeDefined();
      expect(server.command).toBe("npx");
      expect(server.args).toContain("-y");
      expect(server.args).toContain("cortex-tms");
      expect(server.args).toContain("mcp");
    }
  });

  it("Claude Desktop block contains cwd field", async () => {
    const result = await runCommand("mcp", ["--print-config"], tempDir);
    expect(result.stdout).toContain('"cwd"');
  });

  it("does not start the MCP server (exits promptly)", async () => {
    const start = Date.now();
    const result = await runCommand("mcp", ["--print-config"], tempDir, 5000);
    expect(result.exitCode).toBe(0);
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ============================================================================
// Integration — MCP server via subprocess + SDK client
// ============================================================================

describe("cortex-tms mcp (integration)", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await writeFile(join(tempDir, ".cortexrc"), STANDARD_CORTEXRC);
    await seedFile(tempDir, "NEXT-TASKS.md", "# Tasks\n- [ ] test task");
    await seedFile(tempDir, "CLAUDE.md", "# Instructions");
    await seedFile(
      tempDir,
      "docs/core/PATTERNS.md",
      "# Patterns\ncode patterns here",
    );
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  async function connectMcpClient(cwd: string) {
    const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
    const { StdioClientTransport } = await import(
      "@modelcontextprotocol/sdk/client/stdio.js"
    );
    const transport = new StdioClientTransport({
      command: "node",
      args: [CLI_PATH, "mcp"],
      env: { ...process.env, NO_COLOR: "1" },
      cwd,
    });
    const client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(transport);
    return client;
  }

  it("lists resources matching seeded files", async () => {
    const client = await connectMcpClient(tempDir);
    try {
      const { resources } = await client.listResources();
      const uris = resources.map((r: { uri: string }) => r.uri).sort();
      expect(uris).toContain("cortex://next-tasks");
      expect(uris).toContain("cortex://claude");
      expect(uris).toContain("cortex://patterns");
    } finally {
      await client.close();
    }
  }, 10000);

  it("reads resource contents correctly", async () => {
    const client = await connectMcpClient(tempDir);
    try {
      const result = await client.readResource({ uri: "cortex://next-tasks" });
      expect(result.contents).toHaveLength(1);
      const content = result.contents[0] as { text?: string };
      expect(content.text).toContain("test task");
    } finally {
      await client.close();
    }
  }, 10000);

  it("tools/list returns empty array (no write tools)", async () => {
    const client = await connectMcpClient(tempDir);
    try {
      const { tools } = await client.listTools();
      expect(tools).toEqual([]);
    } finally {
      await client.close();
    }
  }, 10000);

  it("prompts/list returns empty array", async () => {
    const client = await connectMcpClient(tempDir);
    try {
      const { prompts } = await client.listPrompts();
      expect(prompts).toEqual([]);
    } finally {
      await client.close();
    }
  }, 10000);

  it("exits 1 with stderr message when no .cortexrc exists", async () => {
    // Create an empty dir (no .cortexrc) — spawn needs an existing cwd
    const emptyDir = await createTempDir();
    try {
      const result = await runCommand("mcp", [], emptyDir, 5000);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain(".cortexrc");
    } finally {
      await cleanupTempDir(emptyDir);
    }
  });
});

// ============================================================================
// Regression — stdout purity check
// ============================================================================

describe("mcp.ts stdout purity (static regression)", () => {
  it("mcp.ts server handlers do not import chalk or ora, and do not use console.log", async () => {
    const { readFile } = await import("fs/promises");
    const mcpSrc = await readFile(
      join(__dirname, "../commands/mcp.ts"),
      "utf-8",
    );

    // These would corrupt the STDIO protocol wire during server operation
    expect(mcpSrc).not.toMatch(/import.*chalk/);
    expect(mcpSrc).not.toMatch(/import.*\bora\b/);
    expect(mcpSrc).not.toMatch(/console\.log/);
    // process.stdout.write is allowed only in printConfig() (--print-config exits before SDK starts)
  });
});
