import { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject } from '@/store/slices/projectSlice';
import { fetchProjectTasks, fetchWorkHistory } from '@/store/slices/taskSlice';
import { fetchProjectPosts } from '@/store/slices/boardSlice';
import { fetchProjectChatroom } from '@/store/slices/chatSlice';
import ProjectHeader from './ProjectHeader';
import TaskPanel from './TaskPanel';
import FloatingChatWidget from './FloatingChatWidget';
import LoadingSpinner from './LoadingSpinner';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject, projectLoading } = useSelector(
    (state) => state.project
  );
  const { isTaskPanelOpen, selectedTask } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (projectId) {
      const loadProjectData = async () => {
        try {
          await dispatch(fetchProject(projectId)).unwrap();
          await Promise.all([
            dispatch(fetchProjectTasks(projectId)),
            dispatch(fetchWorkHistory(projectId)),
            dispatch(fetchProjectPosts(projectId)),
            dispatch(fetchProjectChatroom(projectId)),
          ]);
        } catch (error) {
          console.error('프로젝트 데이터 로드 실패:', error);
        }
      };

      loadProjectData();
    }
  }, [dispatch, projectId]);

  if (projectLoading) {
    return <LoadingSpinner message="프로젝트를 불러오는 중..." />;
  }

  if (!currentProject) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen relative">
      <ProjectHeader />
      <Outlet />
      <TaskPanel isOpen={isTaskPanelOpen} task={selectedTask} />
      {/* 프로젝트 상세페이지에서만 플로팅 채팅 위젯 표시 */}
      <FloatingChatWidget />
    </div>
  );
}
