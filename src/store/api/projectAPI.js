import axiosInstance from './axiosConfig';

export const projectAPI = {
  // 프로젝트 조회
  getProject: (projectId) => {
    return axiosInstance.get(`/projects/${projectId}`);
  },

  // 프로젝트 수정
  updateProject: (projectId, projectData) => {
    return axiosInstance.put(`/projects/${projectId}`, projectData);
  },

  // 프로젝트 멤버 추가
  addProjectMember: (projectId, memberData) => {
    return axiosInstance.post(`/projects/${projectId}/members`, memberData);
  },

  // 프로젝트 멤버 제거
  removeProjectMember: (projectId, memberId) => {
    return axiosInstance.delete(`/projects/${projectId}/members/${memberId}`);
  },
};
