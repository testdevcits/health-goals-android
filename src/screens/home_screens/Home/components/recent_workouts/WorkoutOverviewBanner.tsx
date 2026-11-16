import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import styles from './styles.RecentWorkoutsSection';

interface WorkoutOverviewBannerProps {
  activeTimeText: string;
  caloriesText: string;
  sessionsText: string;
}

export const WorkoutOverviewBanner: React.FC<WorkoutOverviewBannerProps> = ({
  activeTimeText,
  caloriesText,
  sessionsText,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.summaryStrip,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.summaryItem}>
        <AppText variant="caption" secondary bold>
          Active Time
        </AppText>
        <AppText variant="subtitle2" bold color="primary" mt={2}>
          {activeTimeText}
        </AppText>
      </View>

      <View
        style={[styles.summaryDivider, { backgroundColor: colors.border }]}
      />

      <View style={styles.summaryItem}>
        <AppText variant="caption" secondary bold>
          Calories
        </AppText>
        <AppText
          variant="subtitle2"
          bold
          style={{ color: colors.warning }}
          mt={2}
        >
          {caloriesText}
        </AppText>
      </View>

      <View
        style={[styles.summaryDivider, { backgroundColor: colors.border }]}
      />

      <View style={styles.summaryItem}>
        <AppText variant="caption" secondary bold>
          Workouts
        </AppText>
        <AppText variant="subtitle2" bold style={{ color: colors.info }} mt={2}>
          {sessionsText}
        </AppText>
      </View>
    </View>
  );
};
