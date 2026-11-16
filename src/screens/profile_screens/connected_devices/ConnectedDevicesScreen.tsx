import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  AppButton,
  AppHeader,
  AppText,
  ConfirmationModal,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import type { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import {
  BluetoothScanControl,
  ConnectedWatchCard,
  DiscoveredDevicesList,
  HealthDataSection,
} from './components';
import createStyles from './styles.ConnectedDevices';
import useConnectedDevices from './useConnectedDevices';

const ConnectedDevicesScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
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
            <ConnectedWatchCard
              connectedDevice={connectedDevice}
              watchMetrics={watchMetrics}
              onDisconnect={disconnectDevice}
              onSync={syncWatchHealthData}
            />
          ) : null}

          <DiscoveredDevicesList
            discoveredDevices={discoveredDevices}
            connectingDeviceId={connectingDeviceId}
            onlyWatches={onlyWatches}
            onToggleOnlyWatches={() => setOnlyWatches(prev => !prev)}
            onConnectDevice={connectToDevice}
          />

          <BluetoothScanControl
            isScanning={isScanning}
            bluetoothState={bluetoothState}
            connectingDeviceId={connectingDeviceId}
            discoveredCount={discoveredDevices.length}
            hasConnectedDevice={Boolean(connectedDevice)}
            bleError={bleError}
            onScanToggle={isScanning ? stopScan : scanForDevices}
          />

          <HealthDataSection
            autoSyncEnabled={autoSyncEnabled}
            autoSyncLoading={autoSyncLoading}
            onAutoSyncToggle={handleAutoSyncToggle}
            statusDetail={statusDetail}
            actionLabel={actionLabel}
            connectionState={connectionState}
            errorMessage={errorMessage}
            onProviderAction={handleProviderAction}
            onOpenSettings={openHealthConnectSettings}
          />
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
