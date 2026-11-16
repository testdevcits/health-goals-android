import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import styles from './styles.RecentWorkoutsSection';
import type { FilterTab } from './useRecentWorkouts';

interface WorkoutFilterTabsProps {
  activeTab: FilterTab;
  allCount: number;
  workoutCount: number;
  dailyCount: number;
  onSelectTab: (tab: FilterTab) => void;
}

export const WorkoutFilterTabs: React.FC<WorkoutFilterTabsProps> = ({
  activeTab,
  allCount,
  workoutCount,
  dailyCount,
  onSelectTab,
}) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  return (
    <View style={styles.tabsRow}>
      <Pressable
        onPress={() => onSelectTab('all')}
        style={[
          styles.tabButton,
          {
            backgroundColor:
              activeTab === 'all' ? colors.primary : colors.backgroundSecondary,
            borderRadius: radius.full,
          },
        ]}
      >
        <AppText
          variant="caption"
          bold
          color={activeTab === 'all' ? 'textInverse' : 'textSecondary'}
        >
          All ({allCount})
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => onSelectTab('workouts')}
        style={[
          styles.tabButton,
          {
            backgroundColor:
              activeTab === 'workouts'
                ? colors.primary
                : colors.backgroundSecondary,
            borderRadius: radius.full,
          },
        ]}
      >
        <AppText
          variant="caption"
          bold
          color={activeTab === 'workouts' ? 'textInverse' : 'textSecondary'}
        >
          Workouts ({workoutCount})
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => onSelectTab('daily')}
        style={[
          styles.tabButton,
          {
            backgroundColor:
              activeTab === 'daily'
                ? colors.primary
                : colors.backgroundSecondary,
            borderRadius: radius.full,
          },
        ]}
      >
        <AppText
          variant="caption"
          bold
          color={activeTab === 'daily' ? 'textInverse' : 'textSecondary'}
        >
          Daily Stats ({dailyCount})
        </AppText>
      </Pressable>
    </View>
  );
};
