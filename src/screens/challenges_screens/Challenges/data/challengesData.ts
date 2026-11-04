import type { LucideIcon } from 'lucide-react-native';
import { Droplets, Footprints, Sunrise } from 'lucide-react-native';

export type ChallengeTab = 'Leaderboard' | 'Challenges' | 'Badges';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  progressLabel: string;
  status: string;
  color: string;
  icon: LucideIcon;
  joined?: boolean;
  joinable?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  earned: boolean;
}

export interface LeaderboardPerson {
  rank: number;
  name: string;
  steps: string;
  initials: string;
  color: string;
  streak?: string;
}

export const CHALLENGE_TABS: ChallengeTab[] = [
  'Leaderboard',
  'Challenges',
  'Badges',
];

export const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '30-Day Step Sprint',
    description:
      'Walk 10,000 steps daily with your team. Top 3 win gift cards.',
    progress: 68,
    progressLabel: '20 of 30 days',
    status: 'LIVE',
    color: '#00C6A2',
    icon: Footprints,
  },
  {
    id: '2',
    title: 'Morning Yoga Streak',
    description: 'Complete a 15-min yoga session before 9 AM for 7 days.',
    progress: 71,
    progressLabel: '2 days left',
    status: '5/7 days',
    color: '#8175F5',
    icon: Sunrise,
  },
  {
    id: '3',
    title: 'Hydration Hero',
    description: 'Log 8 glasses of water every day this week.',
    progress: 50,
    progressLabel: '4 of 8 glasses today',
    status: 'Daily',
    color: '#FF9B38',
    icon: Droplets,
  },
];

export const BADGES: Badge[] = [
  {
    id: '1',
    title: 'Streak Master',
    subtitle: '10-day streak',
    emoji: '🔥',
    earned: true,
  },
  {
    id: '2',
    title: 'Step Champion',
    subtitle: '100K steps',
    emoji: '👟',
    earned: true,
  },
  {
    id: '3',
    title: 'Hydrated Hero',
    subtitle: '7-day hydration',
    emoji: '💧',
    earned: true,
  },
  {
    id: '4',
    title: 'Early Bird',
    subtitle: '5 AM workouts',
    emoji: '🌅',
    earned: true,
  },
  {
    id: '5',
    title: 'Top 3',
    subtitle: 'Leaderboard',
    emoji: '🏆',
    earned: false,
  },
  {
    id: '6',
    title: 'Iron Will',
    subtitle: '30-day streak',
    emoji: '💪',
    earned: false,
  },
];

export const LEADERBOARD: LeaderboardPerson[] = [
  {
    rank: 1,
    name: 'Sarah',
    steps: '12,450',
    initials: 'S',
    color: '#FF8278',
  },
  {
    rank: 2,
    name: 'Mike',
    steps: '10,230',
    initials: 'M',
    color: '#579CF4',
  },
  {
    rank: 3,
    name: 'Priya',
    steps: '7,100',
    initials: 'P',
    color: '#FF9B38',
  },
  {
    rank: 4,
    name: 'You (Alex)',
    steps: '7,842',
    initials: 'A',
    color: '#00C6A2',
    streak: '12-day streak',
  },
  {
    rank: 5,
    name: 'James',
    steps: '6,500',
    initials: 'J',
    color: '#8175F5',
    streak: '5-day streak',
  },
  {
    rank: 6,
    name: 'Lena',
    steps: '5,920',
    initials: 'L',
    color: '#00C6A2',
    streak: '2-day streak',
  },
];
