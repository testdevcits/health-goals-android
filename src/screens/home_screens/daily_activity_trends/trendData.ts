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
    bars: [66, 80, 42, 96, 72, 58, 32],
    stats: [
      { value: '55,872', label: 'This Week' },
      { value: '7,981', label: 'Daily Avg' },
      { value: '2', label: 'Days >10K' },
      { value: '78%', label: 'Goal Met' },
    ],
    insight:
      'You averaged 7,981 steps this week — about 20% below your 10K goal. Adding a 20-minute evening walk would close the gap.',
    goalUnit: 'steps per day',
  },
  Sleep: {
    color: '#7665DB',
    bars: [76, 70, 88, 66, 82, 91, 74],
    stats: [
      { value: '7h 16m', label: 'Avg Sleep' },
      { value: '88%', label: 'Quality' },
      { value: '1h 48m', label: 'Deep' },
      { value: '22m', label: 'Awake' },
    ],
    insight:
      'Your sleep quality is strong. Thursday was your shortest night (6h 24m) — a consistent 11 PM wind-down could help.',
    goalUnit: 'hours per night',
  },
  Heart: {
    color: '#F16D72',
    bars: [86, 82, 90, 87, 84, 80, 86],
    stats: [
      { value: '68', label: 'Resting bpm' },
      { value: '142', label: 'Peak bpm' },
      { value: '58', label: 'Lowest' },
      { value: 'Good', label: 'Variability' },
    ],
    insight:
      'Your resting heart rate is 68 bpm — within a healthy range. Cardio three times a week could lower it by 3–5 bpm.',
    goalUnit: 'bpm',
  },
  Stress: {
    color: '#F4A04F',
    bars: [72, 60, 96, 80, 62, 42, 66],
    stats: [
      { value: 'Low', label: 'Today' },
      { value: '2.9', label: 'Weekly Avg' },
      { value: '1', label: 'High Day' },
      { value: 'Balanced', label: 'Trend' },
    ],
    insight:
      'Stress peaked on Wednesday. Your post-lunch breathing exercises correlate with lower afternoon stress.',
    goalUnit: 'stress score',
  },
};
