import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import {
  fetchMessages,
  sendMessage,
  updateReadMessageNo,
} from '@/store/slices/chatSlice';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function FloatingChatWidget() {
  const dispatch = useDispatch();
  const { messages, chatroom, loading, unreadCount } = useSelector(
    (state) => state.chat
  );
  const { currentProject } = useSelector((state) => state.project);
  const { currentUser } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  // 채팅방 열기/닫기
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // 채팅방을 열 때 메시지 읽음 처리
      markMessagesAsRead();
    }
  };

  // 채팅방 확장/축소
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 메시지 읽음 처리
  const markMessagesAsRead = () => {
    if (chatroom?.chatroomNo && messages.length > 0) {
      const lastMessageNo = messages[messages.length - 1].messageNo;
      dispatch(
        updateReadMessageNo({
          projectId: currentProject.prjNo,
          chatroomId: chatroom.chatroomNo,
          userId: currentUser.userId,
          readMessageNo: lastMessageNo,
        })
      );
    }
  };

  // 메시지 스크롤 처리
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentProject?.prjNo || !chatroom?.chatroomNo)
      return;

    const messageData = {
      messageNo: `MSG${String(Date.now()).slice(-6)}`,
      chatroomNo: chatroom.chatroomNo,
      prjNo: currentProject.prjNo,
      userId: currentUser.userId,
      userName: currentUser.userName,
      message: newMessage,
      createDate: new Date().toISOString(),
    };

    // 웹소켓으로 메시지 전송
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/pub/chat.message.${chatroom.chatroomNo}`,
        body: JSON.stringify(messageData),
      });
    } else {
      // 웹소켓 연결이 없는 경우 일반 API 호출
      dispatch(sendMessage(messageData));
    }

    setNewMessage('');
  };

  // 메시지 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 사용자 정보 가져오기
  const getMemberInfo = (userId) => {
    return (
      currentProject?.prjMemList?.find(
        (m) => m.userId === userId && !m.deleteDate
      ) || { userName: '알 수 없음' }
    );
  };

  // 웹소켓 연결
  useEffect(() => {
    if (currentProject?.prjNo && chatroom?.chatroomNo && isOpen) {
      // 웹소켓 연결 설정
      const socket = new SockJS('/ws-stomp'); // 서버의 웹소켓 엔드포인트
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 연결 성공 시
      stompClient.current.onConnect = () => {
        console.log('STOMP 연결 성공');

        // 채팅방 구독
        stompClient.current.subscribe(
          `/sub/chat.room.${chatroom.chatroomNo}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);

            // Redux 상태 업데이트
            dispatch({
              type: 'chat/messageReceived',
              payload: receivedMessage,
            });

            // 현재 채팅방이 열려있으면 자동으로 읽음 처리
            if (isOpen && receivedMessage.userId !== currentUser.userId) {
              dispatch(
                updateReadMessageNo({
                  projectId: currentProject.prjNo,
                  chatroomId: chatroom.chatroomNo,
                  userId: currentUser.userId,
                  readMessageNo: receivedMessage.messageNo,
                })
              );
            }
          }
        );
      };

      // 에러 처리
      stompClient.current.onStompError = (frame) => {
        console.error('STOMP 에러:', frame);
      };

      // 연결 시작
      stompClient.current.activate();

      // 컴포넌트 언마운트 시 연결 해제
      return () => {
        if (stompClient.current) {
          stompClient.current.deactivate();
        }
      };
    }
  }, [
    currentProject?.prjNo,
    chatroom?.chatroomNo,
    isOpen,
    dispatch,
    currentUser.userId,
  ]);

  // 메시지 로드
  useEffect(() => {
    if (currentProject?.prjNo && chatroom?.chatroomNo) {
      dispatch(
        fetchMessages({
          projectId: currentProject.prjNo,
          chatroomId: chatroom.chatroomNo,
        })
      );
    }
  }, [dispatch, currentProject?.prjNo, chatroom?.chatroomNo]);

  // 메시지 스크롤
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // 채팅방이 없는 경우
  if (!chatroom) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col ${
        isExpanded ? 'w-80 h-[70vh]' : 'w-72 h-[400px]'
      }`}
    >
      {/* 채팅 버튼 (닫혀있을 때) */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg p-4 h-14 w-14 flex items-center justify-center relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* 채팅 위젯 (열려있을 때) */}
      {isOpen && (
        <div
          className={`flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out h-full`}
        >
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-white">
                {chatroom.chatroomName || '프로젝트 채팅'}
              </span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700 p-1 h-8 w-8"
                onClick={toggleExpand}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700 p-1 h-8 w-8"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 채팅 메시지 영역 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                <p>아직 메시지가 없습니다</p>
                <p className="text-sm">첫 메시지를 보내보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.userId === currentUser.userId;
                  const senderInfo = getMemberInfo(msg.userId);
                  const prevMsg = messages[index - 1];
                  const showSenderInfo =
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
                      {!isCurrentUser && showSenderInfo && (
                        <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                          <AvatarFallback className="bg-gray-700 text-gray-200">
                            {senderInfo.userName?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`flex flex-col ${
                          isCurrentUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        {showSenderInfo && !isCurrentUser && (
                          <span className="text-xs text-gray-400 mb-1">
                            {senderInfo.userName || '알 수 없음'}
                          </span>
                        )}
                        <div
                          className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-700 text-white rounded-bl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.createDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 메시지 입력 영역 */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지 입력..."
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
