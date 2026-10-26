import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
    paddingHorizontal: spacing.lg,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },

  separator: {
    height: spacing.sm,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.huge,
  },
  markAllButton: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
});

export default styles;
