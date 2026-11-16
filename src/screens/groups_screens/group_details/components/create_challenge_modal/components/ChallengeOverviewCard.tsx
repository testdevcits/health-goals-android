import React from 'react';
import { View } from 'react-native';
import AppIcon from '../../../../../../assets/appicon/AppIcon';
import { AppText } from '../../../../../../components';
import { useTheme } from '../../../../../../theme/useTheme';
import createChallengeModalStyles from '../styles.CreateChallengeModal';
import type { MetricTypeOption } from './MetricTypeSelector';

interface ChallengeOverviewCardProps {
  currentMetric: MetricTypeOption;
  challengeGoal: string;
  duration: string;
  rewardPoints: string;
}

export const ChallengeOverviewCard: React.FC<ChallengeOverviewCardProps> = ({
  currentMetric,
  challengeGoal,
  duration,
  rewardPoints,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createChallengeModalStyles(colors, spacing, radius);

  const parsedTarget = Number(challengeGoal.replace(/[^0-9.]/g, '')) || 0;
  const parsedReward = Number(rewardPoints) || 0;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <AppIcon name="Trophy" size={17} color={colors.primary} />
        <AppText variant="subtitle2" bold>
          Challenge Overview
        </AppText>
      </View>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryItemLabel}>Metric Type</AppText>
          <AppText style={styles.summaryItemValue}>{currentMetric.label}</AppText>
        </View>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryItemLabel}>Target Goal</AppText>
          <AppText style={styles.summaryItemValue}>
            {parsedTarget > 0
              ? `${parsedTarget.toLocaleString()} ${currentMetric.unit}`
              : '—'}
          </AppText>
        </View>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryItemLabel}>Duration</AppText>
          <AppText style={styles.summaryItemValue}>{duration}</AppText>
        </View>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryItemLabel}>Bonus Reward</AppText>
          <AppText style={styles.summaryItemValue}>
            {parsedReward > 0 ? `${parsedReward} pts` : 'None'}
          </AppText>
        </View>
      </View>
    </View>
  );
};
