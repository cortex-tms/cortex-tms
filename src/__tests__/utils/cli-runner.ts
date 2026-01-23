/**
 * CLI Runner Utility
 *
 * Provides helpers to execute CLI commands in isolated test environments.
 * Used for integration testing of command workflows.
 */

import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the CLI entry point
const CLI_PATH = join(__dirname, '../../../bin/cortex-tms.js');

export interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Run a CLI command in a specified directory
 *
 * @param command - The command name (init, validate, status, etc.)
 * @param args - Command arguments
 * @param cwd - Working directory for the command
 * @param timeout - Timeout in milliseconds (default: 30000)
 * @returns Promise with command result
 */
export async function runCommand(
  command: string,
  args: string[] = [],
  cwd: string = process.cwd(),
  timeout: number = 30000
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CLI_PATH, command, ...args], {
      cwd,
      env: {
        ...process.env,
        // Disable interactive prompts
        CI: 'true',
        // Disable colors for easier assertion
        NO_COLOR: '1',
      },
      timeout,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
      });
    });

    // Handle timeout
    setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Run multiple commands in sequence
 *
 * @param commands - Array of [command, args] tuples
 * @param cwd - Working directory
 * @returns Array of command results
 */
export async function runCommandSequence(
  commands: Array<[string, string[]]>,
  cwd: string
): Promise<CommandResult[]> {
  const results: CommandResult[] = [];

  for (const [command, args] of commands) {
    const result = await runCommand(command, args, cwd);
    results.push(result);

    // Stop if a command fails
    if (result.exitCode !== 0) {
      break;
    }
  }

  return results;
}

/**
 * Assert command succeeds
 */
export function expectSuccess(result: CommandResult): void {
  if (result.exitCode !== 0) {
    throw new Error(
      `Command failed with exit code ${result.exitCode}\n` +
      `stdout: ${result.stdout}\n` +
      `stderr: ${result.stderr}`
    );
  }
}

/**
 * Assert command fails
 */
export function expectFailure(result: CommandResult): void {
  if (result.exitCode === 0) {
    throw new Error(
      `Command succeeded but was expected to fail\n` +
      `stdout: ${result.stdout}`
    );
  }
}
