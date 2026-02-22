import React from "react";
import { Box, Text } from "ink";

interface CostSavingsCardProps {
  monthlyCost: number;
  tokensAvoided: number;
  percentReduction: number;
  model: string;
}

/**
 * Cost Savings Card - Shows monthly savings from context reduction
 */
export const CostSavingsCard: React.FC<CostSavingsCardProps> = ({
  monthlyCost,
  tokensAvoided,
  percentReduction,
  model,
}) => {
  // Format token count with thousands separator
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1_000_000) {
      return `${(tokens / 1_000_000).toFixed(1)}M`;
    } else if (tokens >= 1_000) {
      return `${(tokens / 1_000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  // Format cost
  const formatCost = (cost: number): string => {
    if (cost < 0.01) return "<$0.01";
    return `$${cost.toFixed(2)}`;
  };

  // Friendly model name
  const modelDisplay = model
    .replace("claude-", "Claude ")
    .replace("sonnet-", "Sonnet ")
    .replace("opus-", "Opus ")
    .replace("haiku-", "Haiku ");

  return (
    <Box
      flexDirection="column"
      paddingY={1}
      borderStyle="round"
      borderColor="green"
    >
      <Box paddingX={2}>
        <Text bold color="green">
          💰 MONTHLY SAVINGS (ESTIMATED)
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1} justifyContent="center">
        <Text color="green" bold>
          ~{formatCost(monthlyCost)}
        </Text>
      </Box>

      <Box paddingX={2} justifyContent="center">
        <Text dimColor>estimated savings per month</Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text dimColor>Assumes: {modelDisplay} @ 10 sessions/day</Text>
      </Box>

      <Box paddingX={2}>
        <Text dimColor>
          Tokens avoided: {formatTokens(tokensAvoided)} (
          {percentReduction.toFixed(0)}% reduction)
        </Text>
      </Box>
    </Box>
  );
};
