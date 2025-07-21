import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle, Users } from 'lucide-react';
import {
  fetchMessages,
  sendMessage,
  updateReadMessageNo,
} from '@/store/slices/chatSlice';

export default function ChatRoom() {
  const dispatch = useDispatch();
  const { messages, chatroom, loading } = useSelector((state) => state.chat);
  const { currentProject } = useSelector((state) => state.project);
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentProject?.prjNo && chatroom?.chatroomNo && isAuthenticated) {
      dispatch(
        fetchMessages({
          projectId: currentProject.prjNo,
          chatroomId: chatroom.chatroomNo,
        })
      );
    }
  }, [dispatch, currentProject, chatroom, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
    if (
      chatroom?.chatroomNo &&
      messages.length > 0 &&
      currentUser &&
      isAuthenticated
    ) {
      const lastMessageNo = messages[messages.length - 1].messageNo;
      dispatch(
        updateReadMessageNo({
          projectId: currentProject.prjNo,
          chatroomId: chatroom.chatroomNo,
          userId: currentUser.userId || currentUser.username,
          readMessageNo: lastMessageNo,
        })
      );
    }
  }, [
    messages,
    chatroom,
    dispatch,
    currentProject,
    currentUser,
    isAuthenticated,
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !currentProject?.prjNo ||
      !chatroom?.chatroomNo ||
      !currentUser ||
      !isAuthenticated
    )
      return;

    const messageData = {
      messageNo: `MSG${String(Date.now()).slice(-6)}`,
      chatroomNo: chatroom.chatroomNo,
      prjNo: currentProject.prjNo,
      userId: currentUser.userId || currentUser.username,
      userName: currentUser.userName || currentUser.username,
      message: newMessage,
      createDate: new Date().toISOString(),
    };
    dispatch(sendMessage(messageData));
    setNewMessage('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMemberInfo = (userId) => {
    // 현재 사용자인지 먼저 확인
    if (
      currentUser &&
      (currentUser.userId === userId || currentUser.username === userId)
    ) {
      return {
        userName: currentUser.userName || currentUser.username,
        userEmail: currentUser.userEmail || currentUser.email || '',
      };
    }

    // 현재 프로젝트 멤버에서 찾기
    const projectMember = currentProject?.prjMemList?.find(
      (m) => m.userId === userId && !m.deleteDate
    );
    if (projectMember) {
      return {
        userName: projectMember.userName,
        userEmail: projectMember.userEmail || '',
      };
    }

    // 채팅방 멤버에서 찾기
    const chatMember = chatroom?.members?.find((m) => m.userId === userId);
    if (chatMember) {
      return {
        userName: chatMember.userName,
        userEmail: chatMember.userEmail || '',
      };
    }

    return {
      userName: '알 수 없음',
      userEmail: '',
    };
  };

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">로그인이 필요합니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            채팅을 사용하려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">이 프로젝트에는 채팅방이 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            프로젝트 설정에서 채팅방을 활성화하거나 생성할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 bg-gray-50 p-4 overflow-hidden"
      style={{ height: 'calc(100vh - 120px)' }}
    >
      <Card className="h-full flex flex-col bg-white shadow-sm border border-gray-200 max-w-4xl mx-auto">
        <CardHeader className="pb-4 border-b border-gray-200 flex-shrink-0">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
            {chatroom.chatroomName || '프로젝트 채팅방'}
            <span className="ml-auto text-sm text-gray-500 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {chatroom.members?.length || 0}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-6 overflow-y-auto min-h-0">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>아직 메시지가 없습니다.</p>
                <p className="text-sm mt-1">첫 번째 메시지를 보내보세요!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isCurrentUser =
                  msg.userId === (currentUser.userId || currentUser.username);
                const senderInfo = getMemberInfo(msg.userId);
                const prevMsg = messages[index - 1];
                const showAvatarAndName =
                  !prevMsg ||
                  prevMsg.userId !== msg.userId ||
                  new Date(msg.createDate).getTime() -
                    new Date(prevMsg.createDate).getTime() >
                    5 * 60 * 1000;

                return (
                  <div
                    key={msg.messageNo}
                    className={`flex ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isCurrentUser && showAvatarAndName && (
                      <Avatar className="w-8 h-8 mr-3 flex-shrink-0">
                        <AvatarFallback className="bg-gray-300 text-gray-800 text-sm font-medium">
                          {senderInfo.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      {showAvatarAndName && (
                        <div
                          className={`text-xs text-gray-600 mb-1 ${
                            isCurrentUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {senderInfo.userName}
                        </div>
                      )}
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {formatDate(msg.createDate)}
                      </span>
                    </div>
                    {isCurrentUser && showAvatarAndName && (
                      <Avatar className="w-8 h-8 ml-3 flex-shrink-0">
                        <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                          {senderInfo.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t border-gray-200 flex items-center space-x-3 flex-shrink-0">
          <Input
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
