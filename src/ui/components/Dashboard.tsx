import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import Spinner from 'ink-spinner';
import { TMSStats } from '../../utils/stats-collector.js';

interface DashboardProps {
  stats: TMSStats;
  loading?: boolean;
  error?: string | null;
  hotFiles?: string[];
}

/**
 * Main Dashboard Component - Redesigned for Impact & Clarity
 */
export const Dashboard: React.FC<DashboardProps> = ({ stats, loading, error, hotFiles = [] }) => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const { files, validation, project } = stats;
  const total = files.total || 1;
  const contextReduction = 100 - Math.round(((files.hot + Math.round(files.warm * 0.3)) / total) * 100);
  const typicalReads = files.hot + Math.round(files.warm * 0.3);

  // Health status
  const getHealthEmoji = () => {
    if (validation.status === 'healthy') return '✅';
    if (validation.status === 'warnings') return '⚠️ ';
    if (validation.status === 'errors') return '❌';
    return '❓';
  };

  const getHealthText = () => {
    if (validation.status === 'healthy') return 'HEALTHY';
    if (validation.status === 'warnings') return `${validation.violations} warnings`;
    if (validation.status === 'errors') return `${validation.violations} errors`;
    return 'Not validated';
  };

  const getHealthColor = () => {
    if (validation.status === 'healthy') return 'green';
    if (validation.status === 'warnings') return 'yellow';
    return 'red';
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="double" borderColor="cyan">
      {/* Header */}
      <Box justifyContent="center">
        <Text bold color="cyan">
          🧠 CORTEX TMS DASHBOARD
        </Text>
      </Box>

      <Newline />

      <Box justifyContent="space-between">
        <Text dimColor>Project: <Text color="white">{project.name}</Text></Text>
        <Text dimColor>{time.toLocaleTimeString()}</Text>
      </Box>

      <Newline />
      <Newline />

      {/* BIG METRIC: Context Reduction */}
      <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
        <Box justifyContent="center">
          <Text bold color="green">📊 CONTEXT REDUCTION</Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text bold color="green" dimColor={false}>
            {'█'.repeat(Math.min(40, Math.round(contextReduction / 2.5)))}
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text bold color="green">
            <Text color="white" bold underline>{contextReduction}%</Text>
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text dimColor>
            Typical AI session: <Text color="cyan">{typicalReads}/{total} files</Text>
          </Text>
        </Box>

        <Box justifyContent="center">
          <Text dimColor>
            Estimated token savings: <Text color="green">~{Math.round(contextReduction * 0.8)}%</Text>
          </Text>
        </Box>
      </Box>

      <Newline />
      <Newline />

      {/* HOT FILES - Most Important */}
      <Box flexDirection="column" borderStyle="single" borderColor="yellow" paddingX={1}>
        <Text bold color="yellow">
          🔥 ACTIVE FILES ({files.hot})
        </Text>

        <Newline />

        {files.hot > 0 ? (
          <Box flexDirection="column">
            {hotFiles.slice(0, 5).map((file, i) => (
              <Box key={i}>
                <Text dimColor>  • </Text>
                <Text color="white">{file}</Text>
              </Box>
            ))}
            {files.hot > 5 && (
              <>
                <Newline />
                <Text dimColor>  +{files.hot - 5} more files</Text>
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Text dimColor>  No HOT files detected</Text>
          </Box>
        )}

        <Newline />

        <Box>
          <Text dimColor>
            These files are always loaded by AI assistants
          </Text>
        </Box>
      </Box>

      <Newline />
      <Newline />

      {/* File Distribution */}
      <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
        <Text bold>📁 FILE DISTRIBUTION</Text>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="yellow">🔥 HOT</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{files.hot}</Text>
          </Box>
          <Text dimColor>({Math.round((files.hot / total) * 100)}%)</Text>
          <Box>
            <Text color="yellow">{'█'.repeat(Math.round((files.hot / total) * 20))}</Text>
            <Text dimColor>{'░'.repeat(20 - Math.round((files.hot / total) * 20))}</Text>
          </Box>
        </Box>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="blue">🌡️  WARM</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{files.warm}</Text>
          </Box>
          <Text dimColor>({Math.round((files.warm / total) * 100)}%)</Text>
          <Box>
            <Text color="blue">{'█'.repeat(Math.round((files.warm / total) * 20))}</Text>
            <Text dimColor>{'░'.repeat(20 - Math.round((files.warm / total) * 20))}</Text>
          </Box>
        </Box>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="cyan">❄️  COLD</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{files.cold}</Text>
          </Box>
          <Text dimColor>({Math.round((files.cold / total) * 100)}%)</Text>
          <Box>
            <Text color="cyan">{'█'.repeat(Math.round((files.cold / total) * 20))}</Text>
            <Text dimColor>{'░'.repeat(20 - Math.round((files.cold / total) * 20))}</Text>
          </Box>
        </Box>
      </Box>

      <Newline />
      <Newline />

      {/* Validation Status */}
      <Box flexDirection="column" borderStyle="single" borderColor={getHealthColor() as any} paddingX={1}>
        <Text bold color={getHealthColor() as any}>
          🛡️  VALIDATION STATUS
        </Text>

        <Newline />

        <Box>
          <Text color={getHealthColor() as any}>
            {getHealthEmoji()} {getHealthText()}
          </Text>
        </Box>

        <Newline />

        {validation.lastChecked ? (
          <Box>
            <Text dimColor>Last checked: {getTimeAgo(validation.lastChecked)}</Text>
          </Box>
        ) : (
          <Box>
            <Text dimColor>Run </Text>
            <Text color="cyan">cortex-tms validate</Text>
            <Text dimColor> to check project health</Text>
          </Box>
        )}
      </Box>

      <Newline />
      <Newline />

      {/* Footer */}
      <Box justifyContent="center">
        <Text dimColor>
          Press <Text bold>Ctrl+C</Text> to exit • Use{' '}
          <Text color="cyan">--live</Text> for auto-refresh
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Helper: Get human-readable time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
