import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Bluetooth,
  Clock,
  Flame,
  Heart,
  MapPin,
  RefreshCw,
  Watch,
  X,
  Zap,
} from 'lucide-react-native';
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
  isConnected?: boolean;
  isConnecting?: boolean;
  onDisconnect: () => void;
  onSync: () => void;
  onReconnect?: () => void;
}

export const ConnectedWatchCard: React.FC<ConnectedWatchCardProps> = ({
  connectedDevice,
  watchMetrics,
  isConnected = true,
  isConnecting = false,
  onDisconnect,
  onSync,
  onReconnect,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const deviceName =
    connectedDevice.name || connectedDevice.localName || 'Not Available';

  const isLive = Boolean(
    watchMetrics.liveHeartRate && watchMetrics.liveHeartRate > 0,
  );
  const heartRate = isLive ? watchMetrics.liveHeartRate : '--';

  const stepCount =
    typeof watchMetrics.steps === 'number' && watchMetrics.steps > 0
      ? Math.round(watchMetrics.steps)
      : 0;
  const stepTarget = 10000;
  const progressRatio = Math.min(
    Math.max((stepCount / stepTarget) * 100, 6),
    100,
  );

  const caloriesValue =
    typeof watchMetrics.calories === 'number' &&
    !isNaN(watchMetrics.calories) &&
    watchMetrics.calories > 0
      ? watchMetrics.calories.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '0.0';

  const distanceValue =
    typeof watchMetrics.distanceKm === 'number' &&
    !isNaN(watchMetrics.distanceKm) &&
    watchMetrics.distanceKm > 0
      ? watchMetrics.distanceKm.toFixed(2)
      : '0.00';

  const lastSyncLabel = watchMetrics.lastSyncedAt
    ? `Last synced at ${watchMetrics.lastSyncedAt}`
    : 'Not Available';

  return (
    <View style={styles.watchCard}>
      {/* Top Header */}
      <View style={styles.watchHeader}>
        <View style={styles.watchInfoRow}>
          {/* Smartwatch Squircle Avatar with overlapping Bluetooth badge */}
          <View style={styles.watchIconBadge}>
            <Watch size={22} color={colors.textPrimary} strokeWidth={1.8} />
            <View style={styles.watchBluetoothBadge}>
              <Bluetooth
                size={9}
                color={colors.watchBluetoothIcon}
                strokeWidth={2.4}
              />
            </View>
          </View>

          {/* Title & Status */}
          <View style={styles.watchTitleCol}>
            <AppText
              variant="subtitle1"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.watchDeviceName}
            >
              {deviceName}
            </AppText>
            <View style={styles.statusIndicatorRow}>
              <View
                style={[
                  styles.statusDot,
                  !isConnected && {
                    backgroundColor: isConnecting
                      ? colors.watchStatusConnecting
                      : colors.watchStatusDisconnected,
                  },
                ]}
              />
              <AppText
                style={[
                  styles.connectedStatusText,
                  !isConnected && {
                    color: isConnecting
                      ? colors.watchStatusConnecting
                      : colors.watchStatusDisconnected,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {isConnected
                  ? 'Connected'
                  : isConnecting
                  ? 'Connecting…'
                  : 'Disconnected'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Header Right Actions: Battery & Connect/Disconnect */}
        <View style={styles.watchHeaderActions}>
          {watchMetrics.batteryLevel !== null ? (
            <View style={styles.batteryBadge}>
              <View style={styles.batteryIndicatorBar} />
              <AppText style={styles.batteryLevelText} numberOfLines={1}>
                {watchMetrics.batteryLevel}%
              </AppText>
            </View>
          ) : null}

          {isConnected ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Disconnect watch"
              hitSlop={8}
              onPress={onDisconnect}
              style={({ pressed }) => [
                styles.disconnectButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <AppText style={styles.disconnectButtonText} numberOfLines={1}>
                Disconnect
              </AppText>
            </Pressable>
          ) : isConnecting ? (
            <View style={[styles.disconnectButton, { opacity: 0.8 }]}>
              <AppText
                style={[
                  styles.disconnectButtonText,
                  { color: colors.watchStatusConnecting },
                ]}
                numberOfLines={1}
              >
                Connecting…
              </AppText>
            </View>
          ) : (
            <View style={styles.disconnectedActionsRow}>
              {onReconnect ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reconnect watch"
                  hitSlop={8}
                  onPress={onReconnect}
                  style={({ pressed }) => [
                    styles.reconnectButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <AppText style={styles.reconnectButtonText} numberOfLines={1}>
                    Reconnect
                  </AppText>
                </Pressable>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Forget watch"
                hitSlop={8}
                onPress={onDisconnect}
                style={({ pressed }) => [
                  styles.forgetButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <X size={12} color={colors.watchForgetText} strokeWidth={2.4} />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* 2x2 Pastel Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Tile 1: Steps Today */}
        <View style={[styles.metricTile, styles.metricTileSteps]}>
          <View style={styles.metricTileHeader}>
            <AppText style={styles.metricTileTitle}>Steps Today</AppText>
            <View
              style={[
                styles.metricIconBadge,
                { backgroundColor: colors.metricStepsIconBg },
              ]}
            >
              <Zap
                size={14}
                color={colors.metricStepsIcon}
                fill={colors.metricStepsIcon}
                strokeWidth={2.4}
              />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText
              style={[
                styles.metricLargeValue,
                { color: colors.metricStepsText },
              ]}
            >
              {stepCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </AppText>
            <AppText
              style={[styles.metricUnitText, { color: colors.metricStepsUnit }]}
            >
              {' '}
              / 10k
            </AppText>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progressRatio}%` }]}
            >
              <View style={styles.progressBarThumb} />
            </View>
          </View>

          <View style={styles.stepsFromWatchRow}>
            <View style={styles.stepsFromWatchDot} />
            <AppText style={styles.stepsFromWatchText}>From watch</AppText>
          </View>
        </View>

        {/* Tile 2: Heart Rate */}
        <View style={[styles.metricTile, styles.metricTileHeart]}>
          <View style={styles.metricTileHeader}>
            <AppText style={styles.metricTileTitle}>Heart Rate</AppText>
            <View
              style={[
                styles.metricIconBadge,
                { backgroundColor: colors.metricHeartIconBg },
              ]}
            >
              <Heart
                size={14}
                color={colors.metricHeartIcon}
                fill={colors.metricHeartIcon}
              />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText
              style={[
                styles.metricLargeValue,
                { color: colors.metricHeartText },
              ]}
            >
              {heartRate}
            </AppText>
            <AppText
              style={[styles.metricUnitText, { color: colors.metricHeartText }]}
            >
              {' '}
              BPM
            </AppText>
          </View>

          <View style={styles.pulseWaveContainer}>
            <Svg width="100%" height={22} viewBox="0 0 100 22">
              <Path
                d="M 0 11 L 34 11 L 39 6 L 45 16 L 51 2 L 57 20 L 63 9 L 68 11 L 100 11"
                fill="none"
                stroke={colors.metricHeartWave}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <AppText style={styles.heartCaptionText}>
            {isLive ? 'Live sensor' : 'Resting pulse'}
          </AppText>
        </View>

        {/* Tile 3: Active Energy */}
        <View style={[styles.metricTile, styles.metricTileEnergy]}>
          <View style={styles.metricTileHeader}>
            <AppText style={styles.metricTileTitle}>Active Energy</AppText>
            <View
              style={[
                styles.metricIconBadge,
                { backgroundColor: colors.metricEnergyIconBg },
              ]}
            >
              <Flame
                size={14}
                color={colors.metricEnergyIcon}
                fill={colors.metricEnergyIcon}
                strokeWidth={2.4}
              />
            </View>
          </View>

          <View
            style={[styles.metricValueRow, { marginBottom: theme.spacing.md }]}
          >
            <AppText
              style={[
                styles.metricLargeValue,
                { color: colors.metricEnergyText },
              ]}
            >
              {caloriesValue}
            </AppText>
          </View>

          <AppText style={styles.energyCaptionText}>kcal burned today</AppText>
        </View>

        {/* Tile 4: Distance */}
        <View style={[styles.metricTile, styles.metricTileDistance]}>
          <View style={styles.metricTileHeader}>
            <AppText style={styles.metricTileTitle}>Distance</AppText>
            <View
              style={[
                styles.metricIconBadge,
                { backgroundColor: colors.metricDistanceIconBg },
              ]}
            >
              <MapPin
                size={14}
                color={colors.metricDistanceIcon}
                strokeWidth={2.4}
              />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText
              style={[
                styles.metricLargeValue,
                { color: colors.metricDistanceText },
              ]}
            >
              {distanceValue}
            </AppText>
            <AppText
              style={[
                styles.metricUnitText,
                { color: colors.metricDistanceUnit },
              ]}
            >
              {' '}
              km
            </AppText>
          </View>

          <View style={styles.distanceDetailRow}>
            <View style={styles.distanceBadge}>
              <AppText style={styles.distanceBadgeText}>Walk /</AppText>
              <AppText style={styles.distanceBadgeText}>Run</AppText>
            </View>
            <View style={styles.gpsLabelContainer}>
              <AppText style={styles.gpsLabelText}>GPS</AppText>
              <AppText style={styles.gpsLabelText}>active</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Footer: Last Sync & Sync Button */}
      <View style={styles.watchFooter}>
        <View style={styles.syncStatusCol}>
          <Clock size={14} color={colors.watchLastSyncText} strokeWidth={2} />
          <AppText style={styles.syncStatusText} numberOfLines={1}>
            {lastSyncLabel}
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sync watch data"
          onPress={onSync}
          disabled={watchMetrics.isSyncing}
          style={({ pressed }) => [
            styles.syncButton,
            { opacity: watchMetrics.isSyncing ? 0.75 : pressed ? 0.88 : 1 },
          ]}
        >
          {watchMetrics.isSyncing ? (
            <ActivityIndicator
              size="small"
              color={colors.watchSyncButtonText}
            />
          ) : (
            <RefreshCw
              size={13}
              color={colors.watchSyncButtonText}
              strokeWidth={2.4}
            />
          )}
          <AppText style={styles.syncButtonText}>
            {watchMetrics.isSyncing ? 'Syncing…' : 'Sync Data'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
