import React from 'react';
import {
  AppEmptyState,
  ProfileCard,
  ProfileListRow,
} from '../../../../components';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';

export interface RedemptionItem {
  id: string;
  status: string;
  createdAt?: string;
  expiresAt?: string;
  pointsUsed: number;
  redemptionCode?: string;
  rewardTitle?: string;
  reward?: {
    title?: string;
    provider?: string;
  };
  provider?: string;
}

interface RecentRedemptionsSectionProps {
  redemptions: RedemptionItem[];
  revealedCodes: string[];
  onRefreshRedemption: (redemption: RedemptionItem) => void;
}

export const RecentRedemptionsSection: React.FC<
  RecentRedemptionsSectionProps
> = ({ redemptions, revealedCodes, onRefreshRedemption }) => {
  return (
    <>
      <ProfileSectionLabel>Recent Redemptions</ProfileSectionLabel>
      <ProfileCard>
        {redemptions.length === 0 ? (
          <AppEmptyState
            title="No redemptions yet"
            description="Rewards you redeem will appear here."
          />
        ) : null}
        {redemptions.slice(0, 5).map((redemption, index) => (
          <ProfileListRow
            key={redemption.id}
            icon="🎁"
            title={
              redemption.redemptionCode &&
              revealedCodes.includes(redemption.id)
                ? redemption.redemptionCode
                : redemption.rewardTitle ||
                  redemption.reward?.title ||
                  redemption.provider ||
                  redemption.reward?.provider ||
                  'Reward redemption'
            }
            detail={`${redemption.status}${
              redemption.createdAt
                ? ` · ${new Date(redemption.createdAt).toLocaleDateString()}`
                : ''
            }${
              redemption.redemptionCode
                ? revealedCodes.includes(redemption.id)
                  ? ' · Tap to hide code'
                  : ' · Tap to reveal code'
                : ''
            }${
              redemption.expiresAt
                ? ` · Expires ${new Date(
                    redemption.expiresAt,
                  ).toLocaleDateString()}`
                : ''
            }`}
            action={`−${redemption.pointsUsed.toLocaleString()}`}
            onPress={
              redemption.redemptionCode
                ? () => {
                    onRefreshRedemption(redemption);
                  }
                : undefined
            }
            last={index === Math.min(redemptions.length, 5) - 1}
          />
        ))}
      </ProfileCard>
    </>
  );
};
