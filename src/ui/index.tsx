import React, { useState, useEffect } from "react";
import { render } from "ink";
import { Dashboard } from "./components/Dashboard.js";
import { collectTMSStats, TMSStats } from "../utils/stats-collector.js";

interface DashboardAppProps {
  cwd: string;
  live?: boolean;
}

/**
 * Dashboard Application - Main entry point for terminal UI
 */
const DashboardApp: React.FC<DashboardAppProps> = ({ cwd, live = false }) => {
  const [stats, setStats] = useState<TMSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const newStats = await collectTMSStats(cwd);
        setStats(newStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Set up live updates if enabled
    if (live) {
      const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }

    return undefined;
  }, [cwd, live]);

  if (!stats) {
    return (
      <Dashboard
        stats={{
          files: { hot: 0, warm: 0, cold: 0, total: 0 },
          hotFiles: [],
          validation: { status: "unknown", violations: 0, lastChecked: null },
          project: { name: "", hasTMS: false },
        }}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <Dashboard
      stats={stats}
      hotFiles={stats.hotFiles}
      loading={loading}
      error={error}
    />
  );
};

/**
 * Render the dashboard
 */
export function renderDashboard(
  options: { cwd?: string; live?: boolean } = {},
) {
  const { cwd = process.cwd(), live = false } = options;

  const { waitUntilExit } = render(<DashboardApp cwd={cwd} live={live} />);

  return waitUntilExit();
}
