export interface WorkoutActivity {
  id: string;
  name: string;
  emoji: string;
  speedKmh: number;
  caloriesPerMinute: number;
}

export const WORKOUT_ACTIVITIES: WorkoutActivity[] = [
  {
    id: 'running',
    name: 'Running',
    emoji: '🏃',
    speedKmh: 9.6,
    caloriesPerMinute: 10,
  },
  {
    id: 'walking',
    name: 'Walking',
    emoji: '🚶',
    speedKmh: 5,
    caloriesPerMinute: 4,
  },
  {
    id: 'cycling',
    name: 'Cycling',
    emoji: '🚴',
    speedKmh: 18,
    caloriesPerMinute: 8,
  },
  {
    id: 'strength',
    name: 'Strength',
    emoji: '🏋️',
    speedKmh: 0,
    caloriesPerMinute: 5,
  },
  { id: 'yoga', name: 'Yoga', emoji: '🧘', speedKmh: 0, caloriesPerMinute: 3 },
  { id: 'hiit', name: 'HIIT', emoji: '🔥', speedKmh: 0, caloriesPerMinute: 12 },
  {
    id: 'swimming',
    name: 'Swimming',
    emoji: '🏊',
    speedKmh: 0,
    caloriesPerMinute: 3,
  },
  {
    id: 'stretch',
    name: 'Stretch',
    emoji: '🤸',
    speedKmh: 0,
    caloriesPerMinute: 3,
  },
  {
    id: 'hiking',
    name: 'Hiking',
    emoji: '🥾',
    speedKmh: 0,
    caloriesPerMinute: 3,
  },
  {
    id: 'machines',
    name: 'Weight machines',
    emoji: '🏋🏻',
    speedKmh: 0,
    caloriesPerMinute: 3,
  },
];

const ACTIVITY_ALIASES: Record<string, string> = {
  '1': 'running',
  '2': 'walking',
  '3': 'cycling',
  '4': 'swimming',
  '5': 'yoga',
  'bike indoor': 'cycling',
  circuit: 'strength',
  core: 'strength',
  dance: 'hiit',
  elliptical: 'cycling',
  'indoor-bike': 'cycling',
  'pool swim': 'swimming',
  treadmill: 'running',
};

export const resolveWorkoutActivityId = (categoryIdOrName: string) => {
  const normalized = categoryIdOrName.trim().toLowerCase();
  const matchedActivity = WORKOUT_ACTIVITIES.find(
    activity =>
      activity.id === normalized || activity.name.toLowerCase() === normalized,
  );

  return matchedActivity?.id ?? ACTIVITY_ALIASES[normalized] ?? 'running';
};

export const getWorkoutActivity = (activityId: string) =>
  WORKOUT_ACTIVITIES.find(activity => activity.id === activityId) ??
  WORKOUT_ACTIVITIES[0];
