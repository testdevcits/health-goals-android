import React, { useCallback, useState } from 'react';
import { Alert, NativeModules, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppButton,
  AppHeader,
  AppText,
  ProfileCard,
  ProfileMetric,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import createStyles from './styles.HealthReport';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';

const METRICS = { Steps: 'steps', Sleep: 'sleep', Workouts: 'workout' } as const;
type DailyValue = { date: string; value: number; count: number; unit: string };

const HealthReportsScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState('Steps');
  const [history, setHistory] = useState<DailyValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dailyCoins, setDailyCoins] = useState<Array<{ day: string; totals?: { steps?: number; workoutMinutes?: number; sleepMinutes?: number }; creditedCoins?: number }>>([]);
  const to = new Date();
  const from = new Date(Date.now() - 6 * 86400000);
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true); setError('');
    const requestTo = new Date();
    const requestFrom = new Date(requestTo.getTime() - 6 * 86400000);
    const metricType = activeTab === 'Workouts' ? 'workout' : METRICS[activeTab as keyof typeof METRICS];
    Promise.all([
      authenticatedRequest<{ history: DailyValue[] }>('GET', `/health/history?metricType=${metricType}&from=${dateKey(requestFrom)}&to=${dateKey(requestTo)}`),
      authenticatedRequest<{ items: Array<{ day: string; totals?: { steps?: number; workoutMinutes?: number; sleepMinutes?: number }; creditedCoins?: number }> }>('GET', `/activity/history?from=${dateKey(requestFrom)}&to=${dateKey(requestTo)}&limit=7`),
    ]).then(([records, coins]) => { if (active) { setHistory(records.history || []); setDailyCoins(coins.items || []); } })
      .catch(cause => { if (active) setError(apiErrorMessage(cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [activeTab]));
  const shareReport = (title: string) => {
    const total = history.reduce((sum, item) => sum + item.value, 0);
    const content = [
      `Report period: ${from.toLocaleDateString()} – ${to.toLocaleDateString()}`,
      `Selected metric: ${activeTab}`,
      `Synced total: ${total.toLocaleString()} ${history[0]?.unit || ''}`,
      `Daily average: ${history.length ? Math.round(total / history.length).toLocaleString() : 0}`,
      `Coins credited: ${dailyCoins.reduce((sum, item) => sum + (item.creditedCoins || 0), 0)}`,
      `Days with activity: ${dailyCoins.length}`,
      `Data points: ${history.length}`,
    ].join('\n');
    const sharePdf = NativeModules.HealthAppConfig?.sharePdf;
    if (typeof sharePdf !== 'function') {
      Alert.alert('Report export unavailable', 'Update the Android app build to enable PDF sharing.');
      return;
    }
    sharePdf(title, content);
  };

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
                onPress={() => setActiveTab(tab)}
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
          {activeTab === 'Steps' && history.length ? (
            <View style={styles.chart}>
              {history.slice(-7).map((item, index) => (
                <View key={index} style={styles.chartDay}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(7, Math.min(100, Math.round(item.value / Math.max(...history.map(row => row.value), 1) * 100))),
                        backgroundColor:
                          index === 3
                            ? theme.colors.primary
                            : theme.colors.primaryDark,
                      },
                    ]}
                  />
                  <AppText variant="caption" color="textTertiary">
                    {new Date(`${item.date}T12:00:00`).toLocaleDateString([], { weekday: 'short' })}
                  </AppText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <AppText variant="h3" primary>{loading ? 'Loading…' : error ? 'Data unavailable' : history.length ? `${history.reduce((sum, item) => sum + item.value, 0).toLocaleString()} ${history[0].unit}` : 'No synced data yet'}</AppText>
              <AppText variant="caption" secondary>
                {error || 'This week'}
              </AppText>
            </View>
          )}
          <View style={styles.metricsRow}>
            {(activeTab === 'Steps'
              ? [[history.reduce((sum, item) => sum + item.value, 0).toLocaleString(), 'Total Steps'], [history.length ? Math.round(history.reduce((sum, item) => sum + item.value, 0) / history.length).toLocaleString() : '—', 'Daily Avg'], [history.filter(item => item.value >= 10000).length.toString(), 'Days >10K']]
              : activeTab === 'Sleep'
              ? [[history.length ? `${Math.floor(history.reduce((sum, item) => sum + item.value, 0) / history.length / 60)}h ${Math.round(history.reduce((sum, item) => sum + item.value, 0) / history.length % 60)}m` : '—', 'Avg Sleep'], [history.length.toString(), 'Days Recorded'], [dailyCoins.reduce((sum, day) => sum + (day.creditedCoins || 0), 0).toString(), 'Coins Earned']]
              : [[history.reduce((sum, item) => sum + item.count, 0).toString(), 'Workouts'], [history.reduce((sum, item) => sum + item.value, 0).toLocaleString(), 'Total Minutes'], [dailyCoins.reduce((sum, day) => sum + (day.creditedCoins || 0), 0).toString(), 'Coins Earned']]
            ).map(([value, label]) => (
              <ProfileMetric key={label} value={value} label={label} />
            ))}
          </View>
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
                shareReport('Weekly health report')
              }
              style={styles.reportButton}
            />
          </View>
        </ProfileCard>

        <ProfileCard style={styles.reportCard}>
          <AppText variant="subtitle2" bold>Daily coins this week</AppText>
          <AppText variant="caption" secondary>Coins credited after activity settlement</AppText>
          <View style={styles.metricsRow}>
            <ProfileMetric value={dailyCoins.reduce((sum, day) => sum + (day.creditedCoins || 0), 0).toLocaleString()} label="Coins Earned" />
            <ProfileMetric value={dailyCoins.length.toString()} label="Active Days" />
            <ProfileMetric value={dailyCoins.reduce((sum, day) => sum + (day.totals?.steps || 0), 0).toLocaleString()} label="Week Steps" />
          </View>
          <View style={styles.reportActions}>
            <AppButton title="Share" variant="ghost" onPress={() => shareReport('This week’s report')} style={[styles.reportButton, { backgroundColor: theme.colors.primaryLight }]} />
            <AppButton title="View PDF" onPress={() => Alert.alert('PDF report', 'PDF export is not available yet.')} style={styles.reportButton} />
          </View>
        </ProfileCard>
      </ScrollView>
    </View>
  );
};

export default HealthReportsScreen;
