/**
 * Cortex TMS CLI - Type Definitions
 *
 * TypeScript interfaces for the CLI tool
 */

/**
 * User responses from the interactive init prompt
 */
export interface InitPromptAnswers {
  projectName: string;
  description?: string;
  includeTemplates: TemplateSelection[];
  overwrite: boolean;
}

/**
 * Template categories that can be selected during init
 */
export type TemplateSelection =
  | 'all'
  | 'minimal'
  | 'core-docs'
  | 'workflow-files'
  | 'example-app';

/**
 * Configuration for project detection
 */
export interface ProjectContext {
  isGitRepo: boolean;
  hasPackageJson: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';
  existingFiles: string[];
}

/**
 * Template file metadata
 */
export interface TemplateFile {
  source: string; // Path in templates/ directory
  destination: string; // Path in user's project
  hasPlaceholders: boolean; // Whether file contains [Project Name] etc.
  category: 'core' | 'workflow' | 'example';
}

/**
 * Options for the init command
 */
export interface InitCommandOptions {
  force?: boolean; // Skip confirmation prompts
  minimal?: boolean; // Install minimal template set only
  verbose?: boolean; // Show detailed output
}

/**
 * CLI tool configuration
 */
export interface CliConfig {
  version: string;
  templatesDir: string;
  outputDir: string;
}

/**
 * Validation check result
 */
export interface ValidationCheck {
  name: string;
  passed: boolean;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
  file?: string;
  line?: number;
}

/**
 * Overall validation result
 */
export interface ValidationResult {
  passed: boolean;
  checks: ValidationCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
  };
}

/**
 * File size limits for TMS files (Rule 4)
 */
export interface LineLimits {
  'NEXT-TASKS.md': number;
  'FUTURE-ENHANCEMENTS.md': number;
  'ARCHITECTURE.md': number;
  'PATTERNS.md': number;
  'DOMAIN-LOGIC.md': number;
  'DECISIONS.md': number;
  'GLOSSARY.md': number;
  'SCHEMA.md': number;
  'TROUBLESHOOTING.md': number;
  [key: string]: number; // Allow custom files
}

/**
 * Mandatory files that must exist in a TMS project
 */
export type MandatoryFile =
  | 'NEXT-TASKS.md'
  | '.github/copilot-instructions.md'
  | 'CLAUDE.md';

/**
 * Options for the validate command
 */
export interface ValidateCommandOptions {
  fix?: boolean; // Auto-fix issues where possible
  strict?: boolean; // Treat warnings as errors
  verbose?: boolean; // Show detailed output
}
