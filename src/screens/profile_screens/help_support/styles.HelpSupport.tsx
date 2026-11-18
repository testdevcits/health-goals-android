import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundSecondary },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.huge + spacing.xxxl,
      padding: spacing.base,
    },
    searchBox: {
      minHeight: 46,
      borderRadius: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.ml,
      gap: spacing.ms,
      marginBottom: spacing.ml,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.ms,
      fontSize: typography.body2.fontSize,
    },
    supportCard: { marginBottom: spacing.xxs },
    faqList: { gap: spacing.ms - 1 },
    faqCard: {
      borderRadius: spacing.ml,
      paddingHorizontal: spacing.ml,
      paddingVertical: spacing.md + 1,
      elevation: 1,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.035,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    faqQuestion: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    faqText: { flex: 1 },
    chevronExpanded: { transform: [{ rotate: '180deg' }] },
    faqAnswer: { marginTop: spacing.ms - 1, paddingRight: spacing.sl },
    emptySearch: { paddingVertical: spacing.lg },
    responseTime: { marginTop: spacing.base, marginBottom: spacing.xs },
  });

export default createStyles;
