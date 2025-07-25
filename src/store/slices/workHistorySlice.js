import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workHistoryAPI } from '../api/workHistoryAPI';

// 작업 내역 조회
export const fetchWorkHistory = createAsyncThunk(
  'workHistory/fetchWorkHistory',
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId || projectId === 'undefined') {
        return rejectWithValue('프로젝트 ID가 필요합니다.');
      }
      const response = await workHistoryAPI.getWorkHistory(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '작업 내역을 불러오는데 실패했습니다.'
      );
    }
  }
);

// 최근 작업 내역 조회
export const fetchRecentWorkHistory = createAsyncThunk(
  'workHistory/fetchRecentWorkHistory',
  async ({ projectId, limit = 10 }, { rejectWithValue }) => {
    try {
      let response;
      if (!projectId || projectId === 'undefined') {
        // 프로젝트 ID가 없으면 전체 최근 작업 내역 조회
        response = await workHistoryAPI.getAllRecentWorkHistory(limit);
      } else {
        response = await workHistoryAPI.getRecentWorkHistory(projectId, limit);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          '최근 작업 내역을 불러오는데 실패했습니다.'
      );
    }
  }
);

// 작업 내역 생성
export const createWorkHistory = createAsyncThunk(
  'workHistory/createWorkHistory',
  async (workHistoryData, { rejectWithValue }) => {
    try {
      const response = await workHistoryAPI.createWorkHistory(workHistoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '작업 내역 생성에 실패했습니다.'
      );
    }
  }
);

const initialState = {
  workHistory: [],
  recentWorkHistory: [],
  loading: false,
  error: null,
};

const workHistorySlice = createSlice({
  name: 'workHistory',
  initialState,
  reducers: {
    clearWorkHistory: (state) => {
      state.workHistory = [];
      state.recentWorkHistory = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 작업 내역 조회
      .addCase(fetchWorkHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.workHistory = action.payload;
      })
      .addCase(fetchWorkHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 최근 작업 내역 조회
      .addCase(fetchRecentWorkHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentWorkHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.recentWorkHistory = action.payload;
      })
      .addCase(fetchRecentWorkHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 작업 내역 생성
      .addCase(createWorkHistory.fulfilled, (state, action) => {
        state.workHistory.unshift(action.payload);
        state.recentWorkHistory.unshift(action.payload);
        // 최근 내역은 최대 10개까지만 유지
        if (state.recentWorkHistory.length > 10) {
          state.recentWorkHistory = state.recentWorkHistory.slice(0, 10);
        }
      });
  },
});

export const { clearWorkHistory, clearError } = workHistorySlice.actions;
export default workHistorySlice.reducer;
