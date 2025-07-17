import { createSlice } from '@reduxjs/toolkit';
import { dummyBoardPosts } from '@/data/dummyData';

const initialState = {
  posts: [...dummyBoardPosts], // 배열 복사로 불변성 보장
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // 게시글 목록 설정
    setPosts: (state, action) => {
      const projectId = action.payload;
      state.posts = dummyBoardPosts.filter((post) => post.prjNo === projectId);
      state.loading = false;
    },

    // 로딩 상태 설정
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },

    // 새 게시글 생성
    createPost: (state, action) => {
      const newPost = {
        ...action.payload,
        createDate: new Date().toISOString(),
      };

      // 더미 데이터에도 추가
      const updatedDummyPosts = [...dummyBoardPosts, newPost];
      dummyBoardPosts.length = 0;
      dummyBoardPosts.push(...updatedDummyPosts);

      // 상태 업데이트
      state.posts = [...state.posts, newPost];
    },

    // 게시글 업데이트
    updatePost: (state, action) => {
      const { id, postData } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.prjPostNo === id);
      const dummyPostIndex = dummyBoardPosts.findIndex(
        (post) => post.prjPostNo === id
      );

      if (postIndex !== -1) {
        // 새 배열 생성하여 불변성 보장
        const updatedPosts = [...state.posts];
        updatedPosts[postIndex] = { ...postData };
        state.posts = updatedPosts;

        // 더미 데이터도 업데이트
        if (dummyPostIndex !== -1) {
          dummyBoardPosts[dummyPostIndex] = { ...postData };
        }
      }
    },

    // 게시글 삭제
    deletePost: (state, action) => {
      const postId = action.payload;

      // 새 배열 생성하여 불변성 보장
      state.posts = state.posts.filter((post) => post.prjPostNo !== postId);

      // 더미 데이터에서도 제거
      const dummyPostIndex = dummyBoardPosts.findIndex(
        (post) => post.prjPostNo === postId
      );
      if (dummyPostIndex !== -1) {
        dummyBoardPosts.splice(dummyPostIndex, 1);
      }
    },

    // 댓글 생성
    createComment: (state, action) => {
      const { postId, comment } = action.payload;
      const postIndex = state.posts.findIndex(
        (post) => post.prjPostNo === postId
      );
      const dummyPostIndex = dummyBoardPosts.findIndex(
        (post) => post.prjPostNo === postId
      );

      if (postIndex !== -1) {
        const updatedPosts = [...state.posts];
        const updatedPost = { ...updatedPosts[postIndex] };
        updatedPost.comments = [...(updatedPost.comments || []), comment];
        updatedPosts[postIndex] = updatedPost;
        state.posts = updatedPosts;

        // 더미 데이터도 업데이트 (불변성 유지)
        if (dummyPostIndex !== -1) {
          dummyBoardPosts[dummyPostIndex] = {
            ...dummyBoardPosts[dummyPostIndex],
            comments: [
              ...(dummyBoardPosts[dummyPostIndex].comments || []),
              comment,
            ],
          };
        }
      }
    },

    // 댓글 삭제
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex(
        (post) => post.prjPostNo === postId
      );
      const dummyPostIndex = dummyBoardPosts.findIndex(
        (post) => post.prjPostNo === postId
      );

      if (postIndex !== -1) {
        const updatedPosts = [...state.posts];
        const updatedPost = { ...updatedPosts[postIndex] };
        updatedPost.comments = (updatedPost.comments || []).filter(
          (comment) => comment.commentNo !== commentId
        );
        updatedPosts[postIndex] = updatedPost;
        state.posts = updatedPosts;

        // 더미 데이터도 업데이트 (불변성 유지)
        if (dummyPostIndex !== -1 && dummyBoardPosts[dummyPostIndex].comments) {
          dummyBoardPosts[dummyPostIndex] = {
            ...dummyBoardPosts[dummyPostIndex],
            comments: dummyBoardPosts[dummyPostIndex].comments.filter(
              (comment) => comment.commentNo !== commentId
            ),
          };
        }
      }
    },
  },
});

// 비동기 액션 시뮬레이션
export const fetchPosts = (projectId) => (dispatch) => {
  dispatch(setLoading(true));
  setTimeout(() => {
    dispatch(setPosts(projectId));
  }, 300);
};

export const {
  setPosts,
  setLoading,
  clearError,
  createPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
} = boardSlice.actions;

export default boardSlice.reducer;
