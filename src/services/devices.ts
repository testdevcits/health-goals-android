import * as Keychain from 'react-native-keychain';
import { Alert, Platform } from 'react-native';
import { authenticatedRequest } from './authenticatedApi';
import { readSession } from './auth';
import { API_ENDPOINTS } from '../constants/endpoints';

const INSTALL_ID_SERVICE = 'com.vitality.device-id';
let registration: Promise<string> | null = null;
let registrationUserId: string | null = null;
let profileSync: { userId: string; promise: Promise<string> } | null = null;

type RegisteredDevice = {
  id: string;
  deviceIdentifier: string;
};

function createInstallId() {
  return (
    'android-' +
    Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 0x100000000)
        .toString(16)
        .padStart(8, '0'),
    ).join('-')
  );
}

async function getInstallId() {
  const stored = await Keychain.getGenericPassword({
    service: INSTALL_ID_SERVICE,
  });
  if (stored) return stored.password;
  const id = createInstallId();
  await Keychain.setGenericPassword('device', id, {
    service: INSTALL_ID_SERVICE,
  });
  return id;
}

export async function syncPhoneProfile(): Promise<string> {
  const session = await readSession();
  if (!session?.user?.id)
    throw new Error('Please sign in to save phone details.');
  if (profileSync?.userId === session.user.id) return profileSync.promise;
  const promise = (async () => {
    const deviceIdentifier = await getInstallId();
    const constants = Platform.constants as typeof Platform.constants & {
      Manufacturer?: string;
      Brand?: string;
      Model?: string;
      Release?: string;
    };
    const phone = {
      deviceIdentifier: deviceIdentifier.slice(0, 160),
      manufacturer: (
        constants.Manufacturer ||
        constants.Brand ||
        'Unknown'
      ).slice(0, 160),
      brand: (constants.Brand || constants.Manufacturer || 'Unknown').slice(
        0,
        160,
      ),
      model: (constants.Model || 'Unknown Android model').slice(0, 160),
      platform: 'android' as const,
      osVersion: `Android ${constants.Release || Platform.Version} (API ${
        Platform.Version
      })`.slice(0, 160),
      appVersion: '1.0'.slice(0, 160),
    };
    const response = await authenticatedRequest<{
      warning?: string | null;
      [key: string]: unknown;
    }>('POST', API_ENDPOINTS.AUTH.DEVICE_REGISTER, phone);

    const warningMessage =
      response?.warning ||
      (response as any)?.data?.warning ||
      (response as any)?.message;
    if (
      response?.warning &&
      typeof response.warning === 'string' &&
      response.warning.trim().length > 0
    ) {
      setTimeout(() => {
        Alert.alert('Shared Device Notice', response.warning as string, [
          { text: 'OK', style: 'default' },
        ]);
      }, 100);
    } else if (
      typeof warningMessage === 'string' &&
      warningMessage.toLowerCase().includes('associated with another account')
    ) {
      setTimeout(() => {
        Alert.alert('Shared Device Notice', warningMessage, [
          { text: 'OK', style: 'default' },
        ]);
      }, 100);
    }
    return deviceIdentifier;
  })();
  profileSync = { userId: session.user.id, promise };
  promise.catch(() => {
    if (profileSync?.promise === promise) profileSync = null;
  });
  return promise;
}

export async function ensureHealthConnectDevice(): Promise<string> {
  const session = await readSession();
  if (!session?.user?.id)
    throw new Error('Please sign in to sync health data.');
  const registrationKey = session.user.id;
  if (!registration || registrationUserId !== registrationKey) {
    const task = (async (): Promise<string> => {
      const deviceIdentifier = await syncPhoneProfile();
      const constants = Platform.constants as typeof Platform.constants & {
        Manufacturer?: string;
        Brand?: string;
        Model?: string;
      };
      const result = await authenticatedRequest<{
        devices: RegisteredDevice[];
      }>('GET', API_ENDPOINTS.DEVICES.LIST);
      const existingDevice = result.devices.find(
        device => device.deviceIdentifier === deviceIdentifier,
      );
      if (existingDevice) {
        if (!existingDevice.id) {
          throw new Error('Registered device response did not include an ID.');
        }
        return existingDevice.id;
      }

      const created = await authenticatedRequest<{
        device: RegisteredDevice;
        warning?: string | null;
      }>('POST', API_ENDPOINTS.DEVICES.REGISTER, {
        deviceType: 'phone',
        deviceIdentifier,
        manufacturer: (
          constants.Manufacturer ||
          constants.Brand ||
          'Unknown'
        ).slice(0, 160),
        model: (constants.Model || 'Unknown Android model').slice(0, 160),
        platform: 'android',
      });
      const warningMessage =
        created?.warning ||
        (created as any)?.data?.warning ||
        (created as any)?.message;
      if (
        created?.warning &&
        typeof created.warning === 'string' &&
        created.warning.trim().length > 0
      ) {
        setTimeout(() => {
          Alert.alert('Shared Device Notice', created.warning as string, [
            { text: 'OK', style: 'default' },
          ]);
        }, 100);
      } else if (
        typeof warningMessage === 'string' &&
        warningMessage.toLowerCase().includes('associated with another account')
      ) {
        setTimeout(() => {
          Alert.alert('Shared Device Notice', warningMessage, [
            { text: 'OK', style: 'default' },
          ]);
        }, 100);
      }
      if (!created.device?.id) {
        throw new Error('Device registration response did not include an ID.');
      }
      return created.device.id;
    })();
    registration = task;
    registrationUserId = registrationKey;
    task.catch(() => {
      if (registration === task) registration = null;
    });
  }
  return registration;
}

export async function listDevices() {
  return authenticatedRequest<{ devices: RegisteredDevice[] }>(
    'GET',
    API_ENDPOINTS.DEVICES.LIST,
  );
}

export async function removeDevice(id: string) {
  return authenticatedRequest('DELETE', API_ENDPOINTS.DEVICES.REMOVE(id));
}
