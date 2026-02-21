/**
 * Archive Command Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand } from './utils/cli-runner.js';

describe('Archive Command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should detect completed tasks with ✅ marker', async () => {
    const nextTasksContent = `# NEXT-TASKS.md

## Sprint 1

- ✅ Task 1 completed
- [ ] Task 2 in progress
- ✅ Task 3 completed
`;

    await writeFile(join(tempDir, 'NEXT-TASKS.md'), nextTasksContent);

    const result = await runCommand('archive', ['--dry-run'], tempDir);

    expect(result.stdout).toContain('Archive');
    expect(result.stdout).toContain('Task 1 completed');
    expect(result.stdout).toContain('Task 3 completed');
  });

  it('should handle missing NEXT-TASKS.md gracefully', async () => {
    const result = await runCommand('archive', ['--dry-run'], tempDir);

    expect(result.stdout || result.stderr).toContain('NEXT-TASKS.md not found');
  });

  it('should show dry-run preview without creating files', async () => {
    const nextTasksContent = `# Tasks
- ✅ Completed task
- [ ] Active task
`;

    await writeFile(join(tempDir, 'NEXT-TASKS.md'), nextTasksContent);

    const result = await runCommand('archive', ['--dry-run'], tempDir);

    expect(result.stdout).toContain('Dry Run');
    const archiveDir = join(tempDir, 'docs', 'archive');
    expect(existsSync(archiveDir)).toBe(false);
  });

  it('should report when no completed tasks exist', async () => {
    const nextTasksContent = `# Tasks
- [ ] Task 1
- [ ] Task 2
`;

    await writeFile(join(tempDir, 'NEXT-TASKS.md'), nextTasksContent);

    const result = await runCommand('archive', ['--dry-run'], tempDir);

    expect(result.stdout).toContain('No completed tasks');
  });
});
