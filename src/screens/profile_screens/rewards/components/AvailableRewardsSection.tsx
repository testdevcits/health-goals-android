import React from 'react';
import { Pressable, View } from 'react-native';
import { AppEmptyState, AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';
import createStyles from '../styles.Rewards';
import { rewardIcon } from '../useRewards';

export interface RewardItem {
  id: string;
  title: string;
  description?: string;
  provider?: string;
  pointsRequired: number;
  stock?: number;
  availableVoucherCount?: number;
}

interface AvailableRewardsSectionProps {
  rewards: RewardItem[];
  points: number;
  redeemingRewardId: string | null;
  onRedeem: (reward: RewardItem) => void;
}

export const AvailableRewardsSection: React.FC<AvailableRewardsSectionProps> = ({
  rewards,
  points,
  redeemingRewardId,
  onRedeem,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <>
      <ProfileSectionLabel>Available Rewards</ProfileSectionLabel>
      <View style={styles.rewardList}>
        {rewards.length === 0 ? (
          <AppEmptyState
            title="No rewards available"
            description="New rewards will appear here when available."
          />
        ) : (
          rewards.map(reward => {
            const isOutOfStock =
              reward.stock === 0 || reward.availableVoucherCount === 0;
            const notEnoughPoints = points < reward.pointsRequired;
            const isDisabled =
              notEnoughPoints || isOutOfStock || redeemingRewardId === reward.id;

            return (
              <ProfileCard key={reward.id}>
                <View style={styles.rewardRow}>
                  <View style={styles.rewardIcon}>
                    <AppText variant="h3">{rewardIcon(reward.title)}</AppText>
                  </View>
                  <View style={styles.rewardCopy}>
                    <AppText variant="subtitle2" bold>
                      {reward.title}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {reward.description || reward.provider || ''}
                    </AppText>
                  </View>
                  <Pressable
                    onPress={() => onRedeem(reward)}
                    disabled={isDisabled}
                    style={styles.redeemAction}
                  >
                    <AppText
                      variant="subtitle2"
                      color={
                        notEnoughPoints || isOutOfStock
                          ? 'textTertiary'
                          : 'warning'
                      }
                      bold
                    >
                      {reward.pointsRequired.toLocaleString()} pts
                    </AppText>
                    <AppText
                      variant="caption"
                      color={
                        notEnoughPoints || isOutOfStock
                          ? 'textTertiary'
                          : 'primary'
                      }
                      bold
                    >
                      {redeemingRewardId === reward.id
                        ? 'Processing'
                        : isOutOfStock
                        ? 'Out of stock'
                        : notEnoughPoints
                        ? 'Not enough points'
                        : 'Redeem'}
                    </AppText>
                  </Pressable>
                </View>
              </ProfileCard>
            );
          })
        )}
      </View>
    </>
  );
};
