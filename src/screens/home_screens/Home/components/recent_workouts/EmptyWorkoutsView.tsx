import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import styles from './styles.RecentWorkoutsSection';
import type { FilterTab } from './useRecentWorkouts';

interface EmptyWorkoutsViewProps {
  activeTab: FilterTab;
  onStartWorkout: () => void;
}

export const EmptyWorkoutsView: React.FC<EmptyWorkoutsViewProps> = ({
  activeTab,
  onStartWorkout,
}) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  return (
    <View
      style={[
        styles.emptyCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.emptyIconBadge,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <AppText variant="h2">{activeTab === 'workouts' ? '🏃' : '📊'}</AppText>
      </View>
      <AppText variant="subtitle1" bold color="textPrimary" mb={4}>
        {activeTab === 'workouts'
          ? 'No workouts synced yet'
          : 'No health records found'}
      </AppText>
      <AppText variant="body2" secondary center style={styles.emptySubtitle}>
        {activeTab === 'workouts'
          ? 'Start running, walking, or cycling to record your activity.'
          : 'Sync Health Connect or complete an activity to see updates.'}
      </AppText>
      <Pressable
        onPress={onStartWorkout}
        style={[
          styles.startButton,
          {
            backgroundColor: colors.primary,
            borderRadius: radius.full,
          },
        ]}
      >
        <AppText variant="buttonSm" color="textInverse" bold>
          Start a Workout
        </AppText>
      </Pressable>
    </View>
  );
};
