import React, { useState } from 'react';
import { Alert, Pressable, ScrollView,   View } from 'react-native';
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

const monthlyReports = [
  {
    title: 'Monthly Report',
    date: 'May 2026',
    metrics: [
      ['246K', 'Total Steps'],
      ['7h 02m', 'Avg Sleep'],
      ['18', 'Workouts'],
    ],
  },
  {
    title: 'Sleep Analysis',
    date: 'Jun 2026',
    metrics: [
      ['88%', 'Sleep Score'],
      ['1h 48m', 'Deep Sleep'],
      ['22m', 'Awake'],
    ],
  },
];

const HealthReportsScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState('Steps');
  const shareReport = (title: string) =>
    Alert.alert('Share report', `${title} is ready to share.`);

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
              Jun 9 – 15
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
          {activeTab === 'Steps' ? (
            <View style={styles.chart}>
              {[58, 72, 36, 84, 64, 51, 29].map((height, index) => (
                <View key={index} style={styles.chartDay}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height,
                        backgroundColor:
                          index === 3
                            ? theme.colors.primary
                            : theme.colors.primaryDark,
                      },
                    ]}
                  />
                  <AppText variant="caption" color="textTertiary">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </AppText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <AppText variant="h3" primary>
                {activeTab === 'Sleep' ? '7h 42m' : '5 workouts'}
              </AppText>
              <AppText variant="caption" secondary>
                This week
              </AppText>
            </View>
          )}
          <View style={styles.metricsRow}>
            {(activeTab === 'Steps'
              ? [
                  ['55,872', 'Total Steps'],
                  ['7,981', 'Daily Avg'],
                  ['2', 'Days >10K'],
                ]
              : activeTab === 'Sleep'
              ? [
                  ['7h 42m', 'Avg Sleep'],
                  ['88%', 'Sleep Score'],
                  ['1h 48m', 'Deep Sleep'],
                ]
              : [
                  ['5', 'Workouts'],
                  ['3h 20m', 'Active Time'],
                  ['1,420', 'Calories'],
                ]
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
                Alert.alert('PDF report', 'Your weekly report is ready.')
              }
              style={styles.reportButton}
            />
          </View>
        </ProfileCard>

        {monthlyReports.map(report => (
          <ProfileCard key={report.title} style={styles.reportCard}>
            <View style={styles.reportHeading}>
              <AppText variant="subtitle2" bold>
                {report.title}
              </AppText>
              <AppText variant="caption" primary bold>
                {report.date}
              </AppText>
            </View>
            <View style={styles.metricsRow}>
              {report.metrics.map(([value, label]) => (
                <ProfileMetric key={label} value={value} label={label} />
              ))}
            </View>
            <View style={styles.reportActions}>
              <AppButton
                title="Share"
                variant="ghost"
                onPress={() => shareReport(report.title)}
                style={[
                  styles.reportButton,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              />
              <AppButton
                title="View PDF"
                onPress={() =>
                  Alert.alert('PDF report', `${report.title} is ready.`)
                }
                style={styles.reportButton}
              />
            </View>
          </ProfileCard>
        ))}
      </ScrollView>
    </View>
  );
};

export default HealthReportsScreen;
