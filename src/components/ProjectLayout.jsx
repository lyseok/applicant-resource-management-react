import { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject } from '@/store/slices/projectSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import { fetchPosts } from '@/store/slices/boardSlice'; // Import fetchPosts
import ProjectHeader from './ProjectHeader';
import TaskPanel from './TaskPanel';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.project);
  const { isTaskPanelOpen, selectedTask } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
      dispatch(fetchTasks(projectId));
      dispatch(fetchPosts(projectId)); // Fetch posts for the current project
    }
  }, [dispatch, projectId]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <ProjectHeader />
      <Outlet />

      {/* 공통 작업 상세 패널 */}
      <TaskPanel isOpen={isTaskPanelOpen} task={selectedTask} />
    </div>
  );
}
