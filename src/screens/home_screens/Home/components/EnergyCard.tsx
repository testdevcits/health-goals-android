import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../../services/api';

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

const EnergyCard: React.FC = () => {
  const [energy, setEnergy] = React.useState(0);
  const [streakPeriod, setStreakPeriod] = React.useState(0);
  const [stepsTarget, setStepsTarget] = React.useState(10000);
  useFocusEffect(React.useCallback(() => {
    let active = true;
    Promise.all([
      authenticatedRequest<{ totals?: { steps?: number }; creditedCoins?: number }>('GET', '/activity/today'),
      authenticatedRequest<{ user: { healthGoals?: Record<string, number> } }>('GET', '/auth/me'),
      authenticatedRequest<{ items: Array<{ day: string; creditedCoins?: number; totals?: { steps?: number; workoutMinutes?: number; meditationMinutes?: number } }> }>('GET', '/activity/history?limit=30'),
    ]).then(([day, profile, history]) => {
      if (!active) return;
      const target = profile.user?.healthGoals?.steps || 10000;
      const steps = day.totals?.steps || 0;
      setStepsTarget(target);
      setEnergy(Math.min(100, Math.round(steps / target * 100)));
      const activeDays = new Set((history.items || []).filter(item => (item.creditedCoins || 0) > 0 || Boolean(item.totals?.steps || item.totals?.workoutMinutes || item.totals?.meditationMinutes)).map(item => item.day));
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
      if ((day.creditedCoins || 0) > 0 || day.totals?.steps || history.items?.some(item => item.day === today && (item.totals?.steps || item.totals?.workoutMinutes || item.totals?.meditationMinutes))) activeDays.add(today);
      let streak = 0; const cursor = new Date();
      while (activeDays.has(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(cursor))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
      setStreakPeriod(streak);
    }).catch(() => { if (active) { setEnergy(0); setStreakPeriod(0); } });
    return () => { active = false; };
  }, []));
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
          Today’s synced steps goal is {stepsTarget.toLocaleString()}. Your progress is{' '}
          <AppText variant="caption" bold color="textInverse">
            {energy}%.
          </AppText>
        </AppText>

        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <AppText variant="caption" bold color="textInverse">
          {streakPeriod ?? initialStreak}-day streak
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default EnergyCard;
