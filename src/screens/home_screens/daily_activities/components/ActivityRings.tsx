import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';
import { useTheme } from '../../../../theme/useTheme';
import { createDailyActivityStyles } from '../styles.DailyActivities';

const rings = [
  { radius: 66, progress: 0.68, color: '#D5E84E' },
  { radius: 52, progress: 0.52, color: '#42C9D9' },
  { radius: 38, progress: 0.34, color: '#B23CC2' },
];

const ActivityRings: React.FC = () => {
  const styles = createDailyActivityStyles(useTheme().theme);
  const center = 110;

  return (
    <View style={styles.ringsArea} accessibilityLabel="Daily activity goal progress">
      <Svg width={220} height={220} viewBox="0 0 220 220">
        {rings.map(ring => {
          const circumference = 2 * Math.PI * ring.radius;
          return (
            <React.Fragment key={ring.radius}>
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke="#E9EDF1"
                strokeWidth={10}
              />
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={`${circumference * ring.progress} ${circumference}`}
                rotation={-90}
                origin={`${center}, ${center}`}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export default ActivityRings;
