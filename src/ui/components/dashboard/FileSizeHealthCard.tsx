import React from 'react';
import { Box, Text } from 'ink';

interface FileSizeHealthItem {
  file: string;
  lines: number;
  limit: number;
  percent: number;
  status: 'healthy' | 'warning' | 'over';
}

interface FileSizeHealthCardProps {
  files: FileSizeHealthItem[];
  maxDisplay?: number;
}

/**
 * File Size Health Card - Shows files approaching or over size limits
 */
export const FileSizeHealthCard: React.FC<FileSizeHealthCardProps> = ({
  files,
  maxDisplay = 5,
}) => {
  // Sort by percent descending and take top N
  const topFiles = files.slice(0, maxDisplay);

  // Count files over limit
  const overLimitCount = files.filter((f) => f.status === 'over').length;

  // Status emoji and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'over':
        return { emoji: '🔴', color: 'red' as const };
      case 'warning':
        return { emoji: '🟡', color: 'yellow' as const };
      case 'healthy':
        return { emoji: '🟢', color: 'green' as const };
      default:
        return { emoji: '⚪', color: 'gray' as const };
    }
  };

  return (
    <Box flexDirection="column" paddingY={1} borderStyle="round" borderColor="yellow">
      <Box paddingX={2}>
        <Text bold color="yellow">
          📏 FILE SIZE HEALTH
        </Text>
      </Box>

      {topFiles.length === 0 ? (
        <Box paddingX={2} paddingTop={1}>
          <Text dimColor>No tracked files found</Text>
        </Box>
      ) : (
        <>
          {topFiles.map((file) => {
            const { emoji, color } = getStatusDisplay(file.status);
            return (
              <Box key={file.file} paddingX={2} paddingTop={1}>
                <Text>{emoji} </Text>
                <Text color={color}>{file.file.padEnd(30)}</Text>
                <Text dimColor>
                  {' '}
                  {file.lines}/{file.limit} lines ({file.percent}%)
                </Text>
              </Box>
            );
          })}

          {overLimitCount > 0 && (
            <Box paddingX={2} paddingTop={1}>
              <Text color="red" bold>
                {overLimitCount} file{overLimitCount > 1 ? 's' : ''} over limit
              </Text>
              <Text dimColor> • Run: </Text>
              <Text color="cyan">cortex-tms validate --fix</Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
