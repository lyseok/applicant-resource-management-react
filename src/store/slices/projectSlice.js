import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '@/services/api';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  projectLoading: false,
  error: null,
};

export const fetchUserProjectsAsync = createAsyncThunk(
  'project/fetchUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getUserProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProjectAsync = createAsyncThunk(
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

export const createProjectAsync = createAsyncThunk(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectAPI.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProjectAsync = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateProject(projectId, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  'project/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await projectAPI.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleProjectFavoriteAsync = createAsyncThunk(
  'project/toggleFavorite',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await projectAPI.toggleFavorite(projectId);
      return { projectId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addProjectMemberAsync = createAsyncThunk(
  'project/addMember',
  async ({ projectId, memberData }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.addProjectMember(projectId, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMemberRoleAsync = createAsyncThunk(
  'project/updateMemberRole',
  async ({ projectId, memberId, role }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateMemberRole(projectId, memberId, {
        authorityCode: role,
      });
      return { memberId, role: response.data.authorityCode };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeProjectMemberAsync = createAsyncThunk(
  'project/removeMember',
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      await projectAPI.removeProjectMember(projectId, memberId);
      return memberId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProjectDetailsAsync = createAsyncThunk(
  'project/updateProjectDetails',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateProject(projectId, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProjectVisibleTabsAsync = createAsyncThunk(
  'project/updateVisibleTabs',
  async ({ projectId, visibleTabs }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateProject(projectId, {
        visibleTabs,
      });
      return { projectId, visibleTabs };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateChatroomNameAsync = createAsyncThunk(
  'project/updateChatroomName',
  async ({ projectId, chatroomName }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.updateProject(projectId, {
        chatroomName,
      });
      return { projectId, chatroomName };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 사용자 프로젝트 목록 조회
      .addCase(fetchUserProjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchUserProjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 프로젝트 상세 조회
      .addCase(fetchProjectAsync.pending, (state) => {
        state.projectLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectAsync.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectAsync.rejected, (state, action) => {
        state.projectLoading = false;
        state.error = action.payload;
      })

      // 프로젝트 생성
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })

      // 프로젝트 수정
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.prjNo === action.payload.prjNo
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.prjNo === action.payload.prjNo) {
          state.currentProject = action.payload;
        }
      })

      // 프로젝트 삭제
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (p) => p.prjNo !== action.payload
        );
        if (state.currentProject?.prjNo === action.payload) {
          state.currentProject = null;
        }
      })

      // 즐겨찾기 토글
      .addCase(toggleProjectFavoriteAsync.fulfilled, (state, action) => {
        const { projectId, isFavorite } = action.payload;
        const project = state.projects.find((p) => p.prjNo === projectId);
        if (project) {
          project.isFavorite = isFavorite;
        }
        if (state.currentProject?.prjNo === projectId) {
          state.currentProject.isFavorite = isFavorite;
        }
      })

      // 멤버 추가
      .addCase(addProjectMemberAsync.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject.members = state.currentProject.members || [];
          state.currentProject.members.push(action.payload);
        }
      })

      // 멤버 역할 변경
      .addCase(updateMemberRoleAsync.fulfilled, (state, action) => {
        const { memberId, role } = action.payload;
        if (state.currentProject?.members) {
          const memberIndex = state.currentProject.members.findIndex(
            (m) => m.userId === memberId
          );
          if (memberIndex !== -1) {
            state.currentProject.members[memberIndex].authorityCode = role;
          }
        }
      })

      // 멤버 제거
      .addCase(removeProjectMemberAsync.fulfilled, (state, action) => {
        const memberId = action.payload;
        if (state.currentProject?.members) {
          state.currentProject.members = state.currentProject.members.filter(
            (m) => m.userId !== memberId
          );
        }
      })

      // 프로젝트 상세 정보 업데이트
      .addCase(updateProjectDetailsAsync.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const index = state.projects.findIndex(
          (p) => p.prjNo === updatedProject.prjNo
        );
        if (index !== -1) {
          state.projects[index] = {
            ...state.projects[index],
            ...updatedProject,
          };
        }
        if (state.currentProject?.prjNo === updatedProject.prjNo) {
          state.currentProject = { ...state.currentProject, ...updatedProject };
        }
      })

      // 가시 탭 업데이트
      .addCase(updateProjectVisibleTabsAsync.fulfilled, (state, action) => {
        const { projectId, visibleTabs } = action.payload;
        const project = state.projects.find((p) => p.prjNo === projectId);
        if (project) {
          project.visibleTabs = visibleTabs;
        }
        if (state.currentProject?.prjNo === projectId) {
          state.currentProject.visibleTabs = visibleTabs;
        }
      })

      // 채팅방 이름 업데이트
      .addCase(updateChatroomNameAsync.fulfilled, (state, action) => {
        const { projectId, chatroomName } = action.payload;
        const project = state.projects.find((p) => p.prjNo === projectId);
        if (project) {
          project.chatroomName = chatroomName;
        }
        if (state.currentProject?.prjNo === projectId) {
          state.currentProject.chatroomName = chatroomName;
        }
      });
  },
});

export const { clearError, setCurrentProject } = projectSlice.actions;

// 별칭 exports 추가
export const createProject = createProjectAsync;
export const updateProject = updateProjectAsync;
export const deleteProject = deleteProjectAsync;
export const fetchProject = fetchProjectAsync;
export const fetchProjects = fetchUserProjectsAsync;
export const fetchUserProjects = fetchUserProjectsAsync;
export const toggleProjectFavorite = toggleProjectFavoriteAsync;
export const addProjectMember = addProjectMemberAsync;
export const updateMemberRole = updateMemberRoleAsync;
export const removeProjectMember = removeProjectMemberAsync;
export const updateProjectDetails = updateProjectDetailsAsync;
export const updateProjectVisibleTabs = updateProjectVisibleTabsAsync;
export const updateChatroomName = updateChatroomNameAsync;

export default projectSlice.reducer;
