import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      paddingHorizontal: spacing.base,
    },
    bottomOverlay: {
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.xs,
    },
    centerOverlay: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '100%',
      alignSelf: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.xxl,
    },
    centerContainer: {
      borderRadius: radius.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      alignSelf: 'center',
      marginBottom: spacing.lg,
      borderRadius: radius.full,
      backgroundColor: colors.border,
    },
    header: {
      minHeight: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    closeButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
    },
  });
};
