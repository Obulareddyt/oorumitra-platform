import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 only resolves on the Android emulator's virtual host loopback —
// it's unreachable from a real device, so point both dev and prod builds at
// the same deployed backend.
const BASE_URL = 'https://ooumitra-backend.onrender.com/api';

// The backend runs on Render's free tier, which spins down after ~15 min
// idle and can take up to several minutes to cold-start on the next request.
// pingBackend() (fired once at app launch, see App.tsx) starts that wake-up
// as early as possible; the retry-with-backoff below covers the case where a
// real request still lands mid cold-start.
export const pingBackend = () => {
  axios.get(`${BASE_URL}/actuator/health`, {timeout: 60000}).catch(() => {});
};

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('@access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const COLD_START_RETRY_DELAYS_MS = [4000, 10000]; // ~14s of backoff beyond the first attempt

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?: boolean; _coldStartRetries?: number};

    // Network error or timeout (no response at all) — most often a Render
    // cold start. Retry with backoff instead of surfacing a false failure.
    if (!error.response && originalRequest && (error.code === 'ECONNABORTED' || error.message === 'Network Error')) {
      const attempt = originalRequest._coldStartRetries ?? 0;
      if (attempt < COLD_START_RETRY_DELAYS_MS.length) {
        originalRequest._coldStartRetries = attempt + 1;
        await sleep(COLD_START_RETRY_DELAYS_MS[attempt]);
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const {data} = await axios.post(`${BASE_URL}/auth/refresh`, null, {
          params: {refreshToken},
        });
        const newToken = data.data.accessToken;
        await AsyncStorage.setItem('@access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        await AsyncStorage.multiRemove(['@access_token', '@refresh_token']);
      }
    }
    // Surface the backend's ApiResponse.message (e.g. "Incorrect password") in
    // place of axios's generic "Request failed with status code 500" — callers
    // throughout the app read err.message directly.
    const backendMessage = (error.response?.data as {message?: string} | undefined)?.message;
    if (backendMessage) error.message = backendMessage;
    return Promise.reject(error);
  },
);

export default api;
