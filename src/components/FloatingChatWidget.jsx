'use client';

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
  const { currentProject, projectMembers } = useSelector(
    (state) => state.project
  );

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [userNames, setUserNames] = useState({}); // 사용자 ID -> 이름 매핑
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // 시간 포맷팅 함수
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // 프로젝트 멤버에서 사용자 이름 찾기
  const getUserNameFromProjectMembers = (userId) => {
    if (projectMembers && Array.isArray(projectMembers)) {
      const member = projectMembers.find((member) => member.userId === userId);
      return member?.userName || member?.name || null;
    }
    return null;
  };

  // 사용자 이름 가져오기 함수 (API 호출)
  const fetchUserName = async (userId) => {
    if (userNames[userId]) {
      return userNames[userId];
    }

    // 먼저 프로젝트 멤버에서 찾기
    const memberName = getUserNameFromProjectMembers(userId);
    if (memberName) {
      setUserNames((prev) => ({
        ...prev,
        [userId]: memberName,
      }));
      return memberName;
    }

    try {
      // API 호출로 사용자 정보 가져오기
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 인증 토큰이 있다면 추가
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userName =
          userData.userName || userData.name || userData.userNm || userId;

        // 사용자 이름 캐시에 저장
        setUserNames((prev) => ({
          ...prev,
          [userId]: userName,
        }));

        console.log(`사용자 이름 로드 완료: ${userId} -> ${userName}`);
        return userName;
      } else {
        console.warn(
          `사용자 정보를 가져올 수 없습니다: ${userId}, Status: ${response.status}`
        );
        // fallback으로 userId 사용
        setUserNames((prev) => ({
          ...prev,
          [userId]: userId,
        }));
        return userId;
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      // fallback으로 userId 사용
      setUserNames((prev) => ({
        ...prev,
        [userId]: userId,
      }));
      return userId;
    }
  };

  // 사용자 이름 표시 함수
  const getUserDisplayName = (userId) => {
    if (userId === currentUser?.userId) {
      return (
        currentUser?.userName ||
        currentUser?.name ||
        currentUser?.userNm ||
        userId
      );
    }

    // 캐시된 이름이 있으면 사용
    if (userNames[userId]) {
      return userNames[userId];
    }

    // 프로젝트 멤버에서 찾기
    const memberName = getUserNameFromProjectMembers(userId);
    if (memberName) {
      return memberName;
    }

    return userId; // fallback
  };

  // 메시지에서 사용자 이름들 미리 로드
  const preloadUserNames = async (messages) => {
    const uniqueUserIds = [...new Set(messages.map((msg) => msg.userId))];
    const missingUserIds = uniqueUserIds.filter(
      (userId) =>
        userId !== currentUser?.userId &&
        !userNames[userId] &&
        !getUserNameFromProjectMembers(userId)
    );

    if (missingUserIds.length > 0) {
      console.log('사용자 이름 로딩 중:', missingUserIds);
      const promises = missingUserIds.map((userId) => fetchUserName(userId));
      await Promise.allSettled(promises); // 일부 실패해도 계속 진행
    }
  };

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

  // 메시지가 로드되면 사용자 이름들 미리 로드
  useEffect(() => {
    if (messages.length > 0) {
      preloadUserNames(messages);
    }
  }, [messages, projectMembers]);

  // 프로젝트 멤버 정보가 로드되면 사용자 이름 매핑 업데이트
  useEffect(() => {
    if (projectMembers && Array.isArray(projectMembers)) {
      const memberNames = {};
      projectMembers.forEach((member) => {
        if (member.userId && (member.userName || member.name)) {
          memberNames[member.userId] = member.userName || member.name;
        }
      });

      setUserNames((prev) => ({
        ...prev,
        ...memberNames,
      }));
    }
  }, [projectMembers]);

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

      const socket = new SockJS('http://192.168.34.70:80/ws');
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
          `/sub/chat.room.${chatroom.chatroomNo}`,
          async (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log('메시지 수신:', receivedMessage);

              // 메시지에 createDate가 없거나 유효하지 않으면 현재 시간으로 설정
              if (
                !receivedMessage.createDate ||
                receivedMessage.createDate === null
              ) {
                receivedMessage.createDate = new Date().toISOString();
                console.log(
                  'createDate가 없어서 현재 시간으로 설정:',
                  receivedMessage.createDate
                );
              }

              // 시간 형식 검증 및 수정
              const testDate = new Date(receivedMessage.createDate);
              if (isNaN(testDate.getTime())) {
                receivedMessage.createDate = new Date().toISOString();
                console.log(
                  '유효하지 않은 createDate, 현재 시간으로 설정:',
                  receivedMessage.createDate
                );
              }

              // 새로운 사용자의 이름 미리 로드
              if (
                receivedMessage.userId !== currentUser?.userId &&
                !userNames[receivedMessage.userId] &&
                !getUserNameFromProjectMembers(receivedMessage.userId)
              ) {
                await fetchUserName(receivedMessage.userId);
              }

              dispatch(messageReceived(receivedMessage));
            } catch (error) {
              console.error('메시지 파싱 오류:', error);
            }
          }
        );
      };

      client.onDisconnect = () => {
        console.log('WebSocket 연결 해제');
        dispatch(setConnectionStatus(false));
      };

      client.onStompError = (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        console.error('STOMP 에러 상세:', frame);
        dispatch(setConnectionStatus(false));

        // 재연결 시도
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('WebSocket 재연결 시도...');
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
      createDate: new Date().toISOString(), // 클라이언트에서 현재 시간 추가
    };

    console.log('전송할 메시지 데이터:', messageData);

    try {
      // WebSocket으로 전송 시도
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/pub/chat.message.${chatroom.chatroomNo}`,
          body: JSON.stringify(messageData),
        });
        setMessage('');
        console.log('WebSocket으로 메시지 전송 완료');
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
        console.log('WebSocket 실패, HTTP API로 재시도');
        await dispatch(sendMessage(messageData)).unwrap();
        setMessage('');
      } catch (httpError) {
        console.error('HTTP API 메시지 전송도 실패:', httpError);
        // 사용자에게 오류 알림
        alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 컴포넌트 언마운트 시 WebSocket 연결 해제
  useEffect(() => {
    return () => {
      if (stompClient) {
        console.log('컴포넌트 언마운트, WebSocket 연결 해제');
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

  // 채팅방이 변경되면 기존 연결 해제하고 새로 연결
  useEffect(() => {
    if (chatroom?.chatroomNo && isOpen) {
      if (stompClient) {
        console.log('채팅방 변경, 기존 연결 해제');
        stompClient.deactivate();
        setStompClient(null);
      }
      // 잠시 후 새로운 연결 시도
      setTimeout(() => {
        connectWebSocket();
      }, 1000);
    }
  }, [chatroom?.chatroomNo]);

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
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    아직 메시지가 없습니다.
                    <br />첫 번째 메시지를 보내보세요!
                  </div>
                ) : (
                  messages.map((msg) => (
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
                            {getUserDisplayName(msg.userId)}
                          </div>
                        )}
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {formatMessageTime(msg.createDate)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                disabled={loading || !isConnected}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || loading || !isConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <div className="text-xs text-red-500 mt-1">
                연결이 끊어졌습니다. 재연결 중...
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
