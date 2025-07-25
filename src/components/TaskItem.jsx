import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { updateTask } from '@/store/slices/taskSlice';
import {
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
  getPriorityLabel,
} from '@/utils/taskUtils';

export default function TaskItem({ task, onClick, onStatusChange }) {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);

  const getAssigneeInfo = (userId) => {
    if (!userId) return { userName: '미지정', userEmail: '' };

    // API 응답에서 prjMem 객체 사용
    if (task.prjMem && task.prjMem.userName) {
      return {
        userName: task.prjMem.userName,
        userEmail: task.prjMem.userEmail || '',
      };
    }

    // 프로젝트 멤버에서 찾기 (fallback)
    const member = currentProject?.members?.find((m) => m.userId === userId);
    return member || { userName: '미지정', userEmail: '' };
  };

  const handleCheckboxChange = async (checked) => {
    const newStatus = checked ? 'PEND-003' : 'PEND-001'; // API 상태 코드 사용
    const newProgressRate = checked ? '100' : '0';

    const updatedTask = {
      ...task,
      taskStatus: newStatus,
      progressRate: newProgressRate,
    };

    try {
      dispatch(
        updateTask({
          id: task.taskNo,
          taskData: updatedTask,
        })
      );
    } catch (error) {
      console.error('작업 상태 변경 실패:', error);
    }
  };

  const assigneeInfo = getAssigneeInfo(task.userId);

  return (
    <div
      className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors cursor-pointer items-center"
      onClick={onClick}
    >
      <div className="col-span-5 flex items-center space-x-3">
        <Checkbox
          className="border-gray-300"
          checked={
            task.progressRate === '100' || task.taskStatus === 'PEND-003'
          }
          onCheckedChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-sm text-gray-900 font-medium">
          {task.taskName}
        </span>
      </div>
      <div className="col-span-2 flex items-center justify-start">
        <Avatar className="w-7 h-7">
          <AvatarFallback className="text-xs bg-blue-500 text-white font-medium">
            {assigneeInfo.userName?.charAt(0) || '미'}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-gray-700 ml-2">
          {assigneeInfo.userName}
        </span>
      </div>
      <div className="col-span-2 flex items-center justify-start text-sm text-gray-600">
        {task.dueDate
          ? `${task.dueDate.slice(4, 6)}월 ${task.dueDate.slice(6, 8)}일`
          : ''}
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
  );
}
