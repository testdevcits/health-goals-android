import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import {
  AppButton,
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
  ProfileCard,
  ProfileMetric,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import createStyles from './styles.HealthReport';
import useHealthReports, { type HealthReportTab } from './useHealthReports';

const HealthReportsScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const {
    activeTab,
    setActiveTab,
    history,
    loading,
    error,
    refresh,
    dailyCoins,
    weekStepTotal,
    from,
    to,
    shareReport,
    totalCoins,
  } = useHealthReports();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Health Reports"
        subtitle="Your weekly and monthly summaries"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
        <ProfileCard style={styles.reportCard}>
          <View style={styles.reportHeading}>
            <AppText variant="subtitle2" bold>
              This Week
            </AppText>
            <AppText variant="caption" primary bold>
              {from.toLocaleDateString()} – {to.toLocaleDateString()}
            </AppText>
          </View>
          <View
            style={[
              styles.tabs,
              { backgroundColor: theme.colors.backgroundSecondary },
            ]}
          >
            {['Steps', 'Sleep', 'Workouts'].map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as HealthReportTab)}
                style={[
                  styles.tab,
                  activeTab === tab && {
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  bold={activeTab === tab}
                  color={activeTab === tab ? 'textPrimary' : 'textTertiary'}
                >
                  {tab}
                </AppText>
              </Pressable>
            ))}
          </View>
          {loading ? (
            <AppLoader message="Loading your health report…" />
          ) : error ? (
            <AppErrorView message={error} onRefresh={refresh} />
          ) : history.length === 0 ? (
            <AppEmptyState
              title="No health data for this week"
              description="Connect Health Connect and allow access to this metric to see your report."
            />
          ) : activeTab === 'Steps' ? (
            <View style={styles.chart}>
              {history.slice(-7).map((item, index) => (
                <View key={index} style={styles.chartDay}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(
                          7,
                          Math.min(
                            100,
                            Math.round(
                              (item.value /
                                Math.max(...history.map(row => row.value), 1)) *
                                100,
                            ),
                          ),
                        ),
                        backgroundColor:
                          index === 3
                            ? theme.colors.primary
                            : theme.colors.primaryDark,
                      },
                    ]}
                  />
                  <AppText variant="caption" color="textTertiary">
                    {new Date(`${item.date}T12:00:00`).toLocaleDateString([], {
                      weekday: 'short',
                    })}
                  </AppText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <AppText variant="h3" primary>
                {history
                  .reduce((sum, item) => sum + item.value, 0)
                  .toLocaleString()}{' '}
                {history[0]?.unit}
              </AppText>
              <AppText variant="caption" secondary>
                {activeTab === 'Sleep'
                  ? 'Sleep recorded this week'
                  : 'Workout minutes recorded this week'}
              </AppText>
            </View>
          )}
          {!loading && !error && history.length > 0 ? (
            <View style={styles.metricsRow}>
              {(activeTab === 'Steps'
                ? [
                    [
                      history
                        .reduce((sum, item) => sum + item.value, 0)
                        .toLocaleString(),
                      'Total Steps',
                    ],
                    [
                      history.length
                        ? Math.round(
                            history.reduce((sum, item) => sum + item.value, 0) /
                              history.length,
                          ).toLocaleString()
                        : '—',
                      'Daily Avg',
                    ],
                    [
                      history
                        .filter(item => item.value >= 10000)
                        .length.toString(),
                      'Days >10K',
                    ],
                  ]
                : activeTab === 'Sleep'
                ? [
                    [
                      history.length
                        ? `${Math.floor(
                            history.reduce((sum, item) => sum + item.value, 0) /
                              history.length /
                              60,
                          )}h ${Math.round(
                            (history.reduce(
                              (sum, item) => sum + item.value,
                              0,
                            ) /
                              history.length) %
                              60,
                          )}m`
                        : '—',
                      'Avg Sleep',
                    ],
                    [history.length.toString(), 'Days Recorded'],
                    [totalCoins.toString(), 'Coins Earned'],
                  ]
                : [
                    [
                      history
                        .reduce((sum, item) => sum + item.count, 0)
                        .toString(),
                      'Workouts',
                    ],
                    [
                      history
                        .reduce((sum, item) => sum + item.value, 0)
                        .toLocaleString(),
                      'Total Minutes',
                    ],
                    [totalCoins.toString(), 'Coins Earned'],
                  ]
              ).map(([value, label]) => (
                <ProfileMetric key={label} value={value} label={label} />
              ))}
            </View>
          ) : null}
          {!loading && !error && history.length > 0 ? (
            <View style={styles.reportActions}>
              <AppButton
                title="Share"
                variant="ghost"
                onPress={() => shareReport('This week’s report')}
                style={[
                  styles.reportButton,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              />
              <AppButton
                title="View PDF"
                onPress={() => shareReport('Weekly health report')}
                style={styles.reportButton}
              />
            </View>
          ) : null}
        </ProfileCard>

        <ProfileCard style={styles.reportCard}>
          <AppText variant="subtitle2" bold>
            Daily coins this week
          </AppText>
          <AppText variant="caption" secondary>
            Coins credited after activity settlement
          </AppText>
          {loading ? (
            <AppLoader message="Loading activity settlement…" />
          ) : error ? (
            <AppErrorView message={error} onRefresh={refresh} />
          ) : dailyCoins.length === 0 ? (
            <AppEmptyState
              title="No activity settlement yet"
              description="Daily points will appear here after the server processes your activity."
            />
          ) : (
            <View style={styles.metricsRow}>
              <ProfileMetric
                value={totalCoins.toLocaleString()}
                label="Coins Earned"
              />
              <ProfileMetric
                value={dailyCoins.length.toString()}
                label="Active Days"
              />
              <ProfileMetric
                value={weekStepTotal.toLocaleString()}
                label="Week Steps"
              />
            </View>
          )}
          <View style={styles.reportActions}>
            <AppButton
              title="Share"
              variant="ghost"
              onPress={() => shareReport('This week’s report')}
              style={[
                styles.reportButton,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            />
            <AppButton
              title="View PDF"
              onPress={() =>
                Alert.alert('PDF report', 'PDF export is not available yet.')
              }
              style={styles.reportButton}
            />
          </View>
        </ProfileCard>
      </ScrollView>
    </View>
  );
};

export default HealthReportsScreen;
