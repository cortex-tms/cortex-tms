import React from 'react';
import { Box, Text, Newline } from 'ink';

type ValidationStatus = 'healthy' | 'warnings' | 'errors' | 'unknown';
type InkColor = 'green' | 'yellow' | 'red' | 'gray';

interface ValidationCardProps {
  status: ValidationStatus;
  violations: number;
  lastChecked: Date | null;
}

function getHealthEmoji(status: ValidationStatus): string {
  if (status === 'healthy') return '✅';
  if (status === 'warnings') return '⚠️ ';
  if (status === 'errors') return '❌';
  return '❓';
}

function getHealthText(status: ValidationStatus, violations: number): string {
  if (status === 'healthy') return 'HEALTHY';
  if (status === 'warnings') return `${violations} warnings`;
  if (status === 'errors') return `${violations} errors`;
  return 'Not validated';
}

function getHealthColor(status: ValidationStatus): InkColor {
  if (status === 'healthy') return 'green';
  if (status === 'warnings') return 'yellow';
  if (status === 'errors') return 'red';
  return 'gray'; // 'unknown' - neutral
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  status,
  violations,
  lastChecked,
}) => {
  const color = getHealthColor(status);

  return (
    <>
      <Box flexDirection="column" borderStyle="single" borderColor={color} paddingX={1}>
        <Text bold color={color}>
          🛡️  VALIDATION STATUS
        </Text>

        <Newline />

        <Box>
          <Text color={color}>
            {getHealthEmoji(status)} {getHealthText(status, violations)}
          </Text>
        </Box>

        <Newline />

        {lastChecked ? (
          <Box>
            <Text dimColor>Last checked: {getTimeAgo(lastChecked)}</Text>
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
    </>
  );
};
