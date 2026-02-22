import React from "react";
import { Box, Text, Newline } from "ink";

interface FileDistributionCardProps {
  hot: number;
  warm: number;
  cold: number;
  total: number;
}

export const FileDistributionCard: React.FC<FileDistributionCardProps> = ({
  hot,
  warm,
  cold,
  total,
}) => {
  const getPercentage = (count: number) => Math.round((count / total) * 100);
  const getBarLength = (count: number) => Math.round((count / total) * 20);

  return (
    <>
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
      >
        <Text bold>📁 FILE DISTRIBUTION</Text>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="yellow">🔥 HOT</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{hot}</Text>
          </Box>
          <Text dimColor>({getPercentage(hot)}%)</Text>
          <Box>
            <Text color="yellow">{"█".repeat(getBarLength(hot))}</Text>
            <Text dimColor>{"░".repeat(20 - getBarLength(hot))}</Text>
          </Box>
        </Box>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="blue">🌡️ WARM</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{warm}</Text>
          </Box>
          <Text dimColor>({getPercentage(warm)}%)</Text>
          <Box>
            <Text color="blue">{"█".repeat(getBarLength(warm))}</Text>
            <Text dimColor>{"░".repeat(20 - getBarLength(warm))}</Text>
          </Box>
        </Box>

        <Newline />

        <Box>
          <Box width={20}>
            <Text color="cyan">❄️ COLD</Text>
          </Box>
          <Box width={8}>
            <Text color="white">{cold}</Text>
          </Box>
          <Text dimColor>({getPercentage(cold)}%)</Text>
          <Box>
            <Text color="cyan">{"█".repeat(getBarLength(cold))}</Text>
            <Text dimColor>{"░".repeat(20 - getBarLength(cold))}</Text>
          </Box>
        </Box>
      </Box>

      <Newline />
      <Newline />
    </>
  );
};
