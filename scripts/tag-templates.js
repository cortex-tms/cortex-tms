#!/usr/bin/env node

/**
 * Retroactive Template Tagging Script
 *
 * Tags all markdown files in templates/ with version metadata.
 * Used for TMS-236: Migration Engine implementation.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSION = '2.3.0';
const VERSION_TAG = `<!-- @cortex-tms-version ${VERSION} -->`;

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
  // Ensure content ends with newline
  const normalized = content.endsWith('\n') ? content : content + '\n';
  return `${normalized}\n${VERSION_TAG}\n`;
}

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Main tagging logic
 */
function tagTemplates() {
  const templatesDir = join(__dirname, '../templates');
  const files = findMarkdownFiles(templatesDir);

  let tagged = 0;
  let skipped = 0;

  console.log(`\n📋 Found ${files.length} markdown files in templates/\n`);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');

    if (hasVersionTag(content)) {
      console.log(`⏭️  SKIP: ${file.replace(templatesDir + '/', '')}`);
      skipped++;
    } else {
      const taggedContent = addVersionTag(content);
      writeFileSync(file, taggedContent, 'utf-8');
      console.log(`✅ TAGGED: ${file.replace(templatesDir + '/', '')}`);
      tagged++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Tagged: ${tagged}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📦 Version: ${VERSION}\n`);
}

// Execute
tagTemplates();
