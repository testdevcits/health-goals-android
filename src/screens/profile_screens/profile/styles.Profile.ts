import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    editIconContainer: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 30,
      height: 30,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },

    scrollContent: {
      paddingHorizontal: spacing.base,
    },

    profileSection: {
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
    },

    largeAvatar: {
      width: 84,
      height: 84,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.info,
      borderWidth: 4,
      borderColor: colors.surface,
      elevation: 4,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: radius.full,
    },

    emailText: {
      marginTop: spacing.xxs,
    },

    statsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    statItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    statDivider: {
      width: StyleSheet.hairlineWidth,
      height: 32,
    },

    sectionTitle: {
      marginBottom: spacing.md,
    },

    menuCard: {
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    menuRow: {
      minHeight: 67,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },

    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },

    menuTitle: {
      flex: 1,
    },
  });

export default createStyles;
