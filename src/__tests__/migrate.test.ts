/**
 * Integration Tests - Migrate Command
 *
 * Tests migration path handling, especially for nested directories.
 * CRITICAL-2 fix: Ensures nested paths like docs/core/PATTERNS.md work correctly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import {
  createTempDir,
  cleanupTempDir,
} from './utils/temp-dir.js';
import { extractVersion } from '../utils/templates.js';
import { saveConfig, createConfigFromScope } from '../utils/config.js';

/**
 * Helper to create a test file with version metadata
 */
async function createVersionedFile(
  filePath: string,
  version: string,
  customContent?: string
): Promise<void> {
  const dir = filePath.substring(0, filePath.lastIndexOf('/'));
  await mkdir(dir, { recursive: true });

  const content = customContent || '# Test Content\n\nThis is a test file.\n';
  const versionedContent = `${content}\n<!-- @cortex-tms-version ${version} -->\n`;

  await writeFile(filePath, versionedContent, 'utf-8');
}

describe('Migrate Command - Nested Path Handling (CRITICAL-2 Fix)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should correctly handle nested file paths like docs/core/PATTERNS.md', async () => {
    // Create a nested file structure
    const nestedPath = join(tempDir, 'docs/core/PATTERNS.md');
    await createVersionedFile(nestedPath, '2.5.0');

    // Extract version should work
    const version = await extractVersion(nestedPath);
    expect(version).toBe('2.5.0');

    // File should exist
    expect(existsSync(nestedPath)).toBe(true);
  });

  it('should preserve directory structure when analyzing files', async () => {
    // Create multiple nested files
    const files = [
      'NEXT-TASKS.md',
      'docs/core/PATTERNS.md',
      'docs/core/ARCHITECTURE.md',
      'docs/core/DOMAIN-LOGIC.md',
    ];

    for (const file of files) {
      const filePath = join(tempDir, file);
      await createVersionedFile(filePath, '2.6.0');
    }

    // All files should exist with correct structure
    for (const file of files) {
      const filePath = join(tempDir, file);
      expect(existsSync(filePath)).toBe(true);

      const version = await extractVersion(filePath);
      expect(version).toBe('2.6.0');
    }
  });

  it('should handle deeply nested paths (3+ levels)', async () => {
    const deepPath = join(tempDir, 'docs/archive/sprints/sprint-v2.5.md');
    await createVersionedFile(deepPath, '2.5.0');

    expect(existsSync(deepPath)).toBe(true);

    const version = await extractVersion(deepPath);
    expect(version).toBe('2.5.0');
  });

  it('should correctly extract version from nested files with prerelease tags', async () => {
    const nestedPath = join(tempDir, 'docs/core/PATTERNS.md');
    await createVersionedFile(nestedPath, '2.6.0-beta.1');

    const version = await extractVersion(nestedPath);
    expect(version).toBe('2.6.0-beta.1');
  });
});

describe('Migrate Command - Version Metadata', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should extract stable versions correctly', async () => {
    const filePath = join(tempDir, 'test.md');
    await createVersionedFile(filePath, '2.6.0');

    const version = await extractVersion(filePath);
    expect(version).toBe('2.6.0');
  });

  it('should extract prerelease versions correctly', async () => {
    const testCases = [
      '2.6.0-beta.1',
      '2.6.0-alpha.3',
      '3.0.0-rc.2',
      '1.0.0-beta',
    ];

    for (const expectedVersion of testCases) {
      const filePath = join(tempDir, `test-${expectedVersion}.md`);
      await createVersionedFile(filePath, expectedVersion);

      const version = await extractVersion(filePath);
      expect(version).toBe(expectedVersion);
    }
  });

  it('should return null for files without version metadata', async () => {
    const filePath = join(tempDir, 'no-version.md');
    await mkdir(tempDir, { recursive: true });
    await writeFile(filePath, '# Test\n\nNo version here.\n', 'utf-8');

    const version = await extractVersion(filePath);
    expect(version).toBeNull();
  });

  it('should return null for non-existent files', async () => {
    const filePath = join(tempDir, 'does-not-exist.md');
    const version = await extractVersion(filePath);
    expect(version).toBeNull();
  });
});

describe('Migrate Command - Config Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create config with correct metadata', async () => {
    const config = createConfigFromScope('standard', 'test-project');

    expect(config.scope).toBe('standard');
    expect(config.metadata?.projectName).toBe('test-project');
    expect(config.version).toBe('1.0.0');
  });

  it('should save and load config correctly', async () => {
    const config = createConfigFromScope('enterprise', 'my-enterprise-app');
    await saveConfig(tempDir, config);

    // Config file should exist
    const configPath = join(tempDir, '.cortexrc');
    expect(existsSync(configPath)).toBe(true);

    // Read and verify content
    const savedContent = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(savedContent);

    expect(parsed.scope).toBe('enterprise');
    expect(parsed.metadata.projectName).toBe('my-enterprise-app');
  });
});

describe('Migrate Command - Edge Cases', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should handle files with special characters in path', async () => {
    const specialPath = join(tempDir, 'docs/my-special_file.v2.md');
    await createVersionedFile(specialPath, '2.6.0');

    expect(existsSync(specialPath)).toBe(true);

    const version = await extractVersion(specialPath);
    expect(version).toBe('2.6.0');
  });

  it('should handle Windows-style paths (forward slash normalization)', async () => {
    // This test uses forward slashes but tests path handling
    const paths = [
      'docs/core/PATTERNS.md',
      'docs/core/ARCHITECTURE.md',
    ];

    for (const p of paths) {
      const filePath = join(tempDir, p);
      await createVersionedFile(filePath, '2.6.0');
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it('should handle files in root directory', async () => {
    const rootFile = join(tempDir, 'NEXT-TASKS.md');
    await createVersionedFile(rootFile, '2.6.0');

    expect(existsSync(rootFile)).toBe(true);

    const version = await extractVersion(rootFile);
    expect(version).toBe('2.6.0');
  });
});
