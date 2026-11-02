import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';
import { authenticatedRequest } from './api';
import { readSession } from './auth';

const INSTALL_ID_SERVICE = 'com.vitality.device-id';
let registration: Promise<string> | null = null;
let profileSync: { userId: string; promise: Promise<string> } | null = null;

function createInstallId() {
  return 'android-' + Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0'),
  ).join('-');
}

async function getInstallId() {
  const stored = await Keychain.getGenericPassword({ service: INSTALL_ID_SERVICE });
  if (stored) return stored.password;
  const id = createInstallId();
  await Keychain.setGenericPassword('device', id, { service: INSTALL_ID_SERVICE });
  return id;
}

export async function syncPhoneProfile(): Promise<string> {
  const session = await readSession();
  if (!session?.user?.id) throw new Error('Please sign in to save phone details.');
  if (profileSync?.userId === session.user.id) return profileSync.promise;
  const promise = (async () => {
    const deviceIdentifier = await getInstallId();
    const constants = Platform.constants as typeof Platform.constants & {
      Manufacturer?: string; Brand?: string; Model?: string; Release?: string;
    };
    const phone = {
      deviceIdentifier,
      manufacturer: constants.Manufacturer || constants.Brand || 'Unknown',
      brand: constants.Brand || constants.Manufacturer || 'Unknown',
      model: constants.Model || 'Unknown Android model',
      platform: 'android',
      osVersion: `Android ${constants.Release || Platform.Version} (API ${Platform.Version})`,
      appVersion: '1.0',
    };
    await authenticatedRequest('POST', '/auth/me/device', phone);
    return deviceIdentifier;
  })();
  profileSync = { userId: session.user.id, promise };
  promise.catch(() => { if (profileSync?.promise === promise) profileSync = null; });
  return promise;
}

export async function ensureHealthConnectDevice(): Promise<string> {
  const session = await readSession();
  if (!session?.user?.id) throw new Error('Please sign in to sync health data.');
  const registrationKey = session.user.id;
  if (!registration || (registration as any).userId !== registrationKey) {
    const task = (async () => {
      const deviceIdentifier = await syncPhoneProfile();
      const constants = Platform.constants as typeof Platform.constants & {
        Manufacturer?: string; Brand?: string; Model?: string;
      };
      const result = await authenticatedRequest<{ devices: any[] }>('GET', '/devices');
      if (!result.devices.some(device => device.deviceIdentifier === deviceIdentifier)) {
        await authenticatedRequest('POST', '/devices', {
          deviceType: 'phone',
          deviceIdentifier,
          manufacturer: constants.Manufacturer || constants.Brand || 'Unknown',
          model: constants.Model || 'Unknown Android model',
          platform: 'android',
        });
      }
      return deviceIdentifier;
    })().catch(error => {
      throw error;
    });
    (task as any).userId = registrationKey;
    registration = task;
    task.catch(() => { if (registration === task) registration = null; });
  }
  return registration;
}

export async function listDevices() {
  return authenticatedRequest<{ devices: any[] }>('GET', '/devices');
}

export async function removeDevice(id: string) {
  return authenticatedRequest('DELETE', `/devices/${encodeURIComponent(id)}`);
}
