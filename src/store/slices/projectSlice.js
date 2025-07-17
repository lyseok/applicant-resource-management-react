// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { projectAPI } from '../api/projectAPI';

// // 비동기 액션들
// export const fetchProjects = createAsyncThunk(
//   'project/fetchProjects',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.getProjects();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchProject = createAsyncThunk(
//   'project/fetchProject',
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.getProject(projectId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const createProject = createAsyncThunk(
//   'project/createProject',
//   async (projectData, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.createProject(projectData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const updateProject = createAsyncThunk(
//   'project/updateProject',
//   async ({ id, projectData }, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.updateProject(id, projectData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const addProjectMember = createAsyncThunk(
//   'project/addProjectMember',
//   async ({ projectId, memberData }, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.addProjectMember(projectId, memberData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const updateMemberRole = createAsyncThunk(
//   'project/updateMemberRole',
//   async ({ projectId, memberId, role }, { rejectWithValue }) => {
//     try {
//       const response = await projectAPI.updateMemberRole(
//         projectId,
//         memberId,
//         role
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const removeProjectMember = createAsyncThunk(
//   'project/removeProjectMember',
//   async ({ projectId, memberId }, { rejectWithValue }) => {
//     try {
//       await projectAPI.removeProjectMember(projectId, memberId);
//       return memberId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   projects: [
//     {
//       prjNo: 'PRJ001',
//       name: '띹장터 프로젝트 개발',
//       description: '온라인 쇼핑몰 플랫폼 개발 프로젝트',
//       status: '진행 중',
//       isFavorite: true,
//       createdAt: '2024-07-01',
//       owner: {
//         id: 'USER001',
//         name: '미뮨석',
//         email: 'admin@example.com',
//         role: 'OWNER',
//       },
//       members: [
//         {
//           id: 'USER001',
//           name: '미뮨석',
//           email: 'admin@example.com',
//           role: 'OWNER',
//           joinedAt: '2024-07-01',
//         },
//         {
//           id: 'USER002',
//           name: '이윤석',
//           email: 'seok000908@gmail.com',
//           role: 'ADMIN',
//           joinedAt: '2024-07-02',
//         },
//         {
//           id: 'USER003',
//           name: '이예솔',
//           email: 'dpfh9596@gmail.com',
//           role: 'MEMBER',
//           joinedAt: '2024-07-03',
//         },
//       ],
//     },
//     {
//       prjNo: 'PRJ002',
//       name: 'PMS 시스템 개발',
//       description: '프로젝트 관리 시스템 개발',
//       status: '계획 중',
//       isFavorite: false,
//       createdAt: '2024-07-10',
//       owner: {
//         id: 'USER001',
//         name: '미뮨석',
//         email: 'admin@example.com',
//         role: 'OWNER',
//       },
//       members: [
//         {
//           id: 'USER001',
//           name: '미뮨석',
//           email: 'admin@example.com',
//           role: 'OWNER',
//           joinedAt: '2024-07-10',
//         },
//       ],
//     },
//   ],
//   currentProject: null,
//   loading: false,
//   error: null,
// };

// const projectSlice = createSlice({
//   name: 'project',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     toggleProjectFavorite: (state, action) => {
//       const projectId = action.payload;
//       const project = state.projects.find((p) => p.prjNo === projectId);
//       if (project) {
//         project.isFavorite = !project.isFavorite;
//       }
//       if (state.currentProject && state.currentProject.prjNo === projectId) {
//         state.currentProject.isFavorite = !state.currentProject.isFavorite;
//       }
//     },
//     updateProjectDescription: (state, action) => {
//       if (state.currentProject) {
//         state.currentProject.description = action.payload;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchProjects
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = action.payload;
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // fetchProject
//       .addCase(fetchProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProject = action.payload;
//       })
//       .addCase(fetchProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.currentProject = null;
//       })
//       // createProject
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.projects.push(action.payload);
//       })
//       // updateProject
//       .addCase(updateProject.fulfilled, (state, action) => {
//         const index = state.projects.findIndex(
//           (p) => p.prjNo === action.payload.prjNo
//         );
//         if (index !== -1) {
//           state.projects[index] = action.payload;
//         }
//         if (
//           state.currentProject &&
//           state.currentProject.prjNo === action.payload.prjNo
//         ) {
//           state.currentProject = action.payload;
//         }
//       })
//       // addProjectMember
//       .addCase(addProjectMember.fulfilled, (state, action) => {
//         if (state.currentProject) {
//           state.currentProject.members.push(action.payload);
//         }
//       })
//       // updateMemberRole
//       .addCase(updateMemberRole.fulfilled, (state, action) => {
//         if (state.currentProject) {
//           const member = state.currentProject.members.find(
//             (m) => m.id === action.payload.id
//           );
//           if (member) {
//             member.role = action.payload.role;
//           }
//         }
//       })
//       // removeProjectMember
//       .addCase(removeProjectMember.fulfilled, (state, action) => {
//         if (state.currentProject) {
//           state.currentProject.members = state.currentProject.members.filter(
//             (m) => m.id !== action.payload
//           );
//         }
//       });
//   },
// });

// export const { clearError, toggleProjectFavorite, updateProjectDescription } =
//   projectSlice.actions;

// export default projectSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { dummyProjects, dummyUsers } from '@/data/dummyData';

const initialState = {
  projects: [...dummyProjects], // 배열 복사로 불변성 보장
  currentProject: dummyProjects[0] || null, // 기본값으로 첫 번째 프로젝트 설정
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // 프로젝트 목록 설정
    setProjects: (state, action) => {
      state.projects = [...action.payload];
      state.loading = false;
    },

    // 현재 프로젝트 설정
    setCurrentProject: (state, action) => {
      const projectId = action.payload;
      state.currentProject =
        state.projects.find((p) => p.prjNo === projectId) || null;
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

    // 프로젝트 즐겨찾기 토글
    toggleProjectFavorite: (state, action) => {
      const projectId = action.payload;

      // projects 배열 업데이트
      const updatedProjects = state.projects.map((project) =>
        project.prjNo === projectId
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      );
      state.projects = updatedProjects;

      // currentProject 업데이트
      if (state.currentProject && state.currentProject.prjNo === projectId) {
        state.currentProject = {
          ...state.currentProject,
          isFavorite: !state.currentProject.isFavorite,
        };
      }

      // 더미 데이터도 업데이트
      const dummyProject = dummyProjects.find((p) => p.prjNo === projectId);
      if (dummyProject) {
        dummyProject.isFavorite = !dummyProject.isFavorite;
      }
    },

    // 새 프로젝트 생성
    createProject: (state, action) => {
      const newProject = {
        prjNo: `PRJ${String(state.projects.length + 1).padStart(3, '0')}`,
        projectName: action.payload.name,
        projectBoardNo: `BOARD${String(state.projects.length + 1).padStart(
          3,
          '0'
        )}`,
        projectContents: action.payload.description || '',
        projectStatus: action.payload.status || '계획중',
        createDate: new Date().toISOString().split('T')[0],
        finishDate: null,
        deleteDate: null,
        isFavorite: action.payload.isFavorite || false,
        projectColor: action.payload.color || '#3B82F6',
        members: [
          {
            userId: 'USER001', // 현재 사용자
            userName: '김미문',
            userEmail: 'mimon@ddit.co.kr',
            authorityCode: 'OWNER',
            authorityName: '프로젝트 소유자',
            joinDate: new Date().toISOString().split('T')[0],
          },
        ],
      };

      state.projects = [...state.projects, newProject];

      // 더미 데이터에도 추가
      dummyProjects.push(newProject);
    },

    // 프로젝트 멤버 추가
    addProjectMember: (state, action) => {
      const { projectId, memberData } = action.payload;
      const projectIndex = state.projects.findIndex(
        (p) => p.prjNo === projectId
      );

      if (projectIndex !== -1) {
        const user = dummyUsers.find((u) => u.userEmail === memberData.email);
        if (user) {
          const newMember = {
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
            authorityCode: memberData.role,
            authorityName:
              memberData.role === 'ADMIN'
                ? '관리자'
                : memberData.role === 'MEMBER'
                ? '멤버'
                : '뷰어',
            joinDate: new Date().toISOString().split('T')[0],
          };

          // 불변성을 지키며 업데이트
          const updatedProjects = [...state.projects];
          updatedProjects[projectIndex] = {
            ...updatedProjects[projectIndex],
            members: [...updatedProjects[projectIndex].members, newMember],
          };
          state.projects = updatedProjects;

          // 현재 프로젝트도 업데이트
          if (
            state.currentProject &&
            state.currentProject.prjNo === projectId
          ) {
            state.currentProject = {
              ...state.currentProject,
              members: [...state.currentProject.members, newMember],
            };
          }

          // 더미 데이터도 업데이트
          const dummyProject = dummyProjects.find((p) => p.prjNo === projectId);
          if (dummyProject) {
            dummyProject.members.push(newMember);
          }
        }
      }
    },

    // 멤버 역할 변경
    updateMemberRole: (state, action) => {
      const { projectId, memberId, role } = action.payload;
      const projectIndex = state.projects.findIndex(
        (p) => p.prjNo === projectId
      );

      if (projectIndex !== -1) {
        const memberIndex = state.projects[projectIndex].members.findIndex(
          (m) => m.userId === memberId
        );
        if (memberIndex !== -1) {
          const updatedProjects = [...state.projects];
          const updatedMembers = [...updatedProjects[projectIndex].members];
          updatedMembers[memberIndex] = {
            ...updatedMembers[memberIndex],
            authorityCode: role,
            authorityName:
              role === 'ADMIN' ? '관리자' : role === 'MEMBER' ? '멤버' : '뷰어',
          };
          updatedProjects[projectIndex] = {
            ...updatedProjects[projectIndex],
            members: updatedMembers,
          };
          state.projects = updatedProjects;

          // 현재 프로젝트도 업데이트
          if (
            state.currentProject &&
            state.currentProject.prjNo === projectId
          ) {
            const currentMemberIndex = state.currentProject.members.findIndex(
              (m) => m.userId === memberId
            );
            if (currentMemberIndex !== -1) {
              const updatedCurrentMembers = [...state.currentProject.members];
              updatedCurrentMembers[currentMemberIndex] = {
                ...updatedCurrentMembers[currentMemberIndex],
                authorityCode: role,
                authorityName:
                  role === 'ADMIN'
                    ? '관리자'
                    : role === 'MEMBER'
                    ? '멤버'
                    : '뷰어',
              };
              state.currentProject = {
                ...state.currentProject,
                members: updatedCurrentMembers,
              };
            }
          }

          // 더미 데이터도 업데이트
          const dummyProject = dummyProjects.find((p) => p.prjNo === projectId);
          if (dummyProject) {
            const dummyMember = dummyProject.members.find(
              (m) => m.userId === memberId
            );
            if (dummyMember) {
              dummyMember.authorityCode = role;
              dummyMember.authorityName =
                role === 'ADMIN'
                  ? '관리자'
                  : role === 'MEMBER'
                  ? '멤버'
                  : '뷰어';
            }
          }
        }
      }
    },

    // 프로젝트 멤버 제거
    removeProjectMember: (state, action) => {
      const { projectId, memberId } = action.payload;
      const projectIndex = state.projects.findIndex(
        (p) => p.prjNo === projectId
      );

      if (projectIndex !== -1) {
        const updatedProjects = [...state.projects];
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          members: updatedProjects[projectIndex].members.filter(
            (m) => m.userId !== memberId
          ),
        };
        state.projects = updatedProjects;

        // 현재 프로젝트도 업데이트
        if (state.currentProject && state.currentProject.prjNo === projectId) {
          state.currentProject = {
            ...state.currentProject,
            members: state.currentProject.members.filter(
              (m) => m.userId !== memberId
            ),
          };
        }

        // 더미 데이터도 업데이트
        const dummyProject = dummyProjects.find((p) => p.prjNo === projectId);
        if (dummyProject) {
          const memberIndex = dummyProject.members.findIndex(
            (m) => m.userId === memberId
          );
          if (memberIndex !== -1) {
            dummyProject.members.splice(memberIndex, 1);
          }
        }
      }
    },

    // 프로젝트 설명 업데이트
    updateProjectDescription: (state, action) => {
      const { projectId, description } = action.payload;
      const projectIndex = state.projects.findIndex(
        (p) => p.prjNo === projectId
      );

      if (projectIndex !== -1) {
        const updatedProjects = [...state.projects];
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          projectContents: description,
        };
        state.projects = updatedProjects;
      }

      if (state.currentProject && state.currentProject.prjNo === projectId) {
        state.currentProject = {
          ...state.currentProject,
          projectContents: description,
        };
      }

      // 더미 데이터도 업데이트
      const dummyProject = dummyProjects.find((p) => p.prjNo === projectId);
      if (dummyProject) {
        dummyProject.projectContents = description;
      }
    },
  },
});

// 비동기 액션 시뮬레이션
export const fetchProjects = () => (dispatch) => {
  dispatch(setLoading(true));
  // 실제 API 호출 시뮬레이션
  setTimeout(() => {
    dispatch(setProjects(dummyProjects));
  }, 500);
};

export const fetchProject = (projectId) => (dispatch) => {
  dispatch(setLoading(true));
  // 실제 API 호출 시뮬레이션
  setTimeout(() => {
    dispatch(setCurrentProject(projectId));
  }, 300);
};

export const {
  setProjects,
  setCurrentProject,
  setLoading,
  clearError,
  toggleProjectFavorite,
  createProject,
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
  updateProjectDescription,
} = projectSlice.actions;

export default projectSlice.reducer;
