import React, { memo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { AppText } from '../../../../components';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';
import type { Activity } from '../workoutSessionHelpers';

export interface ActivitySelectorProps {
  activities: Activity[];
  currentActivityId: string;
  onSelectActivity: (activity: Activity) => void;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
  colors: any;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  currentActivityId,
  onSelectActivity,
  styles,
  colors,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.activitySelector}
    >
      {activities.map(activity => {
        const selected = currentActivityId === activity.id;

        return (
          <Pressable
            key={activity.id}
            onPress={() => onSelectActivity(activity)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${activity.name}`}
            accessibilityState={{ selected }}
            style={[
              styles.activityChip,
              {
                backgroundColor: selected
                  ? colors.surface
                  : colors.surfaceElevated,
                borderColor: selected ? colors.border : 'transparent',
              },
              selected && styles.selectedChip,
            ]}
          >
            <AppText style={styles.activityEmoji}>{activity.emoji}</AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default memo(ActivitySelector);
