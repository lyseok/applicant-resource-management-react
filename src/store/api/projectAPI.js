import axiosInstance from './axiosConfig';

export const projectAPI = {
  // 프로젝트 목록 조회
  getProjects: () => {
    return axiosInstance.get('/projects');
  },

  // 프로젝트 조회
  getProject: (projectId) => {
    return axiosInstance.get(`/projects/${projectId}`);
  },

  // 프로젝트 생성
  createProject: (projectData) => {
    return axiosInstance.post('/projects', projectData);
  },

  // 프로젝트 수정
  updateProject: (projectId, projectData) => {
    return axiosInstance.put(`/projects/${projectId}`, projectData);
  },

  // 프로젝트 삭제
  deleteProject: (projectId) => {
    return axiosInstance.delete(`/projects/${projectId}`);
  },

  // 프로젝트 멤버 추가
  addProjectMember: (projectId, memberData) => {
    return axiosInstance.post(`/projects/${projectId}/members`, memberData);
  },

  // 프로젝트 멤버 역할 변경
  updateMemberRole: (projectId, memberId, role) => {
    return axiosInstance.put(
      `/projects/${projectId}/members/${memberId}/role`,
      { role }
    );
  },

  // 프로젝트 멤버 제거
  removeProjectMember: (projectId, memberId) => {
    return axiosInstance.delete(`/projects/${projectId}/members/${memberId}`);
  },

  // 프로젝트 즐겨찾기 토글
  toggleProjectFavorite: (projectId) => {
    return axiosInstance.patch(`/projects/${projectId}/favorite`);
  },
};
