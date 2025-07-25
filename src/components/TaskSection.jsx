import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function TaskSection({
  title,
  status,
  expanded,
  toggleSection,
  tasks,
  onTaskClick,
  onAddTask,
  onStatusChange,
}) {
  // API 상태 코드로 필터링
  const getApiStatusCode = (internalStatus) => {
    switch (internalStatus) {
      case 'TODO':
        return 'PEND-001';
      case 'IN_PROGRESS':
        return 'PEND-002';
      case 'COMPLETED':
        return 'PEND-003';
      default:
        return internalStatus;
    }
  };

  const apiStatusCode = getApiStatusCode(status);
  const filteredTasks = tasks.filter(
    (task) => task.taskStatus === apiStatusCode
  );

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg w-auto"
        onClick={() => toggleSection(status)}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="text-sm text-gray-500">({filteredTasks.length})</span>
      </Button>

      {expanded && (
        <div className="space-y-3 ml-6 mt-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.taskNo}
              task={task}
              onClick={() => onTaskClick(task)}
              onStatusChange={onStatusChange}
            />
          ))}
          <Button
            variant="ghost"
            className="text-sm text-gray-500 ml-2 hover:bg-gray-50 rounded-lg"
            onClick={() => onAddTask(status)}
          >
            작업 추가...
          </Button>
        </div>
      )}
    </div>
  );
}
