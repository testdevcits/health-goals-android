import React, { memo } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { AppButton, AppText } from '../../../../components';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';

export interface WorkoutControlsProps {
  isRunning: boolean;
  hasStarted: boolean;
  activityColor: string;
  textColor: string;
  savingWorkout?: boolean;
  onStartPause: () => void;
  onFinish: () => void;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
}

const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isRunning,
  hasStarted,
  activityColor,
  textColor,
  savingWorkout = false,
  onStartPause,
  onFinish,
  styles,
}) => {
  return (
    <>
      <AppButton
        title={isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
        onPress={onStartPause}
        disabled={savingWorkout}
        style={[
          styles.startButton,
          { backgroundColor: activityColor },
        ]}
      />

      <Pressable
        onPress={onFinish}
        disabled={savingWorkout}
        accessibilityRole="button"
        style={styles.finishButton}
      >
        {savingWorkout ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <AppText variant="subtitle2" style={{ color: textColor }}>
            Finish & Save
          </AppText>
        )}
      </Pressable>
    </>
  );
};

export default memo(WorkoutControls);
