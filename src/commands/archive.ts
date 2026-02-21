/**
 * Cortex TMS CLI - Archive Command
 *
 * Archives completed tasks from NEXT-TASKS.md to docs/archive/
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface ArchiveOptions {
  dryRun?: boolean;
}

/**
 * Create and configure the archive command
 */
export function createArchiveCommand(): Command {
  const archiveCommand = new Command('archive');

  archiveCommand
    .description('Archive completed tasks and old content')
    .option('--dry-run', 'Preview what would be archived without making changes')
    .action(async (options: ArchiveOptions) => {
      await runArchive(options);
    });

  return archiveCommand;
}

/**
 * Main archive command logic
 */
async function runArchive(options: ArchiveOptions): Promise<void> {
  const cwd = process.cwd();
  const nextTasksPath = join(cwd, 'NEXT-TASKS.md');
  const archiveDir = join(cwd, 'docs', 'archive');

  console.log(chalk.bold.cyan('\n📦 Cortex TMS Archive\n'));

  if (!existsSync(nextTasksPath)) {
    console.log(chalk.yellow('⚠️  NEXT-TASKS.md not found in current directory'));
    console.log(chalk.gray('   Run this command from your project root\n'));
    return;
  }

  const spinner = ora('Analyzing tasks...').start();

  try {
    // Read NEXT-TASKS.md
    const content = await readFile(nextTasksPath, 'utf-8');

    // Count completed tasks (simple heuristic: lines with ✅ or [x])
    const lines = content.split('\n');
    const completedTaskLines = lines.filter(line =>
      line.includes('✅') || /\[x\]/i.test(line) || line.includes('COMPLETED')
    );

    spinner.succeed(`Found ${completedTaskLines.length} completed task markers`);

    if (completedTaskLines.length === 0) {
      console.log(chalk.green('\n✓ No completed tasks to archive'));
      console.log(chalk.gray('  NEXT-TASKS.md is already clean\n'));
      return;
    }

    // In dry-run mode, just show what would be done
    if (options.dryRun) {
      console.log(chalk.bold('\n📋 Archive Preview (Dry Run)\n'));
      console.log(chalk.gray('  The following would be archived:\n'));
      completedTaskLines.slice(0, 5).forEach(line => {
        console.log(chalk.gray(`    ${line.trim().substring(0, 80)}...`));
      });
      if (completedTaskLines.length > 5) {
        console.log(chalk.gray(`    ... and ${completedTaskLines.length - 5} more\n`));
      }
      console.log(chalk.yellow('\n⚠️  Run without --dry-run to actually archive\n'));
      return;
    }

    // Create archive directory if it doesn't exist
    if (!existsSync(archiveDir)) {
      await mkdir(archiveDir, { recursive: true });
    }

    // Generate archive filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const archiveFilename = `completed-tasks-${timestamp}.md`;
    const archivePath = join(archiveDir, archiveFilename);

    // Create archive file content
    const archiveContent = `# Completed Tasks - Archived ${timestamp}

This file contains tasks that were completed and archived from NEXT-TASKS.md.

---

${completedTaskLines.join('\n')}

---

Archived on: ${new Date().toISOString()}
`;

    // Write archive file
    await writeFile(archivePath, archiveContent, 'utf-8');

    console.log(chalk.bold('\n✨ Archive Complete\n'));
    console.log(chalk.green(`  ✓ Archived ${completedTaskLines.length} completed tasks`));
    console.log(chalk.gray(`  ✓ Saved to: ${archivePath.replace(cwd, '.')}\n`));
    console.log(chalk.yellow('⚠️  Note: NEXT-TASKS.md was not modified'));
    console.log(chalk.gray('    Manually remove completed tasks from NEXT-TASKS.md'));
    console.log(chalk.gray('    Or use `cortex-tms validate` to check for cleanup recommendations\n'));

  } catch (error) {
    spinner.fail('Archive failed');
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

// Export the command instance
export const archiveCommand = createArchiveCommand();
export default createArchiveCommand;
