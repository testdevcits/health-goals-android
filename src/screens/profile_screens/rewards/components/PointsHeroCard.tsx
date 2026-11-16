import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.Rewards';

interface PointsHeroCardProps {
  points: number;
  wallet?: {
    lifetimeEarned: number;
    lifetimeRedeemed: number;
  } | null;
}

export const PointsHeroCard: React.FC<PointsHeroCardProps> = ({
  points,
  wallet,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.pointsCard}>
      <AppText variant="caption" color="white" bold>
        Available Points
      </AppText>
      <AppText variant="display" color="white" style={styles.pointsValue}>
        {points.toLocaleString()}
      </AppText>
      <AppText variant="caption" color="white">
        Earn points by hitting goals and winning challenges
      </AppText>
      {wallet ? (
        <View style={styles.lifetimeRow}>
          <View style={styles.lifetimeMetric}>
            <AppText variant="subtitle2" color="white" bold>
              {wallet.lifetimeEarned.toLocaleString()}
            </AppText>
            <AppText variant="caption" color="white">
              Lifetime earned
            </AppText>
          </View>
          <View style={styles.lifetimeDivider} />
          <View style={styles.lifetimeMetric}>
            <AppText variant="subtitle2" color="white" bold>
              {wallet.lifetimeRedeemed.toLocaleString()}
            </AppText>
            <AppText variant="caption" color="white">
              Lifetime redeemed
            </AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
};
