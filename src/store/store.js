import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './slices/taskSlice';
import projectSlice from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
    project: projectSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
