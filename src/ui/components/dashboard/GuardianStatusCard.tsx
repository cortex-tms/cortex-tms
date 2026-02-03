import React from 'react';
import { Box, Text } from 'ink';

interface GuardianStatusCardProps {
  status: 'compliant' | 'minor_issues' | 'major_violations' | 'unknown';
  violationCount: number;
  highConfidenceCount: number;
  lastChecked: Date | null;
}

/**
 * Guardian Status Card - Shows last code review status
 */
export const GuardianStatusCard: React.FC<GuardianStatusCardProps> = ({
  status,
  violationCount,
  highConfidenceCount,
  lastChecked,
}) => {
  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  // Status display
  const getStatusDisplay = () => {
    switch (status) {
      case 'compliant':
        return { emoji: '✅', label: 'All Clear', color: 'green' as const };
      case 'minor_issues':
        return { emoji: '⚠️ ', label: 'Minor Issues Found', color: 'yellow' as const };
      case 'major_violations':
        return { emoji: '❌', label: 'Major Violations', color: 'red' as const };
      default:
        return { emoji: '❓', label: 'Not Reviewed Yet', color: 'gray' as const };
    }
  };

  const { emoji, label, color } = getStatusDisplay();

  return (
    <Box flexDirection="column" paddingY={1} borderStyle="round" borderColor={color}>
      <Box paddingX={2}>
        <Text bold color={color}>
          🛡️  GUARDIAN CODE REVIEW
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text color={color}>
          {emoji} {label}
        </Text>
      </Box>

      {lastChecked ? (
        <>
          <Box paddingX={2} paddingTop={1}>
            <Text dimColor>Last review: {formatTimeAgo(lastChecked)}</Text>
          </Box>

          {violationCount > 0 && (
            <Box paddingX={2}>
              <Text dimColor>
                Violations: {violationCount} total ({highConfidenceCount} high-confidence)
              </Text>
            </Box>
          )}
        </>
      ) : (
        <Box paddingX={2} paddingTop={1}>
          <Text dimColor>No reviews performed yet</Text>
        </Box>
      )}

      <Box paddingX={2} paddingTop={1}>
        <Text dimColor>Run: </Text>
        <Text color="cyan">cortex-tms review {'<file>'}</Text>
      </Box>
    </Box>
  );
};
