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
    color: '#18B9A4',
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
    color: '#7665DB',
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
    color: '#F16D72',
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
    color: '#F4A04F',
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
