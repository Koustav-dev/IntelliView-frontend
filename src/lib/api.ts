import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          const newToken = data.data.accessToken;
          useAuthStore.getState().setTokens(newToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
};

// --- Problems ---
export const problemsAPI = {
  list: (params?: any) => api.get('/problems', { params }),
  get: (slugOrId: string) => api.get(`/problems/${slugOrId}`),
  create: (data: any) => api.post('/problems', data),
};

// --- Submissions ---
export const submissionsAPI = {
  submit: (data: any) => api.post('/submissions', data),
  list: (params?: any) => api.get('/submissions', { params }),
  forProblem: (problemId: string) => api.get(`/submissions/problem/${problemId}`),
  runTestCase: (data: any) => api.post('/submissions/run', data),
  getHint: (data: any) => api.post('/submissions/hint', data),
  explainSolution: (data: any) => api.post('/submissions/explain', data),
};

// --- Interviews ---
export const interviewsAPI = {
  startSession: (data: any) => api.post('/interviews/sessions/start', data),
  completeSession: (id: string, data?: any) => api.post(`/interviews/sessions/${id}/complete`, data || {}),
  abandonSession: (id: string) => api.post(`/interviews/sessions/${id}/abandon`),
  listSessions: (params?: any) => api.get('/interviews/sessions', { params }),
  getSession: (id: string) => api.get(`/interviews/sessions/${id}`),
  getBehavioralQuestions: (params?: any) => api.get('/interviews/behavioral/questions', { params }),
  submitBehavioral: (data: any) => api.post('/interviews/behavioral/submit', data),
  generateQuestion: (data?: any) => api.post('/interviews/behavioral/generate-question', data || {}),
  getMockKit: (params?: any) => api.get('/interviews/mock-kit', { params }),
  getStudyPlan: (data: any) => api.post('/interviews/study-plan', data),
};

// --- Users ---
export const usersAPI = {
  getStats: () => api.get('/users/me/stats'),
  updateProfile: (data: any) => api.patch('/users/me/profile', data),
  changePassword: (data: any) => api.post('/users/me/change-password', data),
  getLeaderboard: (period?: string) => api.get('/users/leaderboard', { params: { period } }),
};

// --- AI ---
export const aiAPI = {
  chat: (data: any) => api.post('/ai/chat', data),
  generateProblem: (data: any) => api.post('/ai/generate-problem', data),
  getStudyRoadmap: (data: any) => api.post('/ai/study-roadmap', data),
};

// --- Companies ---
export const companiesAPI = {
  list: () => api.get('/companies'),
  get: (name: string) => api.get(`/companies/${name}`),
};

export default api;
