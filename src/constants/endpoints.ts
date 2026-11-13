/**
 * Centralized API Endpoints Directory
 * All paths are relative to base URL (e.g., /api/v1)
 */

export const API_ENDPOINTS = {
  // ── 1. AUTHENTICATION & ACCOUNT ─────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/password/forgot',
    RESET_PASSWORD: '/auth/password/reset',
    CHANGE_PASSWORD: '/auth/me/password',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GOOGLE_SIGN_IN: '/auth/google',
    ME: '/auth/me',
    PROFILE_IMAGE: '/auth/me/profile-image',
    PROFILE_QUESTIONS: '/auth/me/profile-questions',
    PROFILE_ANSWERS: '/auth/me/profile-answers',
    DEVICE_REGISTER: '/auth/me/device',
    GOALS: '/auth/me/goals',
  },

  // ── 2. COMMUNITY & GROUPS ───────────────────────────────
  COMMUNITY: {
    FEED: '/community/feed',
    GROUPS: '/community/groups',
    DISCOVER_GROUPS: '/community/groups/discover',
    GROUP_LEADERBOARD: (day?: string) =>
      day
        ? `/community/groups/leaderboard?day=${encodeURIComponent(day)}`
        : '/community/groups/leaderboard',

    // Parameterized Group Operations
    GROUP_DETAILS: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}`,
    JOIN_GROUP: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/join`,
    LEAVE_GROUP: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/leave`,
    GROUP_MEMBERS: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/members`,
    GROUP_MESSAGES: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/messages`,
    GROUP_MEMBER_LEADERBOARD: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/leaderboard`,
    GROUP_CHALLENGES: (groupId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/challenges`,
    JOIN_GROUP_CHALLENGE: (groupId: string, challengeId: string) =>
      `/community/groups/${encodeURIComponent(groupId)}/challenges/${encodeURIComponent(challengeId)}/join`,
    USERS_SEARCH: (query: string) =>
      `/community/users/search?q=${encodeURIComponent(query)}`,
  },

  // ── 3. CHALLENGES & BADGES ──────────────────────────────
  CHALLENGES: {
    LIST: '/community/challenges',
    CREATE: '/community/challenges',
    JOIN: (challengeId: string) =>
      `/community/challenges/${encodeURIComponent(challengeId)}/join`,
    BADGES: '/community/badges',
    RULE_COMPETITIONS: '/rewards/competitions',
  },

  // ── 4. REWARDS, WALLET & ACTIVITY ───────────────────────
  REWARDS: {
    WALLET: '/wallet',
    LIST: '/rewards',
    REDEEM: (rewardId: string) =>
      `/rewards/${encodeURIComponent(rewardId)}/redeem`,
    REDEMPTIONS: '/redemptions',
    REDEMPTION_DETAILS: (redemptionId: string) =>
      `/redemptions/${encodeURIComponent(redemptionId)}`,
    LEADERBOARD_TICKETS: '/rewards/leaderboard-tickets',
  },

  ACTIVITY: {
    TODAY: '/activity/today',
    HISTORY: '/activity/history',
    RECORDS: '/activity/records',
    TRANSACTIONS: (page: number = 1, limit: number = 20) =>
      `/activity/transactions?page=${page}&limit=${limit}`,
  },

  // ── 5. HEALTH & SYNC ────────────────────────────────────
  HEALTH: {
    SYNC: '/health/sync',
    SUMMARY: '/health/summary',
    DASHBOARD: '/health/dashboard',
    RECORDS: '/health/records',
    TRENDS: '/health/trends',
    HISTORY: '/health/history',
  },

  // ── 6. DEVICES ──────────────────────────────────────────
  DEVICES: {
    LIST: '/devices',
    REGISTER: '/devices',
    REMOVE: (id: string) => `/devices/${encodeURIComponent(id)}`,
  },

  // ── 7. NOTIFICATIONS ────────────────────────────────────
  NOTIFICATIONS: {
    LIST: (page: number = 1, limit: number = 50) =>
      `/notifications?page=${page}&limit=${limit}`,
    MARK_READ: (id: string) => `/notifications/${encodeURIComponent(id)}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
} as const;

export default API_ENDPOINTS;
