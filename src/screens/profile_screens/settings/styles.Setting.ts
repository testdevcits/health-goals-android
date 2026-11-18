import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.lg,
    },
    section: {
      marginBottom: spacing.sl,
    },
    sectionTitle: {
      marginLeft: spacing.xs,
      marginBottom: spacing.sm,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    card: {
      borderRadius: spacing.base,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.lg,
      maxHeight: '65%',
    },
    handle: {
      width: spacing.xxxl,
      height: spacing.xs,
      borderRadius: spacing.xxs,
      alignSelf: 'center',
      marginBottom: spacing.base,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: spacing.sm,
    },
    closeButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    option: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    cancelButton: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },

    continueButton: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.md,
      backgroundColor: colors.info,
    },
    modalActionsRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
  });

export default createStyles;
