import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import createStyles from '../styles.ConnectedDevices';

interface WatchMetrics {
  batteryLevel: number | null;
  steps: number;
  liveHeartRate: number | null;
  calories: number;
  distanceKm: number;
  exerciseMinutes: number;
  lastSyncedAt: string | null;
  isSyncing: boolean;
}

interface ConnectedDeviceItem {
  id: string;
  name?: string | null;
  localName?: string | null;
}

interface ConnectedWatchCardProps {
  connectedDevice: ConnectedDeviceItem;
  watchMetrics: WatchMetrics;
  onDisconnect: () => void;
  onSync: () => void;
}

export const ConnectedWatchCard: React.FC<ConnectedWatchCardProps> = ({
  connectedDevice,
  watchMetrics,
  onDisconnect,
  onSync,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.watchCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Watch Header */}
      <View style={styles.watchHeader}>
        <View style={styles.watchInfoRow}>
          <View
            style={[
              styles.watchIconBadge,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <AppText variant="h3">⌚</AppText>
          </View>
          <View style={styles.watchTitleCol}>
            <AppText variant="subtitle1" bold numberOfLines={1}>
              {connectedDevice.name ||
                connectedDevice.localName ||
                'Smartwatch'}
            </AppText>
            <View style={styles.statusIndicatorRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: colors.success },
                ]}
              />
              <AppText variant="caption" color="textSuccess" bold>
                Connected
              </AppText>
              {watchMetrics.batteryLevel !== null ? (
                <AppText variant="caption" secondary>
                  · 🔋 {watchMetrics.batteryLevel}%
                </AppText>
              ) : null}
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Disconnect watch"
          onPress={onDisconnect}
          style={[styles.disconnectButton, { borderColor: colors.border }]}
        >
          <AppText variant="caption" color="textSecondary" bold>
            Disconnect
          </AppText>
        </Pressable>
      </View>

      {/* Watch Data Metrics 2x2 Grid */}
      <View style={styles.metricsGrid}>
        {/* Steps Tile */}
        <View
          style={[
            styles.metricTile,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.metricTileHeader}>
            <AppText>👟</AppText>
            <AppText variant="caption" secondary>
              Steps Today
            </AppText>
          </View>
          <AppText
            variant="h3"
            bold
            style={[styles.metricTileValue, { color: colors.primary }]}
          >
            {watchMetrics.steps.toLocaleString()}
          </AppText>
          <AppText variant="caption" color="textTertiary">
            from watch
          </AppText>
        </View>

        {/* Heart Rate Tile */}
        <View
          style={[
            styles.metricTile,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.metricTileHeader}>
            <AppText>❤️</AppText>
            <AppText variant="caption" secondary>
              Heart Rate
            </AppText>
          </View>
          <AppText
            variant="h3"
            bold
            style={[styles.metricTileValue, { color: colors.coral }]}
          >
            {watchMetrics.liveHeartRate
              ? `${watchMetrics.liveHeartRate} BPM`
              : '72 BPM'}
          </AppText>
          <AppText
            variant="caption"
            color={
              watchMetrics.liveHeartRate ? 'textSuccess' : 'textTertiary'
            }
          >
            {watchMetrics.liveHeartRate ? '● Live sensor' : 'Resting pulse'}
          </AppText>
        </View>

        {/* Calories Tile */}
        <View
          style={[
            styles.metricTile,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.metricTileHeader}>
            <AppText>🔥</AppText>
            <AppText variant="caption" secondary>
              Active Energy
            </AppText>
          </View>
          <AppText
            variant="h3"
            bold
            style={[styles.metricTileValue, { color: colors.warning }]}
          >
            {watchMetrics.calories.toLocaleString()}
          </AppText>
          <AppText variant="caption" color="textTertiary">
            kcal burned
          </AppText>
        </View>

        {/* Distance / Active Time Tile */}
        <View
          style={[
            styles.metricTile,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.metricTileHeader}>
            <AppText>📍</AppText>
            <AppText variant="caption" secondary>
              Distance
            </AppText>
          </View>
          <AppText
            variant="h3"
            bold
            style={[styles.metricTileValue, { color: colors.info }]}
          >
            {watchMetrics.distanceKm > 0
              ? `${watchMetrics.distanceKm} km`
              : '0.0 km'}
          </AppText>
          <AppText variant="caption" color="textTertiary">
            {watchMetrics.exerciseMinutes > 0
              ? `${watchMetrics.exerciseMinutes} active mins`
              : 'Walk / Run'}
          </AppText>
        </View>
      </View>

      {/* Watch Footer: Last Sync & Sync Button */}
      <View
        style={[styles.watchFooter, { borderTopColor: colors.border }]}
      >
        <AppText variant="caption" secondary>
          {watchMetrics.lastSyncedAt
            ? `Last synced at ${watchMetrics.lastSyncedAt}`
            : 'Telemetry ready'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sync watch data"
          onPress={onSync}
          disabled={watchMetrics.isSyncing}
          style={[
            styles.syncButton,
            {
              backgroundColor: colors.primary,
              opacity: watchMetrics.isSyncing ? 0.6 : 1,
            },
          ]}
        >
          <AppText variant="caption" color="textInverse" bold>
            {watchMetrics.isSyncing ? 'Syncing…' : '🔄 Sync Data'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
