import React from 'react';
import { Pressable } from 'react-native';
import {
  AppEmptyState,
  AppText,
  ProfileCard,
  ProfileListRow,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';
import createStyles from '../styles.Rewards';

export interface TransactionItem {
  id: string;
  type: 'EARN' | 'BONUS' | 'REDEEM' | 'ADJUSTMENT' | 'REVERSAL' | 'EXPIRATION';
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceType?: string;
  createdAt?: string;
}

interface PointsActivitySectionProps {
  transactions: TransactionItem[];
  hasMoreTransactions: boolean;
  loadingMoreTransactions: boolean;
  onLoadMore: () => void;
}

const TRANSACTION_ICONS = {
  EARN: '🪙',
  BONUS: '🎉',
  REDEEM: '🎁',
  ADJUSTMENT: '⚖️',
  REVERSAL: '↩️',
  EXPIRATION: '⌛',
} as const;

export const PointsActivitySection: React.FC<PointsActivitySectionProps> = ({
  transactions,
  hasMoreTransactions,
  loadingMoreTransactions,
  onLoadMore,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <>
      <ProfileSectionLabel>Points Activity</ProfileSectionLabel>
      <ProfileCard>
        {transactions.length === 0 ? (
          <AppEmptyState
            title="No points activity yet"
            description="Earned and spent points will appear here."
          />
        ) : (
          transactions.map((transaction, index) => {
            const amount =
              transaction.amount > 0
                ? `+${transaction.amount}`
                : String(transaction.amount);
            const date = transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '';
            return (
              <ProfileListRow
                key={transaction.id}
                icon={TRANSACTION_ICONS[transaction.type]}
                title={
                  transaction.description || transaction.type.replace(/_/g, ' ')
                }
                detail={`${transaction.type}${date ? ` · ${date}` : ''}${
                  transaction.referenceType
                    ? ` · ${transaction.referenceType.replace(/_/g, ' ')}`
                    : ''
                } · Balance ${transaction.balanceAfter.toLocaleString()} pts`}
                action={`${amount} pts`}
                last={index === transactions.length - 1}
              />
            );
          })
        )}
        {hasMoreTransactions ? (
          <Pressable
            onPress={onLoadMore}
            disabled={loadingMoreTransactions}
            style={styles.loadMoreButton}
            accessibilityRole="button"
          >
            <AppText variant="caption" primary bold>
              {loadingMoreTransactions
                ? 'Loading…'
                : 'Load more points activity'}
            </AppText>
          </Pressable>
        ) : null}
      </ProfileCard>
    </>
  );
};
