// React 관련 훅
import { useState, useEffect } from 'react';
// Redux 훅
import { useDispatch, useSelector } from 'react-redux';
// Redux 액션
import { fetchTasks, updateTask } from '@/store/slices/taskSlice';
// 주요 하위 컴포넌트들
import TaskPanel from '@/components/TaskPanel';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';
import ProjectOverview from '@/components/ProjectOverview';
import Dashboard from '@/components/Dashboard';
import TaskHeader from '@/components/TaskHeader';
import TaskToolbar from '@/components/TaskToolbar';
import TaskList from '@/components/TaskList';

// 상단 탭 목록 정의
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

// 섹션 정의 (할 ��, 진행 중, 완료)
const sections = [
  { title: '할 일', status: 'TODO' },
  { title: '수행 중', status: 'IN_PROGRESS' },
  { title: '완료', status: 'COMPLETED' },
];

export default function MyTasks() {
  const dispatch = useDispatch();

  // 전역 상태
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);

  // 로컬 상태
  const [activeTab, setActiveTab] = useState('요약'); // 선택된 탭
  const [expandedSections, setExpandedSections] = useState([
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
  ]); // 확장된 섹션 목록
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false); // 작업 패널 오픈 여부
  const [selectedTask, setSelectedTask] = useState(null); // 선택된 작업

  // 프로젝트 번호가 바뀌거나 마운트되었을 때 작업 목록 조회
  useEffect(() => {
    dispatch(fetchTasks(currentProject.prjNo));
  }, [dispatch, currentProject.prjNo]);

  // 섹션 토글 함수
  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // 작업 클릭 시 패널 열기
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskPanelOpen(true);
  };

  // 체크박스 변경 시 작업 상태 변경
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

  // 작업 추가 버튼 클릭 시
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

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* 상단 탭 헤더 */}
      <TaskHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 탭별 컨텐츠 렌더링 */}
      {activeTab === '보드' && (
        <>
          <TaskToolbar onAddTask={handleAddTask} />
          <KanbanBoard
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        </>
      )}

      {activeTab === '요약' && <ProjectOverview />}
      {activeTab === '대시보드' && <Dashboard />}
      {activeTab === '타임라인' && <GanttChart />}
      {activeTab === '목록' && (
        <>
          <TaskToolbar onAddTask={handleAddTask} />
          <TaskList
            sections={sections}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            onStatusChange={handleTaskStatusChange}
          />
        </>
      )}

      {/* 공통 작업 상세 패널 */}
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
