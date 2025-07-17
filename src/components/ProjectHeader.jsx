import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Users, Settings } from 'lucide-react';
import ProjectMemberModal from './ProjectMemberModal';
import { toggleProjectFavorite } from '@/store/slices/projectSlice';

const tabs = [
  { id: 'overview', label: '요약', path: '' },
  { id: 'board', label: '보드', path: '/board' },
  { id: 'list', label: '목록', path: '/list' },
  { id: 'timeline', label: '타임라인', path: '/timeline' },
  { id: 'dashboard', label: '대시보드', path: '/dashboard' },
  { id: 'calendar', label: '캘린더', path: '/calendar' },
  { id: 'bulletin', label: '게시판', path: '/bulletin' }, // Added bulletin board tab
];

export default function ProjectHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const getCurrentTab = () => {
    const path = location.pathname;

    // 정확한 경로 매칭
    if (
      path === `/project/${projectId}` ||
      path === `/project/${projectId}/overview`
    ) {
      return 'overview';
    }
    if (path === `/project/${projectId}/board`) {
      return 'board';
    }
    if (path === `/project/${projectId}/list`) {
      return 'list';
    }
    if (path === `/project/${projectId}/timeline`) {
      return 'timeline';
    }
    if (path === `/project/${projectId}/dashboard`) {
      return 'dashboard';
    }
    if (path === `/project/${projectId}/calendar`) {
      return 'calendar';
    }
    if (path === `/project/${projectId}/bulletin`) {
      return 'bulletin';
    }

    return 'overview'; // 기본값
  };

  const handleTabChange = (tabId) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      const newPath = `/project/${projectId}${tab.path}`;
      navigate(newPath);
    }
  };

  const handleToggleFavorite = () => {
    if (currentProject) {
      dispatch(toggleProjectFavorite(currentProject.prjNo));
    }
  };

  if (!currentProject) {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="text-center text-gray-500">
            프로젝트를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  const currentTab = getCurrentTab();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentProject.projectName}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="p-1"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  currentProject.isFavorite
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
              {currentProject.projectStatus}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMemberModalOpen(true)}
              className="border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <Users className="w-4 h-4 mr-2" />
              멤버 ({currentProject.members?.length || 0})
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
              공유
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                currentTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto hover:bg-gray-100 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 프로젝트 멤버 관리 모달 */}
      <ProjectMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        project={currentProject}
      />
    </div>
  );
}
