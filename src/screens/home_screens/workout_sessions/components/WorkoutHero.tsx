import React, { memo, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { AppText } from '../../../../components';
import HeartbeatAnimation from './HeartbeatAnimation';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';
import { formatTime, type Activity } from '../workoutSessionHelpers';

export interface WorkoutHeroProps {
  currentActivity: Activity;
  isRunning: boolean;
  isAutoPaused?: boolean;
  hasStarted: boolean;
  elapsedSeconds: number;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
  colors: any;
}

const WorkoutHero: React.FC<WorkoutHeroProps> = ({
  currentActivity,
  isRunning,
  isAutoPaused = false,
  hasStarted,
  elapsedSeconds,
  styles,
  colors,
}) => {
  const fadeAnim = useRef(new Animated.Value(isAutoPaused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isAutoPaused ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, isAutoPaused]);

  return (
    <View
      style={[styles.workoutHero, { backgroundColor: currentActivity.color }]}
    >
      <AppText style={styles.heroEmoji}>{currentActivity.emoji}</AppText>

      <AppText variant="h3" style={styles.heroActivityName}>
        {currentActivity?.name?.toUpperCase()}
      </AppText>

      {/* Heartbeat-style decorative line */}
      <HeartbeatAnimation
        isRunning={isRunning && !isAutoPaused}
        color={colors.white}
      />

      <AppText style={styles.timer}>{formatTime(elapsedSeconds)}</AppText>

      {isAutoPaused ? (
        <Animated.View style={[styles.autoPausePill, { opacity: fadeAnim }]}>
          <View style={styles.autoPauseDot} />
          <AppText style={styles.autoPauseText}>
            Auto-Paused • Device at same place
          </AppText>
        </Animated.View>
      ) : (
        <AppText variant="caption" style={styles.timerStatus}>
          {isRunning
            ? 'Workout in progress'
            : hasStarted
            ? 'Workout paused'
            : 'Ready to start'}
        </AppText>
      )}
    </View>
  );
};

export default memo(WorkoutHero);
