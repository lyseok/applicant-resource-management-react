import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI, authAPI } from '@/services/api';
import { BASE_REDIRECT_URL } from '@/services/api';

// 현재 사용자 정보 조회 (HttpOnly 쿠키 기반)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      // 401 에러인 경우 인증되지 않은 상태로 처리
      if (error.response?.status === 401) {
        return rejectWithValue('인증되지 않은 사용자');
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 로그인
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // 로그인 성공 후 사용자 정보 조회
      const userResponse = await userAPI.getCurrentUser();
      return userResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 로그아웃
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      location.href = BASE_REDIRECT_URL;
      return null;
    } catch (error) {
      // 로그아웃 API 실패해도 클라이언트 상태는 초기화
      console.error('로그아웃 API 실패:', error);
      location.href = BASE_REDIRECT_URL;
      return null;
    }
  }
);

// 인증 상태 확인
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.me();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('인증되지 않은 사용자');
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false, // 초기 인증 상태 확인 완료 여부
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 현재 사용자 정보 조회
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      // 로그인
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentUser = null;
        state.isAuthenticated = false;
      })

      // 로그아웃
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // 인증 상태 확인
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.initialized = true;
      });
  },
});

export const { clearError, setCurrentUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
