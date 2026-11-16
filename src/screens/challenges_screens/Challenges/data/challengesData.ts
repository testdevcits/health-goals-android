import type { LucideIcon } from 'lucide-react-native';

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
  metricLabel?: string;
  targetLabel?: string;
  dateLabel?: string;
  leaderboard?: Array<{
    id: string;
    name: string;
    profileImageUrl?: string;
    value: number;
    rank: number;
    winner?: boolean;
  }>;
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
  isCurrentUser?: boolean;
  unit?: string;
  profileImageUrl?: string;
}

export const CHALLENGE_TABS: ChallengeTab[] = [
  'Leaderboard',
  'Challenges',
  'Badges',
];
