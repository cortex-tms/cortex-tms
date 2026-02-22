import React, { useState } from "react";
import { Box, Text, Newline, useInput } from "ink";
import Spinner from "ink-spinner";
import { TMSStats } from "../../utils/stats-collector.js";
import { Header, Footer } from "./dashboard/index.js";
import { TabBar, type ViewType } from "./dashboard/TabBar.js";
import { ViewContainer } from "./dashboard/ViewContainer.js";

interface DashboardProps {
  stats: TMSStats;
  loading?: boolean;
  error?: string | null;
  hotFiles?: string[];
}

/**
 * Main Dashboard Component - Orchestrates all dashboard cards with tab navigation
 */
export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  loading,
  error,
  hotFiles = [],
}) => {
  const [activeView, setActiveView] = useState<ViewType>("overview");

  // Keyboard navigation
  useInput((input, key) => {
    if (input === "1") {
      setActiveView("overview");
    } else if (input === "2") {
      setActiveView("files");
    } else if (input === "3") {
      setActiveView("health");
    } else if (input === "q") {
      process.exit(0);
    } else if (key.tab) {
      // Cycle forward through views
      if (activeView === "overview") setActiveView("files");
      else if (activeView === "files") setActiveView("health");
      else setActiveView("overview");
    }
  });

  // Error state
  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red" bold>
          ❌ Error
        </Text>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box padding={1}>
        <Text color="cyan">
          <Spinner type="dots" />
        </Text>
        <Text> Loading TMS dashboard...</Text>
      </Box>
    );
  }

  // No TMS detected
  if (!stats.project.hasTMS) {
    return (
      <Box
        flexDirection="column"
        padding={1}
        borderStyle="round"
        borderColor="yellow"
      >
        <Text color="yellow" bold>
          ⚠️ No TMS Detected
        </Text>
        <Newline />
        <Text>
          This directory doesn't appear to have Cortex TMS initialized.
        </Text>
        <Newline />
        <Text dimColor>Run: </Text>
        <Text color="cyan">cortex-tms init</Text>
      </Box>
    );
  }

  // Calculate metrics
  const { files } = stats;
  const total = files.total || 1;
  const contextReduction =
    100 -
    Math.round(((files.hot + Math.round(files.warm * 0.3)) / total) * 100);
  const typicalReads = files.hot + Math.round(files.warm * 0.3);

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="double"
      borderColor="cyan"
    >
      <Header projectName={stats.project.name} />

      <TabBar activeView={activeView} />

      <Box paddingTop={1}>
        <Text dimColor>{"─".repeat(60)}</Text>
      </Box>

      <ViewContainer
        view={activeView}
        stats={stats}
        contextReduction={contextReduction}
        typicalReads={typicalReads}
        total={total}
        hotFiles={hotFiles}
      />

      <Footer />
    </Box>
  );
};
