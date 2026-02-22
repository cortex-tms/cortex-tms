import React from "react";
import { Box, Text } from "ink";

interface GovernanceHealthCardProps {
  score: number; // 0-100
  validationStatus: "healthy" | "warnings" | "errors" | "unknown";
  guardianStatus: "compliant" | "minor_issues" | "major_violations" | "unknown";
  staleness: number; // number of stale docs
}

/**
 * Governance Health Card - Shows overall project governance quality
 */
export const GovernanceHealthCard: React.FC<GovernanceHealthCardProps> = ({
  score,
  validationStatus,
  guardianStatus,
  staleness,
}) => {
  // Determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  // Get status emoji
  const getStatusEmoji = (): string => {
    if (score >= 80) return "✅";
    if (score >= 60) return "⚠️";
    return "❌";
  };

  const scoreColor = getScoreColor(score);

  return (
    <Box
      flexDirection="column"
      paddingY={1}
      borderStyle="round"
      borderColor={scoreColor}
    >
      <Box paddingX={2}>
        <Text bold color={scoreColor}>
          {getStatusEmoji()} GOVERNANCE HEALTH
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1} justifyContent="center">
        <Text color={scoreColor} bold>
          {score}/100
        </Text>
      </Box>

      <Box paddingX={2} justifyContent="center">
        <Text dimColor>overall quality score</Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text dimColor>
          Validation:{" "}
          <Text color={validationStatus === "healthy" ? "green" : "yellow"}>
            {validationStatus}
          </Text>
        </Text>
      </Box>

      <Box paddingX={2}>
        <Text dimColor>
          Guardian:{" "}
          <Text color={guardianStatus === "compliant" ? "green" : "yellow"}>
            {guardianStatus}
          </Text>
        </Text>
      </Box>

      <Box paddingX={2}>
        <Text dimColor>
          Stale docs:{" "}
          <Text color={staleness === 0 ? "green" : "yellow"}>{staleness}</Text>
        </Text>
      </Box>
    </Box>
  );
};
