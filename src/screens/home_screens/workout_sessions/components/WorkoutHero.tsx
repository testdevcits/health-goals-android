import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import HeartbeatAnimation from './HeartbeatAnimation';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';
import { formatTime, type Activity } from '../workoutSessionHelpers';

export interface WorkoutHeroProps {
  currentActivity: Activity;
  isRunning: boolean;
  hasStarted: boolean;
  elapsedSeconds: number;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
  colors: any;
}

const WorkoutHero: React.FC<WorkoutHeroProps> = ({
  currentActivity,
  isRunning,
  hasStarted,
  elapsedSeconds,
  styles,
  colors,
}) => {
  return (
    <View
      style={[
        styles.workoutHero,
        { backgroundColor: currentActivity.color },
      ]}
    >
      <AppText style={styles.heroEmoji}>{currentActivity.emoji}</AppText>

      <AppText variant="h3" style={styles.heroActivityName}>
        {currentActivity?.name?.toUpperCase()}
      </AppText>

      {/* Heartbeat-style decorative line */}
      <HeartbeatAnimation isRunning={isRunning} color={colors.white} />

      <AppText style={styles.timer}>{formatTime(elapsedSeconds)}</AppText>

      <AppText variant="caption" style={styles.timerStatus}>
        {isRunning
          ? 'Workout in progress'
          : hasStarted
            ? 'Workout paused'
            : 'Ready to start'}
      </AppText>
    </View>
  );
};

export default memo(WorkoutHero);
