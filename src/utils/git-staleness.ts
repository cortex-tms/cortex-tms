/**
 * Git Staleness Detection Utilities
 *
 * Provides git-based freshness checks for documentation files
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

export interface StalenessResult {
  isStale: boolean;
  docLastModified: number | null; // epoch seconds
  codeLastModified: number | null; // epoch seconds
  daysSinceDocUpdate: number | null;
  meaningfulCommits: number;
  reason: string;
}

/**
 * Get the last commit timestamp for a file or directory
 * Returns epoch seconds or null if not found/error
 */
export function getLastGitCommitEpochSeconds(pathSpec: string, cwd: string): number | null {
  try {
    const result = execSync(`git log -1 --format=%ct -- "${pathSpec}"`, {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
    }).trim();

    if (!result) {
      return null;
    }

    const timestamp = parseInt(result, 10);
    return isNaN(timestamp) ? null : timestamp;
  } catch {
    return null;
  }
}

/**
 * Count meaningful commits in a directory since a given timestamp
 * Excludes: merge commits, test-only changes, lockfile-only changes
 */
export function countMeaningfulCommits(
  pathSpec: string,
  sinceEpoch: number,
  cwd: string
): number {
  try {
    // Get commits since timestamp, excluding merges
    const result = execSync(
      `git log --no-merges --format=%H --since="${sinceEpoch}" -- "${pathSpec}"`,
      {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }
    ).trim();

    if (!result) {
      return 0;
    }

    const commits = result.split('\n').filter(Boolean);

    // Filter out commits that only touch test/config/lockfiles
    let meaningfulCount = 0;
    for (const commitHash of commits) {
      const files = execSync(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      })
        .trim()
        .split('\n')
        .filter(Boolean);

      // Check if commit has at least one non-test/non-config file
      const hasMeaningfulFile = files.some(
        (file) =>
          !file.includes('test') &&
          !file.includes('.test.') &&
          !file.includes('package-lock.json') &&
          !file.includes('yarn.lock') &&
          !file.includes('pnpm-lock.yaml') &&
          !file.endsWith('.config.js') &&
          !file.endsWith('.config.ts')
      );

      if (hasMeaningfulFile) {
        meaningfulCount++;
      }
    }

    return meaningfulCount;
  } catch {
    return 0;
  }
}

/**
 * Check if repository is shallow clone
 */
export function isShallowClone(cwd: string): boolean {
  const shallowFile = `${cwd}/.git/shallow`;
  return existsSync(shallowFile);
}

/**
 * Check if a governance doc is stale relative to code changes
 */
export function checkDocStaleness(
  docPath: string,
  watchPaths: string[],
  thresholdDays: number,
  minCommits: number,
  cwd: string
): StalenessResult {
  // Get doc last modified timestamp
  const docTimestamp = getLastGitCommitEpochSeconds(docPath, cwd);

  if (docTimestamp === null) {
    return {
      isStale: false,
      docLastModified: null,
      codeLastModified: null,
      daysSinceDocUpdate: null,
      meaningfulCommits: 0,
      reason: 'Doc has no git history (may be new or untracked)',
    };
  }

  // Get most recent code change across all watch paths
  let mostRecentCodeTimestamp = 0;
  for (const watchPath of watchPaths) {
    const timestamp = getLastGitCommitEpochSeconds(watchPath, cwd);
    if (timestamp && timestamp > mostRecentCodeTimestamp) {
      mostRecentCodeTimestamp = timestamp;
    }
  }

  if (mostRecentCodeTimestamp === 0) {
    return {
      isStale: false,
      docLastModified: docTimestamp,
      codeLastModified: null,
      daysSinceDocUpdate: null,
      meaningfulCommits: 0,
      reason: 'No code changes found in watched paths',
    };
  }

  // Calculate age difference
  const secondsSinceDocUpdate = mostRecentCodeTimestamp - docTimestamp;
  const daysSinceDocUpdate = secondsSinceDocUpdate / (60 * 60 * 24);

  // If doc is newer than code, it's fresh
  if (daysSinceDocUpdate <= 0) {
    return {
      isStale: false,
      docLastModified: docTimestamp,
      codeLastModified: mostRecentCodeTimestamp,
      daysSinceDocUpdate: 0,
      meaningfulCommits: 0,
      reason: 'Doc is up to date (modified after code)',
    };
  }

  // Count meaningful commits since doc was updated
  let totalMeaningfulCommits = 0;
  for (const watchPath of watchPaths) {
    totalMeaningfulCommits += countMeaningfulCommits(watchPath, docTimestamp, cwd);
  }

  // Check staleness conditions
  const exceedsTimeThreshold = daysSinceDocUpdate > thresholdDays;
  const exceedsCommitThreshold = totalMeaningfulCommits >= minCommits;

  const isStale = exceedsTimeThreshold && exceedsCommitThreshold;

  let reason = '';
  if (isStale) {
    reason = `Doc is ${Math.round(daysSinceDocUpdate)} days older than code with ${totalMeaningfulCommits} meaningful commits`;
  } else if (exceedsTimeThreshold && !exceedsCommitThreshold) {
    reason = `Time threshold exceeded but only ${totalMeaningfulCommits} commits (< ${minCommits} minimum)`;
  } else {
    reason = `Within ${thresholdDays} day threshold (${Math.round(daysSinceDocUpdate)} days)`;
  }

  return {
    isStale,
    docLastModified: docTimestamp,
    codeLastModified: mostRecentCodeTimestamp,
    daysSinceDocUpdate: Math.round(daysSinceDocUpdate),
    meaningfulCommits: totalMeaningfulCommits,
    reason,
  };
}
