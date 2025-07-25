import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '@/services/api';

// 프로젝트 채팅방 조회
export const fetchProjectChatroom = createAsyncThunk(
  'chat/fetchProjectChatroom',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getProjectChatroom(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 채팅 메시지 목록 조회
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatroomNo, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatMessages(chatroomNo, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 메시지 전송 (HTTP API)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 읽음 상태 업데이트
export const updateReadMessageNo = createAsyncThunk(
  'chat/updateReadMessageNo',
  async ({ chatroomNo, readMessageNo, userId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateReadStatus(
        chatroomNo,
        readMessageNo,
        userId
      );
      return { chatroomNo, readMessageNo, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 읽지 않은 메시지 수 조회
export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async ({ chatroomNo, userId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getUnreadCount(chatroomNo, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  chatroom: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // WebSocket 연결 상태 업데이트
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },

    // 실시간 메시지 수신
    messageReceived: (state, action) => {
      const newMessage = action.payload;
      const existingIndex = state.messages.findIndex(
        (msg) => msg.messageNo === newMessage.messageNo
      );

      if (existingIndex === -1) {
        state.messages.push(newMessage);
        // 자신이 보낸 메시지가 아니면 읽지 않은 메시지 수 증가
        if (newMessage.userId !== action.meta?.currentUserId) {
          state.unreadCount += 1;
        }
      }
    },

    // 메시지 추가 (HTTP API 응답)
    addMessage: (state, action) => {
      const newMessage = action.payload;
      const existingIndex = state.messages.findIndex(
        (msg) => msg.messageNo === newMessage.messageNo
      );

      if (existingIndex === -1) {
        state.messages.push(newMessage);
      }
    },

    // 읽지 않은 메시지 수 초기화
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },

    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    },

    // 채팅방 초기화
    resetChatroom: (state) => {
      state.chatroom = null;
      state.messages = [];
      state.unreadCount = 0;
      state.isConnected = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 채팅방 조회
      .addCase(fetchProjectChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectChatroom.fulfilled, (state, action) => {
        state.loading = false;
        state.chatroom = action.payload;
      })
      .addCase(fetchProjectChatroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 메시지 목록 조회
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 메시지 전송
      .addCase(sendMessage.fulfilled, (state, action) => {
        const newMessage = action.payload;
        const existingIndex = state.messages.findIndex(
          (msg) => msg.messageNo === newMessage.messageNo
        );

        if (existingIndex === -1) {
          state.messages.push(newMessage);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 읽음 상태 업데이트
      .addCase(updateReadMessageNo.fulfilled, (state, action) => {
        const { userId, readMessageNo } = action.payload;
        if (state.chatroom?.chatroomMemList) {
          const member = state.chatroom.chatroomMemList.find(
            (m) => m.userId === userId
          );
          if (member) {
            member.readMessageNo = readMessageNo;
          }
        }
        state.unreadCount = 0;
      })

      // 읽지 않은 메시지 수 조회
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  setConnectionStatus,
  messageReceived,
  addMessage,
  clearUnreadCount,
  clearError,
  resetChatroom,
} = chatSlice.actions;

export default chatSlice.reducer;
