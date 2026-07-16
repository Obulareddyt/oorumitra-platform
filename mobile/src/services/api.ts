import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api'   // Android emulator → localhost
  : 'https://ooumitra-backend.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('@access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?: boolean};
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
