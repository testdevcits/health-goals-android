import React from 'react';
import { Pressable, View } from 'react-native';
import {
  AppEmptyState,
  AppErrorView,
  AppLoader,
  AppText,
  ProfileCard,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.HealthReport';
import type { HealthReportTab } from '../useHealthReports';
import type { ActivityRecord } from '../../../../services/activityRecords';

interface SyncedRecordsCardProps {
  activeTab: HealthReportTab;
  activityRecords: ActivityRecord[];
  loading: boolean;
  loadingMore: boolean;
  error: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const SyncedRecordsCard: React.FC<SyncedRecordsCardProps> = ({
  activeTab,
  activityRecords,
  loading,
  loadingMore,
  error,
  hasMore,
  loadMore,
  refresh,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <ProfileCard style={styles.recordsCard}>
      <View style={styles.recordsHeading}>
        <AppText variant="subtitle2" bold>
          Synced {activeTab.toLowerCase()} records
        </AppText>
        {!loading && !error ? (
          <AppText variant="caption" secondary>
            {activityRecords.length}
            {hasMore ? '+' : ''} shown
          </AppText>
        ) : null}
      </View>
      {loading ? (
        <AppLoader message="Loading synced records…" />
      ) : error ? (
        <AppErrorView message={error} onRefresh={refresh} />
      ) : activityRecords.length === 0 ? (
        <AppEmptyState
          title="No synced records for this period"
          description="Records from your connected health sources will appear here."
        />
      ) : (
        <>
          {activityRecords.map(record => (
            <View key={record.id} style={styles.recordRow}>
              <View style={styles.recordCopy}>
                <AppText variant="subtitle2" bold>
                  {record.activityType ||
                    record.metricType.replace(/_/g, ' ')}
                </AppText>
                <AppText variant="caption" secondary>
                  {new Date(record.recordedAt).toLocaleString()} ·{' '}
                  {record.source}
                </AppText>
              </View>
              <AppText variant="subtitle2" primary bold>
                {record.value.toLocaleString()} {record.unit}
              </AppText>
            </View>
          ))}
          {hasMore ? (
            <Pressable
              onPress={loadMore}
              disabled={loadingMore}
              style={styles.loadMoreRecords}
              accessibilityRole="button"
            >
              <AppText variant="caption" primary bold>
                {loadingMore ? 'Loading…' : 'Load more records'}
              </AppText>
            </Pressable>
          ) : null}
        </>
      )}
    </ProfileCard>
  );
};
