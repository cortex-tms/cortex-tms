/**
 * Cortex TMS CLI - Interactive Prompts
 *
 * Defines inquirer prompts for gathering user input during init
 */

import inquirer from 'inquirer';
import type { InitPromptAnswers, ProjectContext } from '../types/cli.js';
import { getDefaultProjectName } from './detection.js';

/**
 * Run interactive prompts for the init command
 *
 * @param context - Detected project context
 * @param cwd - Current working directory
 * @returns User's answers
 */
export async function runInitPrompts(
  context: ProjectContext,
  cwd: string
): Promise<InitPromptAnswers> {
  const defaultName = getDefaultProjectName(cwd);

  const answers = await inquirer.prompt<InitPromptAnswers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: defaultName,
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Project name is required';
        }
        if (input.length > 100) {
          return 'Project name must be 100 characters or less';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description (optional):',
      default: undefined,
    },
    {
      type: 'checkbox',
      name: 'includeTemplates',
      message: 'Which documentation templates do you want to include?',
      choices: [
        {
          name: 'Core Documentation (ARCHITECTURE, PATTERNS, DOMAIN-LOGIC, etc.)',
          value: 'core-docs',
          checked: true,
        },
        {
          name: 'Workflow Files (NEXT-TASKS, CLAUDE, copilot-instructions)',
          value: 'workflow-files',
          checked: true,
        },
        {
          name: 'Project Files (README, FUTURE-ENHANCEMENTS)',
          value: 'project-files',
          checked: true,
        },
      ],
      validate: (choices: string[]) => {
        if (choices.length === 0) {
          return 'Please select at least one template category';
        }
        return true;
      },
    },
  ]);

  // Add overwrite confirmation if files exist
  if (context.existingFiles.length > 0) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Warning: ${context.existingFiles.length} TMS file(s) already exist. Overwrite them?`,
        default: false,
      },
    ]);

    return { ...answers, overwrite };
  }

  return { ...answers, overwrite: false };
}

/**
 * Show a summary of what will be initialized
 *
 * @param answers - User's prompt answers
 * @param context - Project context
 */
export function showInitSummary(
  answers: InitPromptAnswers,
  context: ProjectContext
): void {
  console.log('\n📋 Summary:');
  console.log(`  Project: ${answers.projectName}`);
  if (answers.description) {
    console.log(`  Description: ${answers.description}`);
  }
  console.log(`  Templates: ${answers.includeTemplates.join(', ')}`);

  if (context.isGitRepo) {
    console.log(`  Git: Repository detected ✓`);
  }

  if (context.hasPackageJson) {
    console.log(
      `  Package Manager: ${context.packageManager !== 'unknown' ? context.packageManager : 'npm (default)'}`
    );
  }

  if (answers.overwrite) {
    console.log(`  ⚠️  Will overwrite ${context.existingFiles.length} existing files`);
  }

  console.log();
}

/**
 * Ask for final confirmation before proceeding
 *
 * @returns true if user confirms, false otherwise
 */
export async function confirmInit(): Promise<boolean> {
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Initialize Cortex TMS with these settings?',
      default: true,
    },
  ]);

  return confirmed;
}
