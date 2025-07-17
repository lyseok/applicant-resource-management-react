import { useState } from 'react';
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
  const [expandedSections, setExpandedSections] = useState([
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
  ]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 6)); // July 2024

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.taskStatus === status);
  };

  const getSectionTitle = (status) => {
    switch (status) {
      case 'TODO':
        return '할 일';
      case 'IN_PROGRESS':
        return '수행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
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

    // Calculate the effective start and end dates within the current month's view
    const effectiveStartDate = new Date(
      Math.max(taskStartDate.getTime(), monthStart.getTime())
    );
    const effectiveEndDate = new Date(
      Math.min(taskEndDate.getTime(), monthEnd.getTime())
    );

    // If the task doesn't overlap with the current month, return zero width
    if (effectiveStartDate > effectiveEndDate) {
      return { left: '0%', width: '0%' };
    }

    const totalDaysInMonth = monthEnd.getDate(); // Number of days in the current month
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

      dispatch(updateTask({ id: draggedTask.taskNo, taskData: updatedTask }));
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
      priorityCode: 'MEDIUM',
      taskStatus: status,
      progressRate: '0',
      detailContent: '',
      upperTaskNo: null,
      prjNo: currentProject?.prjNo || 'PRJ001',
    };
    dispatch(openTaskPanel(newTask));
  };

  const getAssigneeInfo = (userId) => {
    if (!userId) return { userName: '미지정', userEmail: '' };
    const member = currentProject?.members?.find((m) => m.userId === userId);
    return member || { userName: '미지정', userEmail: '' };
  };

  const weeks = getWeeksInMonth(currentMonth);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* 타임라인 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50 font-medium rounded-lg bg-transparent"
              onClick={() => handleAddTask('TODO')}
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
          {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => {
            const sectionTasks = getTasksByStatus(status);
            return (
              <div key={status} className="border-b border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 hover:bg-gray-50 h-12"
                  onClick={() => toggleSection(status)}
                >
                  {expandedSections.includes(status) ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-medium">{getSectionTitle(status)}</span>
                  <Badge variant="outline" className="ml-auto">
                    {sectionTasks.length}
                  </Badge>
                </Button>

                {expandedSections.includes(status) && (
                  <div className="pb-2">
                    {sectionTasks.map((task) => {
                      const assigneeInfo = getAssigneeInfo(task.userId);
                      return (
                        <div
                          key={task.taskNo}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 h-10 flex items-center"
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
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-4 text-gray-500 hover:bg-gray-50 h-12"
                      onClick={() => handleAddTask(status)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      작업 추가
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          <Button
            variant="ghost"
            className="w-full justify-start p-4 text-gray-500 hover:bg-gray-50 h-12"
            onClick={() => handleAddTask('TODO')}
          >
            <Plus className="w-4 h-4 mr-2" />
            섹션 추가
          </Button>
        </div>

        {/* 오른쪽 간트 차트 */}
        <div className="flex-1 bg-white overflow-x-auto">
          <div className="relative min-w-full h-full">
            {/* 그리드 배경 */}
            <div className="absolute inset-0 grid grid-cols-4 gap-1 opacity-20">
              {weeks.slice(0, 4).map((_, index) => (
                <div key={index} className="border-r border-gray-200"></div>
              ))}
            </div>

            {/* 작업 바들 */}
            {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(
              (status, sectionIndex) => {
                const sectionTasks = getTasksByStatus(status);
                if (!expandedSections.includes(status)) return null;

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

                return (
                  <div key={status} className="relative">
                    {/* 섹션 헤더 공간 */}
                    <div className="h-12 border-b border-gray-200"></div>

                    {/* 작업들 */}
                    {sectionTasks
                      .filter((task) => {
                        if (!task.startDate || !task.dueDate) return false;
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
                        return (
                          taskStartDate <= monthEnd && taskEndDate >= monthStart
                        );
                      })
                      .map((task, taskIndex) => {
                        const position = getTaskPosition(task);
                        return (
                          <div
                            key={task.taskNo}
                            className="relative h-10 border-b border-gray-100 flex items-center"
                          >
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
                              onDragStart={(e) => handleTaskDragStart(e, task)}
                              onClick={() => handleTaskClick(task)}
                            >
                              <span className="text-white text-xs font-medium truncate">
                                {task.taskName}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                    {/* 작업 추가 공간 */}
                    <div className="h-12 border-b border-gray-200"></div>
                  </div>
                );
              }
            )}

            {/* 섹션 추가 공간 */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>

      {/* 작업 패널 */}
      <TaskPanel isOpen={isTaskPanelOpen} task={selectedTask} />
    </div>
  );
}
