import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import { fetchProjects, setCurrentProject } from '@/store/slices/projectSlice';
import { fetchCurrentUser } from '@/store/slices/authSlice';

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, loading, initialized } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // 앱 시작시 사용자 정보 조회
    if (!initialized && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized, loading]);

  useEffect(() => {
    // 인증된 사용자의 프로젝트 목록 조회
    if (isAuthenticated && currentUser) {
      dispatch(fetchProjects());
      // 기본 프로젝트 설정 (첫 번째 프로젝트)
      dispatch(setCurrentProject('PRJ001'));
    }
  }, [dispatch, isAuthenticated, currentUser]);

  // 초기 로딩 중
  if (!initialized && loading) {
    return <LoadingSpinner message="사용자 정보를 확인하는 중..." />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
