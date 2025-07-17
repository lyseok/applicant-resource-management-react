import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Plus, Search, Star } from 'lucide-react';
import { fetchTasks, updateTask } from '@/store/slices/taskSlice';
import TaskPanel from '@/components/TaskPanel';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import ProjectOverview from '@/components/ProjectOverview';
import Dashboard from '@/components/Dashboard';

const tabs = [
  '요약',
  '보드',
  '목록',
  '타임라인',
  '대시보드',
  '캘린더',
  '워크플로',
  '메시지',
  '파일',
];

export default function MyTasks() {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);

  const [activeTab, setActiveTab] = useState('목록');
  const [expandedSections, setExpandedSections] = useState([
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
  ]);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks(currentProject.prjNo));
  }, [dispatch, currentProject.prjNo]);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'TODO':
        return '할 일';
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '높음';
      case 'MEDIUM':
        return '보통';
      case 'LOW':
        return '낮음';
      default:
        return priority;
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskPanelOpen(true);
  };

  const handleTaskStatusChange = async (taskNo, completed) => {
    const task = tasks.find((t) => t.taskNo === taskNo);
    if (task) {
      const newStatus = completed ? 'COMPLETED' : 'TODO';
      await dispatch(
        updateTask({
          id: taskNo,
          taskData: {
            ...task,
            taskStatus: newStatus,
            progressRate: completed ? '100' : '0',
          },
        })
      );
    }
  };

  const handleAddTask = (status = 'TODO') => {
    setSelectedTask({
      taskNo: null,
      taskName: '',
      userId: 'USER001',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      dueDate: '',
      startDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      priorityCode: 'MEDIUM',
      taskStatus: status,
      progressRate: '0',
      detailContent: '',
      upperTaskNo: null,
    });
    setIsTaskPanelOpen(true);
  };

  // 요약 탭
  if (activeTab === '요약') {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                  {currentProject.status}
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
                  공유
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                >
                  프로젝트 작업
                </Button>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <ProjectOverview />
      </div>
    );
  }

  // 대시보드 탭
  if (activeTab === '대시보드') {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                  {currentProject.status}
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
                  공유
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                >
                  프로젝트 작업
                </Button>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Dashboard />
      </div>
    );
  }

  // 보드 탭이 선택된 경우 칸반 보드 렌더링
  if (activeTab === '보드') {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                  {currentProject.status}
                </Badge>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
                  공유
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                >
                  프로젝트 작업
                </Button>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 도구 모음 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50 font-medium rounded-lg bg-transparent"
              onClick={() => handleAddTask()}
            >
              <Plus className="w-4 h-4 mr-2" />
              작업 추가
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                필터링
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                정렬
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                그룹
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                숨기기
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 칸반 보드 */}
        <KanbanBoard />
      </div>
    );
  }

  // 타임라인 탭이 선택된 경우 간트 차트 렌더링
  if (activeTab === '타임라인') {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                  {currentProject.status}
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
                  공유
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                >
                  프로젝트 작업
                </Button>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 간트 차트 */}
        <GanttChart />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentProject.name}
              </h1>
              <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                {currentProject.status}
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
                공유
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
              >
                프로젝트 작업
              </Button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto hover:bg-gray-100 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 도구 모음 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50 font-medium rounded-lg bg-transparent"
            onClick={() => handleAddTask()}
          >
            <Plus className="w-4 h-4 mr-2" />
            작업 추가
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              정렬하기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              필터
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              그룹
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              숨기기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 작업 목록 */}
      <div className="bg-white m-6 rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-12 gap-4 pb-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
            <div className="col-span-5">작업</div>
            <div className="col-span-2">담당자</div>
            <div className="col-span-2">마감일</div>
            <div className="col-span-2">우선순위</div>
            <div className="col-span-1">상태</div>
          </div>

          {/* 할 일 섹션 */}
          <div className="mt-6">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg w-auto"
              onClick={() => toggleSection('TODO')}
            >
              {expandedSections.includes('TODO') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-semibold text-gray-900">할 일</span>
            </Button>

            {expandedSections.includes('TODO') && (
              <div className="space-y-3 ml-6 mt-3">
                {tasks
                  .filter((task) => task.taskStatus === 'TODO')
                  .map((task) => (
                    <div
                      key={task.taskNo}
                      className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="col-span-5 flex items-center space-x-3">
                        <Checkbox
                          className="border-gray-300"
                          checked={task.progressRate === '100'}
                          onCheckedChange={(checked) =>
                            handleTaskStatusChange(task.taskNo, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-900 font-medium">
                          {task.taskName}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-yellow-500 text-white font-medium">
                              미문
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">미문</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-gray-600">
                          {task.dueDate
                            ? `${task.dueDate.slice(
                                4,
                                6
                              )}월 ${task.dueDate.slice(6, 8)}일`
                            : ''}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Badge
                          className={`${getPriorityColor(
                            task.priorityCode
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getPriorityLabel(task.priorityCode)}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Badge
                          className={`${getStatusColor(
                            task.taskStatus
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getStatusLabel(task.taskStatus)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="text-sm text-gray-500 ml-8 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleAddTask('TODO')}
                >
                  작업 추가...
                </Button>
              </div>
            )}
          </div>

          {/* 수행 중 섹션 */}
          <div className="mt-8">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg w-auto"
              onClick={() => toggleSection('IN_PROGRESS')}
            >
              {expandedSections.includes('IN_PROGRESS') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-semibold text-gray-900">수행 중</span>
            </Button>

            {expandedSections.includes('IN_PROGRESS') && (
              <div className="ml-6 mt-3">
                {tasks
                  .filter((task) => task.taskStatus === 'IN_PROGRESS')
                  .map((task) => (
                    <div
                      key={task.taskNo}
                      className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors cursor-pointer mb-3"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="col-span-5 flex items-center space-x-3">
                        <Checkbox
                          className="border-gray-300"
                          checked={task.progressRate === '100'}
                          onCheckedChange={(checked) =>
                            handleTaskStatusChange(task.taskNo, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-900 font-medium">
                          {task.taskName}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-yellow-500 text-white font-medium">
                              미문
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">미문</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-gray-600">
                          {task.dueDate
                            ? `${task.dueDate.slice(
                                4,
                                6
                              )}월 ${task.dueDate.slice(6, 8)}일`
                            : ''}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Badge
                          className={`${getPriorityColor(
                            task.priorityCode
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getPriorityLabel(task.priorityCode)}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Badge
                          className={`${getStatusColor(
                            task.taskStatus
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getStatusLabel(task.taskStatus)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="text-sm text-gray-500 ml-8 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleAddTask('IN_PROGRESS')}
                >
                  작업 추가...
                </Button>
              </div>
            )}
          </div>

          {/* 완료 섹션 */}
          <div className="mt-8">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg w-auto"
              onClick={() => toggleSection('COMPLETED')}
            >
              {expandedSections.includes('COMPLETED') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-semibold text-gray-900">완료</span>
            </Button>

            {expandedSections.includes('COMPLETED') && (
              <div className="ml-6 mt-3">
                {tasks
                  .filter((task) => task.taskStatus === 'COMPLETED')
                  .map((task) => (
                    <div
                      key={task.taskNo}
                      className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors cursor-pointer mb-3"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="col-span-5 flex items-center space-x-3">
                        <Checkbox
                          className="border-gray-300"
                          checked={task.progressRate === '100'}
                          onCheckedChange={(checked) =>
                            handleTaskStatusChange(task.taskNo, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-900 font-medium">
                          {task.taskName}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-yellow-500 text-white font-medium">
                              미문
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">미문</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-gray-600">
                          {task.dueDate
                            ? `${task.dueDate.slice(
                                4,
                                6
                              )}월 ${task.dueDate.slice(6, 8)}일`
                            : ''}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Badge
                          className={`${getPriorityColor(
                            task.priorityCode
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getPriorityLabel(task.priorityCode)}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Badge
                          className={`${getStatusColor(
                            task.taskStatus
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getStatusLabel(task.taskStatus)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="text-sm text-gray-500 ml-8 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleAddTask('COMPLETED')}
                >
                  작업 추가...
                </Button>
              </div>
            )}
          </div>

          {/* 섹션 추가 버튼 */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="text-sm text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              섹션 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 작업 패널 */}
      <TaskPanel
        isOpen={isTaskPanelOpen}
        onClose={() => {
          setIsTaskPanelOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}
