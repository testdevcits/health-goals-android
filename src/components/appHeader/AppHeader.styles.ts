import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const styles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    header: {
      paddingHorizontal: spacing.base,
      paddingBottom: spacing.md,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },

    headerMain: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerCopy: {
      flex: 1,
    },

    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatar: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    avatarImage: {
      width: '100%',
      height: '100%',
    },
  });
};
