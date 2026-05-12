import { readFileSync } from "fs";
import { join } from "path";
import { detectContext } from "./detection.js";

export type DetectedPackageManager = "npm" | "pnpm" | "yarn" | "bun";

const VALID_MANAGERS = new Set<DetectedPackageManager>([
  "npm",
  "pnpm",
  "yarn",
  "bun",
]);

/**
 * Detect the package manager used by the project in `cwd`.
 * Returns null when no signal is found — caller decides the fallback.
 *
 * Priority:
 *   1. package.json "packageManager" field (e.g. "pnpm@8.6.0")
 *   2. Lockfiles via detectContext() — pnpm-lock.yaml > yarn.lock > package-lock.json > bun.lockb
 *   3. null
 */
export function detectPackageManager(
  cwd: string,
): DetectedPackageManager | null {
  // 1. package.json packageManager field (most explicit signal)
  try {
    const pkgJson = JSON.parse(
      readFileSync(join(cwd, "package.json"), "utf8"),
    ) as Record<string, unknown>;
    if (typeof pkgJson.packageManager === "string") {
      const name = (pkgJson.packageManager.split("@")[0] ?? "")
        .trim() as DetectedPackageManager;
      if (VALID_MANAGERS.has(name)) {
        return name;
      }
    }
  } catch {
    // missing or malformed package.json — fall through to lockfile detection
  }

  // 2. Lockfile-based detection (reuses detectContext priority order)
  const context = detectContext(cwd);
  if (context.packageManager !== "unknown") {
    return context.packageManager as DetectedPackageManager;
  }

  return null;
}
