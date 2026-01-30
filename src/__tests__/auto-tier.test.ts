/**
 * Unit Tests - Auto-Tier Command
 *
 * Tests the git-based auto-tiering functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import {
  createTempDir,
  cleanupTempDir,
} from './utils/temp-dir.js';
import {
  isGitRepo,
  getFileLastCommit,
  analyzeFileHistory,
} from '../utils/git-history.js';
import { readTierTag, writeTierTag } from '../utils/tier-tags.js';

/**
 * Helper to initialize a git repo in a directory
 */
async function initGitRepo(dir: string): Promise<void> {
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@example.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Test User"', { cwd: dir, stdio: 'ignore' });
}

/**
 * Helper to create and commit a file
 */
async function createAndCommitFile(
  dir: string,
  filename: string,
  content: string
): Promise<void> {
  await writeFile(join(dir, filename), content);
  execSync(`git add "${filename}"`, { cwd: dir, stdio: 'ignore' });
  execSync(`git commit -m "Add ${filename}"`, { cwd: dir, stdio: 'ignore' });
}

describe('git-history.ts - Git Repository Detection', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should detect git repository', async () => {
    await initGitRepo(tempDir);
    expect(isGitRepo(tempDir)).toBe(true);
  });

  it('should return false for non-git directory', () => {
    expect(isGitRepo(tempDir)).toBe(false);
  });
});

describe('git-history.ts - File History Analysis', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await initGitRepo(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should get last commit timestamp for a file', async () => {
    await createAndCommitFile(tempDir, 'test.md', '# Test File');

    const timestamp = getFileLastCommit(tempDir, 'test.md');

    expect(timestamp).not.toBeNull();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });

  it('should return null for untracked files', async () => {
    await writeFile(join(tempDir, 'untracked.md'), '# Untracked');

    const timestamp = getFileLastCommit(tempDir, 'untracked.md');

    expect(timestamp).toBeNull();
  });

  it('should analyze file history for multiple files', async () => {
    await createAndCommitFile(tempDir, 'file1.md', '# File 1');
    await createAndCommitFile(tempDir, 'file2.md', '# File 2');
    await writeFile(join(tempDir, 'file3.md'), '# File 3 (untracked)');

    const results = analyzeFileHistory(tempDir, [
      'file1.md',
      'file2.md',
      'file3.md',
    ]);

    expect(results.length).toBe(3);

    // Tracked files
    expect(results[0].isTracked).toBe(true);
    expect(results[0].lastCommitTimestamp).not.toBeNull();
    expect(results[1].isTracked).toBe(true);
    expect(results[1].lastCommitTimestamp).not.toBeNull();

    // Untracked file
    expect(results[2].isTracked).toBe(false);
    expect(results[2].isNewFile).toBe(true);
    expect(results[2].daysSinceChange).toBe(0);
  });
});

describe('tier-tags.ts - Tier Tag Reading/Writing', () => {
  it('should read existing tier tag', () => {
    const content = '<!-- @cortex-tms-tier HOT -->\n# Test File';
    expect(readTierTag(content)).toBe('HOT');
  });

  it('should read tier tag with extra whitespace', () => {
    const content = '<!--   @cortex-tms-tier   WARM   -->\n# Test File';
    expect(readTierTag(content)).toBe('WARM');
  });

  it('should return null for files without tier tag', () => {
    const content = '# Test File\n\nNo tier tag here.';
    expect(readTierTag(content)).toBeNull();
  });

  it('should insert tier tag at beginning of file', () => {
    const content = '# Test File\n\nSome content.';
    const updated = writeTierTag(content, 'HOT');

    expect(updated).toBe('<!-- @cortex-tms-tier HOT -->\n# Test File\n\nSome content.');
    expect(readTierTag(updated)).toBe('HOT');
  });

  it('should update existing tier tag', () => {
    const content = '<!-- @cortex-tms-tier WARM -->\n# Test File';
    const updated = writeTierTag(content, 'COLD');

    expect(updated).toBe('<!-- @cortex-tms-tier COLD -->\n# Test File');
    expect(readTierTag(updated)).toBe('COLD');
  });

  it('should preserve front matter when inserting tier tag', () => {
    const content = '---\ntitle: Test\ndate: 2026-01-30\n---\n# Test File';
    const updated = writeTierTag(content, 'HOT');

    expect(updated).toContain('---\ntitle: Test\ndate: 2026-01-30\n---\n');
    expect(updated).toContain('<!-- @cortex-tms-tier HOT -->');
    expect(readTierTag(updated)).toBe('HOT');
  });
});

describe('tier-tags.ts - Edge Cases', () => {
  it('should handle all tier types (HOT, WARM, COLD)', () => {
    const tiers: Array<'HOT' | 'WARM' | 'COLD'> = ['HOT', 'WARM', 'COLD'];

    tiers.forEach(tier => {
      const content = '# Test';
      const updated = writeTierTag(content, tier);
      expect(readTierTag(updated)).toBe(tier);
    });
  });

  it('should handle empty content', () => {
    const content = '';
    const updated = writeTierTag(content, 'HOT');

    expect(updated).toBe('<!-- @cortex-tms-tier HOT -->\n');
    expect(readTierTag(updated)).toBe('HOT');
  });

  it('should handle content with only whitespace', () => {
    const content = '\n\n\n';
    const updated = writeTierTag(content, 'WARM');

    expect(updated).toContain('<!-- @cortex-tms-tier WARM -->');
    expect(readTierTag(updated)).toBe('WARM');
  });
});
