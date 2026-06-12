import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../../services/authService';
import {userService} from '../../services/userService';
import {AuthState, User} from '../../types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

export const sendOtp = createAsyncThunk('auth/sendOtp', async (mobileNumber: string) => {
  return authService.sendOtp(mobileNumber);
});

export const registerUser = createAsyncThunk('auth/register', async (payload: Parameters<typeof authService.register>[0]) => {
  return authService.register(payload);
});

export const loginUser = createAsyncThunk('auth/login', async ({mobileNumber, otp}: {mobileNumber: string; otp: string}) => {
  return authService.login(mobileNumber, otp);
});

export const loadAuthState = createAsyncThunk('auth/loadState', async () => {
  const token = await AsyncStorage.getItem('@access_token');
  if (!token) return null;
  const user = await userService.getProfile();
  return {user, accessToken: token};
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      authService.logout();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(loadAuthState.pending, state => { state.isLoading = true; })
      .addCase(loadAuthState.rejected, state => { state.isLoading = false; })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = {
            id: action.payload.userId,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            mobileNumber: action.payload.mobileNumber,
            role: action.payload.role as any,
            language: action.payload.language as any,
          };
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = {
            id: action.payload.userId,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            mobileNumber: action.payload.mobileNumber,
            role: action.payload.role as any,
            language: action.payload.language as any,
          };
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      });
  },
});

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;
