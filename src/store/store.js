import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './slices/taskSlice';
import projectSlice from './slices/projectSlice';
import boardSlice from './slices/boardSlice'; // Import boardSlice

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
    project: projectSlice,
    board: boardSlice, // Add boardSlice to the reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
