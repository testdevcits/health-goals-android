import { authenticatedRequest } from './authenticatedApi';

export type UserProfile = {
  id: string;
  publicId?: string;
  name: string;
  email: string;
  companyCode?: string;
  goal?: string;
  gender?: string;
  phone?: string;
  profileAnswers?: Record<string, unknown>;
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

  return normalizeUserProfile(response.user);
}

const normalizedKey = (key: string) =>
  key.toLowerCase().replace(/[^a-z0-9]/g, '');

function answerFor(
  answers: Record<string, unknown> | undefined,
  key: string,
): unknown {
  if (!answers) return undefined;
  const expected = normalizedKey(key);
  const foundKey = Object.keys(answers).find(
    answerKey => normalizedKey(answerKey) === expected,
  );
  return foundKey === undefined ? undefined : answers[foundKey];
}

function hasValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

function normalizeUserProfile(user: UserProfile): UserProfile {
  const answers = user.profileAnswers;
  const birthDateAnswer = answerFor(answers, 'birthDate');
  const heightAnswer = answerFor(answers, 'heightCm');
  const weightAnswer = answerFor(answers, 'weightKg');
  const genderAnswer = answerFor(answers, 'gender');
  const heightFromAnswers = Number(heightAnswer);
  const weightFromAnswers = Number(weightAnswer);

  return {
    ...user,
    birthDate: hasValue(user.birthDate)
      ? user.birthDate
      : typeof birthDateAnswer === 'string'
      ? birthDateAnswer
      : user.birthDate,
    heightCm:
      user.heightCm != null
        ? user.heightCm
        : Number.isFinite(heightFromAnswers) && hasValue(heightAnswer)
        ? heightFromAnswers
        : user.heightCm,
    weightKg:
      user.weightKg != null
        ? user.weightKg
        : Number.isFinite(weightFromAnswers) && hasValue(weightAnswer)
        ? weightFromAnswers
        : user.weightKg,
    gender: hasValue(user.gender)
      ? user.gender
      : typeof genderAnswer === 'string'
      ? genderAnswer
      : user.gender,
  };
}
