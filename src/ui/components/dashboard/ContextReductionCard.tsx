import React from 'react';
import { Box, Text, Newline } from 'ink';

interface ContextReductionCardProps {
  contextReduction: number;
  typicalReads: number;
  total: number;
}

export const ContextReductionCard: React.FC<ContextReductionCardProps> = ({
  contextReduction,
  typicalReads,
  total,
}) => {
  return (
    <>
      <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1}>
        <Box justifyContent="center">
          <Text bold color="green">
            📊 CONTEXT REDUCTION
          </Text>
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
            <Text color="white" bold underline>
              {contextReduction}%
            </Text>
          </Text>
        </Box>

        <Newline />

        <Box justifyContent="center">
          <Text dimColor>
            Typical AI session:{' '}
            <Text color="cyan">
              {typicalReads}/{total} files
            </Text>
          </Text>
        </Box>

        <Box justifyContent="center">
          <Text dimColor>
            Estimated token savings:{' '}
            <Text color="green">~{Math.round(contextReduction * 0.8)}%</Text>
          </Text>
        </Box>
      </Box>

      <Newline />
      <Newline />
    </>
  );
};
