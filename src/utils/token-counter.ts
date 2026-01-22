/**
 * Cortex TMS CLI - Token Counter
 *
 * Analyzes HOT/WARM/COLD file token usage to demonstrate context optimization.
 * Uses simple heuristic: ~4 characters per token (GPT-3/4 average)
 */

import { readFile } from 'fs/promises';
import { glob } from 'glob';

/**
 * Token estimation heuristic
 * Based on GPT-3/4 tokenization: ~4 chars per token average
 */
const CHARS_PER_TOKEN = 4;

/**
 * Pricing estimates (USD per 1M tokens)
 * Updated as of January 2026
 */
export const MODEL_PRICING = {
  'claude-sonnet-3.5': {
    input: 3.0,
    output: 15.0,
  },
  'claude-opus-3.5': {
    input: 15.0,
    output: 75.0,
  },
  'gpt-4-turbo': {
    input: 10.0,
    output: 30.0,
  },
  'gpt-4': {
    input: 30.0,
    output: 60.0,
  },
} as const;

export type ModelName = keyof typeof MODEL_PRICING;

/**
 * Token count result for a single file
 */
export interface FileTokenCount {
  path: string;
  tier: 'HOT' | 'WARM' | 'COLD';
  characters: number;
  tokens: number;
}

/**
 * Aggregated token statistics
 */
export interface TokenStats {
  hot: {
    files: FileTokenCount[];
    totalTokens: number;
    totalChars: number;
  };
  warm: {
    files: FileTokenCount[];
    totalTokens: number;
    totalChars: number;
  };
  cold: {
    files: FileTokenCount[];
    totalTokens: number;
    totalChars: number;
  };
  total: {
    files: number;
    tokens: number;
    chars: number;
  };
  savings: {
    percentReduction: number;
    tokensAvoided: number;
  };
}

/**
 * Cost estimate for a given model
 */
export interface CostEstimate {
  model: ModelName;
  perSession: number;
  perDay: number; // Assumes 10 sessions
  perMonth: number; // Assumes 20 working days
}

/**
 * HOT tier file patterns (always read)
 */
const HOT_PATTERNS = [
  'NEXT-TASKS.md',
  'CLAUDE.md',
  '.github/copilot-instructions.md',
];

/**
 * WARM tier file patterns (read on demand)
 */
const WARM_PATTERNS = [
  'docs/core/**/*.md',
  'ARCHITECTURE.md',
  'PATTERNS.md',
  'DOMAIN-LOGIC.md',
  'DECISIONS.md',
  'GLOSSARY.md',
  'SCHEMA.md',
  'TROUBLESHOOTING.md',
  'FUTURE-ENHANCEMENTS.md',
];

/**
 * COLD tier file patterns (archived, rarely read)
 */
const COLD_PATTERNS = ['docs/archive/**/*.md'];

/**
 * Count characters in a file
 */
async function countFileCharacters(filePath: string): Promise<number> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content.length;
  } catch {
    return 0;
  }
}

/**
 * Estimate tokens from character count
 */
function estimateTokens(characters: number): number {
  return Math.ceil(characters / CHARS_PER_TOKEN);
}

/**
 * Find files matching tier patterns
 */
async function findTierFiles(
  cwd: string,
  patterns: string[]
): Promise<string[]> {
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd,
      absolute: true,
      nodir: true,
      ignore: ['**/node_modules/**', '**/.git/**'],
    });
    allFiles.push(...matches);
  }

  // Remove duplicates
  return [...new Set(allFiles)];
}

/**
 * Count tokens for files in a specific tier
 */
async function countTierTokens(
  cwd: string,
  tier: 'HOT' | 'WARM' | 'COLD',
  patterns: string[]
): Promise<FileTokenCount[]> {
  const files = await findTierFiles(cwd, patterns);
  const counts: FileTokenCount[] = [];

  for (const filePath of files) {
    const characters = await countFileCharacters(filePath);
    const tokens = estimateTokens(characters);

    // Make path relative to cwd for display
    const relativePath = filePath.replace(cwd + '/', '');

    counts.push({
      path: relativePath,
      tier,
      characters,
      tokens,
    });
  }

  return counts.sort((a, b) => b.tokens - a.tokens); // Sort by tokens desc
}

/**
 * Analyze token usage across all tiers
 */
export async function analyzeTokenUsage(cwd: string): Promise<TokenStats> {
  // Count tokens for each tier
  const hotFiles = await countTierTokens(cwd, 'HOT', HOT_PATTERNS);
  const warmFiles = await countTierTokens(cwd, 'WARM', WARM_PATTERNS);
  const coldFiles = await countTierTokens(cwd, 'COLD', COLD_PATTERNS);

  // Calculate totals
  const hotTotal = hotFiles.reduce((sum, f) => sum + f.tokens, 0);
  const warmTotal = warmFiles.reduce((sum, f) => sum + f.tokens, 0);
  const coldTotal = coldFiles.reduce((sum, f) => sum + f.tokens, 0);

  const hotChars = hotFiles.reduce((sum, f) => sum + f.characters, 0);
  const warmChars = warmFiles.reduce((sum, f) => sum + f.characters, 0);
  const coldChars = coldFiles.reduce((sum, f) => sum + f.characters, 0);

  const totalTokens = hotTotal + warmTotal + coldTotal;
  const totalChars = hotChars + warmChars + coldChars;

  // Calculate savings (HOT vs. total)
  const tokensAvoided = totalTokens - hotTotal;
  const percentReduction =
    totalTokens > 0 ? (tokensAvoided / totalTokens) * 100 : 0;

  return {
    hot: {
      files: hotFiles,
      totalTokens: hotTotal,
      totalChars: hotChars,
    },
    warm: {
      files: warmFiles,
      totalTokens: warmTotal,
      totalChars: warmChars,
    },
    cold: {
      files: coldFiles,
      totalTokens: coldTotal,
      totalChars: coldChars,
    },
    total: {
      files: hotFiles.length + warmFiles.length + coldFiles.length,
      tokens: totalTokens,
      chars: totalChars,
    },
    savings: {
      percentReduction,
      tokensAvoided,
    },
  };
}

/**
 * Calculate cost estimates for different models
 */
export function calculateCostEstimates(
  hotTokens: number,
  model: ModelName = 'claude-sonnet-3.5'
): CostEstimate {
  const pricing = MODEL_PRICING[model];

  // Cost per session (input only, assuming AI reads context)
  const perSession = (hotTokens / 1_000_000) * pricing.input;

  // Estimates for typical usage
  const perDay = perSession * 10; // 10 sessions per day
  const perMonth = perDay * 20; // 20 working days

  return {
    model,
    perSession,
    perDay,
    perMonth,
  };
}

/**
 * Format token count with thousands separator
 */
export function formatTokens(tokens: number): string {
  return tokens.toLocaleString();
}

/**
 * Format cost in USD
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return '<$0.01';
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * Format percentage
 */
export function formatPercent(percent: number): string {
  return `${percent.toFixed(1)}%`;
}
