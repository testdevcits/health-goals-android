import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { getNotificationPermission } from '../../../utils/AppPermissions';
import type { NotificationItem } from './const';

type ApiNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type NotificationPage = {
  items?: ApiNotification[];
  unread?: number;
};

const iconForType = (type: string): NotificationItem['bgColor'] => {
  if (/challenge|achievement|reward|competition/i.test(type))
    return 'warningLight';
  if (/group|invite|community/i.test(type)) return 'infoLight';
  return 'purpleLight';
};

const emojiForType = (type: string) => {
  if (/challenge|competition/i.test(type)) return '🏆';
  if (/achievement|badge/i.test(type)) return '🏅';
  if (/group|invite/i.test(type)) return '👥';
  if (/reward|wallet/i.test(type)) return '🎁';
  return '🔔';
};

const displayTime = (date: string) => {
  const timestamp = Date.parse(date);
  if (!Number.isFinite(timestamp)) return '';
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notificationsRef = useRef<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await authenticatedRequest<NotificationPage>(
        'GET',
        API_ENDPOINTS.NOTIFICATIONS.LIST(1, 50),
      );
      const items = result.items || [];
      try {
        if (await getNotificationPermission()) {
          const channelId = await notifee.createChannel({
            id: 'challenge-updates',
            name: 'Challenge updates',
            importance: AndroidImportance.DEFAULT,
          });
          const challengeItems = items
            .filter(item => !item?.read && /^CHALLENGE_/i.test(item?.type))
            .slice(0, 3);
          const staleChallengeItems = items.filter(
            item => item?.read && /^CHALLENGE_/i.test(item?.type),
          );
          await Promise.all([
            ...staleChallengeItems.map(item =>
              notifee.cancelNotification(item?.id),
            ),
            ...challengeItems.map(item =>
              notifee.displayNotification({
                id: item?.id,
                title: item?.title,
                body: item?.body,
                android: {
                  channelId,
                  smallIcon: 'ic_notification',
                  color: '#00C6A2',
                  pressAction: { id: 'default' },
                },
              }),
            ),
          ]);
        }
      } catch (notificationError) {
        console.warn(
          'Could not display challenge notifications:',
          notificationError,
        );
      }
      const mappedItems = items.map(item => ({
        id: item?.id,
        emoji: emojiForType(item?.type),
        title: item?.body ? `${item?.title} · ${item?.body}` : item?.title,
        time: displayTime(item?.createdAt),
        unread: !item?.read,
        bgColor: iconForType(item?.type),
      }));
      notificationsRef.current = mappedItems;
      setNotifications(mappedItems);
      setUnreadCount(result.unread ?? items.filter(item => !item?.read).length);
    } catch (error) {
      setLoadError(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const markAsRead = useCallback(
    async (id: string) => {
      const wasUnread = notificationsRef.current.some(
        item => item?.id === id && item?.unread,
      );
      if (!wasUnread) return;

      const updatedItems = notificationsRef.current.map(item =>
        item?.id === id ? { ...item, unread: false } : item,
      );
      notificationsRef.current = updatedItems;
      setNotifications(updatedItems);
      setUnreadCount(count => Math.max(0, count - 1));
      try {
        await authenticatedRequest(
          'PATCH',
          API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
        );
        await notifee.cancelNotification(id);
      } catch (error) {
        await refresh();
        showAppToast(
          'error',
          'Could not update notification',
          apiErrorMessage(error),
        );
      }
    },
    [refresh],
  );

  const markAllAsRead = useCallback(async () => {
    const updatedItems = notificationsRef.current.map(item => ({
      ...item,
      unread: false,
    }));
    notificationsRef.current = updatedItems;
    setNotifications(updatedItems);
    setUnreadCount(0);
    try {
      await authenticatedRequest(
        'PATCH',
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
      );
      await Promise.all(
        notificationsRef.current.map(item =>
          notifee.cancelNotification(item?.id),
        ),
      );
    } catch (error) {
      await refresh();
      showAppToast(
        'error',
        'Could not update notifications',
        apiErrorMessage(error),
      );
    }
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    loadError,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}
