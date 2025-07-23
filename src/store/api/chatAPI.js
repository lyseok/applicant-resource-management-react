import { axiosInstance } from './axiosConfig';

export const chatAPI = {
  // 프로젝트 채팅방 조회 (없으면 생성)
  getProjectChatroom: (projectId) => {
    return axiosInstance.get(`/api/chat/project/${projectId}/chatroom`);
  },

  // 채팅 메시지 목록 조회
  getMessages: (chatroomNo, params = {}) => {
    return axiosInstance.get(`/api/chat/chatroom/${chatroomNo}/messages`, {
      params,
    });
  },

  // 메시지 전송
  sendMessage: (messageData) => {
    return axiosInstance.post('/api/chat/messages', messageData);
  },

  // 읽음 상태 업데이트
  updateReadMessageNo: (data) => {
    return axiosInstance.put('/api/chat/read-status', data);
  },

  // 읽지 않은 메시지 수 조회
  getUnreadCount: (chatroomNo, userId) => {
    return axiosInstance.get(`/api/chat/chatroom/${chatroomNo}/unread-count`, {
      params: { userId },
    });
  },
};
