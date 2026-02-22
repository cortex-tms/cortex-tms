export type Tier = "HOT" | "WARM" | "COLD";

const TIER_TAG_PATTERN = /<!--\s*@cortex-tms-tier\s+(HOT|WARM|COLD)\s*-->/;

/**
 * Read existing tier tag from file content
 */
export function readTierTag(content: string): Tier | null {
  const match = content.match(TIER_TAG_PATTERN);
  return match ? (match[1] as Tier) : null;
}

/**
 * Insert or update tier tag in file content
 */
export function writeTierTag(content: string, tier: Tier): string {
  const tag = `<!-- @cortex-tms-tier ${tier} -->`;

  // Check if tag already exists
  if (TIER_TAG_PATTERN.test(content)) {
    return content.replace(TIER_TAG_PATTERN, tag);
  }

  // Insert at beginning (or after front matter)
  const frontMatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[0];
    const rest = content.slice(frontMatter.length);
    return frontMatter + tag + "\n" + rest;
  }

  return tag + "\n" + content;
}
