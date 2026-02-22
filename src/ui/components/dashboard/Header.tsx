import React, { useState, useEffect } from "react";
import { Box, Text, Newline } from "ink";

interface HeaderProps {
  projectName: string;
}

export const Header: React.FC<HeaderProps> = ({ projectName }) => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box justifyContent="center">
        <Text bold color="cyan">
          🧠 CORTEX TMS DASHBOARD
        </Text>
      </Box>

      <Newline />

      <Box justifyContent="space-between">
        <Text dimColor>
          Project: <Text color="white">{projectName}</Text>
        </Text>
        <Text dimColor>{time.toLocaleTimeString()}</Text>
      </Box>

      <Newline />
      <Newline />
    </>
  );
};
