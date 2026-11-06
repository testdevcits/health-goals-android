import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';
import AppIcon from '../assets/appicon/AppIcon';

const ProfileListRow: React.FC<{
  icon: string;
  title: string;
  detail?: string;
  action?: string;
  onPress?: () => void;
  last?: boolean;
}> = ({ icon, title, detail, action, onPress, last }) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.listRow,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
        pressed && { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: colors.primaryLight, borderRadius: radius.sm },
        ]}
      >
        <AppText variant="body1">{icon}</AppText>
      </View>
      <View style={styles.rowCopy}>
        <AppText variant="subtitle2" bold numberOfLines={1}>
          {title}
        </AppText>
        {detail ? (
          <AppText variant="caption" secondary numberOfLines={1}>
            {detail}
          </AppText>
        ) : null}
      </View>
      {action ? (
        <AppText variant="caption" primary bold>
          {action}
        </AppText>
      ) : onPress ? (
        <AppIcon name="ChevronRight" size={17} color={colors.textTertiary} />
      ) : null}
    </Pressable>
  );
};

export default memo(ProfileListRow);

const styles = StyleSheet.create({
  listRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
});
