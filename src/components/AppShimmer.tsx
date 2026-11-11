import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/useTheme';

interface AppShimmerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlightColor?: string;
}

const AppShimmer: React.FC<AppShimmerProps> = ({
  children,
  style,
  highlightColor,
}) => {
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [translateX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setWidth(currentWidth =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  };
  const translateDistance = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
      {width > 0 ? (
        <Animated.View
          style={[
            styles.highlight,
            {
              width: width * 0.6,
              transform: [{ translateX: translateDistance }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              highlightColor ?? theme.colors.surface,
              'transparent',
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
});

export default AppShimmer;
