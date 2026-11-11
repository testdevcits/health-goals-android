import React, { useCallback, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowRight,
  HeartPulse,
  RefreshCw,
} from 'lucide-react-native';
import {
  getGrantedPermissions,
  getSdkStatus,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import type { Permission } from 'react-native-health-connect';
import { AppText } from '../../../../components';
import {
  ensureHealthConnectInitialized,
  HEALTH_PERMISSIONS,
} from '../../../../services/healthConnect';
import { syncRecentHealthData } from '../../../../services/healthSync';
import { apiErrorMessage } from '../../../../services/api';
import { showAppToast } from '../../../../utils/appToast';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';

type ConnectionStatus =
  | 'checking'
  | 'needs-connect'
  | 'connected'
  | 'unavailable'
  | 'update-required'
  | 'unsupported'
  | 'error';

const hasHealthReadAccess = (
  permissions: readonly { accessType: string; recordType: string }[],
) =>
  HEALTH_PERMISSIONS.some(requested =>
    permissions.some(
      granted =>
        granted.accessType === 'read' &&
        granted.recordType === requested.recordType,
    ),
  );

const HealthConnectPrompt: React.FC<{
  onSyncComplete: () => void;
}> = ({ onSyncComplete }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [working, setWorking] = useState(false);

  const checkConnection = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setStatus('unsupported');
      return;
    }

    setStatus('checking');
    try {
      const sdkStatus = await getSdkStatus();
      if (sdkStatus === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        setStatus('unavailable');
        return;
      }
      if (
        sdkStatus ===
        SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
      ) {
        setStatus('update-required');
        return;
      }

      if (!(await ensureHealthConnectInitialized())) {
        setStatus('unavailable');
        return;
      }
      const permissions = (await getGrantedPermissions()).filter(
        (permission): permission is Permission =>
          'accessType' in permission && 'recordType' in permission,
      );
      setStatus(hasHealthReadAccess(permissions) ? 'connected' : 'needs-connect');
    } catch (error) {
      console.error('Unable to check Health Connect access:', error);
      setStatus('error');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkConnection().catch(error => {
        console.error('Unable to refresh Health Connect status:', error);
        setStatus('error');
      });
    }, [checkConnection]),
  );

  const connectAndSync = async () => {
    if (status === 'error') {
      await checkConnection();
      return;
    }
    if (status !== 'needs-connect') return;

    setWorking(true);
    try {
      const granted = await requestPermission(HEALTH_PERMISSIONS);
      if (!hasHealthReadAccess(granted)) {
        showAppToast(
          'info',
          'Health Connect not connected',
          'Allow access to at least one health data type to sync your activity.',
        );
        return;
      }

      setStatus('connected');
      onSyncComplete();
      let result;
      try {
        result = await syncRecentHealthData({ force: true });
      } catch (error) {
        showAppToast(
          'warning',
          'Health Connect connected',
          `Your permissions are saved, but the first sync failed: ${apiErrorMessage(
            error,
          )}`,
        );
        return;
      }
      if (result.failedMetrics?.length) {
        showAppToast(
          'warning',
          'Health Connect connected',
          `Synced available data. Could not read ${result.failedMetrics.join(
            ', ',
          )}; you can retry from Daily Activities.`,
        );
      } else if (result.synced === 0) {
        showAppToast(
          'success',
          'Health Connect connected',
          'No recent records were available yet. New activity will sync when it is recorded.',
        );
      } else {
        showAppToast(
          'success',
          'Health data synced',
          `${result.synced} records checked; ${result.created} new records added.`,
        );
      }
    } catch (error) {
      showAppToast(
        'error',
        'Could not connect Health Connect',
        apiErrorMessage(error),
      );
      await checkConnection();
    } finally {
      setWorking(false);
    }
  };

  if (
    status === 'connected' ||
    status === 'unsupported' ||
    status === 'checking'
  ) {
    return null;
  }

  const unavailable = status === 'unavailable' || status === 'update-required';
  const title = unavailable
    ? 'Set up Health Connect'
    : status === 'error'
    ? 'Check your health connection'
    : 'Connect your health data';
  const description =
    status === 'unavailable'
      ? 'Install Health Connect on your Android device to securely sync your steps, sleep, and workouts.'
      : status === 'update-required'
      ? 'Update Health Connect to securely sync your steps, sleep, and workouts.'
      : status === 'error'
      ? 'We could not check Health Connect right now. Try again.'
      : 'Connect Health Connect to automatically sync your steps, sleep, and workouts. You choose which health data Vitality can read.';
  const actionLabel =
    status === 'error'
      ? 'Retry'
      : status === 'update-required' || status === 'unavailable'
      ? 'Not available'
      : working
      ? 'Connecting…'
      : 'Connect Health Connect';
  const retryAction = status === 'error';

  return (
    <View style={styles.healthConnectCard}>
      <View style={styles.healthConnectIcon}>
        <HeartPulse size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.healthConnectCopy}>
        <AppText variant="subtitle2" bold>
          {title}
        </AppText>
        <AppText variant="caption" secondary>
          {description}
        </AppText>
        {!unavailable ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: working }}
            disabled={working}
            onPress={connectAndSync}
            style={styles.healthConnectAction}
          >
            <AppText variant="caption" primary bold>
              {actionLabel}
            </AppText>
            {working ? (
              <RefreshCw size={15} color={theme.colors.primary} />
            ) : retryAction ? (
              <RefreshCw size={15} color={theme.colors.primary} />
            ) : (
              <ArrowRight size={16} color={theme.colors.primary} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default HealthConnectPrompt;
