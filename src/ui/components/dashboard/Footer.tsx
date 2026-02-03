import React from 'react';
import { Box, Text } from 'ink';

export const Footer: React.FC = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <Box justifyContent="center">
        <Text dimColor>
          Tab: Switch view • 1/2/3: Jump to view • q: Quit
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text dimColor>
          Use <Text color="cyan">--live</Text> for auto-refresh (5s interval)
        </Text>
      </Box>
    </Box>
  );
};
