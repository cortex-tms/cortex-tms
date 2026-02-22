import React from "react";
import { Box, Text, Newline } from "ink";

interface StalenessCardProps {
  staleDocsCount: number;
  totalDocsCount: number;
  freshnessPercent: number; // 0-100, percentage of docs that are fresh
  oldestDocDays?: number | undefined; // Age of stalest doc in days
}

/**
 * Staleness Card - Shows documentation freshness metrics
 */
export const StalenessCard: React.FC<StalenessCardProps> = ({
  staleDocsCount,
  totalDocsCount,
  freshnessPercent,
  oldestDocDays,
}) => {
  const isFresh = staleDocsCount === 0;
  const color = isFresh ? "green" : freshnessPercent >= 70 ? "yellow" : "red";

  return (
    <>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={color}
        padding={1}
      >
        <Box justifyContent="center">
          <Text bold color={color}>
            📅 DOCUMENTATION FRESHNESS
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text bold color={color} dimColor={false}>
            {"█".repeat(Math.min(40, Math.round(freshnessPercent / 2.5)))}
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text bold color={color}>
            <Text color="white" bold underline>
              {freshnessPercent.toFixed(0)}%
            </Text>
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text dimColor>
            Fresh docs:{" "}
            <Text color={color}>
              {totalDocsCount - staleDocsCount}/{totalDocsCount}
            </Text>
          </Text>
        </Box>

        {oldestDocDays !== undefined && oldestDocDays > 0 && (
          <Box justifyContent="center">
            <Text dimColor>
              Oldest:{" "}
              <Text color={oldestDocDays > 60 ? "red" : "yellow"}>
                {oldestDocDays} days
              </Text>
            </Text>
          </Box>
        )}

        <Box justifyContent="center">
          <Text dimColor>
            Status:{" "}
            <Text color={color}>
              {isFresh ? "All docs current" : `${staleDocsCount} need review`}
            </Text>
          </Text>
        </Box>
      </Box>

      <Newline />
      <Newline />
    </>
  );
};
