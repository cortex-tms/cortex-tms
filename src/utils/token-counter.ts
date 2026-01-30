/**
 * Cortex TMS CLI - Token Counter
 *
 * Analyzes HOT/WARM/COLD file token usage to demonstrate context optimization.
 * Uses simple heuristic: ~4 characters per token (GPT-3/4 average)
 */

import { readFile } from 'fs/promises';
import { relative } from 'path';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import { readTierTag } from './tier-tags.js';

/**
 * Token estimation heuristic
 * Based on GPT-3/4 tokenization: ~4 chars per token average
 */
const CHARS_PER_TOKEN = 4;

/**
 * Pricing estimates (USD per 1M tokens)
 * Updated as of January 2026
 * Source: Anthropic and OpenAI pricing pages
 */
export const MODEL_PRICING = {
  // Claude 4.x series (current)
  'claude-sonnet-4.5': {
    input: 3.0,
    output: 15.0,
  },
  'claude-sonnet-4': {
    input: 3.0,
    output: 15.0,
  },
  'claude-opus-4.5': {
    input: 5.0,
    output: 25.0,
  },
  'claude-opus-4': {
    input: 15.0,
    output: 75.0,
  },
  'claude-haiku-4.5': {
    input: 1.0,
    output: 5.0,
  },
  // OpenAI GPT-4 series
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
  'PROMPTS.md',
];

/**
 * COLD tier file patterns (archived, rarely read)
 */
const COLD_PATTERNS = ['docs/archive/**/*.md'];

/**
 * Count characters in a file and return both content and character count
 */
async function readFileWithCharCount(filePath: string): Promise<{ content: string; characters: number }> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return { content, characters: content.length };
  } catch {
    return { content: '', characters: 0 };
  }
}

/**
 * Determine file tier based on tier tag or path patterns
 */
function getFileTier(content: string, path: string): 'HOT' | 'WARM' | 'COLD' {
  // First check for explicit tier tag
  const tierTag = readTierTag(content);
  if (tierTag) {
    return tierTag;
  }

  // Fall back to path-based patterns (existing behavior)
  if (HOT_PATTERNS.some(p => minimatch(path, p))) return 'HOT';
  if (WARM_PATTERNS.some(p => minimatch(path, p))) return 'WARM';
  if (COLD_PATTERNS.some(p => minimatch(path, p))) return 'COLD';

  // Default to WARM for unclassified files
  return 'WARM';
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
 * Analyze token usage across all tiers
 * Now supports both tier tags and path-based patterns
 */
export async function analyzeTokenUsage(cwd: string): Promise<TokenStats> {
  // Find all markdown files (from all tier patterns)
  const allPatterns = [...HOT_PATTERNS, ...WARM_PATTERNS, ...COLD_PATTERNS];
  const allFiles = await findTierFiles(cwd, allPatterns);

  // Classify each file and count tokens
  const hotFiles: FileTokenCount[] = [];
  const warmFiles: FileTokenCount[] = [];
  const coldFiles: FileTokenCount[] = [];

  for (const filePath of allFiles) {
    const { content, characters } = await readFileWithCharCount(filePath);
    const tokens = estimateTokens(characters);
    const relativePath = relative(cwd, filePath);

    // Determine tier (respects tier tags)
    const tier = getFileTier(content, relativePath);

    const fileCount: FileTokenCount = {
      path: relativePath,
      tier,
      characters,
      tokens,
    };

    if (tier === 'HOT') {
      hotFiles.push(fileCount);
    } else if (tier === 'WARM') {
      warmFiles.push(fileCount);
    } else {
      coldFiles.push(fileCount);
    }
  }

  // Sort files by token count (descending)
  hotFiles.sort((a, b) => b.tokens - a.tokens);
  warmFiles.sort((a, b) => b.tokens - a.tokens);
  coldFiles.sort((a, b) => b.tokens - a.tokens);

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
  model: ModelName = 'claude-sonnet-4.5'
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
