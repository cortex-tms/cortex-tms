#!/usr/bin/env node

/**
 * Cortex TMS CLI - Shorthand Executable Wrapper
 *
 * Provides `cortex` as a shorthand alias for `cortex-tms` command.
 * Always runs compiled JavaScript from dist/ when installed via NPM.
 * For development with source files, use: npm run cli:dev
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always run compiled JavaScript (production mode)
await import(join(__dirname, '../dist/cli.js'));
