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
  onDisconnect: () => void;
  onSync: () => void;
}

export const ConnectedWatchCard: React.FC<ConnectedWatchCardProps> = ({
  connectedDevice,
  watchMetrics,
  onDisconnect,
  onSync,
}) => {

  console.log("=======watchMetrics===========", watchMetrics)
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);

  const deviceName =
    connectedDevice.name || connectedDevice.localName || 'Smartwatch';

  const isLive = Boolean(watchMetrics.liveHeartRate);
  const heartRate = watchMetrics.liveHeartRate ?? 72;

  const batteryPercent =
    watchMetrics.batteryLevel !== null ? watchMetrics.batteryLevel : 0;

  const stepCount = watchMetrics.steps > 0 ? watchMetrics.steps : 0;
  const stepTarget = 10000;
  const progressRatio = Math.min(Math.max((stepCount / stepTarget) * 100, 6), 100);

  const caloriesValue =
    watchMetrics.calories > 0
      ? watchMetrics.calories.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      : '0.0';

  const distanceValue =
    watchMetrics.distanceKm > 0
      ? watchMetrics.distanceKm.toFixed(2)
      : '0.0';

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
            <Watch size={24} color="#0F172A" strokeWidth={1.8} />
            <View style={styles.watchBluetoothBadge}>
              <Bluetooth size={10} color="#2563EB" strokeWidth={2.4} />
            </View>
          </View>

          {/* Title & Status */}
          <View style={styles.watchTitleCol}>
            <AppText
              variant="subtitle1"
              bold
              numberOfLines={2}
              style={styles.watchDeviceName}
            >
              {deviceName}
            </AppText>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.statusDot} />
              <AppText style={styles.connectedStatusText}>Connected</AppText>
            </View>
          </View>
        </View>

        {/* Header Right Actions: Battery & Disconnect */}
        <View style={styles.watchHeaderActions}>
          <View style={styles.batteryBadge}>
            <View style={styles.batteryIndicatorBar} />
            <AppText style={styles.batteryLevelText}>{batteryPercent}%</AppText>
          </View>

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
            <AppText style={styles.disconnectButtonText}>Disconnect</AppText>
          </Pressable>
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
                { backgroundColor: '#CCFBF1' },
              ]}
            >
              <Zap size={14} color="#0D9488" fill="#0D9488" strokeWidth={2.4} />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText style={[styles.metricLargeValue, { color: '#0F172A' }]}>
              {stepCount.toLocaleString()}
            </AppText>
            <AppText style={[styles.metricUnitText, { color: '#94A3B8' }]}>
              {' '}
              / 10k
            </AppText>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressRatio}%` },
              ]}
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
                { backgroundColor: '#FFE4E6' },
              ]}
            >
              <Heart size={14} color="#E11D48" fill="#E11D48" />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText style={[styles.metricLargeValue, { color: '#E11D48' }]}>
              {heartRate}
            </AppText>
            <AppText style={[styles.metricUnitText, { color: '#E11D48' }]}>
              {' '}
              BPM
            </AppText>
          </View>

          <View style={styles.pulseWaveContainer}>
            <Svg width="100%" height={22} viewBox="0 0 100 22">
              <Path
                d="M 0 11 L 34 11 L 39 6 L 45 16 L 51 2 L 57 20 L 63 9 L 68 11 L 100 11"
                fill="none"
                stroke="#FB7185"
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
                { backgroundColor: '#FEF3C7' },
              ]}
            >
              <Flame size={14} color="#D97706" fill="#D97706" strokeWidth={2.4} />
            </View>
          </View>

          <View style={[styles.metricValueRow, { marginBottom: 12 }]}>
            <AppText style={[styles.metricLargeValue, { color: '#D97706' }]}>
              {caloriesValue}
            </AppText>
          </View>

          <AppText style={styles.energyCaptionText}>
            kcal burned today
          </AppText>
        </View>

        {/* Tile 4: Distance */}
        <View style={[styles.metricTile, styles.metricTileDistance]}>
          <View style={styles.metricTileHeader}>
            <AppText style={styles.metricTileTitle}>Distance</AppText>
            <View
              style={[
                styles.metricIconBadge,
                { backgroundColor: '#EDE9FE' },
              ]}
            >
              <MapPin size={14} color="#7C3AED" strokeWidth={2.4} />
            </View>
          </View>

          <View style={styles.metricValueRow}>
            <AppText style={[styles.metricLargeValue, { color: '#4338CA' }]}>
              {distanceValue}
            </AppText>
            <AppText style={[styles.metricUnitText, { color: '#4F46E5' }]}>
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
          <Clock size={14} color="#94A3B8" strokeWidth={2} />
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
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <RefreshCw size={13} color="#FFFFFF" strokeWidth={2.4} />
          )}
          <AppText style={styles.syncButtonText}>
            {watchMetrics.isSyncing ? 'Syncing…' : 'Sync Data'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
