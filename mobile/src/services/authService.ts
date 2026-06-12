import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async sendOtp(mobileNumber: string) {
    const {data} = await api.post('/auth/send-otp', {mobileNumber});
    return data;
  },

  async register(payload: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    otp: string;
    email?: string;
    gender: string;
    village?: string;
  }) {
    const {data} = await api.post('/auth/register', payload);
    if (data.data) await this._saveTokens(data.data);
    return data.data;
  },

  async login(mobileNumber: string, otp: string) {
    const {data} = await api.post('/auth/login', {mobileNumber, otp});
    if (data.data) await this._saveTokens(data.data);
    return data.data;
  },

  async logout() {
    await AsyncStorage.multiRemove(['@access_token', '@refresh_token', '@user']);
  },

  async _saveTokens(authResponse: {accessToken: string; refreshToken: string}) {
    await AsyncStorage.multiSet([
      ['@access_token', authResponse.accessToken],
      ['@refresh_token', authResponse.refreshToken],
    ]);
  },

  async getStoredToken() {
    return AsyncStorage.getItem('@access_token');
  },
};
