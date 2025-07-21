import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './slices/taskSlice';
import projectSlice from './slices/projectSlice';
import boardSlice from './slices/boardSlice';
import chatSlice from './slices/chatSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    project: projectSlice,
    board: boardSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
