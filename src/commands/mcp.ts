/**
 * cortex-tms mcp — STDIO MCP Server
 *
 * Exposes TMS governance docs as read-only MCP resources.
 * stdout is exclusively owned by the MCP SDK transport — no other writes allowed.
 * All diagnostics go to stderr.
 */

import { Command } from "commander";
import { readFile } from "fs/promises";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { discoverResources } from "../utils/resources.js";
import { loadConfig } from "../utils/config.js";
import { CortexConfigMissingError } from "../utils/errors.js";
import { validateOptions, mcpOptionsSchema } from "../utils/validation.js";
import type { McpCommandOptions } from "../types/cli.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { version: pkgVersion } = JSON.parse(
  await readFile(join(__dirname, "../../package.json"), "utf-8"),
) as { version: string };

// ============================================================================
// --print-config
// ============================================================================

function printConfig(cwd: string): void {
  const snippets = [
    `# Claude Desktop  (~/Library/Application Support/Claude/claude_desktop_config.json on macOS)`,
    JSON.stringify(
      {
        mcpServers: {
          "cortex-tms": {
            command: "npx",
            args: ["-y", "cortex-tms", "mcp"],
            cwd,
          },
        },
      },
      null,
      2,
    ),
    "",
    `# Cursor  (.cursor/mcp.json in your project)`,
    JSON.stringify(
      {
        mcpServers: {
          "cortex-tms": {
            command: "npx",
            args: ["-y", "cortex-tms", "mcp"],
          },
        },
      },
      null,
      2,
    ),
    "",
    `# Windsurf  (~/.codeium/windsurf/mcp_config.json)`,
    JSON.stringify(
      {
        mcpServers: {
          "cortex-tms": {
            command: "npx",
            args: ["-y", "cortex-tms", "mcp"],
          },
        },
      },
      null,
      2,
    ),
    "",
    `# GitHub Copilot: MCP support not yet available from Microsoft —`,
    `#   see https://docs.github.com/copilot for updates.`,
  ];
  process.stdout.write(snippets.join("\n") + "\n");
}

// ============================================================================
// Server
// ============================================================================

async function runMcpServer(cwd: string): Promise<void> {
  // Validate config exists before starting the transport (fast fail, clear error)
  const config = await loadConfig(cwd);
  if (!config) throw new CortexConfigMissingError(cwd);

  const server = new Server(
    { name: "cortex-tms", version: pkgVersion },
    { capabilities: { resources: {}, tools: {}, prompts: {} } },
  );

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resources = await discoverResources(cwd);
    return {
      resources: resources.map(({ uri, name, description, mimeType }) => ({
        uri,
        name,
        description,
        mimeType,
      })),
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const resources = await discoverResources(cwd);
    const resource = resources.find((r) => r.uri === req.params.uri);
    if (!resource) {
      throw new Error(`Resource not found: ${req.params.uri}`);
    }
    const text = await readFile(resource.path, "utf-8");
    return {
      contents: [{ uri: resource.uri, mimeType: resource.mimeType, text }],
    };
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [] }));

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: [],
  }));

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// ============================================================================
// Command
// ============================================================================

export const mcpCommand = new Command("mcp")
  .description("Start a read-only MCP server exposing TMS governance docs")
  .option("--print-config", "Print paste-ready client config snippets and exit")
  .action(async (rawOptions: McpCommandOptions) => {
    const options = validateOptions(mcpOptionsSchema, rawOptions, "mcp");
    const cwd = resolve(process.cwd());

    if (options.printConfig) {
      printConfig(cwd);
      return;
    }

    try {
      await runMcpServer(cwd);
    } catch (err) {
      if (err instanceof CortexConfigMissingError) {
        process.stderr.write(`cortex-tms mcp: ${err.message}\n`);
        process.exit(1);
      }
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`cortex-tms mcp: fatal error: ${msg}\n`);
      process.exit(1);
    }
  });
