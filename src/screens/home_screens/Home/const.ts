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
    bars: (number | null)[];
    color: string;
    stats: { value: string; label: string }[];
  }
> = {
  Steps: {
    bars: [null, null, null, null, null, null, null],
    color: '#00C6A2',
    stats: [
      { value: '—', label: 'Total' },
      { value: '—', label: 'Daily Avg' },
      { value: '—', label: 'Days >10K' },
    ],
  },
  Sleep: {
    bars: [null, null, null, null, null, null, null],
    color: '#7C5CBF',
    stats: [
      { value: '—', label: 'Avg Sleep' },
      { value: '—', label: 'Quality' },
      { value: '—', label: 'Lowest' },
    ],
  },
  Active: {
    bars: [null, null, null, null, null, null, null],
    color: '#3B82F6',
    stats: [
      { value: '—', label: 'Total Mins' },
      { value: '—', label: 'Daily Avg' },
      { value: '—', label: 'Rest Days' },
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
