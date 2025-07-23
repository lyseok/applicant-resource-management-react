import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ChevronLeft,
  ChevronRightIcon,
} from 'lucide-react';
import { updateTask, openTaskPanel } from '@/store/slices/taskSlice';
import TaskPanel from './TaskPanel';

export default function GanttChart() {
  const { tasks, isTaskPanelOpen, selectedTask } = useSelector(
    (state) => state.tasks
  );
  const { currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  // API 상태 코드 사용
  const [expandedSections, setExpandedSections] = useState([
    'PEND-001', // TODO
    'PEND-002', // IN_PROGRESS
    'PEND-003', // COMPLETED
  ]);
  const [draggedTask, setDraggedTask] = useState(null);
  // 현재 날짜를 기준으로 초기화
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const getTasksByStatus = (status) => {
    console.log('Filtering tasks by status:', status);
    console.log('Available tasks:', tasks);
    const filteredTasks = tasks.filter((task) => task.taskStatus === status);
    console.log('Filtered tasks:', filteredTasks);
    return filteredTasks;
  };

  const getSectionTitle = (status) => {
    switch (status) {
      case 'PEND-001':
        return '할 일';
      case 'PEND-002':
        return '수행 중';
      case 'PEND-003':
        return '완료';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'PCOD001': // HIGH
      case 'HIGH':
        return 'bg-red-500';
      case 'PCOD002': // MEDIUM
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'PCOD003': // LOW
      case 'LOW':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 날짜 관련 함수들
  const getWeeksInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];

    const currentWeek = new Date(firstDay);
    currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // 주의 시작을 일요일로

    while (currentWeek <= lastDay) {
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({
        start: new Date(currentWeek),
        end: weekEnd,
        weekNumber: getWeekNumber(currentWeek),
      });
      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    return weeks;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getTaskPosition = (task) => {
    if (!task.startDate || !task.dueDate) return { left: '0%', width: '0%' };

    const taskStartDate = new Date(
      task.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );
    const taskEndDate = new Date(
      task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );

    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const effectiveStartDate = new Date(
      Math.max(taskStartDate.getTime(), monthStart.getTime())
    );
    const effectiveEndDate = new Date(
      Math.min(taskEndDate.getTime(), monthEnd.getTime())
    );

    if (effectiveStartDate > effectiveEndDate) {
      return { left: '0%', width: '0%' };
    }

    const totalDaysInMonth = monthEnd.getDate();
    const daysFromMonthStartToEffectiveStart =
      (effectiveStartDate.getTime() - monthStart.getTime()) /
      (1000 * 60 * 60 * 24);
    const effectiveDurationDays =
      (effectiveEndDate.getTime() - effectiveStartDate.getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    const left = (daysFromMonthStartToEffectiveStart / totalDaysInMonth) * 100;
    const width = (effectiveDurationDays / totalDaysInMonth) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const handleTaskClick = (task) => {
    dispatch(openTaskPanel(task));
  };

  const handleTaskDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDrop = (e, newDate) => {
    e.preventDefault();
    if (draggedTask) {
      const startDate = new Date(
        draggedTask.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      );
      const endDate = new Date(
        draggedTask.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      );
      const duration = endDate.getTime() - startDate.getTime();

      const updatedTask = {
        ...draggedTask,
        startDate: newDate.toISOString().split('T')[0].replace(/-/g, ''),
        dueDate: new Date(newDate.getTime() + duration)
          .toISOString()
          .split('T')[0]
          .replace(/-/g, ''),
      };

      dispatch(
        updateTask({ taskId: draggedTask.taskNo, taskData: updatedTask })
      );
      setDraggedTask(null);
    }
  };

  const handleAddTask = (status) => {
    const newTask = {
      taskNo: null,
      taskName: '',
      userId: '',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      dueDate: '',
      startDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      priorityCode: 'PCOD002', // API 코드 사용
      taskStatus: status,
      progressRate: '0',
      detailContent: '',
      upperTaskNo: null,
      predecessorTaskNo: null,
      prjNo: currentProject?.prjNo || 'PRJ001',
    };
    dispatch(openTaskPanel(newTask));
  };

  const getAssigneeInfo = (userId) => {
    if (!userId) return { userName: '미지정', userEmail: '' };

    // 활성 멤버에서 찾기
    const member = currentProject?.prjMemList?.find(
      (m) => m.userId === userId && !m.deleteDate
    );
    return member || { userName: '미지정', userEmail: '' };
  };

  const weeks = getWeeksInMonth(currentMonth);

  // 상태별 섹션 정의 (API 상태 코드 사용)
  const statusSections = [
    { id: 'PEND-001', title: '할 일' },
    { id: 'PEND-002', title: '수행 중' },
    { id: 'PEND-003', title: '완료' },
  ];

  // 작업 행 높이 통일 (48px)
  const TASK_ROW_HEIGHT = 48;
  const SECTION_HEADER_HEIGHT = 48;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* 타임라인 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50 font-medium rounded-lg bg-transparent h-12"
              onClick={() => handleAddTask('PEND-001')}
            >
              <Plus className="w-4 h-4 mr-2" />
              작업 추가
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 주별 헤더 */}
        <div className="flex">
          <div className="w-64 flex-shrink-0"></div>
          <div className="flex-1 grid grid-cols-4 gap-1">
            {weeks.slice(0, 4).map((week, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">{week.weekNumber}주</div>
                <div className="text-sm font-medium">
                  {week.start.getDate()} - {week.end.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 간트 차트 본문 */}
      <div className="flex">
        {/* 왼쪽 작업 목록 */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          {/* 헤더 공간 */}
          <div className="h-12 border-b border-gray-200"></div>

          {statusSections.map((section) => {
            const sectionTasks = getTasksByStatus(section.id);
            return (
              <div key={section.id} className="border-b border-gray-200">
                {/* 섹션 헤더 - 고정 높이 */}
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 hover:bg-gray-50"
                  style={{ height: `${SECTION_HEADER_HEIGHT}px` }}
                  onClick={() => toggleSection(section.id)}
                >
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-medium">{section.title}</span>
                  <Badge variant="outline" className="ml-auto">
                    {sectionTasks.length}
                  </Badge>
                </Button>

                {/* 섹션 내용 */}
                {expandedSections.includes(section.id) && (
                  <div>
                    {sectionTasks.map((task) => {
                      const assigneeInfo = getAssigneeInfo(task.userId);
                      return (
                        <div
                          key={task.taskNo}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center"
                          style={{ height: `${TASK_ROW_HEIGHT}px` }}
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="flex items-center space-x-2 w-full">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-yellow-500 text-white text-xs">
                                {assigneeInfo.userName?.charAt(0) || '미'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {task.taskName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {task.startDate &&
                                  task.dueDate &&
                                  `${task.startDate.slice(
                                    4,
                                    6
                                  )}/${task.startDate.slice(
                                    6,
                                    8
                                  )} ~ ${task.dueDate.slice(
                                    4,
                                    6
                                  )}/${task.dueDate.slice(6, 8)}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* 작업 추가 버튼 - 왼쪽에만 유지 */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-4 text-gray-500 hover:bg-gray-50 flex items-center"
                      style={{ height: `${TASK_ROW_HEIGHT}px` }}
                      onClick={() => handleAddTask(section.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      작업 추가
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 오른쪽 간트 차트 */}
        <div
          ref={chartRef}
          className="flex-1 bg-white overflow-x-auto relative"
        >
          <div className="relative min-w-full h-full">
            {/* 그리드 배경 */}
            <div className="absolute inset-0 grid grid-cols-4 gap-1 opacity-20">
              {weeks.slice(0, 4).map((_, index) => (
                <div key={index} className="border-r border-gray-200"></div>
              ))}
            </div>

            {/* 헤더 공간 */}
            <div className="h-12 border-b border-gray-200"></div>

            {/* 작업 바들 */}
            {statusSections.map((section) => {
              const sectionTasks = getTasksByStatus(section.id);

              return (
                <div key={section.id} className="relative">
                  {/* 섹션 헤더 공간 - 왼쪽과 동일한 높이 */}
                  <div
                    className="border-b border-gray-200"
                    style={{ height: `${SECTION_HEADER_HEIGHT}px` }}
                  ></div>

                  {/* 섹션 내용 */}
                  {expandedSections.includes(section.id) && (
                    <>
                      {/* 작업 바들 */}
                      {sectionTasks.map((task) => {
                        const position = getTaskPosition(task);
                        const hasValidDates = task.startDate && task.dueDate;

                        // 현재 월과 겹치는지 확인
                        let isVisible = false;
                        if (hasValidDates) {
                          const taskStartDate = new Date(
                            task.startDate.replace(
                              /(\d{4})(\d{2})(\d{2})/,
                              '$1-$2-$3'
                            )
                          );
                          const taskEndDate = new Date(
                            task.dueDate.replace(
                              /(\d{4})(\d{2})(\d{2})/,
                              '$1-$2-$3'
                            )
                          );
                          const monthStart = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            1
                          );
                          const monthEnd = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            0
                          );
                          isVisible =
                            taskStartDate <= monthEnd &&
                            taskEndDate >= monthStart;
                        }

                        return (
                          <div
                            key={task.taskNo}
                            className="relative border-b border-gray-100 flex items-center"
                            style={{ height: `${TASK_ROW_HEIGHT}px` }}
                          >
                            {hasValidDates && isVisible && (
                              <div
                                className={`absolute h-6 rounded ${getPriorityColor(
                                  task.priorityCode
                                )} opacity-80 cursor-pointer hover:opacity-100 transition-opacity flex items-center px-2`}
                                style={{
                                  left: position.left,
                                  width: position.width,
                                  minWidth: '60px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                                draggable
                                onDragStart={(e) =>
                                  handleTaskDragStart(e, task)
                                }
                                onClick={() => handleTaskClick(task)}
                              >
                                <span className="text-white text-xs font-medium truncate">
                                  {task.taskName}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* 작업 추가 공간 - 차트에서는 버튼 제거, 높이만 유지 */}
                      <div
                        className="border-b border-gray-200"
                        style={{ height: `${TASK_ROW_HEIGHT}px` }}
                      ></div>
                    </>
                  )}
                </div>
              );
            })}

            {/* 섹션 추가 공간 */}
            <div style={{ height: `${SECTION_HEADER_HEIGHT}px` }}></div>
          </div>
        </div>
      </div>

      {/* 작업 패널 */}
      <TaskPanel isOpen={isTaskPanelOpen} task={selectedTask} />
    </div>
  );
}
