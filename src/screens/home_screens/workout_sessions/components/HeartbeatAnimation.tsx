import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../../../theme/useTheme';

interface Props {
  isRunning: boolean;
  color?: string;
}

const AnimatedView = Animated.View;

const HeartbeatAnimation: React.FC<Props> = ({ isRunning, color }) => {
  const { theme } = useTheme();
  const strokeColor = color ?? theme.colors.white;
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!isRunning || containerWidth === 0) {
      translateX.stopAnimation();
      translateX.setValue(0);
      return;
    }

    translateX.setValue(0);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -containerWidth / 2,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [isRunning, containerWidth, translateX]);

  return (
    <View
      style={styles.container}
      onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <AnimatedView
          style={[
            styles.track,
            {
              width: containerWidth * 2,
              transform: [{ translateX }],
            },
          ]}
        >
          <Svg width={containerWidth * 2} height={42} viewBox="0 0 480 42">
            <Path
              d="M0 21 H28 L36 21 L44 10 L53 34 L64 3 L75 29 L84 21 H120 H148 L156 21 L164 10 L173 34 L184 3 L195 29 L204 21 H240 H268 L276 21 L284 10 L293 34 L304 3 L315 29 L324 21 H360 H388 L396 21 L404 10 L413 34 L424 3 L435 29 L444 21 H480"
              stroke={strokeColor}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </AnimatedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: 42,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  track: {
    height: 42,
  },
});

export default HeartbeatAnimation;
