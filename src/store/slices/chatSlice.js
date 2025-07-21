import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '@/services/api';

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

export const fetchMessagesAsync = createAsyncThunk(
  'chat/fetchMessages',
  async ({ projectId, chatroomId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatMessages(chatroomId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessageAsync = createAsyncThunk(
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

export const updateReadMessageNoAsync = createAsyncThunk(
  'chat/updateReadMessageNo',
  async (
    { projectId, chatroomId, userId, readMessageNo },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.updateReadStatus(
        chatroomId,
        readMessageNo
      );
      return { userId, readMessageNo };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  chatroom: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectChatroom.fulfilled, (state, action) => {
        state.chatroom = action.payload;
      })
      .addCase(fetchMessagesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(updateReadMessageNoAsync.fulfilled, (state, action) => {
        // 읽음 상태 업데이트 로직
        const { userId, readMessageNo } = action.payload;
        if (state.chatroom?.members) {
          const member = state.chatroom.members.find(
            (m) => m.userId === userId
          );
          if (member) {
            member.readMessageNo = readMessageNo;
          }
        }
      });
  },
});

export const { clearError } = chatSlice.actions;

// 별칭 exports 추가
export const fetchMessages = fetchMessagesAsync;
export const sendMessage = sendMessageAsync;
export const updateReadMessageNo = updateReadMessageNoAsync;

export default chatSlice.reducer;
