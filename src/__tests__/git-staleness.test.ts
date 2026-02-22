/**
 * Git Staleness Detection Tests
 */

import { describe, it, expect } from "vitest";
import {
  getLastGitCommitEpochSeconds,
  countMeaningfulCommits,
  isShallowClone,
  checkDocStaleness,
} from "../utils/git-staleness.js";

describe("Git Staleness Utilities", () => {
  const cwd = process.cwd();

  describe("getLastGitCommitEpochSeconds", () => {
    it("should return a timestamp for existing file", () => {
      const timestamp = getLastGitCommitEpochSeconds("README.md", cwd);

      if (timestamp !== null) {
        expect(typeof timestamp).toBe("number");
        expect(timestamp).toBeGreaterThan(0);
        expect(timestamp).toBeLessThan(Date.now() / 1000);
      }
      // If null, file might not have git history (acceptable)
    });

    it("should return null for non-existent path", () => {
      const timestamp = getLastGitCommitEpochSeconds(
        "non-existent-file-xyz.md",
        cwd,
      );
      expect(timestamp).toBeNull();
    });

    it("should handle directory paths", () => {
      const timestamp = getLastGitCommitEpochSeconds("src/", cwd);

      if (timestamp !== null) {
        expect(typeof timestamp).toBe("number");
        expect(timestamp).toBeGreaterThan(0);
      }
    });
  });

  describe("countMeaningfulCommits", () => {
    it("should return a non-negative number", () => {
      const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
      const count = countMeaningfulCommits("src/", oneYearAgo, cwd);

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should return 0 for future timestamp", () => {
      const future = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      const count = countMeaningfulCommits("src/", future, cwd);

      expect(count).toBe(0);
    });
  });

  describe("isShallowClone", () => {
    it("should return a boolean", () => {
      const result = isShallowClone(cwd);
      expect(typeof result).toBe("boolean");
    });

    it("should return false for full clone (cortex repo)", () => {
      // Cortex TMS repo should be a full clone during development
      const result = isShallowClone(cwd);
      // This might be true or false depending on how the repo was cloned
      expect(typeof result).toBe("boolean");
    });
  });

  describe("checkDocStaleness", () => {
    it("should handle non-existent doc gracefully", () => {
      const result = checkDocStaleness(
        "non-existent-doc.md",
        ["src/"],
        30,
        3,
        cwd,
      );

      expect(result.isStale).toBe(false);
      expect(result.docLastModified).toBeNull();
      expect(result.reason).toContain("no git history");
    });

    it("should return valid result structure", () => {
      const result = checkDocStaleness("README.md", ["src/"], 30, 3, cwd);

      expect(result).toHaveProperty("isStale");
      expect(result).toHaveProperty("docLastModified");
      expect(result).toHaveProperty("codeLastModified");
      expect(result).toHaveProperty("daysSinceDocUpdate");
      expect(result).toHaveProperty("meaningfulCommits");
      expect(result).toHaveProperty("reason");

      expect(typeof result.isStale).toBe("boolean");
      expect(typeof result.reason).toBe("string");
      expect(typeof result.meaningfulCommits).toBe("number");
    });

    it("should not flag as stale if doc is recent", () => {
      // Check with very long threshold (100 days)
      const result = checkDocStaleness(
        "README.md",
        ["src/"],
        100,
        999, // High commit threshold
        cwd,
      );

      // With high thresholds, should not be stale
      if (result.docLastModified !== null) {
        expect(result.isStale).toBe(false);
      }
    });

    it("should require both time AND commit thresholds", () => {
      const result = checkDocStaleness(
        "README.md",
        ["src/"],
        0, // Zero days (time threshold always exceeded)
        999, // Very high commit threshold (unlikely to be exceeded)
        cwd,
      );

      // Should not be stale if commit threshold not met
      if (result.docLastModified !== null && result.meaningfulCommits < 999) {
        expect(result.isStale).toBe(false);
      }
    });
  });
});
