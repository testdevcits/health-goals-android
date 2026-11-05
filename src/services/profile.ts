import { authenticatedRequest } from './authenticatedApi';

export type UserProfile = {
  id: string;
  publicId?: string;
  name: string;
  email: string;
  companyCode?: string;
  goal?: string;
  healthGoals?: Record<string, number>;
  heightCm?: number | null;
  weightKg?: number | null;
  birthDate?: string;
  profileImageUrl?: string;
  deviceProfile?: {
    deviceIdentifier?: string;
    deviceType?: string;
    manufacturer?: string;
    brand?: string;
    model?: string;
    platform?: string;
    osVersion?: string;
    appVersion?: string;
    lastSeenAt?: string;
  } | null;
  authVersion?: number;
  status?: string;
  role?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CurrentUserResponse = {
  user?: UserProfile | null;
};

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await authenticatedRequest<CurrentUserResponse>(
    'GET',
    '/auth/me',
  );

  if (!response.user) {
    throw new Error(
      'The current-user response did not include a user profile.',
    );
  }

  return response.user;
}
