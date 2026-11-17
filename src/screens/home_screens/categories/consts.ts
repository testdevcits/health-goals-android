import { lightColors } from '../../../theme/colors';

export type WorkoutCategory = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tint: string;
};

export const categories: WorkoutCategory[] = [
  {
    id: 'running',
    title: 'Running',
    subtitle: 'Cardio & Endurance',
    emoji: '🏃',
    tint: lightColors.coralLight,
  },
  {
    id: 'walking',
    title: 'Walking',
    subtitle: 'Low impact steps',
    emoji: '🚶',
    tint: lightColors.primaryLight,
  },
  {
    id: 'cycling',
    title: 'Cycling',
    subtitle: 'Outdoor & Indoor',
    emoji: '🚴',
    tint: lightColors.infoLight,
  },
  {
    id: 'strength',
    title: 'Strength',
    subtitle: 'Weights & Resistance',
    emoji: '🏋️',
    tint: lightColors.purpleLight,
  },
  {
    id: 'yoga',
    title: 'Yoga',
    subtitle: 'Flexibility & Mind',
    emoji: '🧘',
    tint: lightColors.warningLight,
  },
  {
    id: 'hiit',
    title: 'HIIT',
    subtitle: 'High Intensity',
    emoji: '🔥',
    tint: lightColors.errorLight,
  },
  {
    id: 'swimming',
    title: 'Pool swim',
    subtitle: 'Full body cardio',
    emoji: '🏊',
    tint: lightColors.infoLight,
  },
  {
    id: 'circuit',
    title: 'Circuit training',
    subtitle: 'Full body workout',
    emoji: '🤸',
    tint: lightColors.purpleLight,
  },
  {
    id: 'hiking',
    title: 'Hiking',
    subtitle: 'Outdoor trails',
    emoji: '🥾',
    tint: lightColors.primaryLight,
  },
  {
    id: 'machines',
    title: 'Weight machines',
    subtitle: 'Gym equipment',
    emoji: '🏋️',
    tint: lightColors.surfaceElevated,
  },
  {
    id: 'indoor-bike',
    title: 'Bike indoor',
    subtitle: 'Stationary cycling',
    emoji: '🚲',
    tint: lightColors.purpleLight,
  },
  {
    id: 'treadmill',
    title: 'Treadmill',
    subtitle: 'Indoor running',
    emoji: '🏃',
    tint: lightColors.primaryLight,
  },
  {
    id: 'elliptical',
    title: 'Elliptical trainer',
    subtitle: 'Low impact gym',
    emoji: '🚴',
    tint: lightColors.infoLight,
  },
  {
    id: 'dance',
    title: 'Dance',
    subtitle: 'Fun cardio',
    emoji: '💃',
    tint: lightColors.coralLight,
  },
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Abs & Stability',
    emoji: '🤸',
    tint: lightColors.warningLight,
  },
  {
    id: 'stretch',
    title: 'Stretch',
    subtitle: 'Recovery & Mobility',
    emoji: '🧘',
    tint: lightColors.primaryLight,
  },
];
