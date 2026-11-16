import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '../../../../../components';
import { Member, formatSteps } from '../../constants';
import { useTheme } from '../../../../../theme/useTheme';

interface GoalCardProps {
  styles: any;
  members: Member[];
}

export const GoalCard: React.FC<GoalCardProps> = memo(({ styles, members }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const total = members.reduce((sum, member) => sum + member.steps, 0);
  const target = members.length * 10000;
  const hasData = target > 0 && total > 0;
  const progressRatio = target > 0 ? Math.min(1, total / target) : 0;
  const percent = Math.round(progressRatio * 100);

  const size = 86;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalRingContainer}>
        <Svg width={size} height={size}>
          {/* Background unfilled track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Filled progress circle when data is available */}
          {hasData ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          ) : null}
        </Svg>
        <View style={styles.goalRingInner}>
          <AppText variant="h3" center>
            {percent}%
          </AppText>
          <AppText variant="caption" secondary center>
            OF GOAL
          </AppText>
        </View>
      </View>
      <View style={styles.goalInfo}>
        <AppText variant="caption" secondary>
          WEEKLY GROUP GOAL
        </AppText>
        <View style={styles.goalNumbers}>
          <AppText variant="h2">{formatSteps(total)}</AppText>
          <AppText variant="caption" secondary>
            {` / ${formatSteps(target)} steps`}
          </AppText>
        </View>
        <AppText
          variant="caption"
          color={hasData ? 'textSuccess' : 'textTertiary'}
          bold
        >
          {members.length && total > 0
            ? `${members.length} members · last 7 days`
            : 'No synced steps this week'}
        </AppText>
      </View>
    </View>
  );
});

export default GoalCard;
