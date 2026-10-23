import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

interface AppSettingsRowProps {
  icon: string;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showDivider?: boolean;
}

const AppSettingsRow: React.FC<AppSettingsRowProps> = ({
  icon,
  title,
  description,
  value,
  onPress,
  switchValue,
  onSwitchChange,
  showDivider = true,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const hasSwitch = onSwitchChange !== undefined;
  const isInteractive = onPress !== undefined || value !== undefined;

  const content = (
    <>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: radius.sm,
          },
        ]}
      >
        <AppText variant="body1">{icon}</AppText>
      </View>

      <View style={styles.copy}>
        <AppText variant="subtitle2" bold numberOfLines={1}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" secondary numberOfLines={1}>
            {description}
          </AppText>
        ) : null}
      </View>

      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
          thumbColor={colors.white}
          accessibilityLabel={title}
        />
      ) : value !== undefined ? (
        <View style={styles.valueContainer}>
          <AppText variant="caption" secondary>
            {value}
          </AppText>
          {isInteractive ? (
            <ChevronRight size={17} color={colors.textTertiary} />
          ) : null}
        </View>
      ) : null}
    </>
  );

  return (
    <View
      style={[
        styles.rowWrapper,
        showDivider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {isInteractive && !hasSwitch ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${title}${value ? `, ${value}` : ''}`}
          style={({ pressed }) => [
            styles.row,
            { paddingHorizontal: spacing.md },
            pressed && { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={[styles.row, { paddingHorizontal: spacing.md }]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rowWrapper: {
    paddingHorizontal: 0,
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default AppSettingsRow;
