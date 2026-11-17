import { lightColors } from '../../../theme/colors';

export const TREND_METRICS = ['Steps', 'Sleep', 'Heart', 'Stress'] as const;

export type TrendMetric = (typeof TREND_METRICS)[number];

type TrendSummary = {
  value: string;
  label: string;
};

type TrendMetricData = {
  color: string;
  bars: (number | null)[];
  stats: TrendSummary[];
  insight: string;
  goalUnit: string;
};

export const trendData: Record<TrendMetric, TrendMetricData> = {
  Steps: {
    color: lightColors.primary,
    bars: [null, null, null, null, null, null, null],
    stats: [
      { value: '—', label: 'Last 7 days' },
      { value: '—', label: 'Daily avg' },
      { value: '—', label: 'Days ≥10K' },
      { value: '—', label: 'Goal met' },
    ],
    insight: '',
    goalUnit: 'steps per day',
  },
  Sleep: {
    color: lightColors.primaryDark,
    bars: [null, null, null, null, null, null, null],
    stats: [
      { value: '—', label: 'Daily avg' },
      { value: '—', label: 'Longest day' },
      { value: '—', label: 'Shortest day' },
      { value: '—', label: 'Days synced' },
    ],
    insight: '',
    goalUnit: 'hours per night',
  },
  Heart: {
    color: lightColors.coral,
    bars: [null, null, null, null, null, null, null],
    stats: [
      { value: '—', label: 'Daily avg' },
      { value: '—', label: 'Highest daily avg' },
      { value: '—', label: 'Lowest daily avg' },
      { value: '—', label: 'Days synced' },
    ],
    insight: '',
    goalUnit: 'bpm',
  },
  Stress: {
    color: lightColors.warning,
    bars: [null, null, null, null, null, null, null],
    stats: [
      { value: '—', label: 'Daily avg' },
      { value: '—', label: 'Highest daily avg' },
      { value: '—', label: 'Lowest daily avg' },
      { value: '—', label: 'Days synced' },
    ],
    insight: '',
    goalUnit: 'stress score',
  },
};
