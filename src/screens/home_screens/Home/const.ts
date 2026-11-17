import { lightColors } from '../../../theme/colors';

// ── Static data ────────────────────────────────────────────────────────────
export const WORKOUT_CATEGORIES = [
  {
    id: '1',
    emoji: '🏃',
    name: 'Running',
    subtitle: 'Cardio & Endurance',
    bg: lightColors.coralLight,
    accent: lightColors.coral,
  },
  {
    id: '2',
    emoji: '🚶',
    name: 'Walking',
    subtitle: 'Low impact steps',
    bg: lightColors.primaryLight,
    accent: lightColors.primary,
  },
  {
    id: '3',
    emoji: '🚴',
    name: 'Cycling',
    subtitle: 'Outdoor & Indoor',
    bg: lightColors.infoLight,
    accent: lightColors.info,
  },
  {
    id: '4',
    emoji: '🏊',
    name: 'Swimming',
    subtitle: 'Full body workout',
    bg: lightColors.purpleLight,
    accent: lightColors.primaryDark,
  },
  {
    id: '5',
    emoji: '🧘',
    name: 'Yoga',
    subtitle: 'Flexibility & calm',
    bg: lightColors.warningLight,
    accent: lightColors.warning,
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
    color: lightColors.primary,
    stats: [
      { value: '—', label: 'Total' },
      { value: '—', label: 'Daily Avg' },
      { value: '—', label: 'Days >10K' },
    ],
  },
  Sleep: {
    bars: [null, null, null, null, null, null, null],
    color: lightColors.primaryDark,
    stats: [
      { value: '—', label: 'Avg Sleep' },
      { value: '—', label: 'Quality' },
      { value: '—', label: 'Lowest' },
    ],
  },
  Active: {
    bars: [null, null, null, null, null, null, null],
    color: lightColors.info,
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
    bg: lightColors.warningLight,
    accent: lightColors.warning,
    screenName: 'WorkoutSession',
  },
  {
    id: '2',
    emoji: '🏆',
    label: 'Join Challenge',
    bg: lightColors.warningLight,
    accent: lightColors.warning,
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
