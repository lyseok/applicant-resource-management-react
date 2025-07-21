import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Users, Settings } from 'lucide-react';
import ProjectMemberModal from './ProjectMemberModal';
import ProjectSettingsModal from './ProjectSettingsModal'; // Import ProjectSettingsModal
import { toggleProjectFavorite } from '@/store/slices/projectSlice';

const ALL_TABS = [
  { id: 'overview', label: '요약', path: '' },
  { id: 'board', label: '보드', path: '/board' },
  { id: 'list', label: '목록', path: '/list' },
  { id: 'timeline', label: '타임라인', path: '/timeline' },
  { id: 'dashboard', label: '대시보드', path: '/dashboard' },
  { id: 'calendar', label: '캘린더', path: '/calendar' },
  { id: 'bulletin', label: '게시판', path: '/bulletin' },
  { id: 'chat', label: '채팅', path: '/chat' }, // New chat tab
];

export default function ProjectHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // New state for settings modal

  const getCurrentTab = () => {
    const path = location.pathname;

    // Find the tab that matches the current path
    const matchedTab = ALL_TABS.find((tab) => {
      const fullPath = `/project/${projectId}${tab.path}`;
      return (
        path === fullPath ||
        (tab.path === '' && path === `/project/${projectId}`)
      );
    });

    return matchedTab ? matchedTab.id : 'overview'; // Default to overview
  };

  const handleTabChange = (tabId) => {
    const tab = ALL_TABS.find((t) => t.id === tabId);
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
  const visibleTabs =
    currentProject.visibleTabs || ALL_TABS.map((tab) => tab.id); // Get visible tabs from project state
  const filteredTabs = ALL_TABS.filter((tab) => visibleTabs.includes(tab.id)); // Filter tabs based on visibility

  // Check if current user is owner
  const isOwner = currentProject.members?.some(
    (member) => member.userId === 'USER001' && member.authorityCode === 'OWNER'
  ); // Assuming USER001 is the current user

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
              멤버 ({currentProject.prjMemList?.length || 0})
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
              공유
            </Button>
            {isOwner && ( // Only show settings button to owner
              <Button
                variant="outline"
                className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                onClick={() => setIsSettingsModalOpen(true)} // Open settings modal
              >
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-8 border-b border-gray-200">
          {filteredTabs.map((tab) => (
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

      {/* 프로젝트 설정 모달 */}
      {isOwner && ( // Only render settings modal if current user is owner
        <ProjectSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          project={currentProject}
        />
      )}
    </div>
  );
}
