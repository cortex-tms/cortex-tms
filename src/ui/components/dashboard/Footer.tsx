import React from 'react';
import { Box, Text } from 'ink';

export const Footer: React.FC = () => {
  return (
    <Box justifyContent="center">
      <Text dimColor>
        Press <Text bold>Ctrl+C</Text> to exit • Use <Text color="cyan">--live</Text> for
        auto-refresh
      </Text>
    </Box>
  );
};
