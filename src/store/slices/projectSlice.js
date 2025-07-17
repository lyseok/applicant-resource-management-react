import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '../api/projectAPI';

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getProject(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateProject(id, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentProject: {
    prjNo: 'PRJ001',
    name: '띹장터 프로젝트 개발',
    description: '',
    status: '대기 중',
    owner: { name: '미뮨석', role: '프로젝트 소유자' },
    members: [],
    goals: [],
    portfolios: [],
  },
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateProjectDescription: (state, action) => {
      state.currentProject.description = action.payload;
    },
    addProjectMember: (state, action) => {
      state.currentProject.members.push(action.payload);
    },
    removeProjectMember: (state, action) => {
      state.currentProject.members = state.currentProject.members.filter(
        (member) => member.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.currentProject = { ...state.currentProject, ...action.payload };
      });
  },
});

export const {
  updateProjectDescription,
  addProjectMember,
  removeProjectMember,
} = projectSlice.actions;
export default projectSlice.reducer;
