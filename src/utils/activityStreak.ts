export type ActivityHistoryItemForStreak = {
  day: string;
  creditedCoins?: number;
  totals?: {
    steps?: number;
    workoutMinutes?: number;
    meditationMinutes?: number;
  };
};

export type TodayActivityForStreak = {
  creditedCoins?: number;
  totals?: {
    steps?: number;
    workoutMinutes?: number;
    meditationMinutes?: number;
  };
};

export function calculateActivityStreak(
  historyItems: ActivityHistoryItemForStreak[] = [],
  todayData?: TodayActivityForStreak,
): number {
  const activeDays = new Set(
    (historyItems || [])
      .filter(
        item =>
          (item?.creditedCoins || 0) > 0 ||
          Boolean(
            item?.totals?.steps ||
            item?.totals?.workoutMinutes ||
            item?.totals?.meditationMinutes,
          ),
      )
      .map(item => item?.day),
  );

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  if (
    (todayData?.creditedCoins || 0) > 0 ||
    Boolean(todayData?.totals?.steps) ||
    Boolean(todayData?.totals?.workoutMinutes) ||
    Boolean(todayData?.totals?.meditationMinutes) ||
    (historyItems || []).some(
      item =>
        item?.day === today &&
        Boolean(
          item?.totals?.steps ||
          item?.totals?.workoutMinutes ||
          item?.totals?.meditationMinutes,
        ),
    )
  ) {
    activeDays.add(today);
  }

  let streak = 0;
  const cursor = new Date();
  while (
    activeDays.has(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
      }).format(cursor),
    )
  ) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}
