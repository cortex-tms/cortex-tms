import React from 'react';
import { Box, Text, Newline } from 'ink';
import Spinner from 'ink-spinner';
import { TMSStats } from '../../utils/stats-collector.js';
import {
  Header,
  ContextReductionCard,
  HotFilesCard,
  FileDistributionCard,
  ValidationCard,
  Footer,
} from './dashboard/index.js';

interface DashboardProps {
  stats: TMSStats;
  loading?: boolean;
  error?: string | null;
  hotFiles?: string[];
}

/**
 * Main Dashboard Component - Orchestrates all dashboard cards
 */
export const Dashboard: React.FC<DashboardProps> = ({ stats, loading, error, hotFiles = [] }) => {
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
      <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
        <Text color="yellow" bold>
          ⚠️  No TMS Detected
        </Text>
        <Newline />
        <Text>This directory doesn't appear to have Cortex TMS initialized.</Text>
        <Newline />
        <Text dimColor>Run: </Text>
        <Text color="cyan">cortex-tms init</Text>
      </Box>
    );
  }

  // Calculate metrics
  const { files, validation, project } = stats;
  const total = files.total || 1;
  const contextReduction = 100 - Math.round(((files.hot + Math.round(files.warm * 0.3)) / total) * 100);
  const typicalReads = files.hot + Math.round(files.warm * 0.3);

  return (
    <Box flexDirection="column" padding={1} borderStyle="double" borderColor="cyan">
      <Header projectName={project.name} />

      <ContextReductionCard
        contextReduction={contextReduction}
        typicalReads={typicalReads}
        total={total}
      />

      <HotFilesCard hotFiles={hotFiles} count={files.hot} />

      <FileDistributionCard hot={files.hot} warm={files.warm} cold={files.cold} total={total} />

      <ValidationCard
        status={validation.status}
        violations={validation.violations}
        lastChecked={validation.lastChecked}
      />

      <Footer />
    </Box>
  );
};
