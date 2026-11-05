import { StyleSheet } from 'react-native';

const createOnboardingStyles = (theme: any) => {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    backText: {
      fontWeight: '600',
    },
    progressWrap: {
      height: spacing.sm + 4,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      overflow: 'hidden',
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    progressBar: {
      height: '100%',
      borderRadius: radius.full,
    },
    titleWrap: {
      marginBottom: spacing.lg,
    },
    subtitle: {
      marginTop: spacing.xs,
      lineHeight: typography.body2.lineHeight,
    },
    welcomeCard: {
      marginTop: spacing.xs,
    },
    emojiBox: {
      alignSelf: 'center',
      width: 120,
      height: 120,
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    emoji: {
      fontSize: typography.display.fontSize,
      lineHeight: typography.display.lineHeight,
    },
    featureList: {
      marginTop: spacing.xs,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginBottom: spacing.sm,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    featureIconText: {
      fontSize: typography.h3.fontSize,
      lineHeight: typography.h3.lineHeight,
    },
    featureTextWrap: {
      flex: 1,
    },
    formCard: {
      marginTop: spacing.xs,
    },
    selectionWrap: {
      marginTop: spacing.xs,
    },
    choiceSection: {
      marginBottom: spacing.lg,
    },
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -spacing.xs,
    },
    choiceChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      margin: spacing.xs,
      minWidth: 120,
      alignItems: 'center',
    },
    permissionCard: {
      marginTop: spacing.xs,
    },
    summaryBox: {
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    summaryText: {
      marginTop: spacing.xs,
    },
    permissionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
    },
    permissionTextWrap: {
      flex: 1,
      paddingRight: spacing.sm,
    },
    actions: {
      marginTop: spacing.xl,
    },
    primaryButton: {
      marginBottom: spacing.xs,
    },
  });
};

export { createOnboardingStyles };
