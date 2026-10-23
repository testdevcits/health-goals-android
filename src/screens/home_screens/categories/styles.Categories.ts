import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowSeparator: {
    height: spacing.md,
  },
  categoryCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 80,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    elevation: 2,
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 7,
  },
  emojiBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 23,
    lineHeight: 29,
  },
  categoryText: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  categoryTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  categorySubtitle: {
    fontSize: 11,
    lineHeight: 14,
  },
});

export default styles;
