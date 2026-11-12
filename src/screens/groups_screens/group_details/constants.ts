// ─── Types ──────────────────────────────────────────────────────────────────

export type DetailTab = 'Overview' | 'Leaderboard' | 'Challenges'
// | 'Chat';

export interface Member {
  id: string;
  name: string;
  initials: string;
  steps: number;
  streak: number;
  color: string;
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

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const DETAIL_TABS: DetailTab[] = [
  'Overview',
  'Leaderboard',
  'Challenges',
  // 'Chat',
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    initials: 'S',
    steps: 52400,
    streak: 14,
    color: '#FF8278',
  },
  {
    id: '2',
    name: 'Mike Chen',
    initials: 'M',
    steps: 48300,
    streak: 9,
    color: '#579CF4',
  },
  {
    id: '3',
    name: 'You (Alex)',
    initials: 'A',
    steps: 41200,
    streak: 12,
    color: '#00C6A2',
  },
  {
    id: '4',
    name: 'Priya Patel',
    initials: 'P',
    steps: 37600,
    streak: 7,
    color: '#FF9B38',
  },
  {
    id: '5',
    name: 'James Liu',
    initials: 'J',
    steps: 32100,
    streak: 5,
    color: '#8175F5',
  },
  {
    id: '6',
    name: 'Lena Park',
    initials: 'L',
    steps: 29600,
    streak: 3,
    color: '#00C6A2',
  },
];

export const INITIAL_MESSAGES: GroupMessage[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    initials: 'S',
    message: 'Morning run done! 6.2K before 7 AM ☀️',
    time: '6:42 AM',
    color: '#FF8278',
  },
  {
    id: '2',
    name: 'Mike Chen',
    initials: 'M',
    message: "Nice! I'm doing a 5K at lunch, anyone joining?",
    time: '7:15 AM',
    color: '#579CF4',
  },
  {
    id: '3',
    name: 'Priya Patel',
    initials: 'P',
    message: 'Count me in! Meet at the park entrance?',
    time: '7:22 AM',
    color: '#FF9B38',
  },
  {
    id: '4',
    name: 'Alex',
    initials: 'A',
    message: "I'll be there 💪",
    time: '7:30 AM',
    color: '#00C6A2',
    mine: true,
  },
];

export const INITIAL_CHALLENGES: GroupChallenge[] = [
  {
    id: '1',
    title: 'Weekend Sprint',
    description:
      'Whoever walks the most steps between Sat–Sun wins 200 bonus points and group bragging rights.',
    status: 'Starts Sat',
    progress: 0,
    progressLabel: 'Not started',
    color: '#00C6A2',
  },
];

export const WEEKLY_STEPS = [
  { day: 'Mon', value: 68 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 54 },
  { day: 'Thu', value: 84 },
  { day: 'Fri', value: 72 },
  { day: 'Sat', value: 46 },
  { day: 'Sun', value: 28 },
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
