import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import boardReducer from './slices/boardSlice';
import chatReducer from './slices/chatSlice';
import workHistoryReducer from './slices/workHistorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    tasks: taskReducer,
    board: boardReducer,
    chat: chatReducer,
    workHistory: workHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
