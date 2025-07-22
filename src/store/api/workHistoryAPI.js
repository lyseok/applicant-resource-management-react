import axiosInstance from './axiosConfig';

export const workHistoryAPI = {
  // 프로젝트별 작업 내역 조회
  getWorkHistory: (projectId) => {
    if (!projectId || projectId === 'undefined') {
      return Promise.reject(new Error('Project ID is required'));
    }
    return axiosInstance.get(`/work-history/${projectId}`);
  },

  // 작업 내역 생성
  createWorkHistory: (workHistoryData) => {
    return axiosInstance.post('/work-history', workHistoryData);
  },

  // 최근 작업 내역 조회 (상태 변경 중심)
  getRecentWorkHistory: (projectId, limit = 10) => {
    if (!projectId || projectId === 'undefined') {
      return Promise.reject(new Error('Project ID is required'));
    }
    return axiosInstance.get(`/work-history/${projectId}/recent`, {
      params: { limit },
    });
  },

  // 전체 최근 작업 내역 조회 (프로젝트 ID 없이)
  getAllRecentWorkHistory: (limit = 10) => {
    return axiosInstance.get('/work-history/recent', {
      params: { limit },
    });
  },

  // 사용자별 작업 내역 조회
  getUserWorkHistory: (userId, projectId) => {
    return axiosInstance.get(`/work-history/user/${userId}`, {
      params: { projectId },
    });
  },

  // 작업 타입별 내역 조회
  getWorkHistoryByType: (projectId, workType) => {
    if (!projectId || projectId === 'undefined') {
      return Promise.reject(new Error('Project ID is required'));
    }
    return axiosInstance.get(`/work-history/${projectId}/type/${workType}`);
  },
};
