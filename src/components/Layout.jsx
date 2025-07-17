import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import { fetchProjects, setCurrentProject } from '@/store/slices/projectSlice';

export default function Layout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 앱 시작시 사용자의 프로젝트 목록 조회
    dispatch(fetchProjects());

    // 기본 프로젝트 설정 (첫 번째 프로젝트)
    dispatch(setCurrentProject('PRJ001'));
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
