import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 160,
  },
  skeleton: {
    flexGrow: 1,
    width: '100%',
    gap: spacing.base,
  },
  skeletonCard: {
    width: '100%',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonText: {
    flex: 1,
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  skeletonTitle: {
    width: '72%',
    height: 12,
  },
  skeletonSubtitle: {
    width: '48%',
  },
  skeletonBadge: {
    width: 34,
    height: 18,
    borderRadius: 9,
  },
  skeletonFooter: {
    width: '58%',
    marginTop: spacing.ml,
  },
});
