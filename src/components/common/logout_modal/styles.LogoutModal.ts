import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

  return StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
    },
    sheet: {
      alignItems: 'center',
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      marginBottom: spacing.lg,
      borderRadius: radius.full,
      backgroundColor: colors.border,
    },
    iconContainer: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderRadius: radius.full,
    },
    message: {
      maxWidth: 320,
      marginBottom: spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      gap: spacing.sm,
    },
    button: {
      minHeight: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: radius.md,
    },
  });
};
