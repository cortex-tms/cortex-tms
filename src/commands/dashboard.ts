/**
 * Dashboard Command - Terminal UI for TMS project visualization
 */

import { Command } from 'commander';
import { renderDashboard } from '../ui/index.js';

export const dashboardCommand = new Command('dashboard')
  .description('🎨 Interactive terminal dashboard for TMS project stats')
  .option('--live', 'Enable live updates (refreshes every 5 seconds)', false)
  .option('--cwd <path>', 'Project directory (defaults to current directory)')
  .action(async (options) => {
    const cwd = options.cwd || process.cwd();
    const live = options.live || false;

    try {
      await renderDashboard({ cwd, live });
    } catch (error) {
      console.error('Failed to render dashboard:', error);
      process.exit(1);
    }
  });
