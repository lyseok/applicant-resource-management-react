import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI, workHistoryAPI } from '@/services/api';
import { createWorkHistory } from './workHistorySlice';
import {
  generateWorkContent,
  WORK_TYPES,
  WORK_TABLES,
} from '../../utils/workHistoryUtils';

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
  async (taskData, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      const newTask = response.data;

      // 작업 내역 기록
      const { auth, project } = getState();
      const workHistoryData = {
        prjNo: project.currentProject?.prjNo,
        userId: auth.user?.userId,
        workDate: new Date().toISOString(),
        workTable: WORK_TABLES.TASK,
        workType: WORK_TYPES.CREATE,
        workTarget: newTask.taskNo,
        workContent: generateWorkContent(
          WORK_TYPES.CREATE,
          WORK_TABLES.TASK,
          newTask.taskName
        ),
      };

      dispatch(createWorkHistory(workHistoryData));

      return newTask;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '작업 생성에 실패했습니다.'
      );
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { dispatch, getState, rejectWithValue }) => {
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
      const updatedTask = response.data;

      // 기존 작업 정보 가져오기
      const { tasks, auth, project } = getState();
      const oldTask = tasks.tasks.find((task) => task.taskNo === taskId);

      // 작업 내역 기록
      const workHistoryData = {
        prjNo: project.currentProject?.prjNo,
        userId: auth.user?.userId,
        workDate: new Date().toISOString(),
        workTable: WORK_TABLES.TASK,
        workTarget: taskId,
      };

      // 상태 변경 확인
      if (oldTask && oldTask.taskStatus !== updatedTask.taskStatus) {
        dispatch(
          createWorkHistory({
            ...workHistoryData,
            workType: WORK_TYPES.STATUS_CHANGE,
            workContent: generateWorkContent(
              WORK_TYPES.STATUS_CHANGE,
              WORK_TABLES.TASK,
              updatedTask.taskName,
              {
                oldValue: oldTask.taskStatus,
                newValue: updatedTask.taskStatus,
              }
            ),
          })
        );
      }

      // 진척도 변경 확인
      if (oldTask && oldTask.progressRate !== updatedTask.progressRate) {
        dispatch(
          createWorkHistory({
            ...workHistoryData,
            workType: WORK_TYPES.PROGRESS_UPDATE,
            workContent: generateWorkContent(
              WORK_TYPES.PROGRESS_UPDATE,
              WORK_TABLES.TASK,
              updatedTask.taskName,
              {
                oldValue: oldTask.progressRate,
                newValue: updatedTask.progressRate,
              }
            ),
          })
        );
      }

      // 담당자 변경 확인
      if (oldTask && oldTask.userId !== updatedTask.userId) {
        const assigneeName = updatedTask.prjMem?.userName || '미지정';
        dispatch(
          createWorkHistory({
            ...workHistoryData,
            workType: WORK_TYPES.ASSIGN,
            workContent: generateWorkContent(
              WORK_TYPES.ASSIGN,
              WORK_TABLES.TASK,
              updatedTask.taskName,
              {
                assigneeName: updatedTask.userId ? assigneeName : null,
              }
            ),
          })
        );
      }

      // 일반 수정 기록 (상태, 진척도, 담당자 변경이 아닌 경우)
      if (
        !oldTask ||
        (oldTask.taskStatus === updatedTask.taskStatus &&
          oldTask.progressRate === updatedTask.progressRate &&
          oldTask.userId === updatedTask.userId)
      ) {
        dispatch(
          createWorkHistory({
            ...workHistoryData,
            workType: WORK_TYPES.UPDATE,
            workContent: generateWorkContent(
              WORK_TYPES.UPDATE,
              WORK_TABLES.TASK,
              updatedTask.taskName
            ),
          })
        );
      }

      return updatedTask;
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
  async (taskId, { dispatch, getState, rejectWithValue }) => {
    try {
      // taskId가 undefined인지 확인
      if (!taskId || taskId === 'undefined') {
        throw new Error('작업 ID가 유효하지 않습니다.');
      }

      const { tasks, auth, project } = getState();
      const taskToDelete = tasks.tasks.find((task) => task.taskNo === taskId);

      await taskAPI.deleteTask(taskId);

      // 작업 내역 기록
      if (taskToDelete) {
        const workHistoryData = {
          prjNo: project.currentProject?.prjNo,
          userId: auth.user?.userId,
          workDate: new Date().toISOString(),
          workTable: WORK_TABLES.TASK,
          workType: WORK_TYPES.DELETE,
          workTarget: taskId,
          workContent: generateWorkContent(
            WORK_TYPES.DELETE,
            WORK_TABLES.TASK,
            taskToDelete.taskName
          ),
        };

        dispatch(createWorkHistory(workHistoryData));
      }

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
