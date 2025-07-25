import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { updateTask, openTaskPanel } from '@/store/slices/taskSlice';

export default function Calendar() {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);

  // 작업을 캘린더 이벤트로 변환
  const calendarEvents = tasks
    .map((task) => {
      const startDate = task.startDate
        ? new Date(task.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        : null;
      const endDate = task.dueDate
        ? new Date(task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        : null;

      let backgroundColor = '#3B82F6'; // 기본 파란색
      if (task.priorityCode === 'HIGH') backgroundColor = '#EF4444';
      else if (task.priorityCode === 'MEDIUM') backgroundColor = '#F59E0B';
      else if (task.priorityCode === 'LOW') backgroundColor = '#10B981';

      return {
        id: task.taskNo,
        title: task.taskName,
        start: startDate,
        end: endDate
          ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
          : endDate, // 종료일 +1일
        backgroundColor,
        borderColor: backgroundColor,
        extendedProps: {
          task: task,
          status: task.taskStatus,
          priority: task.priorityCode,
          assignee: task.userId,
          progress: task.progressRate,
        },
      };
    })
    .filter((event) => event.start); // 시작일이 있는 작업만 표시

  // 이벤트 클릭 핸들러
  const handleEventClick = (clickInfo) => {
    const task = clickInfo.event.extendedProps.task;
    dispatch(openTaskPanel(task));
  };

  // 이벤트 드래그 앤 드롭 핸들러
  const handleEventDrop = async (dropInfo) => {
    const task = dropInfo.event.extendedProps.task;
    const newStartDate = dropInfo.event.start;
    const originalDuration =
      task.dueDate && task.startDate
        ? new Date(
            task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          ).getTime() -
          new Date(
            task.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          ).getTime()
        : 0;

    const newEndDate = new Date(newStartDate.getTime() + originalDuration);

    const updatedTask = {
      ...task,
      startDate: newStartDate.toISOString().split('T')[0].replace(/-/g, ''),
      dueDate: newEndDate.toISOString().split('T')[0].replace(/-/g, ''),
    };

    try {
      dispatch(
        updateTask({
          id: task.taskNo,
          taskData: updatedTask,
        })
      );
    } catch (error) {
      console.error('작업 일정 변경 실패:', error);
      dropInfo.revert(); // 실패시 원래 위치로 되돌리기
    }
  };

  // 이벤트 리사이즈 핸들러
  const handleEventResize = async (resizeInfo) => {
    const task = resizeInfo.event.extendedProps.task;
    const newEndDate = new Date(
      resizeInfo.event.end.getTime() - 24 * 60 * 60 * 1000
    ); // -1일

    const updatedTask = {
      ...task,
      dueDate: newEndDate.toISOString().split('T')[0].replace(/-/g, ''),
    };

    try {
      dispatch(
        updateTask({
          id: task.taskNo,
          taskData: updatedTask,
        })
      );
    } catch (error) {
      console.error('작업 기간 변경 실패:', error);
      resizeInfo.revert(); // 실패시 원래 크기로 되돌리기
    }
  };

  // 날짜 클릭으로 새 작업 생성
  const handleDateClick = (dateClickInfo) => {
    const clickedDate = dateClickInfo.dateStr;
    const newTask = {
      taskNo: null,
      taskName: '',
      userId: 'USER001',
      sectNo: 'SECT001',
      creatorId: 'USER001',
      dueDate: clickedDate.replace(/-/g, ''),
      startDate: clickedDate.replace(/-/g, ''),
      priorityCode: 'MEDIUM',
      taskStatus: 'TODO',
      progressRate: '0',
      detailContent: '',
      upperTaskNo: null,
    };

    dispatch(openTaskPanel(newTask));
  };

  return (
    <div className="flex-1 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          프로젝트 캘린더
        </h2>
        <p className="text-gray-600 text-sm">
          작업을 드래그하여 일정을 변경하거나, 날짜를 클릭하여 새 작업을 생성할
          수 있습니다.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          dateClick={handleDateClick}
          editable={true}
          droppable={true}
          height="auto"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDisplay="block"
          eventTextColor="white"
          // eventBorderWidth={0} // Removed this line
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          dayCellClassNames="hover:bg-gray-50 cursor-pointer"
          // 이벤트 렌더링 커스터마이징
          eventContent={(eventInfo) => {
            const task = eventInfo.event.extendedProps.task;
            return (
              <div className="p-1 text-xs">
                <div className="font-medium truncate">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs opacity-90">
                  {task.progressRate}% 완료
                </div>
              </div>
            );
          }}
          // 툴팁 표시
          eventMouseEnter={(mouseEnterInfo) => {
            const task = mouseEnterInfo.event.extendedProps.task;
            mouseEnterInfo.el.title = `${task.taskName}\n상태: ${task.taskStatus}\n진행률: ${task.progressRate}%\n담당자: ${task.userId}`;
          }}
        />
      </div>

      {/* 범례 */}
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">높은 우선순위</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">보통 우선순위</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">낮은 우선순위</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">기본</span>
        </div>
      </div>
    </div>
  );
}
