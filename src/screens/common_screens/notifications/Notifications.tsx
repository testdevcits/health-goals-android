import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import {
  AppButton,
  AppHeader,
  AppText,
  NotificationCard,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { spacing } from '../../../theme/spacing';

import styles from './styles.notification';
import { INITIAL_NOTIFICATIONS } from './const';
import { useNavigation } from '@react-navigation/native';

const NotificationSeparator = () => <View style={styles.separator} />;

const Notifications = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { colors } = theme;
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(item => item?.unread).length;

  const markAllAsRead = useCallback(() => {
    setNotifications(previous =>
      previous.map(item => ({
        ...item,
        unread: false,
      })),
    );
  }, []);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Screen Header */}
        <AppHeader
          title="Notifications"
          subtitle={
            unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : 'You are all caught up'
          }
          onBackPress={() => {
            navigation.goBack();
          }}
        />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <AppText variant="h3" color="textPrimary">
            Recent activity
          </AppText>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
            >
              <AppText variant="buttonSm" primary>
                Mark all as read
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationCard item={item} setNotifications={setNotifications} />
          )}
          keyExtractor={item => item?.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={NotificationSeparator}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppText variant="display" center>
                🔔
              </AppText>

              <AppText variant="h3" color="textPrimary" center mt={spacing.md}>
                You're all caught up!
              </AppText>

              <AppText
                variant="body2"
                color="textSecondary"
                center
                mt={spacing.sm}
              >
                New notifications will appear here.
              </AppText>
            </View>
          }
        />
        <AppButton
          title="Mark all as read"
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
          style={styles.markAllButton}
        />
      </View>
    </View>
  );
};

export default Notifications;
