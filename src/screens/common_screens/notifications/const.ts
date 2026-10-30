import type { AppColors } from '../../../theme/colors';

export type NotificationItem = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  unread: boolean;
  bgColor: keyof AppColors;
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    emoji: '🏆',
    title: 'Sarah passed you on the leaderboard',
    time: '12 min ago',
    unread: true,
    bgColor: 'warningLight',
  },
  {
    id: '2',
    emoji: '🔥',
    title: 'You hit a 12-day streak!',
    time: '1h ago',
    unread: true,
    bgColor: 'coralLight',
  },
  {
    id: '3',
    emoji: '👥',
    title: 'Mike invited you to Weekend Sprint',
    time: '2h ago',
    unread: true,
    bgColor: 'infoLight',
  },
  {
    id: '4',
    emoji: '💧',
    title: 'Time to log your afternoon water',
    time: '3h ago',
    unread: false,
    bgColor: 'infoLight',
  },
  {
    id: '5',
    emoji: '🎁',
    title: 'You have points to redeem',
    time: 'Yesterday',
    unread: false,
    bgColor: 'purpleLight',
  },
];
