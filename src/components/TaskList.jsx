import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openTaskPanel } from '@/store/slices/taskSlice';
import TaskSection from '@/components/TaskSection';

const sections = [
  { title: '할 일', status: 'TODO' },
  { title: '수행 중', status: 'IN_PROGRESS' },
  { title: '완료', status: 'COMPLETED' },
];

export default function TaskList() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [expandedSections, setExpandedSections] = useState([
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
  ]);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleTaskClick = (task) => {
    dispatch(openTaskPanel(task));
  };

  const handleAddTask = (status = 'TODO') => {
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
    };
    dispatch(openTaskPanel(newTask));
  };

  const handleTaskStatusChange = async (taskNo, completed) => {
    // 이 기능은 TaskItem 컴포넌트에서 처리됩니다
  };

  return (
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

        {sections.map(({ title, status }) => (
          <TaskSection
            key={status}
            title={title}
            status={status}
            expanded={expandedSections.includes(status)}
            toggleSection={toggleSection}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            onStatusChange={handleTaskStatusChange}
          />
        ))}

        {/* 섹션 추가 버튼 */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="text-sm text-gray-500 hover:bg-gray-50 rounded-lg"
            onClick={() => handleAddTask('TODO')}
          >
            <Plus className="w-4 h-4 mr-2" />
            섹션 추가
          </Button>
        </div>
      </div>
    </div>
  );
}
