// import { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Plus,
//   Search,
//   MessageCircle,
//   ThumbsUp,
//   Edit,
//   Trash2,
//   Send,
// } from 'lucide-react';
// import {
//   createPost,
//   deletePost,
//   createComment,
//   deleteComment,
//   updatePost,
// } from '@/store/slices/boardSlice';

// export default function ProjectBoard() {
//   const dispatch = useDispatch();
//   const { posts, loading } = useSelector((state) => state.board);
//   const { currentProject } = useSelector((state) => state.project);
//   const { currentUser } = useSelector((state) => state.auth);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isEditingPost, setIsEditingPost] = useState(false);
//   const [newPostTitle, setNewPostTitle] = useState('');
//   const [newPostContent, setNewPostContent] = useState('');
//   const [editedPostTitle, setEditedPostTitle] = useState('');
//   const [editedPostContent, setEditedPostContent] = useState('');
//   const [commentInputs, setCommentInputs] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.prjNo === currentProject?.prjNo &&
//       (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         post.content.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleCreatePost = () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) return;

//     const newPost = {
//       prjPostNo: `POST${String(Date.now()).slice(-6)}`,
//       prjNo: currentProject?.prjNo,
//       userId: currentUser.userId,
//       userName: currentUser.userName,
//       title: newPostTitle,
//       content: newPostContent,
//       createDate: new Date().toISOString(),
//       deleteDate: null,
//       comments: [],
//     };

//     dispatch(createPost(newPost));
//     setNewPostTitle('');
//     setNewPostContent('');
//     setIsCreateModalOpen(false);
//   };

//   const handlePostClick = (post) => {
//     setSelectedPost(post);
//     setIsDetailModalOpen(true);
//     setIsEditingPost(false);
//   };

//   const handleEditPost = () => {
//     if (selectedPost) {
//       setEditedPostTitle(selectedPost.title);
//       setEditedPostContent(selectedPost.content);
//       setIsEditingPost(true);
//     }
//   };

//   const handleSaveEditedPost = () => {
//     if (!editedPostTitle.trim() || !editedPostContent.trim()) return;

//     const updatedPostData = {
//       ...selectedPost,
//       title: editedPostTitle,
//       content: editedPostContent,
//     };

//     // postId를 명시적으로 전달
//     dispatch(
//       updatePost({
//         postId: selectedPost.prjPostNo, // id 대신 postId 사용
//         postData: updatedPostData,
//       })
//     );
//     setSelectedPost(updatedPostData);
//     setIsEditingPost(false);
//   };

//   const handleCancelEdit = () => {
//     setIsEditingPost(false);
//     setEditedPostTitle(selectedPost.title);
//     setEditedPostContent(selectedPost.content);
//   };

//   const handleAddComment = (postId) => {
//     const commentText = commentInputs[postId];
//     if (!commentText?.trim()) return;

//     const newComment = {
//       commentNo: `CMT${String(Date.now()).slice(-6)}`,
//       prjPostNo: postId,
//       prjNo: currentProject?.prjNo || 'PRJ001',
//       userId: currentUser.userId,
//       userName: currentUser.userName,
//       commentContent: commentText,
//       createDate: new Date().toISOString(),
//       deleteDate: null,
//     };

//     dispatch(createComment({ postId, comment: newComment }));
//     setCommentInputs({ ...commentInputs, [postId]: '' });

//     // Update selectedPost to reflect the new comment immediately
//     setSelectedPost((prevPost) => {
//       if (prevPost && prevPost.prjPostNo === postId) {
//         return {
//           ...prevPost,
//           bbsCommentList: [...(prevPost.bbsCommentList || []), newComment],
//         };
//       }
//       return prevPost;
//     });
//   };

//   const handleDeletePost = (postId) => {
//     if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
//       dispatch(deletePost(postId));
//       setIsDetailModalOpen(false);
//       setSelectedPost(null);
//     }
//   };

//   const handleDeleteComment = async (postId, commentId) => {
//     if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
//       try {
//         await dispatch(deleteComment({ postId, commentId })).unwrap();

//         // 선택된 게시글의 댓글 목록에서 즉시 제거
//         setSelectedPost((prevPost) => {
//           if (prevPost && prevPost.prjPostNo === postId) {
//             return {
//               ...prevPost,
//               bbsCommentList: prevPost.bbsCommentList.filter(
//                 (c) => c.commentNo !== commentId
//               ),
//             };
//           }
//           return prevPost;
//         });
//       } catch (error) {
//         console.error('댓글 삭제 실패:', error);
//         alert('댓글 삭제에 실패했습니다.');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ko-KR', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // 사용자 정보 가져오기 - API 응답 구조에 맞게 수정
//   const getUserInfo = (post) => {
//     // API 응답에서 prjMem 객체 사용
//     if (post.prjMem && post.prjMem.userName) {
//       return {
//         userName: post.prjMem.userName,
//         userEmail: post.prjMem.userEmail || '',
//         userPosition: post.prjMem.userPosition || '',
//       };
//     }

//     // fallback: 프로젝트 멤버에서 찾기
//     const member = currentProject?.prjMemList?.find(
//       (m) => m.userId === post.userId && !m.deleteDate
//     );
//     if (member) {
//       return {
//         userName: member.userName,
//         userEmail: member.userEmail || '',
//         userPosition: member.userPosition || '',
//       };
//     }

//     return { userName: '알 수 없음', userEmail: '', userPosition: '' };
//   };

//   // 댓글 사용자 정보 가져오기
//   const getCommentUserInfo = (comment) => {
//     // 댓글에 prjMem 정보가 있는 경우
//     if (comment.prjMem && comment.prjMem.userName) {
//       return {
//         userName: comment.prjMem.userName,
//         userEmail: comment.prjMem.userEmail || '',
//       };
//     }

//     // 프로젝트 멤버에서 찾기
//     const member = currentProject?.prjMemList?.find(
//       (m) => m.userId === comment.userId && !m.deleteDate
//     );
//     if (member) {
//       return {
//         userName: member.userName,
//         userEmail: member.userEmail || '',
//       };
//     }

//     return { userName: '알 수 없음', userEmail: '' };
//   };

//   // 유효한 댓글만 필터링
//   const getValidComments = (post) => {
//     if (!post.bbsCommentList) return [];

//     return post.bbsCommentList.filter(
//       (comment) =>
//         comment.commentNo &&
//         comment.userId &&
//         comment.commentContent &&
//         comment.commentContent.trim() !== ''
//     );
//   };

//   return (
//     <div className="flex-1 bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* 헤더 */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">
//               프로젝트 게시판
//             </h2>
//             <p className="text-gray-600 text-sm mt-1">
//               공지사항, 회의록, 아이디어를 공유해보세요
//             </p>
//           </div>
//           <Button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" />새 게시글
//           </Button>
//         </div>

//         {/* 검색 */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <Input
//             placeholder="게시글 검색..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-white"
//           />
//         </div>

//         {/* 게시글 목록 */}
//         <div className="space-y-4">
//           {filteredPosts.length === 0 ? (
//             <Card className="bg-white">
//               <CardContent className="p-8 text-center">
//                 <div className="text-gray-500">
//                   <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                   <p>아직 게시글이 없습니다.</p>
//                   <p className="text-sm mt-1">첫 번째 게시글을 작성해보세요!</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             filteredPosts.map((post) => {
//               const userInfo = getUserInfo(post);
//               const validComments = getValidComments(post);

//               return (
//                 <Card
//                   key={post.prjPostNo}
//                   className="bg-white hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => handlePostClick(post)}
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <Avatar className="w-10 h-10">
//                           <AvatarFallback className="bg-blue-500 text-white font-medium">
//                             {userInfo.userName?.charAt(0) || 'U'}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="font-medium text-gray-900">
//                             {userInfo.userName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {formatDate(post.createDate)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {post.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm line-clamp-3 mb-4">
//                       {post.content}
//                     </p>

//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <MessageCircle className="w-4 h-4" />
//                         <span>{validComments.length}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <ThumbsUp className="w-4 h-4" />
//                         <span>0</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* 게시글 작성 모달 */}
//       {isCreateModalOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setIsCreateModalOpen(false)}
//           />
//           <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   새 게시글 작성
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsCreateModalOpen(false)}
//                 >
//                   ×
//                 </Button>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     제목
//                   </label>
//                   <Input
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                     placeholder="게시글 제목을 입력하세요"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     내용
//                   </label>
//                   <Textarea
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     placeholder="게시글 내용을 입력하세요"
//                     rows={8}
//                     className="resize-none"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-3 p-6 border-t border-gray-200">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsCreateModalOpen(false)}
//                   className="flex-1"
//                 >
//                   취소
//                 </Button>
//                 <Button
//                   onClick={handleCreatePost}
//                   disabled={!newPostTitle.trim() || !newPostContent.trim()}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700"
//                 >
//                   게시글 작성
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* 게시글 상세 모달 */}
//       {isDetailModalOpen && selectedPost && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setIsDetailModalOpen(false)}
//           />
//           <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   게시글 상세
//                 </h2>
//                 <div className="flex items-center space-x-2">
//                   {selectedPost.userId === currentUser.userId && (
//                     <>
//                       {!isEditingPost && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={handleEditPost}
//                         >
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                       )}
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleDeletePost(selectedPost.prjPostNo)}
//                         className="text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </>
//                   )}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setIsDetailModalOpen(false)}
//                   >
//                     ×
//                   </Button>
//                 </div>
//               </div>

//               <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//                 {/* 게시글 내용 */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <Avatar className="w-12 h-12">
//                       <AvatarFallback className="bg-blue-500 text-white font-medium">
//                         {getUserInfo(selectedPost).userName?.charAt(0) || 'U'}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="font-medium text-gray-900">
//                         {getUserInfo(selectedPost).userName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {formatDate(selectedPost.createDate)}
//                       </div>
//                     </div>
//                   </div>

//                   {isEditingPost ? (
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           제목
//                         </label>
//                         <Input
//                           value={editedPostTitle}
//                           onChange={(e) => setEditedPostTitle(e.target.value)}
//                           className="text-2xl font-bold"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           내용
//                         </label>
//                         <Textarea
//                           value={editedPostContent}
//                           onChange={(e) => setEditedPostContent(e.target.value)}
//                           rows={10}
//                           className="resize-none"
//                         />
//                       </div>
//                       <div className="flex space-x-2">
//                         <Button
//                           onClick={handleSaveEditedPost}
//                           className="bg-blue-600 hover:bg-blue-700"
//                         >
//                           저장
//                         </Button>
//                         <Button variant="outline" onClick={handleCancelEdit}>
//                           취소
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <h1 className="text-2xl font-bold text-gray-900 mb-4">
//                         {selectedPost.title}
//                       </h1>
//                       <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                         {selectedPost.content}
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* 댓글 섹션 */}
//                 {!isEditingPost && (
//                   <div className="p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       댓글 ({getValidComments(selectedPost).length})
//                     </h3>

//                     {/* 댓글 입력 */}
//                     <div className="flex space-x-3 mb-6">
//                       <Avatar className="w-8 h-8">
//                         <AvatarFallback className="bg-yellow-500 text-white text-sm font-medium">
//                           {currentUser.userName?.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 flex space-x-2">
//                         <Input
//                           placeholder="댓글을 입력하세요..."
//                           value={commentInputs[selectedPost.prjPostNo] || ''}
//                           onChange={(e) =>
//                             setCommentInputs({
//                               ...commentInputs,
//                               [selectedPost.prjPostNo]: e.target.value,
//                             })
//                           }
//                           onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                               handleAddComment(selectedPost.prjPostNo);
//                             }
//                           }}
//                         />
//                         <Button
//                           size="sm"
//                           onClick={() =>
//                             handleAddComment(selectedPost.prjPostNo)
//                           }
//                           disabled={
//                             !commentInputs[selectedPost.prjPostNo]?.trim()
//                           }
//                           className="bg-blue-600 hover:bg-blue-700"
//                         >
//                           <Send className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>

//                     {/* 댓글 목록 */}
//                     <div className="space-y-4">
//                       {getValidComments(selectedPost).map((comment) => {
//                         const commentUserInfo = getCommentUserInfo(comment);
//                         return (
//                           <div
//                             key={comment.commentNo}
//                             className="flex space-x-3"
//                           >
//                             <Avatar className="w-8 h-8">
//                               <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
//                                 {commentUserInfo.userName?.charAt(0) || 'U'}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1">
//                               <div className="bg-gray-50 rounded-lg p-3">
//                                 <div className="flex items-center justify-between mb-1">
//                                   <span className="font-medium text-sm text-gray-900">
//                                     {commentUserInfo.userName}
//                                   </span>
//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-xs text-gray-500">
//                                       {formatDate(comment.createDate)}
//                                     </span>
//                                     {comment.userId === currentUser.userId && (
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() =>
//                                           handleDeleteComment(
//                                             selectedPost.prjPostNo,
//                                             comment.commentNo
//                                           )
//                                         }
//                                         className="text-red-600 hover:text-red-700 p-1"
//                                       >
//                                         <Trash2 className="w-3 h-3" />
//                                       </Button>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <p className="text-sm text-gray-700">
//                                   {comment.commentContent}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}

//                       {getValidComments(selectedPost).length === 0 && (
//                         <div className="text-center py-8 text-gray-500">
//                           <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                           <p className="text-sm">아직 댓글이 없습니다.</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Search,
  MessageCircle,
  ThumbsUp,
  Edit,
  Trash2,
  Send,
} from 'lucide-react';
import {
  createPost,
  deletePost,
  createComment,
  deleteComment,
  updatePost,
} from '@/store/slices/boardSlice';

export default function ProjectBoard() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.board);
  const { currentProject } = useSelector((state) => state.project);
  const { currentUser } = useSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editedPostTitle, setEditedPostTitle] = useState('');
  const [editedPostContent, setEditedPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(
    (post) =>
      post.prjNo === currentProject?.prjNo &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 줄바꿈 처리 함수
  const formatTextWithLineBreaks = (text) => {
    if (!text) return '';
    return text.split('\\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\\n').length - 1 && <br />}
      </span>
    ));
  };

  // 요약용 텍스트 처리 (줄바꿈 포함, 길이 제한)
  const formatSummaryText = (text, maxLength = 150) => {
    if (!text) return '';
    const plainText = text.replace(/\\n/g, ' ').trim();
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      prjPostNo: `POST${String(Date.now()).slice(-6)}`,
      prjNo: currentProject?.prjNo,
      userId: currentUser.userId,
      userName: currentUser.userName,
      title: newPostTitle,
      content: newPostContent.replace(/\n/g, '\\n'), // 줄바꿈을 \n으로 변환하여 저장
      createDate: new Date().toISOString(),
      deleteDate: null,
      comments: [],
    };

    dispatch(createPost(newPost));
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreateModalOpen(false);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
    setIsEditingPost(false);
  };

  const handleEditPost = () => {
    if (selectedPost) {
      setEditedPostTitle(selectedPost.title);
      // 편집 시 \n을 실제 줄바꿈으로 변환
      setEditedPostContent(selectedPost.content.replace(/\\n/g, '\n'));
      setIsEditingPost(true);
    }
  };

  const handleSaveEditedPost = () => {
    if (!editedPostTitle.trim() || !editedPostContent.trim()) return;

    const updatedPostData = {
      ...selectedPost,
      title: editedPostTitle,
      content: editedPostContent.replace(/\n/g, '\\n'), // 저장 시 줄바꿈을 \n으로 변환
    };

    dispatch(
      updatePost({
        postId: selectedPost.prjPostNo,
        postData: updatedPostData,
      })
    );
    setSelectedPost(updatedPostData);
    setIsEditingPost(false);
  };

  const handleCancelEdit = () => {
    setIsEditingPost(false);
    setEditedPostTitle(selectedPost.title);
    setEditedPostContent(selectedPost.content.replace(/\\n/g, '\n'));
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const newComment = {
      commentNo: `CMT${String(Date.now()).slice(-6)}`,
      prjPostNo: postId,
      prjNo: currentProject?.prjNo || 'PRJ001',
      userId: currentUser.userId,
      userName: currentUser.userName,
      commentContent: commentText.replace(/\n/g, '\\n'), // 댓글도 줄바꿈 처리
      createDate: new Date().toISOString(),
      deleteDate: null,
    };

    dispatch(createComment({ postId, comment: newComment }));
    setCommentInputs({ ...commentInputs, [postId]: '' });

    setSelectedPost((prevPost) => {
      if (prevPost && prevPost.prjPostNo === postId) {
        return {
          ...prevPost,
          bbsCommentList: [...(prevPost.bbsCommentList || []), newComment],
        };
      }
      return prevPost;
    });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      dispatch(deletePost(postId));
      setIsDetailModalOpen(false);
      setSelectedPost(null);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await dispatch(deleteComment({ postId, commentId })).unwrap();

        setSelectedPost((prevPost) => {
          if (prevPost && prevPost.prjPostNo === postId) {
            return {
              ...prevPost,
              bbsCommentList: prevPost.bbsCommentList.filter(
                (c) => c.commentNo !== commentId
              ),
            };
          }
          return prevPost;
        });
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInfo = (post) => {
    if (post.prjMem && post.prjMem.userName) {
      return {
        userName: post.prjMem.userName,
        userEmail: post.prjMem.userEmail || '',
        userPosition: post.prjMem.userPosition || '',
      };
    }

    const member = currentProject?.prjMemList?.find(
      (m) => m.userId === post.userId && !m.deleteDate
    );
    if (member) {
      return {
        userName: member.userName,
        userEmail: member.userEmail || '',
        userPosition: member.userPosition || '',
      };
    }

    return { userName: '알 수 없음', userEmail: '', userPosition: '' };
  };

  const getCommentUserInfo = (comment) => {
    if (comment.prjMem && comment.prjMem.userName) {
      return {
        userName: comment.prjMem.userName,
        userEmail: comment.prjMem.userEmail || '',
      };
    }

    const member = currentProject?.prjMemList?.find(
      (m) => m.userId === comment.userId && !m.deleteDate
    );
    if (member) {
      return {
        userName: member.userName,
        userEmail: member.userEmail || '',
      };
    }

    return { userName: '알 수 없음', userEmail: '' };
  };

  const getValidComments = (post) => {
    if (!post.bbsCommentList) return [];

    return post.bbsCommentList.filter(
      (comment) =>
        comment.commentNo &&
        comment.userId &&
        comment.commentContent &&
        comment.commentContent.trim() !== ''
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              프로젝트 게시판
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              공지사항, 회의록, 아이디어를 공유해보세요
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />새 게시글
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="게시글 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>아직 게시글이 없습니다.</p>
                  <p className="text-sm mt-1">첫 번째 게시글을 작성해보세요!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const userInfo = getUserInfo(post);
              const validComments = getValidComments(post);

              return (
                <Card
                  key={post.prjPostNo}
                  className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-500 text-white font-medium">
                            {userInfo.userName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {userInfo.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(post.createDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {formatSummaryText(post.content)}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{validComments.length}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* 게시글 작성 모달 */}
      {isCreateModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  새 게시글 작성
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  ×
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <Input
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="게시글 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="게시글 내용을 입력하세요"
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 p-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  게시글 작성
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 게시글 상세 모달 */}
      {isDetailModalOpen && selectedPost && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDetailModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  게시글 상세
                </h2>
                <div className="flex items-center space-x-2">
                  {selectedPost.userId === currentUser.userId && (
                    <>
                      {!isEditingPost && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditPost}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(selectedPost.prjPostNo)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* 게시글 내용 */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-500 text-white font-medium">
                        {getUserInfo(selectedPost).userName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getUserInfo(selectedPost).userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedPost.createDate)}
                      </div>
                    </div>
                  </div>

                  {isEditingPost ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제목
                        </label>
                        <Input
                          value={editedPostTitle}
                          onChange={(e) => setEditedPostTitle(e.target.value)}
                          className="text-2xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          내용
                        </label>
                        <Textarea
                          value={editedPostContent}
                          onChange={(e) => setEditedPostContent(e.target.value)}
                          rows={10}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSaveEditedPost}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          저장
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedPost.title}
                      </h1>
                      <div className="text-gray-700 leading-relaxed">
                        {formatTextWithLineBreaks(selectedPost.content)}
                      </div>
                    </>
                  )}
                </div>

                {/* 댓글 섹션 */}
                {!isEditingPost && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      댓글 ({getValidComments(selectedPost).length})
                    </h3>

                    {/* 댓글 입력 */}
                    <div className="flex space-x-3 mb-6">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-yellow-500 text-white text-sm font-medium">
                          {currentUser.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Textarea
                          placeholder="댓글을 입력하세요..."
                          value={commentInputs[selectedPost.prjPostNo] || ''}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [selectedPost.prjPostNo]: e.target.value,
                            })
                          }
                          rows={2}
                          className="resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAddComment(selectedPost.prjPostNo)
                          }
                          disabled={
                            !commentInputs[selectedPost.prjPostNo]?.trim()
                          }
                          className="bg-blue-600 hover:bg-blue-700 self-end"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="space-y-4">
                      {getValidComments(selectedPost).map((comment) => {
                        const commentUserInfo = getCommentUserInfo(comment);
                        return (
                          <div
                            key={comment.commentNo}
                            className="flex space-x-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
                                {commentUserInfo.userName?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {commentUserInfo.userName}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {formatDate(comment.createDate)}
                                    </span>
                                    {comment.userId === currentUser.userId && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteComment(
                                            selectedPost.prjPostNo,
                                            comment.commentNo
                                          )
                                        }
                                        className="text-red-600 hover:text-red-700 p-1"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-700">
                                  {formatTextWithLineBreaks(
                                    comment.commentContent
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {getValidComments(selectedPost).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">아직 댓글이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
