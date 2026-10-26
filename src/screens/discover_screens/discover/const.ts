export type Program = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  button: string;
  color: string;
  description: string;
  duration: string;
  daily: string;
  level: string;
  included: string[];
};

export const programs: Program[] = [
  {
    id: 'yoga',
    emoji: '🧘',
    title: 'Mindfulness & Yoga',
    subtitle: '7-day starter program to reduce stress and improve sleep',
    button: 'Start Program',
    color: '#7660ED',
    description:
      'A gentle program to reduce stress and improve sleep quality through daily guided sessions.',
    duration: '7',
    daily: '20m',
    level: 'Easy',
    included: [
      '15–20 min daily sessions',
      'Breathing + stretching routines',
      'Sleep-focused evening flows',
      'Progress tracking & reminders',
    ],
  },
  {
    id: 'running',
    emoji: '🏃',
    title: 'Couch to 5K',
    subtitle: 'Adaptive run coaching — beginner to race day in 8 weeks',
    button: 'View Plan',
    color: '#FF8D79',
    description:
      'Build your endurance with a beginner-friendly running plan that gradually prepares you for a 5K.',
    duration: '8',
    daily: '30m',
    level: 'Beginner',
    included: [
      'Progressive running and walking',
      'Weekly training schedule',
      'Rest and recovery days',
      'Track your distance and pace',
    ],
  },
  {
    id: 'sleep',
    emoji: '😴',
    title: 'Sleep Coaching',
    subtitle: 'Personalized sleep insights and wind-down routines',
    button: 'Get Started',
    color: '#5DA4F5',
    description:
      'Build a relaxing nighttime routine and improve your sleep habits with guided coaching.',
    duration: '14',
    daily: '15m',
    level: 'Easy',
    included: [
      'Personalized bedtime routine',
      'Relaxation exercises',
      'Sleep habit tracking',
      'Daily wind-down reminders',
    ],
  },
  {
    id: 'nutrition',
    emoji: '🥗',
    title: 'Nutrition Tracker',
    subtitle: 'Log meals, track macros, and get smart food suggestions',
    button: 'Explore',
    color: '#FFBE32',
    description:
      'Understand your daily food habits and build a balanced nutrition routine.',
    duration: '30',
    daily: '5m',
    level: 'All levels',
    included: [
      'Daily meal logging',
      'Nutrition and macro overview',
      'Food habit insights',
      'Personalized meal suggestions',
    ],
  },
];

export const recommendations = [
  {
    emoji: '🌅',
    title: '10-Min Morning Stretch',
    subtitle:
      'Based on your sleep data, a short stretch could boost your energy score by ~4 points.',
    tag: 'AI Pick',
  },
  {
    emoji: '💧',
    title: 'Daily Hydration Routine',
    subtitle: 'Build a simple habit to stay hydrated throughout the day.',
    tag: 'Daily',
  },
];
