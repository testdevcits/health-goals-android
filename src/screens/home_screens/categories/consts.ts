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
    tint: '#FCE8E8',
  },
  {
    id: 'walking',
    title: 'Walking',
    subtitle: 'Low impact steps',
    emoji: '🚶',
    tint: '#DDF7F1',
  },
  {
    id: 'cycling',
    title: 'Cycling',
    subtitle: 'Outdoor & Indoor',
    emoji: '🚴',
    tint: '#E5EFFC',
  },
  {
    id: 'strength',
    title: 'Strength',
    subtitle: 'Weights & Resistance',
    emoji: '🏋️',
    tint: '#EEE8FF',
  },
  {
    id: 'yoga',
    title: 'Yoga',
    subtitle: 'Flexibility & Mind',
    emoji: '🧘',
    tint: '#FFF0DE',
  },
  {
    id: 'hiit',
    title: 'HIIT',
    subtitle: 'High Intensity',
    emoji: '🔥',
    tint: '#FFE5E5',
  },
  {
    id: 'swimming',
    title: 'Pool swim',
    subtitle: 'Full body cardio',
    emoji: '🏊',
    tint: '#E1F3FF',
  },
  {
    id: 'circuit',
    title: 'Circuit training',
    subtitle: 'Full body workout',
    emoji: '🤸',
    tint: '#F6E7FF',
  },
  {
    id: 'hiking',
    title: 'Hiking',
    subtitle: 'Outdoor trails',
    emoji: '🥾',
    tint: '#E0F5EE',
  },
  {
    id: 'machines',
    title: 'Weight machines',
    subtitle: 'Gym equipment',
    emoji: '🏋️',
    tint: '#EDF1F4',
  },
  {
    id: 'indoor-bike',
    title: 'Bike indoor',
    subtitle: 'Stationary cycling',
    emoji: '🚲',
    tint: '#F1E6FA',
  },
  {
    id: 'treadmill',
    title: 'Treadmill',
    subtitle: 'Indoor running',
    emoji: '🏃',
    tint: '#DFF6F1',
  },
  {
    id: 'elliptical',
    title: 'Elliptical trainer',
    subtitle: 'Low impact gym',
    emoji: '🚴',
    tint: '#E4F0FC',
  },
  {
    id: 'dance',
    title: 'Dance',
    subtitle: 'Fun cardio',
    emoji: '💃',
    tint: '#FBE5FA',
  },
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Abs & Stability',
    emoji: '🤸',
    tint: '#FFF3DA',
  },
  {
    id: 'stretch',
    title: 'Stretch',
    subtitle: 'Recovery & Mobility',
    emoji: '🧘',
    tint: '#DDF7F1',
  },
];
