import React from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { State as BluetoothState } from 'react-native-ble-plx';
import {
  AppButton,
  AppHeader,
  AppText,
  ConfirmationModal,
  ProfileCard,
  ProfileListRow,
  ProfileToggleRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import useConnectedDevices from './useConnectedDevices';
import createStyles from './styles.ConnectedDevices';

const ConnectedDevicesScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors);
  const {
    bluetoothState,
    discoveredDevices,
    connectedDevice,
    connectingDeviceId,
    isScanning,
    bleError,
    connectionState,
    errorMessage,
    statusDetail,
    actionLabel,
    stopScan,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    handleProviderAction,
    openHealthConnectSettings,
    autoSyncEnabled,
    autoSyncLoading,
    handleAutoSyncToggle,
    showAutoSyncConfirm,
    confirmAutoSync,
    cancelAutoSync,
    watchMetrics,
    syncWatchHealthData,
    onlyWatches,
    setOnlyWatches,
  } = useConnectedDevices();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Connected Devices"
        subtitle="Scan and connect to nearby devices"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
        <View style={{ flex: 1 }}>
          <AppText
            variant="label"
            color="textTertiary"
            style={styles.sectionLabel}
          >
            BLUETOOTH DEVICES
          </AppText>
          {connectedDevice ? (
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
                  onPress={disconnectDevice}
                  style={[
                    styles.disconnectButton,
                    { borderColor: colors.border },
                  ]}
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
                      watchMetrics.liveHeartRate
                        ? 'textSuccess'
                        : 'textTertiary'
                    }
                  >
                    {watchMetrics.liveHeartRate
                      ? '● Live sensor'
                      : 'Resting pulse'}
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
                style={[
                  styles.watchFooter,
                  { borderTopColor: colors.border },
                ]}
              >
                <AppText variant="caption" secondary>
                  {watchMetrics.lastSyncedAt
                    ? `Last synced at ${watchMetrics.lastSyncedAt}`
                    : 'Telemetry ready'}
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sync watch data"
                  onPress={syncWatchHealthData}
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
          ) : null}

          {/* Filter Toggle Row */}
          <View style={styles.filterRow}>
            <AppText variant="caption" secondary style={{ width: "50%" }}>
              {onlyWatches
                ? 'Showing smartwatches & fitness bands'
                : 'Showing all nearby Bluetooth devices'}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Toggle device filter"
              onPress={() => setOnlyWatches(prev => !prev)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: onlyWatches
                    ? colors.primaryLight
                    : colors.backgroundSecondary,
                  borderColor: onlyWatches ? colors.primary : colors.border,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={onlyWatches ? 'primary' : 'textSecondary'}
                bold
              >
                {onlyWatches ? '⌚ Watches Only' : 'All Devices'}
              </AppText>
            </Pressable>
          </View>
          {discoveredDevices.map(device => (
            <ProfileCard key={device.id} style={styles.deviceCard}>
              <ProfileListRow
                icon="⌚"
                title={device.name || device.localName || 'Bluetooth device'}
                detail={
                  device.rssi === null
                    ? 'Nearby'
                    : `Signal strength ${device.rssi} dBm`
                }
                action={
                  connectingDeviceId === device.id ? 'Connecting…' : 'Connect'
                }
                onPress={
                  connectingDeviceId ? undefined : () => connectToDevice(device)
                }
                last
              />
            </ProfileCard>
          ))}
          <Pressable
            onPress={isScanning ? stopScan : scanForDevices}
            disabled={!!connectingDeviceId}
            style={[
              styles.scanButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                marginTop: spacing.md,
              },
              connectingDeviceId && styles.disabledButton,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isScanning
                ? 'Stop scanning for Bluetooth devices'
                : 'Scan for devices'
            }
          >
            <AppText variant="button" color="textInverse">
              {isScanning ? 'Stop Scan' : 'Scan for Devices'}
            </AppText>
          </Pressable>
          <AppText variant="caption" secondary style={styles.deviceNote}>
            {bluetoothState === BluetoothState.PoweredOff
              ? 'Bluetooth is off. Start a scan to turn it on and search for nearby devices.'
              : 'This creates a Bluetooth Low Energy connection, not system pairing or automatic health-data sync. Some watches require their own app or a brand-specific protocol.'}
          </AppText>
          {!isScanning && discoveredDevices.length === 0 && !connectedDevice ? (
            <AppText
              variant="caption"
              secondary
              center
              style={styles.emptyDevices}
            >
              Scan to find nearby Bluetooth devices.
            </AppText>
          ) : null}
          {bleError ? (
            <AppText variant="caption" error style={styles.errorMessage}>
              {bleError}
            </AppText>
          ) : null}
          <AppText
            variant="label"
            color="textTertiary"
            style={[styles.sectionLabel, styles.healthSectionLabel]}
          >
            HEALTH DATA
          </AppText>
          {Platform.OS === 'android' && Number(Platform.Version) >= 34 ? (
            <ProfileCard>
              <ProfileToggleRow
                icon="🔄"
                title="Auto-Sync"
                detail="Sync data in the background every 15 min"
                value={autoSyncEnabled}
                onChange={handleAutoSyncToggle}
                disabled={autoSyncLoading}
                last
              />
            </ProfileCard>
          ) : null}
          <View style={styles.spacer} />
          <ProfileCard>
            <ProfileListRow
              icon="❤️"
              title="Health Connect"
              detail={statusDetail}
              action={actionLabel}
              onPress={
                connectionState === 'available' || connectionState === 'error'
                  ? handleProviderAction
                  : undefined
              }
              last
            />
          </ProfileCard>
          {connectionState === 'available' ? (
            <Pressable
              onPress={openHealthConnectSettings}
              style={[
                styles.settingsButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  marginTop: spacing.md,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open Health Connect settings"
            >
              <AppText variant="buttonSm" primary>
                Open Health Connect settings
              </AppText>
            </Pressable>
          ) : null}
          {connectionState === 'unsupported' ? (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  marginTop: spacing.md,
                  padding: spacing.base,
                },
              ]}
            >
              <AppText variant="body2" secondary>
                iPhone health data connection is not configured yet. This screen
                currently connects Android devices through Health Connect.
              </AppText>
            </View>
          ) : null}
          {errorMessage && connectionState !== 'error' ? (
            <AppText variant="caption" error style={styles.errorMessage}>
              {errorMessage}
            </AppText>
          ) : null}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showAutoSyncConfirm}
        onClose={cancelAutoSync}
        title="Allow auto-sync?"
        message="Vitality will periodically read the Health Connect data you have approved and sync it to your account, even when the app is closed. Android may delay background runs to save battery. You can turn this off at any time."
        position="center"
        showCloseButton
      >
        <View style={styles.modalActions}>
          <AppButton
            title="Not now"
            variant="ghost"
            onPress={cancelAutoSync}
            style={styles.modalActionButton}
          />
          <AppButton
            title="Continue"
            onPress={confirmAutoSync}
            style={styles.modalActionButton}
          />
        </View>
      </ConfirmationModal>
    </View>
  );
};

export default ConnectedDevicesScreen;
