import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../api/taskAPI';

// 비동기 액션들
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTask = createAsyncThunk(
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

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(id, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  tasks: [
    {
      taskNo: 'TASK001',
      prjNo: 'PRJ001',
      userId: 'USER001',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      taskName: '프로젝트 요구사항 정의서 작성',
      taskStatus: 'TODO',
      detailContent: '프로젝트의 전체적인 요구사항 파악및 이걸 왜하지?.',
      startDate: '20240715',
      dueDate: '20240718',
      priorityCode: 'LOW',
      upperTaskNo: null,
      progressRate: '0',
      deleteDate: null,
      deleteUserId: null,
    },
    {
      taskNo: 'TASK002',
      prjNo: 'PRJ001',
      userId: 'USER001',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      taskName: 'ERD 설계 및 테이블 구조 정의',
      taskStatus: 'TODO',
      detailContent:
        '프로젝트의 데이터베이스 구조를 설계하고 ERD를 작성하는 작업입니다.',
      startDate: '20240717',
      dueDate: '20240721',
      priorityCode: 'MEDIUM',
      upperTaskNo: 'TASK001',
      progressRate: '0',
      deleteDate: null,
      deleteUserId: null,
    },
    {
      taskNo: 'TASK003',
      prjNo: 'PRJ001',
      userId: 'USER001',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      taskName: '팀원과 타임라인 공유하기',
      taskStatus: 'TODO',
      detailContent: '프로젝트 타임라인을 팀원들과 공유하는 작업입니다.',
      startDate: '20240719',
      dueDate: '20240722',
      priorityCode: 'MEDIUM',
      upperTaskNo: 'TASK002',
      progressRate: '0',
      deleteDate: null,
      deleteUserId: null,
    },
  ],
  loading: false,
  error: null,
  statistics: {
    total: 3,
    completed: 0,
    incomplete: 3,
    overdue: 0,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTaskStatus: (state, action) => {
      const { taskNo, status } = action.payload;
      const task = state.tasks.find((task) => task.taskNo === taskNo);
      if (task) {
        task.taskStatus = status;
        task.progressRate = status === 'COMPLETED' ? '100' : task.progressRate;
      }
      // 통계 업데이트
      state.statistics = calculateStatistics(state.tasks);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.statistics = calculateStatistics(action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.statistics = calculateStatistics(state.tasks);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.taskNo === action.payload.taskNo
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.statistics = calculateStatistics(state.tasks);
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.taskNo !== action.payload
        );
        state.statistics = calculateStatistics(state.tasks);
      });
  },
});

// 통계 계산 함수
const calculateStatistics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.taskStatus === 'COMPLETED'
  ).length;
  const incomplete = tasks.filter(
    (task) => task.taskStatus !== 'COMPLETED'
  ).length;
  const overdue = tasks.filter((task) => {
    const dueDate = new Date(
      task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );
    const today = new Date();
    return dueDate < today && task.taskStatus !== 'COMPLETED';
  }).length;

  return { total, completed, incomplete, overdue };
};

export const { clearError, updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
