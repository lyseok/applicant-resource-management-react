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
import { X, Check, Trash2, ChevronDown, Plus, Bell } from 'lucide-react';
import {
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  closeTaskPanel,
} from '@/store/slices/taskSlice';

export default function TaskPanel({ isOpen, task }) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);

  const [taskName, setTaskName] = useState('');
  const [userId, setUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [priorityCode, setPriorityCode] = useState('PCOD002');
  const [taskStatus, setTaskStatus] = useState('PEND-001');
  const [detailContent, setDetailContent] = useState('');
  const [progressRate, setProgressRate] = useState('0');
  const [upperTaskNo, setUpperTaskNo] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 활성 멤버만 필터링 (deleteDate가 null인 멤버)
  const activeMembers =
    currentProject?.prjMemList?.filter(
      (member) => member.deleteDate === null
    ) || [];

  // task가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName || '');
      setUserId(task.userId || '');
      setDueDate(task.dueDate || '');
      setStartDate(task.startDate || '');
      setPriorityCode(task.priorityCode || 'PCOD002');
      setTaskStatus(task.taskStatus || 'PEND-001');
      setDetailContent(task.detailContent || '');
      setProgressRate(task.progressRate || '0');
      setUpperTaskNo(task.upperTaskNo || '');
    } else {
      // 새 작업일 때 초기화
      setTaskName('');
      setUserId('');
      setDueDate('');
      setStartDate('');
      setPriorityCode('PCOD002');
      setTaskStatus('PEND-001');
      setDetailContent('');
      setProgressRate('0');
      setUpperTaskNo('');
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskName.trim()) return;

    const taskData = {
      taskName,
      prjNo: currentProject?.prjNo,
      userId,
      creatorId: user?.userId,
      dueDate,
      startDate,
      priorityCode,
      taskStatus,
      detailContent,
      progressRate,
      upperTaskNo: upperTaskNo || null,
    };

    try {
      if (task?.taskNo) {
        // 기존 작업 업데이트 - taskNo를 정확히 전달
        await dispatch(
          updateTaskAsync({
            taskId: task.taskNo, // task.taskNo를 taskId로 전달
            taskData: { ...taskData, taskNo: task.taskNo },
          })
        ).unwrap();
      } else {
        // 새 작업 생성
        await dispatch(createTaskAsync(taskData)).unwrap();
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

  const handleDelete = async () => {
    if (!task?.taskNo) return;

    try {
      await dispatch(deleteTaskAsync(task.taskNo)).unwrap();

      // 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(closeTaskPanel());
      }, 1500);
    } catch (error) {
      console.error('작업 삭제 실패:', error);
    }
  };

  const handleMarkComplete = () => {
    const newProgressRate = progressRate === '100' ? '0' : '100';
    const newStatus = newProgressRate === '100' ? 'PEND-003' : 'PEND-001';
    setProgressRate(newProgressRate);
    setTaskStatus(newStatus);
  };

  const handleClose = () => {
    dispatch(closeTaskPanel());
  };

  // 담당자 변경 핸들러 - UI 즉시 업데이트
  const handleAssigneeChange = (newUserId) => {
    console.log('Assignee changed to:', newUserId);
    setUserId(newUserId === 'none' ? '' : newUserId);
  };

  const availableTasks = tasks.filter((t) => t.taskNo !== task?.taskNo);

  // 담당자 정보 가져오기
  const getAssigneeInfo = (userId) => {
    if (!userId) return null;

    // API 응답에서 prjMem 객체 사용
    if (task?.prjMem && task.prjMem.userName && task.prjMem.userId === userId) {
      return {
        userName: task.prjMem.userName,
        userEmail: task.prjMem.userEmail || '',
      };
    }

    // 활성 멤버에서 찾기
    const member = activeMembers.find((m) => m.userId === userId);
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
          <span className="font-medium">
            {isNewTask ? '작업이 생성되었습니다!' : '저장이 완료되었습니다!'}
          </span>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">작업 삭제</h3>
            <p className="text-gray-600 mb-6">
              이 작업을 삭제하시겠습니까? 삭제된 작업은 복구할 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="flex-1"
              >
                삭제
              </Button>
            </div>
          </div>
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
            <div className="flex items-center space-x-2">
              {/* 완료됨 버튼 */}
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

              {/* 삭제 버튼 - 기존 작업에만 표시 */}
              {!isNewTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>

            {/* 닫기 버튼 */}
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
            <Select
              value={userId || 'none'}
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="담당자를 선택하세요">
                  {assigneeInfo ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                          {assigneeInfo.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assigneeInfo.userName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">담당자 미지정</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">담당자 미지정</SelectItem>
                {activeMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                          {member.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.userName}</div>
                        <div className="text-xs text-gray-500">
                          {member.userPosition || '직책 없음'}
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
                    <SelectItem value="PEND-001">할 일</SelectItem>
                    <SelectItem value="PEND-002">진행 중</SelectItem>
                    <SelectItem value="PEND-003">완료</SelectItem>
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
                    <SelectItem value="PCOD003">낮음</SelectItem>
                    <SelectItem value="PCOD002">중간</SelectItem>
                    <SelectItem value="PCOD001">높음</SelectItem>
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
