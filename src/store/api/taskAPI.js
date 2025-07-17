import axiosInstance from './axiosConfig';

export const taskAPI = {
  // 작업 목록 조회
  getTasks: (projectId) => {
    return axiosInstance.get(`/projects/${projectId}/tasks`);
  },

  // 작업 생성
  createTask: (taskData) => {
    return axiosInstance.post('/tasks', taskData);
  },

  // 작업 수정
  updateTask: (taskNo, taskData) => {
    return axiosInstance.put(`/tasks/${taskNo}`, taskData);
  },

  // 작업 삭제
  deleteTask: (taskNo) => {
    return axiosInstance.delete(`/tasks/${taskNo}`);
  },

  // 작업 상태 변경
  updateTaskStatus: (taskNo, status) => {
    return axiosInstance.patch(`/tasks/${taskNo}/status`, { status });
  },

  // 작업 통계 조회
  getTaskStatistics: (projectId) => {
    return axiosInstance.get(`/projects/${projectId}/tasks/statistics`);
  },
};
