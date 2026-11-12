import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

const ProfileToggleRow: React.FC<{
  icon: string;
  title: string;
  detail?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
  disabled?: boolean;
}> = ({ icon, title, detail, value, onChange, last, disabled = false }) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  return (
    <View
      style={[
        styles.listRow,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
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
      <Pressable
        onPress={() => onChange(!value)}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        accessibilityLabel={title}
        style={[
          styles.switchTrack,
          {
            backgroundColor: value ? colors.primary : colors.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            { backgroundColor: colors.white },
            value && styles.switchThumbOn,
          ]}
        />
      </Pressable>
    </View>
  );
};

export default memo(ProfileToggleRow);

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
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  switchThumbOn: { alignSelf: 'flex-end' },
});
