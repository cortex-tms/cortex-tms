import React from "react";
import { Box, Text } from "ink";

interface NotConfiguredCardProps {
  title: string;
  message: string;
  icon?: string;
  color?: "gray" | "yellow" | "cyan";
}

/**
 * Not Configured Card - Placeholder for missing/unavailable data
 */
export const NotConfiguredCard: React.FC<NotConfiguredCardProps> = ({
  title,
  message,
  icon = "⚙️ ",
  color = "gray",
}) => {
  return (
    <Box
      flexDirection="column"
      paddingY={1}
      borderStyle="round"
      borderColor={color}
    >
      <Box paddingX={2}>
        <Text bold color={color}>
          {icon} {title}
        </Text>
      </Box>

      <Box paddingX={2} paddingTop={1}>
        <Text dimColor>{message}</Text>
      </Box>
    </Box>
  );
};
