import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { AppButton, AppText } from '../../../../components';
import { createWorkoutSessionStyles } from '../styles.WorkoutSession';

export interface WorkoutControlsProps {
  isRunning: boolean;
  hasStarted: boolean;
  activityColor: string;
  textColor: string;
  onStartPause: () => void;
  onFinish: () => void;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
}

const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isRunning,
  hasStarted,
  activityColor,
  textColor,
  onStartPause,
  onFinish,
  styles,
}) => {
  return (
    <>
      <AppButton
        title={isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
        onPress={onStartPause}
        style={[
          styles.startButton,
          { backgroundColor: activityColor },
        ]}
      />

      <Pressable
        onPress={onFinish}
        accessibilityRole="button"
        style={styles.finishButton}
      >
        <AppText variant="subtitle2" style={{ color: textColor }}>
          Finish & Save
        </AppText>
      </Pressable>
    </>
  );
};

export default memo(WorkoutControls);
