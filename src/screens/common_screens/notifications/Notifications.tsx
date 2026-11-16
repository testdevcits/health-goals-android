import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppButton,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
  NotificationCard,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import styles from './styles.notification';
import type { NotificationItem } from './const';
import useNotifications from './useNotifications';
import NotificationEmptyState from './components/NotificationEmptyState';

const NotificationSeparator = () => <View style={styles.separator} />;

const Notifications = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { colors } = theme;

  const {
    notifications,
    unreadCount,
    loading,
    loadError,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const renderNotification = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <NotificationCard item={item} onRead={markAsRead} />
    ),
    [markAsRead],
  );

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Screen Header */}
        <AppHeader
          title="Notifications"
          subtitle={
            loading
              ? 'Loading notifications…'
              : `${unreadCount} unread notifications`
          }
          onBackPress={() => {
            navigation.goBack();
          }}
          showNotifications={false}
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
          renderItem={renderNotification}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          ListHeaderComponent={
            loadError ? (
              <AppErrorView
                message={loadError}
                onRefresh={refresh}
                refreshing={loading}
              />
            ) : null
          }
          ItemSeparatorComponent={NotificationSeparator}
          ListEmptyComponent={
            loading ? (
              <AppLoader message="Loading notifications…" />
            ) : loadError ? null : (
              <NotificationEmptyState />
            )
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
