import React from 'react';
import { Box, Text } from 'ink';

interface SprintProgressCardProps {
  sprintName: string;
  progress: number;
  done: number;
  inProgress: number;
  todo: number;
}

/**
 * Sprint Progress Card - Shows current sprint status
 */
export const SprintProgressCard: React.FC<SprintProgressCardProps> = ({
  sprintName,
  progress,
  done,
  inProgress,
  todo,
}) => {
  // Generate progress bar (40 characters wide)
  const barWidth = 40;
  const filled = Math.round((progress / 100) * barWidth);
  const empty = barWidth - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <Box flexDirection="column" paddingY={1} borderStyle="round" borderColor="cyan">
      <Box paddingX={2}>
        <Text bold color="cyan">
          🎯 SPRINT PROGRESS
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text dimColor>Current: </Text>
        <Text>{sprintName}</Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text color="green">{progressBar}</Text>
        <Text color="cyan" bold>
          {' '}
          {progress}%
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text color="green">✅ Done: {done}</Text>
        <Text dimColor> | </Text>
        <Text color="yellow">🔄 In Progress: {inProgress}</Text>
        <Text dimColor> | </Text>
        <Text color="gray">📋 Todo: {todo}</Text>
      </Box>
    </Box>
  );
};
