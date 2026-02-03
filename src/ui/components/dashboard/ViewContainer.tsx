import React from 'react';
import { Box } from 'ink';
import { TMSStats } from '../../../utils/stats-collector.js';
import { ContextReductionCard } from './ContextReductionCard.js';
import { SprintProgressCard } from './SprintProgressCard.js';
import { CostSavingsCard } from './CostSavingsCard.js';
import { HotFilesCard } from './HotFilesCard.js';
import { FileDistributionCard } from './FileDistributionCard.js';
import { FileSizeHealthCard } from './FileSizeHealthCard.js';
import { ValidationCard } from './ValidationCard.js';
import { GuardianStatusCard } from './GuardianStatusCard.js';
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
  contextReduction,
  typicalReads,
  total,
  hotFiles,
}) => {
  const { files, sprint, savings, fileSizeHealth, validation, guardian } = stats;

  if (view === 'overview') {
    return (
      <Box flexDirection="column">
        <ContextReductionCard
          contextReduction={contextReduction}
          typicalReads={typicalReads}
          total={total}
        />

        {sprint && (
          <SprintProgressCard
            sprintName={sprint.name}
            progress={sprint.progress}
            done={sprint.tasks.done}
            inProgress={sprint.tasks.inProgress}
            todo={sprint.tasks.todo}
          />
        )}

        {savings && (
          <CostSavingsCard
            monthlyCost={savings.monthlyCost}
            tokensAvoided={savings.tokensAvoided}
            percentReduction={savings.percentReduction}
            model={savings.model}
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
