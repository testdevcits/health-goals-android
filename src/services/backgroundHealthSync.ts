import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import { Platform } from 'react-native';
import {
  getGrantedPermissions,
  requestPermission,
} from 'react-native-health-connect';
import type { BackgroundAccessPermission } from 'react-native-health-connect';
import { syncRecentHealthData } from './healthSync';
import { ensureHealthConnectInitialized } from './healthConnect';

const ENABLED_KEY = '@vitality/background-health-sync-enabled';
const BACKGROUND_ACCESS_PERMISSION: BackgroundAccessPermission = {
  accessType: 'read',
  recordType: 'BackgroundAccessPermission',
};

let configurePromise: Promise<void> | null = null;

const supportsBackgroundRead = () =>
  Platform.OS === 'android' && Number(Platform.Version) >= 34;

const hasBackgroundAccess = (
  permissions: ReadonlyArray<{ recordType: string }>,
) =>
  permissions.some(
    permission => permission.recordType === 'BackgroundAccessPermission',
  );

export async function isBackgroundHealthSyncEnabled(): Promise<boolean> {
  if (!supportsBackgroundRead()) {
    return false;
  }

  if (!(await ensureHealthConnectInitialized())) {
    return false;
  }

  const [enabled, permissions] = await Promise.all([
    AsyncStorage.getItem(ENABLED_KEY),
    getGrantedPermissions(),
  ]);
  return enabled === 'true' && hasBackgroundAccess(permissions);
}

export async function requestBackgroundHealthReadPermission(): Promise<boolean> {
  if (!supportsBackgroundRead()) {
    return false;
  }

  if (!(await ensureHealthConnectInitialized())) {
    throw new Error(
      'Health Connect is unavailable. Install or update it, then try again.',
    );
  }

  const permissions = await getGrantedPermissions();
  const hasHealthReadAccess = permissions.some(
    permission =>
      permission.accessType === 'read' &&
      permission.recordType !== 'BackgroundAccessPermission',
  );
  if (!hasHealthReadAccess) {
    throw new Error(
      'Connect Health Connect and allow health data access before enabling background sync.',
    );
  }

  const granted = await requestPermission([BACKGROUND_ACCESS_PERMISSION]);
  return hasBackgroundAccess(granted);
}

async function configureBackgroundFetch(): Promise<void> {
  if (configurePromise) {
    return configurePromise;
  }

  configurePromise = BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    },
    async taskId => {
      try {
        await runBackgroundHealthSync();
      } catch (error) {
        console.error('Background Health Connect sync failed:', error);
      } finally {
        BackgroundFetch.finish(taskId);
      }
    },
    taskId => {
      console.warn('Background Health Connect sync timed out.');
      BackgroundFetch.finish(taskId);
    },
  )
    .then(() => undefined)
    .catch(error => {
      configurePromise = null;
      throw error;
    });

  return configurePromise;
}

export async function initializeBackgroundHealthSync(): Promise<void> {
  if (!supportsBackgroundRead()) {
    return;
  }

  if ((await AsyncStorage.getItem(ENABLED_KEY)) !== 'true') {
    return;
  }

  if (!(await ensureHealthConnectInitialized())) {
    await BackgroundFetch.stop();
    return;
  }

  await configureBackgroundFetch();
  if (await isBackgroundHealthSyncEnabled()) {
    await BackgroundFetch.start();
  } else {
    await BackgroundFetch.stop();
  }
}

export async function enableBackgroundHealthSync(): Promise<void> {
  if (!supportsBackgroundRead()) {
    throw new Error(
      'Background Health Connect sync requires Android 14 or later.',
    );
  }

  if (!(await ensureHealthConnectInitialized())) {
    throw new Error(
      'Health Connect is unavailable. Install or update it, then try again.',
    );
  }

  if (!(await isBackgroundHealthSyncEnabled())) {
    const permissions = await getGrantedPermissions();
    if (!hasBackgroundAccess(permissions)) {
      throw new Error('Health Connect background access has not been granted.');
    }
  }

  await configureBackgroundFetch();
  await AsyncStorage.setItem(ENABLED_KEY, 'true');
  try {
    await BackgroundFetch.start();
  } catch (error) {
    await AsyncStorage.removeItem(ENABLED_KEY);
    throw error;
  }
}

export async function disableBackgroundHealthSync(): Promise<void> {
  await AsyncStorage.removeItem(ENABLED_KEY);
  if (Platform.OS === 'android') {
    await BackgroundFetch.stop();
  }
}

export async function runBackgroundHealthSync(): Promise<void> {
  if (await isBackgroundHealthSyncEnabled()) {
    await syncRecentHealthData();
  }
}
