/**
 * Project Analyzer Utility
 *
 * Analyzes existing projects and suggests TMS structure
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface ProjectAnalysis {
  projectName: string;
  projectType: string;
  fileCount: number;
  linesOfCode: number;
  existingDocs: DocumentationFile[];
  recommendedScope: 'nano' | 'standard' | 'enterprise';
  migrationStrategy: string[];
  estimatedEffort: string;
}

export interface DocumentationFile {
  path: string;
  lines: number;
  quality: 'good' | 'fair' | 'poor';
  assessment: string;
  lastModified?: Date;
}

/**
 * Analyze project and provide TMS recommendations
 */
export async function analyzeProject(cwd: string): Promise<ProjectAnalysis> {
  // Get project name from package.json or directory name
  const projectName = await getProjectName(cwd);

  // Scan for existing documentation
  const existingDocs = await scanExistingDocumentation(cwd);

  // Detect framework/project type
  const projectType = await detectProjectType(cwd);

  // Count files and estimate LOC
  const { fileCount, linesOfCode } = await estimateProjectSize(cwd);

  // Recommend scope based on project size
  const recommendedScope = recommendScope(fileCount, linesOfCode);

  // Generate migration strategy
  const migrationStrategy = generateMigrationStrategy(existingDocs, recommendedScope);

  // Estimate effort
  const estimatedEffort = estimateEffort(existingDocs);

  return {
    projectName,
    projectType,
    fileCount,
    linesOfCode,
    existingDocs,
    recommendedScope,
    migrationStrategy,
    estimatedEffort,
  };
}

/**
 * Scan for existing documentation files
 */
async function scanExistingDocumentation(cwd: string): Promise<DocumentationFile[]> {
  const docPatterns = [
    'README.md',
    'CONTRIBUTING.md',
    'ARCHITECTURE.md',
    'docs/**/*.md',
    '.github/**/*.md',
  ];

  const docs: DocumentationFile[] = [];

  for (const pattern of docPatterns) {
    const files = await glob(pattern, { cwd, ignore: ['node_modules/**', '**/node_modules/**'] });

    for (const file of files) {
      const filePath = path.join(cwd, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').length;
        const { quality, assessment } = assessDocQuality(file, lines, content);

        docs.push({
          path: file,
          lines,
          quality,
          assessment,
        });
      } catch (error) {
        // Skip files we can't read
      }
    }
  }

  return docs;
}

/**
 * Get project name from package.json or directory name
 */
async function getProjectName(cwd: string): Promise<string> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    return packageJson.name || path.basename(cwd);
  } catch (error) {
    return path.basename(cwd);
  }
}

/**
 * Assess documentation quality
 */
function assessDocQuality(
  _filename: string,
  lines: number,
  content: string
): { quality: 'good' | 'fair' | 'poor'; assessment: string } {
  // Good: 50-500 lines, has structure
  if (lines >= 50 && lines <= 500 && content.includes('##')) {
    return {
      quality: 'good',
      assessment: 'Well-structured',
    };
  }

  // Fair: Some content but needs work
  if (lines >= 20 && lines < 50) {
    return {
      quality: 'fair',
      assessment: 'Could use more detail',
    };
  }

  if (lines > 500) {
    return {
      quality: 'fair',
      assessment: 'Very long - consider splitting',
    };
  }

  // Poor: Too short or missing
  return {
    quality: 'poor',
    assessment: 'Incomplete or placeholder',
  };
}

/**
 * Detect project type/framework
 */
async function detectProjectType(cwd: string): Promise<string> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Framework detection
    if (deps['next']) return 'Next.js Web App';
    if (deps['@remix-run/react']) return 'Remix App';
    if (deps['react']) return 'React App';
    if (deps['vue']) return 'Vue App';
    if (deps['@angular/core']) return 'Angular App';
    if (deps['express']) return 'Express API';
    if (deps['fastify']) return 'Fastify API';
    if (deps['@nestjs/core']) return 'NestJS App';

    // Generic types
    if (packageJson.bin) return 'CLI Tool';
    if (packageJson.type === 'module' || deps['typescript']) return 'Node.js Library';

    return 'Node.js Project';
  } catch (error) {
    // No package.json or can't read
    return 'Unknown Project Type';
  }
}

/**
 * Estimate project size
 */
async function estimateProjectSize(cwd: string): Promise<{ fileCount: number; linesOfCode: number }> {
  const codePatterns = ['src/**/*.{ts,tsx,js,jsx}', 'lib/**/*.{ts,tsx,js,jsx}', '*.{ts,js}'];

  let fileCount = 0;
  let linesOfCode = 0;

  for (const pattern of codePatterns) {
    const files = await glob(pattern, { cwd, ignore: ['node_modules/**', '**/node_modules/**', 'dist/**', 'build/**'] });
    fileCount += files.length;

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(cwd, file), 'utf-8');
        linesOfCode += content.split('\n').length;
      } catch (error) {
        // Skip files we can't read
      }
    }
  }

  return { fileCount, linesOfCode };
}

/**
 * Recommend scope based on project size
 */
function recommendScope(fileCount: number, linesOfCode: number): 'nano' | 'standard' | 'enterprise' {
  // Nano: Very small projects (< 10 files, < 1000 LOC)
  if (fileCount < 10 && linesOfCode < 1000) {
    return 'nano';
  }

  // Enterprise: Large projects (> 100 files, > 10000 LOC)
  if (fileCount > 100 || linesOfCode > 10000) {
    return 'enterprise';
  }

  // Standard: Everything else
  return 'standard';
}

/**
 * Generate migration strategy
 */
function generateMigrationStrategy(
  existingDocs: DocumentationFile[],
  _scope: string
): string[] {
  const strategy: string[] = [];

  // Check for README
  const readme = existingDocs.find((doc) => doc.path === 'README.md');
  if (readme) {
    strategy.push('Keep README.md as project overview (no change)');
  } else {
    strategy.push('Create README.md with TMS init');
  }

  // Check for CONTRIBUTING
  const contributing = existingDocs.find((doc) => doc.path === 'CONTRIBUTING.md');
  if (contributing) {
    strategy.push('Migrate CONTRIBUTING.md → docs/core/PATTERNS.md');
  } else {
    strategy.push('Create PATTERNS.md with TMS init');
  }

  // Check for architecture docs
  const archDocs = existingDocs.filter((doc) =>
    doc.path.toLowerCase().includes('arch') ||
    doc.path.toLowerCase().includes('design')
  );
  if (archDocs.length > 0 && archDocs[0]) {
    strategy.push(`Migrate ${archDocs[0].path} → docs/core/ARCHITECTURE.md`);
  } else {
    strategy.push('Create ARCHITECTURE.md with TMS init');
  }

  // TMS-specific files
  strategy.push('Create new: NEXT-TASKS.md, CLAUDE.md, DOMAIN-LOGIC.md');

  return strategy;
}

/**
 * Estimate migration effort
 */
function estimateEffort(existingDocs: DocumentationFile[]): string {
  if (existingDocs.length === 0) {
    return '15 minutes (fresh start with init)';
  }

  if (existingDocs.length <= 3) {
    return '30 minutes (minimal migration)';
  }

  if (existingDocs.length <= 10) {
    return '1-2 hours (moderate migration)';
  }

  return '2-4 hours (extensive migration)';
}
