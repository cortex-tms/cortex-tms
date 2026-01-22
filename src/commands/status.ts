/**
 * Cortex TMS CLI - Status Command
 *
 * Provides a high-level project dashboard showing scope, sprint progress,
 * health summary, and backlog size.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getProjectStatus, calculateProgress } from '../utils/status.js';
import { validateProject } from '../utils/validator.js';
import {
  analyzeTokenUsage,
  calculateCostEstimates,
  formatTokens,
  formatCost,
  formatPercent,
  type ModelName,
  MODEL_PRICING,
} from '../utils/token-counter.js';

/**
 * Create and configure the status command
 */
export function createStatusCommand(): Command {
  const statusCommand = new Command('status');

  statusCommand
    .description('Show project health dashboard')
    .option('-t, --tokens', 'Show token usage analysis and cost estimates')
    .option(
      '-m, --model <model>',
      'Model for cost estimates (claude-sonnet-3.5, claude-opus-3.5, gpt-4-turbo, gpt-4)',
      'claude-sonnet-3.5'
    )
    .action(async (options) => {
      if (options.tokens) {
        await runTokenAnalysis(options.model);
      } else {
        await runStatus();
      }
    });

  return statusCommand;
}

/**
 * Main status command logic
 */
async function runStatus(): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n📊 Cortex TMS Status Dashboard\n'));

  // Gather status information
  const spinner = ora('Gathering project information...').start();

  try {
    const status = await getProjectStatus(cwd);
    const validation = await validateProject(cwd, { strict: false });

    spinner.succeed('Project information loaded');

    // Project Identity Section
    console.log(chalk.bold('\n🏷️  Project Identity'));
    console.log(`  ${chalk.cyan('Name:')} ${status.projectName}`);
    console.log(
      `  ${chalk.cyan('Scope:')} ${formatScope(status.scope)} ${getScopeEmoji(status.scope)}`
    );
    if (status.config) {
      console.log(`  ${chalk.cyan('TMS Version:')} ${status.config.version}`);
    }

    // Health Section
    console.log(chalk.bold('\n💚 Project Health'));
    const healthEmoji = validation.passed ? '✅' : '⚠️';
    const healthText = validation.passed ? chalk.green('Healthy') : chalk.yellow('Issues Found');
    console.log(`  ${healthEmoji} ${healthText}`);
    console.log(
      `  ${chalk.cyan('Checks:')} ${validation.summary.passed}/${validation.summary.total} passed`
    );
    if (validation.summary.warnings > 0) {
      console.log(`  ${chalk.yellow('⚠')} ${validation.summary.warnings} warnings`);
    }
    if (validation.summary.errors > 0) {
      console.log(`  ${chalk.red('✗')} ${validation.summary.errors} errors`);
    }

    // Sprint Section
    if (status.sprint) {
      console.log(chalk.bold('\n🎯 Current Sprint'));
      console.log(`  ${chalk.cyan('Name:')} ${status.sprint.name}`);
      if (status.sprint.description) {
        console.log(`  ${chalk.cyan('Focus:')} ${status.sprint.description}`);
      }

      const progress = calculateProgress(status.sprint);
      const progressBar = createProgressBar(progress, 20);
      const progressColor = progress === 100 ? chalk.green : progress >= 50 ? chalk.yellow : chalk.gray;

      console.log(`  ${chalk.cyan('Progress:')} ${progressBar} ${progressColor(`${progress}%`)}`);
      console.log(
        `  ${chalk.cyan('Tasks:')} ${status.sprint.completedTasks} done, ${status.sprint.inProgressTasks} in progress, ${status.sprint.todoTasks} todo`
      );
    } else {
      console.log(chalk.bold('\n🎯 Current Sprint'));
      console.log(chalk.gray('  No active sprint found in NEXT-TASKS.md'));
    }

    // Backlog Section
    console.log(chalk.bold('\n📋 Backlog'));
    if (status.backlogSize > 0) {
      console.log(`  ${chalk.cyan('Future Enhancements:')} ${status.backlogSize} items pending`);
    } else {
      console.log(chalk.gray('  No backlog items found in FUTURE-ENHANCEMENTS.md'));
    }

    // Quick Actions
    console.log(chalk.bold('\n⚡ Quick Actions'));
    console.log(chalk.gray('  Run'), chalk.cyan('cortex-tms validate'), chalk.gray('for detailed health checks'));
    console.log(chalk.gray('  Edit'), chalk.cyan('NEXT-TASKS.md'), chalk.gray('to update sprint tasks'));
    if (validation.summary.warnings > 0 || validation.summary.errors > 0) {
      console.log(
        chalk.gray('  Run'),
        chalk.cyan('cortex-tms validate --fix'),
        chalk.gray('to auto-fix issues')
      );
    }

    console.log(); // Add trailing newline
  } catch (error) {
    spinner.fail('Failed to gather project information');
    console.error(
      chalk.red('\n❌ Error:'),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  }
}

/**
 * Token analysis command logic
 */
async function runTokenAnalysis(modelName: string = 'claude-sonnet-3.5'): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n📊 Token Usage Analysis\n'));

  const spinner = ora('Analyzing token usage...').start();

  try {
    const stats = await analyzeTokenUsage(cwd);
    spinner.succeed('Analysis complete');

    // HOT Files Section
    console.log(chalk.bold('\n🔥 HOT Files (Always Read)'));
    console.log(chalk.gray('  Files read at the start of every AI session\n'));

    if (stats.hot.files.length > 0) {
      stats.hot.files.forEach((file) => {
        const tokenStr = formatTokens(file.tokens).padStart(8);
        console.log(`  ${chalk.cyan(tokenStr)} tokens  ${chalk.gray(file.path)}`);
      });
      console.log(
        chalk.gray('\n  ─────────────────────────────────────────────────────')
      );
      console.log(
        `  ${chalk.bold.cyan(formatTokens(stats.hot.totalTokens).padStart(8))} tokens  ${chalk.bold('Total HOT')}`
      );
    } else {
      console.log(chalk.gray('  No HOT files found'));
    }

    // WARM Files Section
    console.log(chalk.bold('\n📚 WARM Files (Read On Demand)'));
    console.log(chalk.gray('  Files read when implementing specific features\n'));

    if (stats.warm.files.length > 0) {
      // Show top 10 WARM files
      const topWarm = stats.warm.files.slice(0, 10);
      topWarm.forEach((file) => {
        const tokenStr = formatTokens(file.tokens).padStart(8);
        console.log(`  ${chalk.yellow(tokenStr)} tokens  ${chalk.gray(file.path)}`);
      });

      if (stats.warm.files.length > 10) {
        console.log(
          chalk.gray(`  ... and ${stats.warm.files.length - 10} more files`)
        );
      }

      console.log(
        chalk.gray('\n  ─────────────────────────────────────────────────────')
      );
      console.log(
        `  ${chalk.bold.yellow(formatTokens(stats.warm.totalTokens).padStart(8))} tokens  ${chalk.bold('Total WARM')}`
      );
    } else {
      console.log(chalk.gray('  No WARM files found'));
    }

    // COLD Files Section
    console.log(chalk.bold('\n❄️  COLD Files (Archived)'));
    console.log(chalk.gray('  Historical context - rarely read by AI\n'));

    if (stats.cold.files.length > 0) {
      // Show top 5 COLD files
      const topCold = stats.cold.files.slice(0, 5);
      topCold.forEach((file) => {
        const tokenStr = formatTokens(file.tokens).padStart(8);
        console.log(`  ${chalk.blue(tokenStr)} tokens  ${chalk.gray(file.path)}`);
      });

      if (stats.cold.files.length > 5) {
        console.log(
          chalk.gray(`  ... and ${stats.cold.files.length - 5} more files`)
        );
      }

      console.log(
        chalk.gray('\n  ─────────────────────────────────────────────────────')
      );
      console.log(
        `  ${chalk.bold.blue(formatTokens(stats.cold.totalTokens).padStart(8))} tokens  ${chalk.bold('Total COLD')}`
      );
    } else {
      console.log(chalk.gray('  No COLD files found'));
    }

    // Summary Section
    console.log(chalk.bold('\n📈 Summary'));
    console.log(
      `  ${chalk.cyan('Active Context (HOT):')} ${chalk.bold(formatTokens(stats.hot.totalTokens))} tokens`
    );
    console.log(
      `  ${chalk.cyan('Full Repository:')} ${formatTokens(stats.total.tokens)} tokens`
    );
    console.log(
      `  ${chalk.green('Context Reduction:')} ${chalk.bold(formatPercent(stats.savings.percentReduction))}`
    );
    console.log(
      `  ${chalk.cyan('Tokens Avoided:')} ${formatTokens(stats.savings.tokensAvoided)} per session`
    );

    // Cost Estimates Section
    const model = modelName as ModelName;
    if (MODEL_PRICING[model]) {
      const costs = calculateCostEstimates(stats.hot.totalTokens, model);

      console.log(chalk.bold(`\n💰 Cost Estimates (${model})`));
      console.log(
        `  ${chalk.cyan('Per Session:')} ${chalk.bold(formatCost(costs.perSession))}`
      );
      console.log(
        `  ${chalk.cyan('Per Day (10 sessions):')} ${formatCost(costs.perDay)}`
      );
      console.log(
        `  ${chalk.cyan('Per Month (20 days):')} ${chalk.bold(formatCost(costs.perMonth))}`
      );
    }

    // Sustainability Note
    console.log(chalk.bold('\n🌱 Sustainability Impact'));
    console.log(
      chalk.gray(
        `  By reducing context by ${formatPercent(stats.savings.percentReduction)}, you're:`
      )
    );
    console.log(chalk.gray('  • Reducing API costs'));
    console.log(chalk.gray('  • Lowering compute requirements'));
    console.log(chalk.gray('  • Decreasing energy consumption'));

    console.log(); // Trailing newline
  } catch (error) {
    spinner.fail('Token analysis failed');
    console.error(
      chalk.red('\n❌ Error:'),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  }
}

/**
 * Format scope name with proper capitalization
 */
function formatScope(scope: string): string {
  return scope.charAt(0).toUpperCase() + scope.slice(1).toLowerCase();
}

/**
 * Get emoji for project scope
 */
function getScopeEmoji(scope: string): string {
  switch (scope.toLowerCase()) {
    case 'nano':
      return '🔬';
    case 'standard':
      return '📦';
    case 'enterprise':
      return '🏢';
    default:
      return '❓';
  }
}

/**
 * Create a visual progress bar
 *
 * @param progress - Progress percentage (0-100)
 * @param width - Width of the progress bar in characters
 * @returns Formatted progress bar string
 */
function createProgressBar(progress: number, width: number): string {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  const filledColor = progress === 100 ? chalk.green : progress >= 50 ? chalk.yellow : chalk.gray;

  return `[${filledColor('█'.repeat(filled))}${chalk.gray('░'.repeat(empty))}]`;
}

// Export the command
export const statusCommand = createStatusCommand();
