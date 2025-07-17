import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { updateTask, openTaskPanel } from '@/store/slices/taskSlice';
import { getPriorityColor, getPriorityLabel } from '@/utils/taskUtils';

const columns = [
  { id: 'TODO', title: '할 일', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: '수행 중', color: 'bg-blue-50' },
  { id: 'COMPLETED', title: '완료', color: 'bg-green-50' },
];

export default function KanbanBoard() {
  const { tasks } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.taskNo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.taskStatus !== columnId) {
      try {
        const updatedTask = {
          ...draggedTask,
          taskStatus: columnId,
          progressRate:
            columnId === 'COMPLETED' ? '100' : draggedTask.progressRate,
        };

        await dispatch(
          updateTask({
            id: draggedTask.taskNo,
            taskData: updatedTask,
          })
        );
      } catch (error) {
        console.error('작업 상태 변경 실패:', error);
      }
    }
    setDraggedTask(null);
  };

  const handleTaskClick = (task) => {
    dispatch(openTaskPanel(task));
  };

  const handleAddTask = (columnId) => {
    const newTask = {
      taskNo: null,
      taskName: '',
      userId: '',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      dueDate: '',
      startDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      priorityCode: 'MEDIUM',
      taskStatus: columnId,
      progressRate: '0',
      detailContent: '',
      upperTaskNo: null,
      prjNo: currentProject?.prjNo || 'PRJ001',
    };
    dispatch(openTaskPanel(newTask));
  };

  const getTasksByColumn = (columnId) => {
    return tasks.filter((task) => task.taskStatus === columnId);
  };

  const getAssigneeInfo = (userId) => {
    if (!userId) return null;
    const member = currentProject?.members?.find((m) => m.userId === userId);
    return member || { userName: '미지정', userEmail: '' };
  };

  const handleCheckboxChange = async (task, checked) => {
    try {
      const newStatus = checked ? 'COMPLETED' : 'TODO';
      const newProgressRate = checked ? '100' : '0';

      const updatedTask = {
        ...task,
        taskStatus: newStatus,
        progressRate: newProgressRate,
      };

      await dispatch(
        updateTask({
          id: task.taskNo,
          taskData: updatedTask,
        })
      );
    } catch (error) {
      console.error('작업 상태 변경 실패:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6">
      <div className="flex space-x-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByColumn(column.id);
          return (
            <div
              key={column.id}
              className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* 컬럼 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-600"
                  >
                    {columnTasks.length}
                  </Badge>
                </div>
              </div>

              {/* 작업 카드들 */}
              <div className="space-y-3 mb-4">
                {columnTasks.map((task) => {
                  const assigneeInfo = getAssigneeInfo(task.userId);
                  return (
                    <div
                      key={task.taskNo}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => handleTaskClick(task)}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
                    >
                      {/* 작업 헤더 */}
                      <div className="flex items-start space-x-3 mb-3">
                        <Checkbox
                          checked={task.progressRate === '100'}
                          className="mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(
                              task,
                              !task.progressRate === '100'
                            );
                          }}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(task, checked)
                          }
                        />
                        <h4 className="font-medium text-gray-900 flex-1 leading-tight">
                          {task.taskName}
                        </h4>
                      </div>

                      {/* 태그들 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          className={`${getPriorityColor(
                            task.priorityCode
                          )} font-medium px-2 py-1 text-xs`}
                        >
                          {getPriorityLabel(task.priorityCode)}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium px-2 py-1 text-xs">
                          {task.progressRate}%
                        </Badge>
                      </div>

                      {/* 담당자와 마감일 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {assigneeInfo ? (
                            <>
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                                  {assigneeInfo.userName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">
                                {assigneeInfo.userName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">
                              담당자 미지정
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.dueDate
                            ? `${task.dueDate.slice(
                                4,
                                6
                              )}월 ${task.dueDate.slice(6, 8)}일`
                            : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 작업 추가 버튼 */}
              <Button
                variant="ghost"
                className="w-full justify-center text-gray-500 hover:bg-gray-50 rounded-lg py-3 border-2 border-dashed border-gray-200 hover:border-gray-300"
                onClick={() => handleAddTask(column.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                작업 추가
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
