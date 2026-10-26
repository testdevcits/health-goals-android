export type NotificationItem = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  unread: boolean;
  bgColor: string;
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    emoji: '🏆',
    title: 'Sarah passed you on the leaderboard',
    time: '12 min ago',
    unread: true,
    bgColor: '#FFF4D6',
  },
  {
    id: '2',
    emoji: '🔥',
    title: 'You hit a 12-day streak!',
    time: '1h ago',
    unread: true,
    bgColor: '#FFE9E5',
  },
  {
    id: '3',
    emoji: '👥',
    title: 'Mike invited you to Weekend Sprint',
    time: '2h ago',
    unread: true,
    bgColor: '#E8F0FF',
  },
  {
    id: '4',
    emoji: '💧',
    title: 'Time to log your afternoon water',
    time: '3h ago',
    unread: false,
    bgColor: '#DFF6FF',
  },
  {
    id: '5',
    emoji: '🎁',
    title: 'You have points to redeem',
    time: 'Yesterday',
    unread: false,
    bgColor: '#F3E8FF',
  },
];
