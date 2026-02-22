import React from 'react';
import { Box } from 'ink';
import { TMSStats } from '../../../utils/stats-collector.js';
import { StalenessCard } from './StalenessCard.js';
import { SprintProgressCard } from './SprintProgressCard.js';
import { GovernanceHealthCard } from './GovernanceHealthCard.js';
import { HotFilesCard } from './HotFilesCard.js';
import { FileDistributionCard } from './FileDistributionCard.js';
import { FileSizeHealthCard } from './FileSizeHealthCard.js';
import { ValidationCard } from './ValidationCard.js';
import { GuardianStatusCard } from './GuardianStatusCard.js';
import { NotConfiguredCard } from './NotConfiguredCard.js';
import type { ViewType } from './TabBar.js';

interface ViewContainerProps {
  view: ViewType;
  stats: TMSStats;
  contextReduction: number;
  typicalReads: number;
  total: number;
  hotFiles: string[];
}

/**
 * View Container - Renders cards based on active view
 */
export const ViewContainer: React.FC<ViewContainerProps> = ({
  view,
  stats,
  total,
  hotFiles,
}) => {
  const { files, sprint, fileSizeHealth, validation, guardian } = stats;

  if (view === 'overview') {
    // Calculate governance health score (0-100)
    const calculateGovernanceScore = (): number => {
      let score = 100;

      // Deduct for validation issues
      if (validation.status === 'errors') score -= 40;
      else if (validation.status === 'warnings') score -= 20;
      else if (validation.status === 'unknown') score -= 10;

      // Deduct for guardian issues
      if (guardian && guardian.status === 'major_violations') score -= 30;
      else if (guardian && guardian.status === 'minor_issues') score -= 15;

      // TODO: Deduct for staleness when git-staleness is integrated

      return Math.max(0, score);
    };

    // Get staleness data from stats (v4.0.0 git-based detection)
    const staleness = stats.staleness;
    const staleDocsCount = staleness?.staleDocsCount || 0;
    const totalDocsCount = staleness?.totalChecked || 0;
    const freshnessPercent = staleness?.freshnessPercent || 100;
    const oldestDocDays = staleness?.oldestDocDays ?? undefined;

    const governanceScore = calculateGovernanceScore();

    return (
      <Box flexDirection="column">
        <GovernanceHealthCard
          score={governanceScore}
          validationStatus={validation.status}
          guardianStatus={guardian?.status || 'unknown'}
          staleness={staleDocsCount}
        />

        {totalDocsCount > 0 && (
          <StalenessCard
            staleDocsCount={staleDocsCount}
            totalDocsCount={totalDocsCount}
            freshnessPercent={freshnessPercent}
            oldestDocDays={oldestDocDays}
          />
        )}

        {sprint ? (
          <SprintProgressCard
            sprintName={sprint.name}
            progress={sprint.progress}
            done={sprint.tasks.done}
            inProgress={sprint.tasks.inProgress}
            todo={sprint.tasks.todo}
          />
        ) : (
          <NotConfiguredCard
            title="SPRINT PROGRESS"
            message="No sprint configured in NEXT-TASKS.md"
            icon="🎯"
            color="gray"
          />
        )}
      </Box>
    );
  }

  if (view === 'files') {
    return (
      <Box flexDirection="column">
        <HotFilesCard hotFiles={hotFiles} count={files.hot} />

        <FileDistributionCard hot={files.hot} warm={files.warm} cold={files.cold} total={total} />

        {fileSizeHealth && fileSizeHealth.length > 0 && (
          <FileSizeHealthCard files={fileSizeHealth} />
        )}
      </Box>
    );
  }

  if (view === 'health') {
    return (
      <Box flexDirection="column">
        <ValidationCard
          status={validation.status}
          violations={validation.violations}
          lastChecked={validation.lastChecked}
        />

        {guardian ? (
          <GuardianStatusCard
            status={guardian.status}
            violationCount={guardian.violationCount}
            highConfidenceCount={guardian.highConfidenceCount}
            lastChecked={guardian.lastChecked}
          />
        ) : (
          <GuardianStatusCard
            status="unknown"
            violationCount={0}
            highConfidenceCount={0}
            lastChecked={null}
          />
        )}
      </Box>
    );
  }

  return null;
};
