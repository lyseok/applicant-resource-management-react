// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { taskAPI } from '../api/taskAPI';

// // 비동기 액션들
// export const fetchTasks = createAsyncThunk(
//   'tasks/fetchTasks',
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await taskAPI.getTasks(projectId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const createTask = createAsyncThunk(
//   'tasks/createTask',
//   async (taskData, { rejectWithValue }) => {
//     try {
//       const response = await taskAPI.createTask(taskData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const updateTask = createAsyncThunk(
//   'tasks/updateTask',
//   async ({ id, taskData }, { rejectWithValue }) => {
//     try {
//       const response = await taskAPI.updateTask(id, taskData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const deleteTask = createAsyncThunk(
//   'tasks/deleteTask',
//   async (taskId, { rejectWithValue }) => {
//     try {
//       await taskAPI.deleteTask(taskId);
//       return taskId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   tasks: [
//     {
//       taskNo: 'TASK001',
//       prjNo: 'PRJ001',
//       userId: 'USER002', // 이윤석
//       sectNo: 'SECT001',
//       creatorId: 'USER001',
//       taskName: '프로젝트 요구사항 정의서 작성',
//       taskStatus: 'TODO',
//       detailContent: '프로젝트의 전체적인 요구사항 파악 및 문서화 작업입니다.',
//       startDate: '20240715',
//       dueDate: '20240718',
//       priorityCode: 'HIGH',
//       upperTaskNo: null,
//       progressRate: '0',
//       deleteDate: null,
//       deleteUserId: null,
//     },
//     {
//       taskNo: 'TASK002',
//       prjNo: 'PRJ001',
//       userId: 'USER003', // 이예솔
//       sectNo: 'SECT001',
//       creatorId: 'USER001',
//       taskName: 'ERD 설계 및 테이블 구조 정의',
//       taskStatus: 'IN_PROGRESS',
//       detailContent:
//         '프로젝트의 데이터베이스 구조를 설계하고 ERD를 작성하는 작업입니다.',
//       startDate: '20240717',
//       dueDate: '20240721',
//       priorityCode: 'MEDIUM',
//       upperTaskNo: 'TASK001',
//       progressRate: '30',
//       deleteDate: null,
//       deleteUserId: null,
//     },
//     {
//       taskNo: 'TASK003',
//       prjNo: 'PRJ001',
//       userId: 'USER001', // 미뮨석
//       sectNo: 'SECT001',
//       creatorId: 'USER001',
//       taskName: '팀원과 타임라인 공유하기',
//       taskStatus: 'COMPLETED',
//       detailContent: '프로젝트 타임라인을 팀원들과 공유하는 작업입니다.',
//       startDate: '20240719',
//       dueDate: '20240722',
//       priorityCode: 'LOW',
//       upperTaskNo: 'TASK002',
//       progressRate: '100',
//       deleteDate: null,
//       deleteUserId: null,
//     },
//   ],
//   loading: false,
//   error: null,
//   statistics: {
//     total: 3,
//     completed: 1,
//     incomplete: 2,
//     overdue: 0,
//   },
//   // UI 상태
//   isTaskPanelOpen: false,
//   selectedTask: null,
// };

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     openTaskPanel: (state, action) => {
//       state.selectedTask = action.payload;
//       state.isTaskPanelOpen = true;
//     },
//     closeTaskPanel: (state) => {
//       state.isTaskPanelOpen = false;
//       state.selectedTask = null;
//     },
//     updateTaskStatus: (state, action) => {
//       const { taskNo, status } = action.payload;
//       const task = state.tasks.find((task) => task.taskNo === taskNo);
//       if (task) {
//         task.taskStatus = status;
//         task.progressRate = status === 'COMPLETED' ? '100' : task.progressRate;
//       }
//       // 통계 업데이트
//       state.statistics = calculateStatistics(state.tasks);
//     },
//     // 실시간 상태 동기화를 위한 액션
//     syncTaskUpdate: (state, action) => {
//       const updatedTask = action.payload;
//       const index = state.tasks.findIndex(
//         (task) => task.taskNo === updatedTask.taskNo
//       );
//       if (index !== -1) {
//         state.tasks[index] = updatedTask;
//         state.statistics = calculateStatistics(state.tasks);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchTasks
//       .addCase(fetchTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks = action.payload;
//         state.statistics = calculateStatistics(action.payload);
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // createTask
//       .addCase(createTask.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createTask.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks.push(action.payload);
//         state.statistics = calculateStatistics(state.tasks);
//         state.isTaskPanelOpen = false;
//         state.selectedTask = null;
//       })
//       .addCase(createTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // updateTask
//       .addCase(updateTask.fulfilled, (state, action) => {
//         const index = state.tasks.findIndex(
//           (task) => task.taskNo === action.payload.taskNo
//         );
//         if (index !== -1) {
//           state.tasks[index] = action.payload;
//         }
//         state.statistics = calculateStatistics(state.tasks);

//         // 현재 선택된 작업이 업데이트된 작업이면 패널의 데이터도 업데이트
//         if (
//           state.selectedTask &&
//           state.selectedTask.taskNo === action.payload.taskNo
//         ) {
//           state.selectedTask = action.payload;
//         }
//       })
//       // deleteTask
//       .addCase(deleteTask.fulfilled, (state, action) => {
//         state.tasks = state.tasks.filter(
//           (task) => task.taskNo !== action.payload
//         );
//         state.statistics = calculateStatistics(state.tasks);

//         // 삭제된 작업이 현재 선택된 작업이면 패널 닫기
//         if (
//           state.selectedTask &&
//           state.selectedTask.taskNo === action.payload
//         ) {
//           state.isTaskPanelOpen = false;
//           state.selectedTask = null;
//         }
//       });
//   },
// });

// // 통계 계산 함수
// const calculateStatistics = (tasks) => {
//   const total = tasks.length;
//   const completed = tasks.filter(
//     (task) => task.taskStatus === 'COMPLETED'
//   ).length;
//   const incomplete = tasks.filter(
//     (task) => task.taskStatus !== 'COMPLETED'
//   ).length;
//   const overdue = tasks.filter((task) => {
//     if (!task.dueDate || task.taskStatus === 'COMPLETED') return false;
//     const dueDate = new Date(
//       task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
//     );
//     const today = new Date();
//     return dueDate < today;
//   }).length;

//   return { total, completed, incomplete, overdue };
// };

// export const {
//   clearError,
//   openTaskPanel,
//   closeTaskPanel,
//   updateTaskStatus,
//   syncTaskUpdate,
// } = taskSlice.actions;

// export default taskSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { dummyTasks, dummyWorkHistory } from '@/data/dummyData';

const calculateStatistics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.taskStatus === 'COMPLETED'
  ).length;
  const incomplete = tasks.filter(
    (task) => task.taskStatus !== 'COMPLETED'
  ).length;
  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.taskStatus === 'COMPLETED') return false;
    const dueDate = new Date(
      task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );
    const today = new Date();
    return dueDate < today;
  }).length;

  return { total, completed, incomplete, overdue };
};

const initialState = {
  tasks: [...dummyTasks], // 배열 복사로 불변성 보장
  workHistory: [...dummyWorkHistory],
  loading: false,
  error: null,
  statistics: calculateStatistics(dummyTasks),
  // UI 상태
  isTaskPanelOpen: false,
  selectedTask: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // 작업 목록 설정
    setTasks: (state, action) => {
      const projectId = action.payload;
      state.tasks = dummyTasks.filter((task) => task.prjNo === projectId);
      state.statistics = calculateStatistics(state.tasks);
      state.loading = false;
    },

    // 로딩 상태 설정
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },

    // 작업 패널 열기
    openTaskPanel: (state, action) => {
      state.selectedTask = action.payload;
      state.isTaskPanelOpen = true;
    },

    // 작업 패널 닫기
    closeTaskPanel: (state) => {
      state.isTaskPanelOpen = false;
      state.selectedTask = null;
    },

    // 새 작업 생성
    createTask: (state, action) => {
      const newTask = {
        ...action.payload,
        taskNo: `TASK${String(Date.now()).slice(-3).padStart(3, '0')}`,
        createDate: new Date().toISOString().split('T')[0],
      };

      // 더미 데이터에도 추가 (새 배열로 교체)
      const updatedDummyTasks = [...dummyTasks, newTask];
      dummyTasks.length = 0;
      dummyTasks.push(...updatedDummyTasks);

      // 상태 업데이트
      state.tasks = [...state.tasks, newTask];
      state.statistics = calculateStatistics(state.tasks);
      state.isTaskPanelOpen = false;
      state.selectedTask = null;

      // 작업 내역 추가
      const workHistory = {
        workHistNo: `WORK${String(Date.now()).slice(-3).padStart(3, '0')}`,
        prjNo: newTask.prjNo,
        userId: newTask.creatorId,
        workDate: new Date().toISOString().split('T')[0],
        workTable: 'PRJ_TASK',
        workType: 'CREATE',
        workTarget: newTask.taskNo,
        workContent: `새로운 작업 '${newTask.taskName}' 생성`,
        createDate: new Date().toISOString(),
      };

      const updatedWorkHistory = [...dummyWorkHistory, workHistory];
      dummyWorkHistory.length = 0;
      dummyWorkHistory.push(...updatedWorkHistory);

      state.workHistory = [...state.workHistory, workHistory];
    },

    // 작업 업데이트
    updateTask: (state, action) => {
      const { id, taskData } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.taskNo === id);
      const dummyTaskIndex = dummyTasks.findIndex((task) => task.taskNo === id);

      if (taskIndex !== -1) {
        const oldTask = { ...state.tasks[taskIndex] };

        // 새 배열 생성하여 불변성 보장
        const updatedTasks = [...state.tasks];
        updatedTasks[taskIndex] = { ...taskData };
        state.tasks = updatedTasks;

        // 더미 데이터도 업데이트
        if (dummyTaskIndex !== -1) {
          dummyTasks[dummyTaskIndex] = { ...taskData };
        }

        state.statistics = calculateStatistics(state.tasks);

        // 현재 선택된 작업이 업데이트된 작업이면 패널의 데이터도 업데이트
        if (state.selectedTask && state.selectedTask.taskNo === id) {
          state.selectedTask = { ...taskData };
        }

        // 작업 내역 추가
        let changeDescription = '';
        if (oldTask.taskStatus !== taskData.taskStatus) {
          changeDescription += `작업 상태를 ${oldTask.taskStatus}에서 ${taskData.taskStatus}로 변경`;
        }
        if (oldTask.progressRate !== taskData.progressRate) {
          if (changeDescription) changeDescription += ', ';
          changeDescription += `진행률을 ${oldTask.progressRate}%에서 ${taskData.progressRate}%로 업데이트`;
        }
        if (oldTask.taskName !== taskData.taskName) {
          if (changeDescription) changeDescription += ', ';
          changeDescription += `작업명을 '${oldTask.taskName}'에서 '${taskData.taskName}'로 변경`;
        }

        if (changeDescription) {
          const workHistory = {
            workHistNo: `WORK${String(Date.now()).slice(-3).padStart(3, '0')}`,
            prjNo: taskData.prjNo,
            userId: taskData.userId || 'USER001',
            workDate: new Date().toISOString().split('T')[0],
            workTable: 'PRJ_TASK',
            workType: 'UPDATE',
            workTarget: taskData.taskNo,
            workContent: changeDescription,
            createDate: new Date().toISOString(),
          };

          const updatedWorkHistory = [...dummyWorkHistory, workHistory];
          dummyWorkHistory.length = 0;
          dummyWorkHistory.push(...updatedWorkHistory);

          state.workHistory = [...state.workHistory, workHistory];
        }
      }
    },

    // 작업 삭제
    deleteTask: (state, action) => {
      const taskId = action.payload;
      const task = state.tasks.find((t) => t.taskNo === taskId);

      // 새 배열 생성하여 불변성 보장
      state.tasks = state.tasks.filter((task) => task.taskNo !== taskId);

      // 더미 데이터에서도 제거
      const dummyTaskIndex = dummyTasks.findIndex(
        (task) => task.taskNo === taskId
      );
      if (dummyTaskIndex !== -1) {
        dummyTasks.splice(dummyTaskIndex, 1);
      }

      state.statistics = calculateStatistics(state.tasks);

      // 삭제된 작업이 현재 선택된 작업이면 패널 닫기
      if (state.selectedTask && state.selectedTask.taskNo === taskId) {
        state.isTaskPanelOpen = false;
        state.selectedTask = null;
      }

      // 작업 내역 추가
      if (task) {
        const workHistory = {
          workHistNo: `WORK${String(Date.now()).slice(-3).padStart(3, '0')}`,
          prjNo: task.prjNo,
          userId: 'USER001',
          workDate: new Date().toISOString().split('T')[0],
          workTable: 'PRJ_TASK',
          workType: 'DELETE',
          workTarget: task.taskNo,
          workContent: `작업 '${task.taskName}' 삭제`,
          createDate: new Date().toISOString(),
        };

        const updatedWorkHistory = [...dummyWorkHistory, workHistory];
        dummyWorkHistory.length = 0;
        dummyWorkHistory.push(...updatedWorkHistory);

        state.workHistory = [...state.workHistory, workHistory];
      }
    },

    // 작업 상태 변경
    updateTaskStatus: (state, action) => {
      const { taskNo, status } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.taskNo === taskNo);
      const dummyTaskIndex = dummyTasks.findIndex(
        (task) => task.taskNo === taskNo
      );

      if (taskIndex !== -1) {
        const oldStatus = state.tasks[taskIndex].taskStatus;

        // 새 배열 생성하여 불변성 보장
        const updatedTasks = [...state.tasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          taskStatus: status,
          progressRate:
            status === 'COMPLETED'
              ? '100'
              : updatedTasks[taskIndex].progressRate,
        };
        state.tasks = updatedTasks;

        if (dummyTaskIndex !== -1) {
          dummyTasks[dummyTaskIndex] = {
            ...dummyTasks[dummyTaskIndex],
            taskStatus: status,
            progressRate:
              status === 'COMPLETED'
                ? '100'
                : dummyTasks[dummyTaskIndex].progressRate,
          };
        }

        state.statistics = calculateStatistics(state.tasks);

        // 작업 내역 추가
        const workHistory = {
          workHistNo: `WORK${String(Date.now()).slice(-3).padStart(3, '0')}`,
          prjNo: updatedTasks[taskIndex].prjNo,
          userId: updatedTasks[taskIndex].userId || 'USER001',
          workDate: new Date().toISOString().split('T')[0],
          workTable: 'PRJ_TASK',
          workType: 'UPDATE',
          workTarget: updatedTasks[taskIndex].taskNo,
          workContent: `작업 상태를 ${oldStatus}에서 ${status}로 변경`,
          createDate: new Date().toISOString(),
        };

        const updatedWorkHistory = [...dummyWorkHistory, workHistory];
        dummyWorkHistory.length = 0;
        dummyWorkHistory.push(...updatedWorkHistory);

        state.workHistory = [...state.workHistory, workHistory];
      }
    },

    // 작업 내역 설정
    setWorkHistory: (state, action) => {
      const projectId = action.payload;
      state.workHistory = dummyWorkHistory.filter(
        (history) => history.prjNo === projectId
      );
    },

    // 실시간 상태 동기화를 위한 액션
    syncTaskUpdate: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(
        (task) => task.taskNo === updatedTask.taskNo
      );
      if (index !== -1) {
        const updatedTasks = [...state.tasks];
        updatedTasks[index] = updatedTask;
        state.tasks = updatedTasks;
        state.statistics = calculateStatistics(state.tasks);
      }
    },
  },
});

// 비동기 액션 시뮬레이션
export const fetchTasks = (projectId) => (dispatch) => {
  dispatch(setLoading(true));
  // 실제 API 호출 시뮬레이션
  setTimeout(() => {
    dispatch(setTasks(projectId));
    dispatch(setWorkHistory(projectId));
  }, 300);
};

export const {
  setTasks,
  setLoading,
  clearError,
  openTaskPanel,
  closeTaskPanel,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  setWorkHistory,
  syncTaskUpdate,
} = taskSlice.actions;

export default taskSlice.reducer;
