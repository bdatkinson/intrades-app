export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name: string; email: string; password: string };
export type ResetRequest = { email: string };
export type ResetConfirmRequest = { token: string; password: string };

export type AuthTokens = { accessToken: string; refreshToken?: string };
export type Profile = { id: string; name: string; email: string; role?: string };

// Gamification Types
export type ProgressTier = "Apprentice" | "Journeyman" | "Master" | "Contractor" | "Boss";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpRequired: number;
  dateEarned?: string;
};

export type UserProgression = {
  xp: number;
  level: number;
  tier: ProgressTier;
  badges: Badge[];
  nextTierXP: number;
  streakDays: number;
  lastActivityDate?: string;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  tier: ProgressTier;
  trend?: "up" | "down" | "same";
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  userRank?: number;
  period: "weekly" | "allTime";
};

// Challenge Types
export type Challenge = {
  id: string;
  title: string;
  description: string;
  summary?: string;
  trade: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "quiz" | "real-world" | "mini-game" | "boss-battle";
  xpReward: number;
  estimatedTime?: string;
  requirements?: string[];
  submissionType?: "upload" | "text" | "quiz" | "none";
  submissionAccept?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};

export type ChallengeSubmission = {
  id: string;
  challengeId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: "pending" | "graded" | "returned";
  grade?: number;
  maxPoints?: number;
  files?: Array<{ url: string; name: string; type: string }>;
  textResponse?: string;
  rubricScores?: Record<string, number>;
  feedback?: string;
  comments?: Array<{ author: string; message: string; timestamp: string; isInstructor: boolean }>;
};

export type SubmissionData = {
  textResponse?: string;
  files?: Array<{ key: string; url: string; name: string }>;
  images?: Array<{ key: string; url: string; name: string }>;
  notes?: string;
  isDraft?: boolean;
};

// Instructor Types
export type Student = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  tier: string;
  challengesCompleted: number;
  challengesTotal: number;
  badgesEarned: number;
  streakDays: number;
  lastActivity?: string;
  cohort?: string;
};

export type Cohort = {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  studentCount: number;
  instructorCount: number;
  status: "active" | "upcoming" | "completed";
};

export type InstructorNotification = {
  id: string;
  type: "submission" | "grading" | "system" | "student" | "cohort";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
};

// Activity Types
export type ActivityItem = {
  id: string;
  type: "challenge_completed" | "badge_earned" | "xp_gained" | "tier_up" | "milestone_completed" | "streak_milestone" | "quiz_completed";
  title: string;
  description?: string;
  icon: string;
  timestamp: string;
  xpGained?: number;
  metadata?: Record<string, any>;
};

// Business Milestone Types
export type BusinessMilestone = {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  completed: boolean;
  completedAt?: string;
  note?: string;
  xpReward?: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const tokens = storage.tokens;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  // Add auth token if available
  if (tokens?.accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...init,
    credentials: 'include',
  });

  if (!res.ok) {
    // Handle 401 - try to refresh token
    if (res.status === 401 && tokens?.refreshToken) {
      try {
        const newTokens = await api.refresh(tokens.refreshToken);
        storage.tokens = newTokens;
        // Retry original request
        return request<T>(path, init);
      } catch (refreshError) {
        // Refresh failed, clear tokens
        storage.tokens = null;
        throw new Error("Session expired. Please login again.");
      }
    }

    const text = await res.text().catch(() => '');
    let errorMessage = text;
    
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.message || errorJson.error || text;
    } catch {
      // Not JSON, use text as is
    }

    throw new Error(errorMessage || `Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}

export const api = {
  // Auth
  login: (body: LoginRequest) =>
    request<AuthTokens>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: RegisterRequest) =>
    request<AuthTokens>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  refresh: (token?: string) =>
    request<AuthTokens>('/api/auth/refresh', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  logout: () =>
    request<void>('/api/auth/logout', { method: 'POST' }),
  profile: (token?: string) =>
    request<Profile>('/api/auth/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  updateProfile: (data: Partial<Profile>) =>
    request<Profile>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  resetRequest: (body: ResetRequest) =>
    request<void>('/api/auth/password-reset', { method: 'POST', body: JSON.stringify(body) }),
  resetConfirm: (body: ResetConfirmRequest) =>
    request<void>('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify(body) }),

  // Gamification
  getUserProgression: (userId: string, token?: string) =>
    request<UserProgression>(`/api/xp/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  getXPHistory: (userId: string, limit?: number, offset?: number) =>
    request<ActivityItem[]>(`/api/xp/users/${userId}/history?limit=${limit || 20}&offset=${offset || 0}`),
  getBadges: (token?: string) =>
    request<Badge[]>('/api/badges', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  getUserBadges: (userId: string, token?: string) =>
    request<Badge[]>(`/api/badges/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  getLeaderboard: (period: "weekly" | "allTime" = "weekly", token?: string) =>
    request<LeaderboardResponse>(`/api/xp/leaderboard?period=${period}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  awardMilestoneXP: (userId: string, milestone: string, note?: string) =>
    request<{ totalXP: number; message: string }>(`/api/xp/users/${userId}/milestone`, {
      method: 'POST',
      body: JSON.stringify({ milestone, note }),
    }),

  // Challenges
  getChallenges: (filters?: { trade?: string; difficulty?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.trade) params.append('trade', filters.trade);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.type) params.append('type', filters.type);
    const query = params.toString();
    return request<Challenge[]>(`/api/challenges${query ? `?${query}` : ''}`);
  },
  getChallenge: (id: string) =>
    request<Challenge>(`/api/challenges/${id}`),
  getUserChallenges: (userId: string) =>
    request<Challenge[]>(`/api/challenges/users/${userId}`),
  createChallenge: (data: Omit<Challenge, "id" | "createdAt" | "updatedAt">) =>
    request<Challenge>('/api/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateChallenge: (id: string, data: Partial<Challenge>) =>
    request<Challenge>(`/api/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteChallenge: (id: string) =>
    request<void>(`/api/challenges/${id}`, { method: 'DELETE' }),
  submitChallenge: (challengeId: string, data: SubmissionData) =>
    request<{ submissionId: string; message: string }>(`/api/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getChallengeSubmissions: (challengeId: string) =>
    request<ChallengeSubmission[]>(`/api/challenges/${challengeId}/submissions`),
  gradeSubmission: (challengeId: string, submissionId: string, grade: number, feedback: string, rubricScores?: Record<string, number>) =>
    request<{ message: string }>(`/api/challenges/${challengeId}/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade, feedback, rubricScores }),
    }),
  getChallengeAnalytics: (challengeId: string) =>
    request<any>(`/api/challenges/${challengeId}/analytics`),

  // Instructor
  getStudents: (filters?: { cohortId?: string; tier?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.cohortId) params.append('cohortId', filters.cohortId);
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return request<Student[]>(`/api/instructor/students${query ? `?${query}` : ''}`);
  },
  getCohorts: () =>
    request<Cohort[]>('/api/instructor/cohorts'),
  createCohort: (data: Omit<Cohort, "id" | "studentCount" | "instructorCount">) =>
    request<Cohort>('/api/instructor/cohorts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCohort: (id: string, data: Partial<Cohort>) =>
    request<Cohort>(`/api/instructor/cohorts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCohort: (id: string) =>
    request<void>(`/api/instructor/cohorts/${id}`, { method: 'DELETE' }),
  getNotifications: () =>
    request<InstructorNotification[]>('/api/instructor/notifications'),
  markNotificationRead: (id: string) =>
    request<void>(`/api/instructor/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    request<void>('/api/instructor/notifications/read-all', { method: 'POST' }),

  // Activity Feed
  getActivityFeed: (userId: string, limit?: number) =>
    request<ActivityItem[]>(`/api/activity/${userId}?limit=${limit || 10}`),

  // Business Milestones
  getBusinessMilestones: (userId: string) =>
    request<BusinessMilestone[]>(`/api/users/${userId}/milestones`),
  completeMilestone: (userId: string, milestoneId: string, note?: string) =>
    request<BusinessMilestone>(`/api/users/${userId}/milestones/${milestoneId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  // File Uploads
  getUploadUrl: (challengeId: string, submissionId: string, fileName: string, contentType: string) =>
    request<{ url: string; fields: Record<string, string> }>(`/api/uploads/challenges/${challengeId}/submissions/${submissionId}/presigned`, {
      method: 'POST',
      body: JSON.stringify({ fileName, contentType }),
    }),
  uploadFile: (url: string, fields: Record<string, string>, file: File) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);
    return fetch(url, {
      method: 'POST',
      body: formData,
    });
  },
};

export const storage = {
  get tokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth:tokens');
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  },
  set tokens(v: AuthTokens | null) {
    if (typeof window === 'undefined') return;
    if (!v) localStorage.removeItem('auth:tokens');
    else localStorage.setItem('auth:tokens', JSON.stringify(v));
  },
};
