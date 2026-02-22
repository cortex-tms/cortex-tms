import React from "react";
import { Box, Text } from "ink";

export type ViewType = "overview" | "files" | "health";

interface TabBarProps {
  activeView: ViewType;
}

/**
 * Tab Bar - Shows available views with active indicator
 */
export const TabBar: React.FC<TabBarProps> = ({ activeView }) => {
  const tabs = [
    { key: "overview" as ViewType, label: "1. Overview", number: "1" },
    { key: "files" as ViewType, label: "2. Files", number: "2" },
    { key: "health" as ViewType, label: "3. Health", number: "3" },
  ];

  return (
    <Box paddingX={2}>
      {tabs.map((tab, index) => {
        const isActive = activeView === tab.key;
        return (
          <React.Fragment key={tab.key}>
            {index > 0 && <Text dimColor> </Text>}
            <Text bold={isActive} color={isActive ? "cyan" : "gray"}>
              {isActive ? `[${tab.label}]` : tab.label}
            </Text>
          </React.Fragment>
        );
      })}
    </Box>
  );
};
