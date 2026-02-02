/**
 * Stats Collector - Gathers TMS project statistics
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { minimatch } from 'minimatch';

export interface TMSStats {
  files: {
    hot: number;
    warm: number;
    cold: number;
    total: number;
  };
  hotFiles: string[]; // List of actual HOT file paths
  validation: {
    status: 'healthy' | 'warnings' | 'errors' | 'unknown';
    violations: number;
    lastChecked: Date | null;
  };
  project: {
    name: string;
    hasTMS: boolean;
  };
}

/**
 * Extract tier from file content (@cortex-tier HOT/WARM/COLD)
 * Performance optimization: Only reads first 4KB since tier tags appear at file top
 */
function extractTierFromFile(filePath: string): 'HOT' | 'WARM' | 'COLD' | null {
  try {
    // Only read first 4KB - tier tags are typically in the file header
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(4096);
    const bytesRead = fs.readSync(fd, buffer, 0, 4096, 0);
    fs.closeSync(fd);

    const content = buffer.toString('utf-8', 0, bytesRead);
    const tierMatch = content.match(/@cortex-tier\s+(HOT|WARM|COLD)/i);
    return tierMatch && tierMatch[1] ? (tierMatch[1].toUpperCase() as 'HOT' | 'WARM' | 'COLD') : null;
  } catch {
    return null;
  }
}

/**
 * Determine tier based on file location (fallback if no explicit tier tag)
 */
function inferTierFromPath(filePath: string): 'HOT' | 'WARM' | 'COLD' {
  const normalized = filePath.toLowerCase();

  // HOT patterns (active development files) - lowercase to match normalized path
  const hotPatterns = [
    '**/next-tasks.md',
    '**/todo.md',
    '**/claude.md',
    '**/.github/copilot-instructions.md',
    '**/wip*.md',
  ];

  // WARM patterns (reference documentation) - lowercase to match normalized path
  const warmPatterns = [
    '**/docs/**/*.md',
    '**/architecture.md',
    '**/patterns.md',
    '**/decisions.md',
    '**/glossary.md',
    '**/readme.md',
  ];

  // COLD patterns (archives) - lowercase to match normalized path
  const coldPatterns = [
    '**/archive/**',
    '**/archived/**',
    '**/*-archive.md',
    '**/*-deprecated.md',
  ];

  // Check patterns in order (COLD first to catch archives before other matches)
  if (coldPatterns.some(pattern => minimatch(normalized, pattern))) return 'COLD';
  if (hotPatterns.some(pattern => minimatch(normalized, pattern))) return 'HOT';
  if (warmPatterns.some(pattern => minimatch(normalized, pattern))) return 'WARM';

  // Default to WARM for docs
  return 'WARM';
}

/**
 * Collect TMS statistics from current directory
 */
export async function collectTMSStats(cwd: string = process.cwd()): Promise<TMSStats> {
  const stats: TMSStats = {
    files: { hot: 0, warm: 0, cold: 0, total: 0 },
    hotFiles: [],
    validation: {
      status: 'unknown',
      violations: 0,
      lastChecked: null,
    },
    project: {
      name: path.basename(cwd),
      hasTMS: false,
    },
  };

  // Check if TMS is initialized
  const tmsIndicators = [
    'CLAUDE.md',
    'NEXT-TASKS.md',
    'docs/core/PATTERNS.md',
    '.github/copilot-instructions.md',
  ];

  for (const indicator of tmsIndicators) {
    if (fs.existsSync(path.join(cwd, indicator))) {
      stats.project.hasTMS = true;
      break;
    }
  }

  if (!stats.project.hasTMS) {
    return stats; // No TMS, return empty stats
  }

  // Find all markdown files (exclude templates, examples, and build artifacts)
  const markdownFiles = await glob('**/*.md', {
    cwd,
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/templates/**',      // Exclude template files
      '**/examples/**',       // Exclude example projects
      '**/website/**',        // Exclude website content (if it's a docs site)
    ],
    absolute: true,
  });

  // Performance check: warn about very large projects
  if (markdownFiles.length > 1000) {
    console.warn(
      `⚠️  Large project detected (${markdownFiles.length} markdown files). This may take a moment...`
    );
  }

  // Classify files by tier
  for (const file of markdownFiles) {
    const tier = extractTierFromFile(file) || inferTierFromPath(file);

    stats.files.total++;
    if (tier === 'HOT') {
      stats.files.hot++;
      // Store relative path for display
      const relativePath = path.relative(cwd, file);
      stats.hotFiles.push(relativePath);
    } else if (tier === 'WARM') {
      stats.files.warm++;
    } else if (tier === 'COLD') {
      stats.files.cold++;
    }
  }

  // Check for validation results (if user has run validate recently)
  const validationCache = path.join(cwd, '.cortex', 'validation-cache.json');
  if (fs.existsSync(validationCache)) {
    try {
      const cache = fs.readJSONSync(validationCache);
      stats.validation.lastChecked = new Date(cache.timestamp);
      stats.validation.violations = cache.violations || 0;

      // Determine status based on severity
      // Future: cache.severity could distinguish 'errors' vs 'warnings'
      if (cache.violations === 0) {
        stats.validation.status = 'healthy';
      } else if (cache.severity === 'error' || cache.violations > 10) {
        stats.validation.status = 'errors';
      } else {
        stats.validation.status = 'warnings';
      }
    } catch {
      // Ignore cache read errors
    }
  }

  return stats;
}
