import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://192.168.34.70:80/api';
export const BASE_REDIRECT_URL =
  import.meta.env.VITE_REDIRECT_URL || 'http://192.168.34.70/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 프로젝트 API
export const projectAPI = {
  getUserProjects: () => api.get('/projects/my'),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  createProject: (projectData) =>
    api.post('/projects', {
      projectName: projectData.projectName,
      projectContents: projectData.projectContents,
      projectStatus: projectData.projectStatus || '진행중',
      projectColor: projectData.projectColor || '#3B82F6',
    }),
  updateProject: (projectId, projectData) =>
    api.put(`/projects/${projectId}`, projectData),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  toggleFavorite: (projectId) => api.patch(`/projects/${projectId}/favorite`),
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
  getProjectTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
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
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  updateTaskStatus: (taskId, status) =>
    api.patch(`/tasks/${taskId}/status`, {
      taskStatus: status,
    }),
  updateTaskProgress: (taskId, progressRate) =>
    api.patch(`/tasks/${taskId}/progress`, {
      progressRate: progressRate,
    }),
  getTaskStatistics: (projectId) =>
    api.get(`/projects/${projectId}/tasks/statistics`),
};

// 작업 내역 추적 API
export const workHistoryAPI = {
  getWorkHistory: (projectId) => api.get(`/projects/${projectId}/work-history`),
  getAllRecentWorkHistory: (limit = 10) =>
    api.get('/work-history/recent', {
      params: { limit },
    }),
  getRecentWorkHistory: (projectId, limit = 10) =>
    api.get(`/projects/${projectId}/work-history/recent`, {
      params: { limit },
    }),
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
  getProjectSections: (projectId) => api.get(`/projects/${projectId}/sections`),
  createSection: (sectionData) =>
    api.post('/sections', {
      prjNo: sectionData.prjNo,
      userId: sectionData.userId,
      sectName: sectionData.sectName,
      sectOrder: sectionData.sectOrder,
    }),
  updateSection: (sectionId, sectionData) =>
    api.put(`/sections/${sectionId}`, sectionData),
  deleteSection: (sectionId) => api.delete(`/sections/${sectionId}`),
};

// 게시판 API
export const boardAPI = {
  getProjectPosts: (projectId, params = {}) =>
    api.get(`/projects/${projectId}/posts`, { params }),
  getPost: (postId) => api.get(`/posts/${postId}`),
  createPost: (postData) =>
    api.post('/posts', {
      prjNo: postData.prjNo,
      userId: postData.userId,
      title: postData.title,
      content: postData.content,
    }),
  updatePost: (postId, postData) =>
    api.put(`/posts/${postId}`, {
      title: postData.title,
      content: postData.content,
    }),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  createComment: (commentData) =>
    api.post('/comments', {
      prjPostNo: commentData.prjPostNo,
      prjNo: commentData.prjNo,
      userId: commentData.userId,
      commentContent: commentData.commentContent,
    }),
  updateComment: (commentId, commentData) =>
    api.put(`/comments/${commentId}`, {
      commentContent: commentData.commentContent,
    }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

// 채팅 API
export const chatAPI = {
  // 프로젝트 채팅방 정보 조회
  getProjectChatroom: (projectId) => api.get(`/projects/${projectId}/chatroom`),

  // 채팅 메시지 목록 조회
  getChatMessages: (chatroomNo, params = {}) =>
    api.get(`/chatrooms/${chatroomNo}/messages`, {
      params: {
        page: params.page || 0,
        size: params.size || 50,
        ...params,
      },
    }),

  // 메시지 전송 (HTTP API - WebSocket fallback용)
  sendMessage: (messageData) =>
    api.post('/chat/messages', {
      chatroomNo: messageData.chatroomNo,
      prjNo: messageData.prjNo,
      userId: messageData.userId,
      message: messageData.message,
    }),

  // 읽음 상태 업데이트
  updateReadStatus: (chatroomNo, readMessageNo, userId) =>
    api.patch(`/chatrooms/${chatroomNo}/read`, {
      readMessageNo: readMessageNo,
      userId: userId,
    }),

  // 채팅방 이름 변경
  updateChatroomName: (chatroomNo, chatroomName) =>
    api.put(`/chatrooms/${chatroomNo}`, {
      chatroomName: chatroomName,
    }),

  // 채팅방 멤버 목록 조회
  getChatroomMembers: (chatroomNo) =>
    api.get(`/chatrooms/${chatroomNo}/members`),

  // 읽지 않은 메시지 수 조회
  getUnreadCount: (chatroomNo, userId) =>
    api.get(`/chatrooms/${chatroomNo}/unread-count`, {
      params: { userId },
    }),
};

// 사용자 API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  searchUsers: (query) =>
    api.get('/users/search', {
      params: { q: query },
    }),
};

// 인증 API
export const authAPI = {
  login: (credentials) =>
    api.post('/common/auth', {
      username: credentials.username,
      password: credentials.password,
    }),
  logout: () => api.post('/common/auth/revoke'),
  me: () => api.get('/users/me'),
};

export default api;
