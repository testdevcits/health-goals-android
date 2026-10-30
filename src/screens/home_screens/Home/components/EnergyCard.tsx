import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';

const CIRCLE_SIZE = 88;
const STROKE_WIDTH = 7;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const EnergyCircle: React.FC<{ energy: number }> = ({ energy }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const progress = Math.max(0, Math.min(100, energy));
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <View
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        style={{ position: 'absolute' }}
      >
        {/* Gray background track */}
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={colors.white}
          opacity={0.25}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Energy progress */}
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={colors.white}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
        />
      </Svg>

      <AppText variant="body2" bold color="textInverse">
        {Math.round(progress)}
      </AppText>

      <AppText variant="caption" color="textInverse" style={{ marginTop: -2 }}>
        ENERGY
      </AppText>
    </View>
  );
};

const EnergyCard: React.FC<{ energy: number; streak_period: number }> = ({
  energy,
  streak_period,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createHomeStyles(theme);

  return (
    <View style={styles.energyCard}>
      <EnergyCircle energy={energy} />

      {/* Right side with a subtle circular gray background */}
      <View style={styles.energyRight}>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 190,
            height: 190,
            borderRadius: 95,
            backgroundColor: colors.white,
            opacity: 0.1,
            right: -95,
            top: -65,
          }}
        />

        <AppText variant="subtitle1" bold color="textInverse" mb={4}>
          You're doing great! 🎯
        </AppText>

        <AppText
          variant="caption"
          color="textInverse"
          style={styles.energyDescription}
        >
          Your recovery is strong today. A 20-min walk would push you to{' '}
          <AppText variant="caption" bold color="textInverse">
            {energy}.
          </AppText>
        </AppText>

        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <AppText variant="caption" bold color="textInverse">
            {streak_period}-day streak
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default EnergyCard;
