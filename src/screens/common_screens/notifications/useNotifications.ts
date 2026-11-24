import { useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { getNotificationPermission } from '../../../utils/AppPermissions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../../store/notificationSlice';
import type { NotificationItem } from './const';

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
  const dispatch = useAppDispatch();
  const {
    items: rawItems,
    unreadCount,
    loading,
    error: loadError,
  } = useAppSelector(state => state.notifications);

  const notifications = useMemo<NotificationItem[]>(() => {
    return (rawItems || []).map(item => ({
      id: item?.id,
      emoji: emojiForType(item?.type),
      title: item?.body ? `${item?.title} · ${item?.body}` : item?.title,
      time: displayTime(item?.createdAt),
      unread: !item?.read,
      bgColor: iconForType(item?.type),
    }));
  }, [rawItems]);

  const refresh = useCallback(
    async (force = true) => {
      try {
        const actionResult = await dispatch(fetchNotifications({ force }));
        if (fetchNotifications.fulfilled.match(actionResult)) {
          const items = actionResult.payload.items;
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
        }
      } catch (notificationError) {
        console.warn(
          'Could not display challenge notifications:',
          notificationError,
        );
      }
    },
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      refresh(false);
    }, [refresh]),
  );

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await dispatch(markNotificationAsRead(id)).unwrap();
        await notifee.cancelNotification(id);
      } catch (error) {
        showAppToast(
          'error',
          'Could not update notification',
          apiErrorMessage(error),
        );
      }
    },
    [dispatch],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      await Promise.all(
        (rawItems || []).map(item => notifee.cancelNotification(item?.id)),
      );
    } catch (error) {
      showAppToast(
        'error',
        'Could not update notifications',
        apiErrorMessage(error),
      );
    }
  }, [dispatch, rawItems]);

  return {
    notifications,
    unreadCount,
    loading,
    loadError: loadError ?? '',
    refresh,
    markAsRead,
    markAllAsRead,
  };
}
