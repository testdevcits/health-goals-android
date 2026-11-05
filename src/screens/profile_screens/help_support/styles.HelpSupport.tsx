import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    searchBox: {
      minHeight: 46,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      gap: 10,
      marginBottom: 14,
    },
    searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
    supportCard: { marginBottom: 2 },
    faqList: { gap: 9 },
    faqCard: {
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 13,
      elevation: 1,
      shadowColor: colors.black,
      shadowOpacity: 0.035,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    faqQuestion: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    faqText: { flex: 1 },
    chevronExpanded: { transform: [{ rotate: '180deg' }] },
    faqAnswer: { marginTop: 9, paddingRight: 18 },
    emptySearch: { paddingVertical: 20 },
    responseTime: { marginTop: 16, marginBottom: 4 },
  });

export default createStyles;
