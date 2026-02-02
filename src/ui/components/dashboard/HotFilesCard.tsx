import React from 'react';
import { Box, Text, Newline } from 'ink';

interface HotFilesCardProps {
  hotFiles: string[];
  count: number;
}

export const HotFilesCard: React.FC<HotFilesCardProps> = ({ hotFiles, count }) => {
  return (
    <>
      <Box flexDirection="column" borderStyle="single" borderColor="yellow" paddingX={1}>
        <Text bold color="yellow">
          🔥 ACTIVE FILES ({count})
        </Text>

        <Newline />

        {count > 0 ? (
          <Box flexDirection="column">
            {hotFiles.slice(0, 5).map((file, i) => (
              <Box key={i}>
                <Text dimColor>  • </Text>
                <Text color="white">{file}</Text>
              </Box>
            ))}
            {count > 5 && (
              <>
                <Newline />
                <Text dimColor>  +{count - 5} more files</Text>
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Text dimColor>  No HOT files detected</Text>
          </Box>
        )}

        <Newline />

        <Box>
          <Text dimColor>These files are always loaded by AI assistants</Text>
        </Box>
      </Box>

      <Newline />
      <Newline />
    </>
  );
};
