import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  Check,
  ThumbsUp,
  Paperclip,
  Share2,
  Link,
  Maximize2,
  MoreHorizontal,
  ChevronDown,
  Plus,
  Bell,
} from 'lucide-react';
import {
  createTask,
  updateTask,
  closeTaskPanel,
} from '@/store/slices/taskSlice';

export default function TaskPanel({ isOpen, task }) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);

  const [taskName, setTaskName] = useState('');
  const [userId, setUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [priorityCode, setPriorityCode] = useState('MEDIUM');
  const [taskStatus, setTaskStatus] = useState('TODO');
  const [detailContent, setDetailContent] = useState('');
  const [comment, setComment] = useState('');
  const [progressRate, setProgressRate] = useState('0');
  const [upperTaskNo, setUpperTaskNo] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // task가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName || '');
      setUserId(task.userId || '');
      setDueDate(task.dueDate || '');
      setStartDate(task.startDate || '');
      setPriorityCode(task.priorityCode || 'MEDIUM');
      setTaskStatus(task.taskStatus || 'TODO');
      setDetailContent(task.detailContent || '');
      setProgressRate(task.progressRate || '0');
      setUpperTaskNo(task.upperTaskNo || '');
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskName.trim()) return;

    const taskData = {
      taskName,
      prjNo: currentProject?.prjNo || 'PRJ001',
      userId,
      sectNo: 'SECT001',
      creatorId: 'USER001',
      dueDate,
      startDate,
      priorityCode,
      taskStatus,
      detailContent,
      progressRate,
      upperTaskNo: upperTaskNo || null,
      deleteDate: null,
      deleteUserId: null,
    };

    try {
      if (task?.taskNo) {
        // 기존 작업 업데이트
        dispatch(
          updateTask({
            id: task.taskNo,
            taskData: { ...taskData, taskNo: task.taskNo },
          })
        );
      } else {
        // 새 작업 생성
        const newTaskNo = `TASK${String(tasks.length + 1).padStart(3, '0')}`;
        dispatch(createTask({ ...taskData, taskNo: newTaskNo }));
      }

      // 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(closeTaskPanel());
      }, 1500);
    } catch (error) {
      console.error('작업 저장 실패:', error);
    }
  };

  const handleMarkComplete = () => {
    const newProgressRate = progressRate === '100' ? '0' : '100';
    const newStatus = newProgressRate === '100' ? 'COMPLETED' : 'TODO';
    setProgressRate(newProgressRate);
    setTaskStatus(newStatus);
  };

  const handleClose = () => {
    dispatch(closeTaskPanel());
  };

  const availableTasks = tasks.filter((t) => t.taskNo !== task?.taskNo);
  const projectMembers = currentProject?.members || [];

  // 담당자 정보 가져오기
  const getAssigneeInfo = (userId) => {
    const member = projectMembers.find((m) => m.userId === userId);
    return member || { userName: '미지정', userEmail: '' };
  };

  if (!isOpen) return null;

  const isNewTask = !task?.taskNo;
  const assigneeInfo = userId ? getAssigneeInfo(userId) : null;

  return (
    <>
      {/* 성공 메시지 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">저장이 완료되었습니다!</span>
        </div>
      )}

      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* 사이드 패널 */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              className={`border-gray-300 hover:bg-gray-50 font-medium rounded-lg ${
                progressRate === '100'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-transparent'
              }`}
              onClick={handleMarkComplete}
            >
              <Check className="w-4 h-4 mr-2" />
              {progressRate === '100' ? '완료됨' : '완료로 표시'}
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ThumbsUp className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Paperclip className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Link className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Maximize2 className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={handleClose}
              >
                <X className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 작업 제목 */}
          <div>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="text-xl font-semibold border-none p-0 focus:ring-0 bg-transparent"
              placeholder={
                isNewTask
                  ? '새 작업 제목을 입력하세요'
                  : '작업 제목을 입력하세요'
              }
            />
          </div>

          {/* 담당자 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">담당자</label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="담당자를 선택하세요">
                  {assigneeInfo && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                          {assigneeInfo.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assigneeInfo.userName}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">담당자 미지정</SelectItem>
                {projectMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                          {member.userName?.charAt(0) ||
                            member.userEmail?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.userName}</div>
                        <div className="text-xs text-gray-500">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 시작일과 마감일 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                시작일
              </label>
              <Input
                type="date"
                value={
                  startDate
                    ? startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
                    : ''
                }
                onChange={(e) => setStartDate(e.target.value.replace(/-/g, ''))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                마감일
              </label>
              <Input
                type="date"
                value={
                  dueDate
                    ? dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
                    : ''
                }
                onChange={(e) => setDueDate(e.target.value.replace(/-/g, ''))}
                className="w-full"
              />
            </div>
          </div>

          {/* 프로젝트 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              프로젝트
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  {currentProject?.projectName}
                </span>
                <Select value={taskStatus} onValueChange={setTaskStatus}>
                  <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto">
                    <SelectValue />
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">할 일</SelectItem>
                    <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                    <SelectItem value="COMPLETED">완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 상위 작업 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              상위 작업
            </label>
            <Select
              value={upperTaskNo || 'none'}
              onValueChange={(value) =>
                setUpperTaskNo(value === 'none' ? '' : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상위 작업을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">상위 작업 없음</SelectItem>
                {availableTasks.map((t) => (
                  <SelectItem key={t.taskNo} value={t.taskNo}>
                    {t.taskName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 필드 */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">필드</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">우선순위</span>
                </div>
                <Select value={priorityCode} onValueChange={setPriorityCode}>
                  <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">낮음</SelectItem>
                    <SelectItem value="MEDIUM">중간</SelectItem>
                    <SelectItem value="HIGH">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">진척도</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={progressRate}
                    onChange={(e) => setProgressRate(e.target.value)}
                    className="w-16 text-right text-sm"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">설명</label>
            <Textarea
              value={detailContent}
              onChange={(e) => setDetailContent(e.target.value)}
              placeholder="이 작업에 대해 설명해 주세요"
              className="min-h-32 resize-none border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 하위 작업 추가 */}
          <div>
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:bg-gray-50 rounded-lg p-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              하위 작업 추가
            </Button>
          </div>

          {/* 댓글 입력 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-yellow-500 text-white text-sm font-medium">
                  미
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글 추가"
                  className="min-h-16 resize-none border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">작업 참여자</span>
              {assigneeInfo && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                    {assigneeInfo.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Bell className="w-4 h-4 mr-2" />
              작업 나가기
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !taskName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading
                ? '저장 중...'
                : isNewTask
                ? '작업 생성'
                : '변경사항 저장'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
