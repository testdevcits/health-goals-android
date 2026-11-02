import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { DAYS, TREND_DATA, TREND_TABS, TrendTab } from '../const';
import { createHomeStyles } from '../styles.Home';
import { authenticatedRequest } from '../../../../services/authenticatedApi';

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

const ActivityTrends: React.FC<{ onPressDetails: () => void }> = ({
  onPressDetails,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [activeTab, setActiveTab] = useState<TrendTab>('Steps');
  const [trendData, setTrendData] = useState(TREND_DATA);
  useFocusEffect(useCallback(() => {
    let active = true;
    const end = new Date(); const start = new Date(Date.now() - 6 * 86400000);
    const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const metricType = activeTab === 'Steps' ? 'steps' : activeTab === 'Sleep' ? 'sleep' : 'active_minutes';
    authenticatedRequest<{ history: Array<{ date: string; value: number }> }>('GET', `/health/history?metricType=${metricType}&from=${key(start)}&to=${key(end)}`)
      .then(({ history }) => {
        if (!active || !history.length) return;
        const values = history.slice(-7).map(row => row.value);
        const sum = values.reduce((total, value) => total + value, 0);
        const average = Math.round(sum / values.length);
        setTrendData(current => ({ ...current, [activeTab]: { ...current[activeTab], bars: values, stats: current[activeTab].stats.map((stat, index) => index === 0 ? { ...stat, value: activeTab === 'Sleep' ? `${Math.floor(average / 60)}h ${Math.round(average % 60)}m` : sum.toLocaleString() } : index === 1 ? { ...stat, value: activeTab === 'Sleep' ? `${(average / 60).toFixed(1)}h` : average.toLocaleString() } : index === 2 && activeTab === 'Steps' ? { ...stat, value: values.filter(value => value >= 10000).length.toString() } : stat) } }));
      }).catch(() => {});
    return () => { active = false; };
  }, [activeTab]));
  const activeTrendData = trendData[activeTab];

  return (
    <>
      <SectionHeader
        sectionTitle="Daily Activity Trends"
        rightText="Details"
        onRightPress={onPressDetails}
      />
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
        <BarChart data={activeTrendData.bars} color={activeTrendData.color} />
        <View style={styles.statsRow}>
          {activeTrendData.stats.map((stat, index) => (
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
