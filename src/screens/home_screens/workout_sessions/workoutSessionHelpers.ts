import { WORKOUT_ACTIVITIES } from './workoutActivities';

export type Activity = (typeof WORKOUT_ACTIVITIES)[number] & { color: string };

export interface WorkoutConfirmation {
  title: string;
  message: string;
  actions: {
    label: string;
    variant?: 'primary' | 'outline';
    destructive?: boolean;
    onPress?: () => void | Promise<void>;
  }[];
}

export const generateActivityColor = (seed: number): string => {
  const hue = (seed * 47 + Math.floor(Math.random() * 60)) % 360;
  const saturation = 72;
  const lightness = 58;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export const activities: Activity[] = WORKOUT_ACTIVITIES.map((activity, index) => ({
  ...activity,
  color: generateActivityColor(index + 1),
}));

export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};
