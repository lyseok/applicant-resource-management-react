import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';
export const BASE_REDIRECT_URL =
  import.meta.env.VITE_REDIRECT_URL || 'http://localhost/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키를 포함하여 요청
});

// 요청 인터셉터 - HttpOnly 쿠키는 자동으로 포함됨
api.interceptors.request.use(
  (config) => {
    // HttpOnly 쿠키는 브라우저가 자동으로 포함시키므로
    // 별도의 Authorization 헤더 설정이 불필요
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 프로젝트 API
export const projectAPI = {
  // 사용자 프로젝트 목록 조회 (사용자가 참여중인 프로젝트만)
  getUserProjects: () => api.get('/projects/my'),

  // 프로젝트 상세 정보 조회 (멤버, 채팅방 정보 포함)
  getProject: (projectId) => api.get(`/projects/${projectId}`),

  // 프로젝트 생성
  createProject: (projectData) =>
    api.post('/projects', {
      projectName: projectData.projectName,
      projectContents: projectData.projectContents,
      projectStatus: projectData.projectStatus || '진행중',
      projectColor: projectData.projectColor || '#3B82F6',
    }),

  // 프로젝트 수정
  updateProject: (projectId, projectData) =>
    api.put(`/projects/${projectId}`, projectData),

  // 프로젝트 삭제
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),

  // 프로젝트 즐겨찾기 토글 (별도 테이블이 필요할 수 있음)
  toggleFavorite: (projectId) => api.patch(`/projects/${projectId}/favorite`),

  // 프로젝트 멤버 관리
  getProjectMembers: (projectId) => api.get(`/projects/${projectId}/members`),

  addProjectMember: (projectId, memberData) =>
    api.post(`/projects/${projectId}/members`, {
      userId: memberData.userId,
      authorityCode: memberData.authorityCode || 'MEMBER',
    }),

  updateMemberRole: (projectId, userId, roleData) =>
    api.put(`/projects/${projectId}/members/${userId}`, {
      authorityCode: roleData.authorityCode,
    }),

  removeProjectMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

// 작업 API
export const taskAPI = {
  // 프로젝트 작업 목록 조회
  getProjectTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),

  // 작업 생성
  createTask: (taskData) =>
    api.post('/tasks', {
      prjNo: taskData.prjNo,
      userId: taskData.userId,
      sectNo: taskData.sectNo,
      creatorId: taskData.creatorId,
      taskName: taskData.taskName,
      taskStatus: taskData.taskStatus || 'TODO',
      detailContent: taskData.detailContent,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      priorityCode: taskData.priorityCode || 'MEDIUM',
      upperTaskNo: taskData.upperTaskNo,
      progressRate: taskData.progressRate || '0',
    }),

  // 작업 수정
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),

  // 작업 삭제 (soft delete)
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),

  // 작업 상태 변경
  updateTaskStatus: (taskId, status) =>
    api.patch(`/tasks/${taskId}/status`, {
      taskStatus: status,
    }),

  // 작업 진행률 업데이트
  updateTaskProgress: (taskId, progressRate) =>
    api.patch(`/tasks/${taskId}/progress`, {
      progressRate: progressRate,
    }),

  // 작업 통계
  getTaskStatistics: (projectId) =>
    api.get(`/projects/${projectId}/tasks/statistics`),
};

// 작업 내역 추적 API
export const workHistoryAPI = {
  // 프로젝트 작업 내역 조회
  getWorkHistory: (projectId) => api.get(`/projects/${projectId}/work-history`),

  // 작업 내역 생성 (보통 서버에서 자동 생성)
  createWorkHistory: (historyData) =>
    api.post('/work-history', {
      prjNo: historyData.prjNo,
      userId: historyData.userId,
      workDate: historyData.workDate,
      workTable: historyData.workTable,
      workType: historyData.workType,
      workTarget: historyData.workTarget,
      workContent: historyData.workContent,
    }),
};

// 프로젝트 섹션 API
export const sectionAPI = {
  // 프로젝트 섹션 목록 조회
  getProjectSections: (projectId) => api.get(`/projects/${projectId}/sections`),

  // 섹션 생성
  createSection: (sectionData) =>
    api.post('/sections', {
      prjNo: sectionData.prjNo,
      userId: sectionData.userId,
      sectName: sectionData.sectName,
      sectOrder: sectionData.sectOrder,
    }),

  // 섹션 수정
  updateSection: (sectionId, sectionData) =>
    api.put(`/sections/${sectionId}`, sectionData),

  // 섹션 삭제
  deleteSection: (sectionId) => api.delete(`/sections/${sectionId}`),
};

// 게시판 API
export const boardAPI = {
  // 프로젝트 게시글 목록 조회
  getProjectPosts: (projectId, params = {}) =>
    api.get(`/projects/${projectId}/posts`, { params }),

  // 게시글 상세 조회 (댓글 포함)
  getPost: (postId) => api.get(`/posts/${postId}`),

  // 게시글 생성
  createPost: (postData) =>
    api.post('/posts', {
      prjNo: postData.prjNo,
      userId: postData.userId,
      title: postData.title,
      content: postData.content,
    }),

  // 게시글 수정
  updatePost: (postId, postData) =>
    api.put(`/posts/${postId}`, {
      title: postData.title,
      content: postData.content,
    }),

  // 게시글 삭제
  deletePost: (postId) => api.delete(`/posts/${postId}`),

  // 댓글 생성
  createComment: (commentData) =>
    api.post('/comments', {
      prjPostNo: commentData.prjPostNo,
      prjNo: commentData.prjNo,
      userId: commentData.userId,
      commentContent: commentData.commentContent,
    }),

  // 댓글 수정
  updateComment: (commentId, commentData) =>
    api.put(`/comments/${commentId}`, {
      commentContent: commentData.commentContent,
    }),

  // 댓글 삭제
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

// 채팅 API
export const chatAPI = {
  // 프로젝트 채팅방 정보 조회 (멤버 정보 포함)
  getProjectChatroom: (projectId) => api.get(`/projects/${projectId}/chatroom`),

  // 채팅 메시지 목록 조회 (페이징)
  getChatMessages: (chatroomId, params = {}) =>
    api.get(`/chatrooms/${chatroomId}/messages`, {
      params: {
        page: params.page || 0,
        size: params.size || 50,
        ...params,
      },
    }),

  // 메시지 전송
  sendMessage: (messageData) =>
    api.post('/messages', {
      chatroomNo: messageData.chatroomNo,
      prjNo: messageData.prjNo,
      userId: messageData.userId,
      message: messageData.message,
    }),

  // 읽음 상태 업데이트
  updateReadStatus: (chatroomId, messageId) =>
    api.patch(`/chatrooms/${chatroomId}/read`, {
      readMessageNo: messageId,
    }),

  // 채팅방 이름 변경
  updateChatroomName: (chatroomId, chatroomName) =>
    api.put(`/chatrooms/${chatroomId}`, {
      chatroomName: chatroomName,
    }),
};

// 작업 관리자 API (TasksManager)
export const tasksManagerAPI = {
  // 작업 담당자 지정
  assignTaskManager: (taskId, userId) =>
    api.post(`/tasks/${taskId}/managers`, {
      userId: userId,
    }),

  // 작업 담당자 해제
  removeTaskManager: (taskId, userId) =>
    api.delete(`/tasks/${taskId}/managers/${userId}`),

  // 작업 담당자 목록 조회
  getTaskManagers: (taskId) => api.get(`/tasks/${taskId}/managers`),
};

// 사용자 API
export const userAPI = {
  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: () => api.get('/users/me'),

  // 사용자 검색 (프로젝트 멤버 추가 시 사용)
  searchUsers: (query) =>
    api.get('/users/search', {
      params: { q: query },
    }),
};

// 인증 API
export const authAPI = {
  // 로그인
  login: (credentials) =>
    api.post('/common/auth', {
      username: credentials.username,
      password: credentials.password,
    }),

  // 로그아웃
  logout: () => api.post('/common/auth/revoke'),

  // 현재 사용자 정보 조회 (인증 상태 확인)
  me: () => api.get('/users/me'),
};

export default api;
