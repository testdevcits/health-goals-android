import type { AppColors } from '../../../theme/colors';

export type NotificationItem = {
  id: string;
  emoji: string;
  title: string;
  time: string;
  unread: boolean;
  bgColor: keyof AppColors;
};

