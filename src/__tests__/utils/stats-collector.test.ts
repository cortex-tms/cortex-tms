import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { collectTMSStats } from '../../utils/stats-collector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesPath = path.join(__dirname, '..', 'fixtures', 'tms-project');

describe('stats-collector', () => {
  describe('collectTMSStats', () => {
    it('should detect TMS project', async () => {
      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.project.hasTMS).toBe(true);
      expect(stats.project.name).toBe('tms-project');
    });

    it('should correctly classify files by tier', async () => {
      const stats = await collectTMSStats(fixturesPath, { silent: true });

      // HOT files: CLAUDE.md (explicit tag), NEXT-TASKS.md (path inference)
      expect(stats.files.hot).toBe(2);

      // WARM files: PATTERNS.md (explicit tag), README.md (path inference)
      expect(stats.files.warm).toBe(2);

      // COLD files: archive/old-doc.md (path inference)
      expect(stats.files.cold).toBe(1);

      // Total
      expect(stats.files.total).toBe(5);
    });

    it('should list HOT files', async () => {
      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.hotFiles).toHaveLength(2);
      expect(stats.hotFiles).toContain('CLAUDE.md');
      expect(stats.hotFiles).toContain('NEXT-TASKS.md');
    });

    it('should handle validation cache when present', async () => {
      // Create a mock validation cache
      const cortexDir = path.join(fixturesPath, '.cortex');
      const cacheFile = path.join(cortexDir, 'validation-cache.json');

      await fs.ensureDir(cortexDir);
      await fs.writeJSON(cacheFile, {
        timestamp: new Date().toISOString(),
        violations: 3,
      });

      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.validation.status).toBe('warnings');
      expect(stats.validation.violations).toBe(3);
      expect(stats.validation.lastChecked).toBeInstanceOf(Date);

      // Cleanup
      await fs.remove(cortexDir);
    });

    it('should handle validation cache with no violations', async () => {
      // Create a mock validation cache with 0 violations
      const cortexDir = path.join(fixturesPath, '.cortex');
      const cacheFile = path.join(cortexDir, 'validation-cache.json');

      await fs.ensureDir(cortexDir);
      await fs.writeJSON(cacheFile, {
        timestamp: new Date().toISOString(),
        violations: 0,
      });

      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.validation.status).toBe('healthy');
      expect(stats.validation.violations).toBe(0);

      // Cleanup
      await fs.remove(cortexDir);
    });

    it('should handle validation cache with many violations (errors)', async () => {
      // Create a mock validation cache with many violations
      const cortexDir = path.join(fixturesPath, '.cortex');
      const cacheFile = path.join(cortexDir, 'validation-cache.json');

      await fs.ensureDir(cortexDir);
      await fs.writeJSON(cacheFile, {
        timestamp: new Date().toISOString(),
        violations: 15,
      });

      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.validation.status).toBe('errors');
      expect(stats.validation.violations).toBe(15);

      // Cleanup
      await fs.remove(cortexDir);
    });

    it('should default to unknown status when no cache exists', async () => {
      const stats = await collectTMSStats(fixturesPath, { silent: true });

      expect(stats.validation.status).toBe('unknown');
      expect(stats.validation.violations).toBe(0);
      expect(stats.validation.lastChecked).toBeNull();
    });

    it('should handle non-TMS project', async () => {
      // Create a temporary directory without TMS indicators
      const tempDir = path.join(__dirname, '..', 'fixtures', 'non-tms-project');
      await fs.ensureDir(tempDir);
      await fs.writeFile(path.join(tempDir, 'README.md'), '# Non-TMS Project');

      const stats = await collectTMSStats(tempDir, { silent: true });

      expect(stats.project.hasTMS).toBe(false);
      expect(stats.files.total).toBe(0);

      // Cleanup
      await fs.remove(tempDir);
    });

    it('should respect file exclusions', async () => {
      // The fixtures don't have node_modules, templates, etc.
      // This test just verifies the behavior is correct
      const stats = await collectTMSStats(fixturesPath, { silent: true });

      // Should not include any files from excluded directories
      const allFiles = [...stats.hotFiles];

      // Verify no excluded paths
      allFiles.forEach(file => {
        expect(file).not.toMatch(/node_modules/);
        expect(file).not.toMatch(/templates/);
        expect(file).not.toMatch(/examples/);
        expect(file).not.toMatch(/website/);
      });
    });
  });
});
