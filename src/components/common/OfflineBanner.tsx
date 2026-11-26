import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff, Wifi } from 'lucide-react-native';
import AppText from './AppText';
import { useTheme } from '../../theme/useTheme';

export const OfflineBanner: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // isConnected is null on initial fetch sometimes, check false explicitly
      const offline =
        state.isConnected === false || state.isInternetReachable === false;

      if (offline) {
        wasOfflineRef.current = true;
        setIsOffline(true);
        setShowReconnected(false);
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }).start();
      } else if (wasOfflineRef.current) {
        // Was offline and now back online
        wasOfflineRef.current = false;
        setIsOffline(false);
        setShowReconnected(true);

        // Keep reconnected banner visible for 2.5s then slide out
        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -60,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            setShowReconnected(false);
          });
        }, 2500);

        return () => clearTimeout(timer);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [slideAnim]);

  if (!isOffline && !showReconnected) {
    return null;
  }

  const isBackOnline = showReconnected && !isOffline;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isBackOnline ? colors.success : colors.error,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        {isBackOnline ? (
          <Wifi size={16} color={colors.white} />
        ) : (
          <WifiOff size={16} color={colors.white} />
        )}
        <AppText
          variant="caption"
          bold
          style={[styles.text, { color: colors.white }]}
        >
          {isBackOnline
            ? 'Back online. Syncing health data...'
            : 'No internet connection. Saved data will sync automatically.'}
        </AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
  },
});
