import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { createTempDir, cleanupTempDir } from "./utils/temp-dir.js";
import { detectPackageManager } from "../utils/package-manager.js";

describe("detectPackageManager", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe("package.json packageManager field", () => {
    it("detects pnpm from packageManager field", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "pnpm@8.6.0" }),
      );
      expect(detectPackageManager(tempDir)).toBe("pnpm");
    });

    it("detects yarn from packageManager field", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "yarn@3.5.0" }),
      );
      expect(detectPackageManager(tempDir)).toBe("yarn");
    });

    it("detects bun from packageManager field", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "bun@1.0.0" }),
      );
      expect(detectPackageManager(tempDir)).toBe("bun");
    });

    it("detects npm from packageManager field", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "npm@10.2.4" }),
      );
      expect(detectPackageManager(tempDir)).toBe("npm");
    });

    it("returns null for unknown packageManager value", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "unknowntool@1.0.0" }),
      );
      expect(detectPackageManager(tempDir)).toBeNull();
    });

    it("returns null for non-string packageManager value", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: 42 }),
      );
      expect(detectPackageManager(tempDir)).toBeNull();
    });

    it("packageManager field takes priority over lockfile", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ packageManager: "bun@1.0.0" }),
      );
      writeFileSync(join(tempDir, "pnpm-lock.yaml"), "");
      expect(detectPackageManager(tempDir)).toBe("bun");
    });
  });

  describe("lockfile-based detection", () => {
    it("detects pnpm from pnpm-lock.yaml", () => {
      writeFileSync(join(tempDir, "pnpm-lock.yaml"), "");
      expect(detectPackageManager(tempDir)).toBe("pnpm");
    });

    it("detects yarn from yarn.lock", () => {
      writeFileSync(join(tempDir, "yarn.lock"), "");
      expect(detectPackageManager(tempDir)).toBe("yarn");
    });

    it("detects npm from package-lock.json", () => {
      writeFileSync(join(tempDir, "package-lock.json"), "{}");
      expect(detectPackageManager(tempDir)).toBe("npm");
    });

    it("detects bun from bun.lockb", () => {
      writeFileSync(join(tempDir, "bun.lockb"), "");
      expect(detectPackageManager(tempDir)).toBe("bun");
    });

    it("pnpm-lock.yaml takes priority over package-lock.json", () => {
      writeFileSync(join(tempDir, "pnpm-lock.yaml"), "");
      writeFileSync(join(tempDir, "package-lock.json"), "{}");
      expect(detectPackageManager(tempDir)).toBe("pnpm");
    });
  });

  describe("fallback behaviour", () => {
    it("returns null in empty directory", () => {
      expect(detectPackageManager(tempDir)).toBeNull();
    });

    it("returns null when package.json has no packageManager field", () => {
      writeFileSync(
        join(tempDir, "package.json"),
        JSON.stringify({ name: "my-project" }),
      );
      expect(detectPackageManager(tempDir)).toBeNull();
    });

    it("returns null for malformed package.json with no lockfile", () => {
      writeFileSync(join(tempDir, "package.json"), "not valid json {{");
      expect(detectPackageManager(tempDir)).toBeNull();
    });
  });
});
