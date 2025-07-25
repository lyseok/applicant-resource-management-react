import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessageCircle, X, Send, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  fetchProjectChatroom,
  fetchMessages,
  sendMessage,
  updateReadMessageNo,
  messageReceived,
  setConnectionStatus,
  clearUnreadCount,
} from '@/store/slices/chatSlice';

export default function FloatingChatWidget() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { chatroom, messages, unreadCount, loading, isConnected } = useSelector(
    (state) => state.chat
  );
  const { currentUser } = useSelector((state) => state.auth);
  const { currentProject } = useSelector((state) => state.project);

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // 메시지 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 프로젝트 채팅방 초기화
  useEffect(() => {
    if (projectId && currentUser) {
      dispatch(fetchProjectChatroom(projectId));
    }
  }, [dispatch, projectId, currentUser]);

  // 채팅방이 로드되면 메시지 가져오기
  useEffect(() => {
    if (chatroom?.chatroomNo) {
      dispatch(fetchMessages({ chatroomNo: chatroom.chatroomNo }));
    }
  }, [dispatch, chatroom]);

  // WebSocket 연결
  const connectWebSocket = async () => {
    if (!chatroom?.chatroomNo || !currentUser?.userId) return;

    try {
      // 동적 import로 SockJS와 STOMP 로드
      const [SockJSModule, StompModule] = await Promise.all([
        import('sockjs-client'),
        import('@stomp/stompjs'),
      ]);

      const SockJS = SockJSModule.default || SockJSModule;
      const { Client } = StompModule;

      const socket = new SockJS('http://localhost:80/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP Debug:', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log('WebSocket 연결 성공');
        dispatch(setConnectionStatus(true));

        // 채팅방 구독
        client.subscribe(
          `/topic/chatroom/${chatroom.chatroomNo}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('메시지 수신:', receivedMessage);
            dispatch(messageReceived(receivedMessage));
          }
        );
      };

      client.onDisconnect = () => {
        console.log('WebSocket 연결 해제');
        dispatch(setConnectionStatus(false));
      };

      client.onStompError = (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        dispatch(setConnectionStatus(false));
        // 재연결 시도
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      dispatch(setConnectionStatus(false));
    }
  };

  // 채팅창 열기/닫기
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // 채팅창을 열 때
      if (!stompClient || !stompClient.connected) {
        connectWebSocket();
      }
      // 읽지 않은 메시지 수 초기화
      if (unreadCount > 0 && chatroom?.chatroomNo) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          dispatch(
            updateReadMessageNo({
              chatroomNo: chatroom.chatroomNo,
              readMessageNo: lastMessage.messageNo,
              userId: currentUser.userId,
            })
          );
        }
        dispatch(clearUnreadCount());
      }
    }
  };

  // 메시지 전송
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatroom) return;

    const messageData = {
      chatroomNo: chatroom.chatroomNo,
      prjNo: currentProject?.prjNo || projectId,
      userId: currentUser.userId,
      message: message.trim(),
    };

    console.log('전송할 메시지 데이터:', messageData);

    try {
      // WebSocket으로 전송 시도
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(messageData),
        });
        setMessage('');
      } else {
        // WebSocket 연결이 없으면 HTTP API 사용
        console.log('WebSocket 연결 없음, HTTP API 사용');
        await dispatch(sendMessage(messageData)).unwrap();
        setMessage('');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // WebSocket 실패 시 HTTP API로 재시도
      try {
        await dispatch(sendMessage(messageData)).unwrap();
        setMessage('');
      } catch (httpError) {
        console.error('HTTP API 메시지 전송도 실패:', httpError);
      }
    }
  };

  // 컴포넌트 언마운트 시 WebSocket 연결 해제
  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stompClient]);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 프로젝트 상세 페이지가 아니면 렌더링하지 않음
  if (!projectId) return null;

  // COMPANY 타입 사용자는 채팅 기능 사용 불가
  if (!currentUser || currentUser.userType === 'COMPANY') {
    return null;
  }

  return (
    <>
      {/* 플로팅 채팅 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="relative h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* 채팅 창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                {chatroom?.chatroomName ||
                  `${currentProject?.prjName || '프로젝트'} 채팅`}
              </h3>
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
            </div>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 메시지 영역 */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.messageNo}
                    className={`flex ${
                      msg.userId === currentUser?.userId
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                        msg.userId === currentUser?.userId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.userId !== currentUser?.userId && (
                        <div className="text-xs opacity-70 mb-1">
                          {msg.userId}
                        </div>
                      )}
                      <div>{msg.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.createDate).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* 메시지 입력 영역 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
