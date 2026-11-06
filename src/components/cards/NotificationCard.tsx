import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { NotificationItem } from '../../screens/common_screens/notifications/const';
import AppText from '../AppText';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../theme/radius';

const NotificationCard = ({
  item,
  onRead,
}: {
  item: NotificationItem;
  onRead: (id: string) => void;
}) => {
  const { theme } = useTheme();

  const { colors } = theme;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${item?.title}, ${item?.time}${
        item?.unread ? ', unread' : ''
      }`}
      style={[
        styles.notificationCard,
        {
          backgroundColor: item?.unread ? colors.primaryLight : colors.surface,
          borderColor: item?.unread ? colors.primary : colors.border,
          borderRadius: radius.lg,
        },
      ]}
      onPress={() => item?.unread && onRead(item.id)}
    >
      {/* Notification Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors[item.bgColor],
            borderRadius: radius.md,
          },
        ]}
      >
        <AppText variant="h3">{item?.emoji}</AppText>
      </View>

      {/* Notification Details */}
      <View style={styles.notificationContent}>
        <AppText variant="body2" bold={item?.unread} color="textPrimary">
          {item?.title}
        </AppText>

        <AppText variant="caption" color="textSecondary" mt={spacing.xs}>
          {item?.time}
        </AppText>
      </View>

      {/* Unread Indicator */}
      {item?.unread && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(NotificationCard);

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 84,
    borderWidth: StyleSheet.hairlineWidth,
  },

  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  notificationContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
});
