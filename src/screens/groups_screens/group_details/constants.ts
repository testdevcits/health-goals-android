// ─── Types ──────────────────────────────────────────────────────────────────

export type DetailTab = 'Overview' | 'Leaderboard' | 'Challenges';
// | 'Chat';

export interface Member {
  id: string;
  name: string;
  initials: string;
  steps: number;
  streak: number;
  color: string;
  profileImageUrl?: string;
}

export interface GroupMessage {
  id: string;
  name: string;
  initials: string;
  message: string;
  time: string;
  color: string;
  mine?: boolean;
}

export interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  progressLabel: string;
  color: string;
  joined?: boolean;
  joinable?: boolean;
  targetValue?: number;
  currentValue?: number;
  endsAt?: string;
  participantCount?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const DETAIL_TABS: DetailTab[] = [
  'Overview',
  'Leaderboard',
  'Challenges',
  // 'Chat',
];

export const DURATION_OPTIONS = ['3 days', '7 days', '14 days', '30 days'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatSteps = (steps: number) => steps.toLocaleString('en-US');

export const AVATAR_PALETTE = [
  '#FF8278',
  '#579CF4',
  '#00C6A2',
  '#FF9B38',
  '#8175F5',
  '#FF7AA2',
  '#00B8A9',
  '#FF6B57',
];
