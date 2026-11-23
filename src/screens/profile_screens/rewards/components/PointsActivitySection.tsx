import React, { memo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppEmptyState, AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';
import createStyles from '../styles.Rewards';

export interface TransactionItem {
  id: string;
  walletId?: string;
  userId?: string;
  type: 'EARN' | 'BONUS' | 'REDEEM' | 'ADJUSTMENT' | 'REVERSAL' | 'EXPIRATION';
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  idempotencyKey?: string;
  createdAt?: string;
}

interface PointsActivitySectionProps {
  transactions: TransactionItem[];
  hasMoreTransactions: boolean;
  loadingMoreTransactions: boolean;
  onLoadMore: () => void;
}

const getTransactionVisuals = (
  type: TransactionItem['type'],
  colors: any,
) => {
  switch (type) {
    case 'EARN':
      return {
        icon: '🪙',
        badgeBg: colors.primaryLight,
        amountColor: colors.primary,
        isPositive: true,
      };
    case 'BONUS':
      return {
        icon: '🎉',
        badgeBg: colors.purpleLight || '#F3E8FF',
        amountColor: '#8B5CF6',
        isPositive: true,
      };
    case 'REDEEM':
      return {
        icon: '🎁',
        badgeBg: colors.coralLight || '#FFE9E5',
        amountColor: colors.coral || '#FF8278',
        isPositive: false,
      };
    case 'ADJUSTMENT':
      return {
        icon: '⚖️',
        badgeBg: colors.infoLight,
        amountColor: colors.info,
        isPositive: true,
      };
    case 'REVERSAL':
      return {
        icon: '↩️',
        badgeBg: colors.warningLight,
        amountColor: colors.warning,
        isPositive: true,
      };
    case 'EXPIRATION':
      return {
        icon: '⌛',
        badgeBg: colors.backgroundSecondary,
        amountColor: colors.textTertiary,
        isPositive: false,
      };
    default:
      return {
        icon: '🪙',
        badgeBg: colors.primaryLight,
        amountColor: colors.primary,
        isPositive: true,
      };
  }
};

const formatTransactionDate = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const dateStr = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} • ${timeStr}`;
};

export const PointsActivitySection: React.FC<PointsActivitySectionProps> = memo(
  ({
    transactions,
    hasMoreTransactions,
    loadingMoreTransactions,
    onLoadMore,
  }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const styles = createStyles(colors);

    return (
      <View>
        <ProfileSectionLabel>Points Activity</ProfileSectionLabel>

        {transactions.length === 0 ? (
          <ProfileCard>
            <AppEmptyState
              title="No points activity yet"
              description="Earned and spent points will appear here."
            />
          </ProfileCard>
        ) : (
          <View style={styles.activityCardList}>
            {transactions.map(item => {
              const visuals = getTransactionVisuals(item.type, colors);
              const formattedDate = formatTransactionDate(item.createdAt);
              const isPositive = item.amount > 0;
              const displayAmount = isPositive
                ? `+${item.amount}`
                : `${item.amount}`;

              // Clean title
              const displayTitle =
                item.description || item.type.replace(/_/g, ' ');

              // Clean reference label (e.g. DAILY_SETTLEMENT -> Daily Settlement)
              const displayRef = item.referenceType
                ? item.referenceType.replace(/_/g, ' ')
                : item.type.replace(/_/g, ' ');

              return (
                <View key={item.id} style={styles.transactionCard}>
                  {/* Left: Icon Badge & Details */}
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIconBadge,
                        { backgroundColor: visuals.badgeBg },
                      ]}
                    >
                      <AppText style={{ fontSize: 20 }}>{visuals.icon}</AppText>
                    </View>

                    <View style={styles.transactionTitleCol}>
                      <AppText
                        style={styles.transactionTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {displayTitle}
                      </AppText>

                      <View style={styles.transactionMetaRow}>
                        <View style={styles.refTypeBadge}>
                          <AppText style={styles.refTypeText}>
                            {displayRef}
                          </AppText>
                        </View>

                        {formattedDate ? (
                          <AppText style={styles.transactionDate}>
                            {formattedDate}
                          </AppText>
                        ) : null}
                      </View>
                    </View>
                  </View>

                  {/* Right: Amount & Balance */}
                  <View style={styles.transactionRight}>
                    <AppText
                      style={[
                        styles.transactionAmount,
                        { color: visuals.amountColor },
                      ]}
                    >
                      {displayAmount} Coins
                    </AppText>

                    <AppText style={styles.transactionBalance}>
                      Bal: {item.balanceAfter.toLocaleString()}
                    </AppText>
                  </View>
                </View>
              );
            })}

            {/* Load More Button */}
            {hasMoreTransactions ? (
              <Pressable
                onPress={onLoadMore}
                disabled={loadingMoreTransactions}
                style={styles.loadMoreButton}
                accessibilityRole="button"
              >
                {loadingMoreTransactions ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <AppText variant="caption" primary bold>
                    Load more points activity
                  </AppText>
                )}
              </Pressable>
            ) : null}
          </View>
        )}
      </View>
    );
  },
);

export default PointsActivitySection;
