import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boardAPI } from '@/services/api';

export const fetchProjectPosts = createAsyncThunk(
  'board/fetchProjectPosts',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await boardAPI.getProjectPosts(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPostAsync = createAsyncThunk(
  'board/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await boardAPI.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePostAsync = createAsyncThunk(
  'board/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await boardAPI.updatePost(postId, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  'board/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await boardAPI.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCommentAsync = createAsyncThunk(
  'board/createComment',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await boardAPI.createComment(comment);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'board/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await boardAPI.deleteComment(commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchProjectPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.prjPostNo === action.payload.prjPostNo
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.prjPostNo !== action.payload
        );
      })
      .addCase(createCommentAsync.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p.prjPostNo === postId);
        if (post) {
          post.comments = post.comments || [];
          post.comments.push(comment);
        }
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.posts.find((p) => p.prjPostNo === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter(
            (c) => c.commentNo !== commentId
          );
        }
      });
  },
});

export const { clearError } = boardSlice.actions;

// 별칭 exports 추가
export const createPost = createPostAsync;
export const updatePost = updatePostAsync;
export const deletePost = deletePostAsync;
export const createComment = createCommentAsync;
export const deleteComment = deleteCommentAsync;

export default boardSlice.reducer;
