import { StyleSheet } from 'react-native';
import { spacing } from '../../../../../theme/spacing';
import { typography } from '../../../../../theme/typography';

const styles = StyleSheet.create({
  container: {
    margin: spacing.xl,
  },
  sectionHeader: {
    marginHorizontal: 0,
    marginBottom: spacing.ms,
  },
  // Overview Summary Strip
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: spacing.ml,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 28,
  },
  // Filter Tabs
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.ml,
  },
  tabButton: {
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: spacing.md,
  },
  shimmerCard: {
    height: 120,
    width: '100%',
  },
  // Card
  card: {
    borderWidth: 1,
    padding: spacing.base,
    borderRadius: 18,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  activityInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
  },

  titleCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginTop: spacing.xxs + 1,
  },
  dotDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  sessionsBadge: {
    paddingHorizontal: spacing.sm - 1,
    paddingVertical: spacing.xxs,
    borderRadius: 6,
  },
  sessionsBadgeText: {
    fontSize: typography.tabLabel.fontSize,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sourceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  sourceBadgeText: {
    fontSize: typography.tabLabel.fontSize,
  },
  quickStartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Metrics Row
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s - 1,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.s,
    borderRadius: 12,
  },
  // Progress bar for daily stats like steps
  progressContainer: {
    width: '100%',
    paddingTop: spacing.ms,
    marginTop: spacing.xs,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  // Multi-session breakdown
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s - 1,
    paddingVertical: spacing.ms - 1,
    marginTop: spacing.ms,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sessionsBreakdownContainer: {
    marginTop: spacing.s,
    paddingTop: spacing.ms,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  sessionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
  },
  sessionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sessionIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIndexText: {
    fontSize: typography.tabLabel.fontSize,
  },
  sessionItemMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  // Empty State
  emptyCard: {
    padding: spacing.xl + spacing.xs,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  emptyIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    maxWidth: 270,
    marginBottom: spacing.base,
  },
  startButton: {
    paddingHorizontal: spacing.lg + spacing.xxs,
    paddingVertical: spacing.md - 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreButton: {
    borderWidth: 1,
    paddingVertical: spacing.md - 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
    borderRadius: 12,
  },
});

export default styles;
