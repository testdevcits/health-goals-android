import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { DAYS, TREND_DATA, TREND_TABS, TrendTab } from '../const';
import { createHomeStyles } from '../styles.Home';

const BAR_MAX_HEIGHT = 100;

const BarChart: React.FC<{ data: number[]; color: string }> = ({
  data,
  color,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const maxValue = Math.max(...data);

  return (
    <View style={styles.chartArea}>
      {data.map((value, index) => {
        const height = Math.max(8, (value / maxValue) * BAR_MAX_HEIGHT);
        return (
          <View key={DAYS[index]} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: color,
                },
                index !== 4 && styles.barMuted,
              ]}
            />
            <AppText variant="caption" secondary>
              {DAYS[index]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const ActivityTrends: React.FC<{ onPressDetails: () => void }> = ({ onPressDetails }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [activeTab, setActiveTab] = useState<TrendTab>('Steps');
  const trendData = TREND_DATA[activeTab];

  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText variant="h3">Daily Activity Trends</AppText>
        <TouchableOpacity onPress={onPressDetails} accessibilityRole="button">
          <AppText variant="label" link>
            Details
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.trendsCard}>
        <View style={styles.tabRow}>
          {TREND_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
            >
              <AppText
                variant="label"
                bold={activeTab === tab}
                color={activeTab === tab ? 'textPrimary' : 'textSecondary'}
              >
                {tab}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        <BarChart data={trendData.bars} color={trendData.color} />
        <View style={styles.statsRow}>
          {trendData.stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <AppText variant="subtitle1" bold mb={2}>
                  {stat.value}
                </AppText>
                <AppText variant="caption" secondary>
                  {stat.label}
                </AppText>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </>
  );
};

export default ActivityTrends;
