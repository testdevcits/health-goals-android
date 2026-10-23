// ── Static data ────────────────────────────────────────────────────────────
export const WORKOUT_CATEGORIES = [
  {
    id: '1',
    emoji: '🏃',
    name: 'Running',
    subtitle: 'Cardio & Endurance',
    bg: '#FFE8E8',
    accent: '#EF4444',
  },
  {
    id: '2',
    emoji: '🚶',
    name: 'Walking',
    subtitle: 'Low impact steps',
    bg: '#E0FAF5',
    accent: '#00C6A2',
  },
  {
    id: '3',
    emoji: '🚴',
    name: 'Cycling',
    subtitle: 'Outdoor & Indoor',
    bg: '#E0EEFF',
    accent: '#3B82F6',
  },
  {
    id: '4',
    emoji: '🏊',
    name: 'Swimming',
    subtitle: 'Full body workout',
    bg: '#EDE9FE',
    accent: '#7C3AED',
  },
  {
    id: '5',
    emoji: '🧘',
    name: 'Yoga',
    subtitle: 'Flexibility & calm',
    bg: '#FEF3C7',
    accent: '#D97706',
  },
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const TREND_TABS = ['Steps', 'Sleep', 'Active'] as const;
export type TrendTab = (typeof TREND_TABS)[number];

export const TREND_DATA: Record<
  TrendTab,
  {
    bars: number[];
    color: string;
    stats: { value: string; label: string }[];
  }
> = {
  Steps: {
    bars: [6500, 8200, 7100, 9400, 8800, 5600, 7200],
    color: '#00C6A2',
    stats: [
      { value: '55,872', label: 'Total' },
      { value: '7,981', label: 'Daily Avg' },
      { value: '2', label: 'Days >10K' },
    ],
  },
  Sleep: {
    bars: [7.5, 6.8, 8.1, 7.2, 6.5, 8.8, 7.0],
    color: '#7C5CBF',
    stats: [
      { value: '7h 16m', label: 'Avg Sleep' },
      { value: '88%', label: 'Quality' },
      { value: '6.4h', label: 'Lowest' },
    ],
  },
  Active: {
    bars: [45, 60, 35, 75, 55, 30, 50],
    color: '#3B82F6',
    stats: [
      { value: '350', label: 'Total Mins' },
      { value: '50', label: 'Daily Avg' },
      { value: '1', label: 'Rest Days' },
    ],
  },
};

export const QUICK_ACTIONS = [
  {
    id: '1',
    emoji: '▶️',
    label: 'Start Workout',
    bg: '#FFF3E0',
    accent: '#F59E0B',
    screenName: 'WorkoutSession',
  },
  {
    id: '2',
    emoji: '🏆',
    label: 'Join Challenge',
    bg: '#FFF9E0',
    accent: '#D97706',
    screenName: 'Challenges',
  },
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────
export const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
};

export const getFormattedDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};
