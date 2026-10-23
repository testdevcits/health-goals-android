import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import {
  ProfileCard,
  ProfileListRow,
  ProfileScreen,
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';

const rewards = [
  {
    icon: '☕',
    title: '$5 Coffee eGift',
    detail: 'Starbucks or local café',
    cost: 500,
  },
  {
    icon: '🎁',
    title: '$10 Amazon Gift Card',
    detail: 'Digital delivery instantly',
    cost: 1000,
  },
  {
    icon: '💪',
    title: 'Fitness Band Discount',
    detail: '20% off select wearables',
    cost: 1500,
  },
  {
    icon: '❤️',
    title: 'Donate to Charity',
    detail: '$10 to a health charity',
    cost: 2000,
  },
  {
    icon: '🏖️',
    title: 'Extra PTO Day',
    detail: 'Redeem with your HR portal',
    cost: 5000,
  },
];

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const [points, setPoints] = useState(2840);

  const redeem = (title: string, cost: number) => {
    if (points < cost) {
      Alert.alert(
        'Not enough points',
        `You need ${(
          cost - points
        ).toLocaleString()} more points for this reward.`,
      );
      return;
    }
    setPoints(value => value - cost);
    Alert.alert('Reward redeemed', `${title} has been redeemed.`);
  };

  return (
    <ProfileScreen
      navigation={navigation}
      title="Rewards & Redemption"
      subtitle="Redeem your hard-earned points"
    >
      <View
        style={[styles.pointsCard, { backgroundColor: theme.colors.primary }]}
      >
        <AppText variant="caption" color="white" bold>
          Available Points
        </AppText>
        <AppText variant="display" color="white" style={styles.pointsValue}>
          {points.toLocaleString()}
        </AppText>
        <AppText variant="caption" color="white">
          Earn points by hitting goals and winning challenges
        </AppText>
      </View>
      <ProfileSectionLabel>Available Rewards</ProfileSectionLabel>
      <View style={styles.rewardList}>
        {rewards.map(reward => (
          <ProfileCard key={reward.title}>
            <View style={styles.rewardRow}>
              <View
                style={[
                  styles.rewardIcon,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              >
                <AppText variant="h3">{reward.icon}</AppText>
              </View>
              <View style={styles.rewardCopy}>
                <AppText variant="subtitle2" bold>
                  {reward.title}
                </AppText>
                <AppText variant="caption" secondary>
                  {reward.detail}
                </AppText>
              </View>
              <Pressable
                onPress={() => redeem(reward.title, reward.cost)}
                style={styles.redeemAction}
              >
                <AppText variant="subtitle2" color="warning" bold>
                  {reward.cost.toLocaleString()} pts
                </AppText>
                <AppText variant="caption" primary bold>
                  Redeem
                </AppText>
              </Pressable>
            </View>
          </ProfileCard>
        ))}
      </View>
      <ProfileSectionLabel>Recent Redemptions</ProfileSectionLabel>
      <ProfileCard>
        <ProfileListRow
          icon="☕"
          title="$5 Coffee eGift"
          detail="Redeemed Jun 2, 2026"
          action="−500"
          last
        />
      </ProfileCard>
    </ProfileScreen>
  );
};

const styles = StyleSheet.create({
  pointsCard: { borderRadius: 22, padding: 20, marginBottom: 4 },
  pointsValue: { marginVertical: 2 },
  rewardList: { gap: 10 },
  rewardRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  rewardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCopy: { flex: 1 },
  redeemAction: { alignItems: 'flex-end' },
});

export default RewardsScreen;
