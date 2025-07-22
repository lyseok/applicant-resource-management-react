import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI, workHistoryAPI } from '@/services/api';

// 비동기 액션들
export const fetchProjectTasks = createAsyncThunk(
  'tasks/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getProjectTasks(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      // taskId와 taskData 유효성 검사
      console.log('updateTaskAsync called with:', { taskId, taskData });

      if (!taskId || taskId === 'undefined' || taskId === 'null') {
        console.error('Invalid taskId:', taskId);
        throw new Error('작업 ID가 유효하지 않습니다.');
      }

      if (!taskData) {
        console.error('Invalid taskData:', taskData);
        throw new Error('작업 데이터가 유효하지 않습니다.');
      }

      const response = await taskAPI.updateTask(taskId, taskData);
      return response.data;
    } catch (error) {
      console.error('Task update error:', error);
      console.error('TaskId:', taskId);
      console.error('TaskData:', taskData);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      // taskId가 undefined인지 확인
      if (!taskId || taskId === 'undefined') {
        throw new Error('작업 ID가 유효하지 않습니다.');
      }

      await taskAPI.deleteTask(taskId);
      return taskId; // 삭제된 작업의 ID 반환
    } catch (error) {
      console.error('Task delete error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTaskStatusAsync = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      if (!taskId || taskId === 'undefined') {
        throw new Error('작업 ID가 유효하지 않습니다.');
      }

      const response = await taskAPI.updateTaskStatus(taskId, status);
      return { taskId, status, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWorkHistoryAsync = createAsyncThunk(
  'tasks/fetchWorkHistory',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await workHistoryAPI.getWorkHistory(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const calculateStatistics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.taskStatus === 'PEND-003'
  ).length;
  const incomplete = tasks.filter(
    (task) => task.taskStatus !== 'PEND-003'
  ).length;
  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.taskStatus === 'PEND-003') return false;
    const dueDate = new Date(
      task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );
    const today = new Date();
    return dueDate < today;
  }).length;

  return { total, completed, incomplete, overdue };
};

const initialState = {
  tasks: [],
  workHistory: [],
  loading: false,
  error: null,
  statistics: { total: 0, completed: 0, incomplete: 0, overdue: 0 },
  isTaskPanelOpen: false,
  selectedTask: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    openTaskPanel: (state, action) => {
      state.selectedTask = action.payload;
      state.isTaskPanelOpen = true;
    },
    closeTaskPanel: (state) => {
      state.isTaskPanelOpen = false;
      state.selectedTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 프로젝트 작업 목록 조회
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.statistics = calculateStatistics(action.payload);
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 작업 생성
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.statistics = calculateStatistics(state.tasks);
        state.isTaskPanelOpen = false;
        state.selectedTask = null;
      })

      // 작업 수정
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.taskNo === action.payload.taskNo
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.statistics = calculateStatistics(state.tasks);
        }
        if (state.selectedTask?.taskNo === action.payload.taskNo) {
          state.selectedTask = action.payload;
        }
      })

      // 작업 삭제
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.taskNo !== action.payload
        );
        state.statistics = calculateStatistics(state.tasks);
        if (state.selectedTask?.taskNo === action.payload) {
          state.isTaskPanelOpen = false;
          state.selectedTask = null;
        }
      })

      // 작업 상태 변경
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.taskNo === action.payload.taskId
        );
        if (index !== -1) {
          state.tasks[index].taskStatus = action.payload.status;
          state.statistics = calculateStatistics(state.tasks);
        }
      })

      // 작업 내역 조회
      .addCase(fetchWorkHistoryAsync.fulfilled, (state, action) => {
        state.workHistory = action.payload;
      });
  },
});

export const { openTaskPanel, closeTaskPanel, clearError } = taskSlice.actions;

// 별칭 exports 추가
export const fetchTasks = fetchProjectTasks;
export const createTask = createTaskAsync;
export const updateTask = updateTaskAsync;
export const deleteTask = deleteTaskAsync;
export const updateTaskStatus = updateTaskStatusAsync;
export const fetchWorkHistory = fetchWorkHistoryAsync;

export default taskSlice.reducer;
