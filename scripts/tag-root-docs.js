#!/usr/bin/env node

/**
 * Tag Root Documentation Files
 *
 * Tags root-level and docs/core/ markdown files with version metadata.
 * Used for TMS-236: Migration Engine implementation.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSION = '2.3.0';
const VERSION_TAG = `<!-- @cortex-tms-version ${VERSION} -->`;

const FILES_TO_TAG = [
  'CLAUDE.md',
  'README.md',
  'NEXT-TASKS.md',
  'FUTURE-ENHANCEMENTS.md',
  'CHANGELOG.md',
  'docs/core/ARCHITECTURE.md',
  'docs/core/DECISIONS.md',
  'docs/core/DOMAIN-LOGIC.md',
  'docs/core/GIT-STANDARDS.md',
  'docs/core/GLOSSARY.md',
  'docs/core/PATTERNS.md',
  'docs/core/SCHEMA.md',
  'docs/core/TROUBLESHOOTING.md',
];

/**
 * Check if file already has version metadata
 */
function hasVersionTag(content) {
  return content.includes('@cortex-tms-version');
}

/**
 * Add version metadata to file content
 */
function addVersionTag(content) {
  const normalized = content.endsWith('\n') ? content : content + '\n';
  return `${normalized}\n${VERSION_TAG}\n`;
}

/**
 * Main tagging logic
 */
function tagRootDocs() {
  const rootDir = join(__dirname, '..');
  let tagged = 0;
  let skipped = 0;

  console.log(`\n📋 Tagging ${FILES_TO_TAG.length} root documentation files\n`);

  for (const file of FILES_TO_TAG) {
    const fullPath = join(rootDir, file);

    if (!existsSync(fullPath)) {
      console.log(`⚠️  NOT FOUND: ${file}`);
      continue;
    }

    const content = readFileSync(fullPath, 'utf-8');

    if (hasVersionTag(content)) {
      console.log(`⏭️  SKIP: ${file}`);
      skipped++;
    } else {
      const taggedContent = addVersionTag(content);
      writeFileSync(fullPath, taggedContent, 'utf-8');
      console.log(`✅ TAGGED: ${file}`);
      tagged++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Tagged: ${tagged}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📦 Version: ${VERSION}\n`);
}

// Execute
tagRootDocs();
