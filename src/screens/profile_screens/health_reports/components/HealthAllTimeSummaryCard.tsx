import React from 'react';
import { AppErrorView, AppLoader, AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.HealthReport';
import type { HealthReportTab } from '../useHealthReports';
import type { HealthSummary } from '../../../../services/healthSummary';

interface HealthAllTimeSummaryCardProps {
  activeTab: HealthReportTab;
  loading: boolean;
  error: string;
  refresh: () => void;
  healthSummary?: HealthSummary | null;
}

export const HealthAllTimeSummaryCard: React.FC<HealthAllTimeSummaryCardProps> = ({
  activeTab,
  loading,
  error,
  refresh,
  healthSummary,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const allTimeMetric =
    activeTab === 'Workouts' ? 'workout' : activeTab === 'Sleep' ? 'sleep' : 'steps';
  const allTimeValue = healthSummary?.[allTimeMetric];
  const allTimeValueLabel =
    allTimeValue === undefined
      ? '—'
      : activeTab === 'Sleep'
      ? `${(allTimeValue / 60).toFixed(1)} h`
      : activeTab === 'Workouts'
      ? `${allTimeValue.toLocaleString()} min`
      : `${allTimeValue.toLocaleString()} steps`;

  return (
    <ProfileCard style={styles.summaryCard}>
      <AppText variant="subtitle2" bold>
        All-time {activeTab.toLowerCase()}
      </AppText>
      {loading ? (
        <AppLoader message="Loading all-time summary…" />
      ) : error ? (
        <AppErrorView message={error} onRefresh={refresh} />
      ) : (
        <AppText variant="h3" primary>
          {allTimeValueLabel}
        </AppText>
      )}
    </ProfileCard>
  );
};
