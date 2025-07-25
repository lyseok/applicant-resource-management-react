import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Users, Settings, Shield } from 'lucide-react';
import ProjectMemberModal from './ProjectMemberModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import { toggleProjectFavorite } from '@/store/slices/projectSlice';

const ALL_TABS = [
  { id: 'overview', label: '요약', path: '' },
  { id: 'board', label: '보드', path: '/board' },
  { id: 'list', label: '목록', path: '/list' },
  { id: 'timeline', label: '타임라인', path: '/timeline' },
  { id: 'dashboard', label: '대시보드', path: '/dashboard' },
  { id: 'calendar', label: '캘린더', path: '/calendar' },
  { id: 'bulletin', label: '게시판', path: '/bulletin' },
  { id: 'admin', label: '관리', path: '/admin', adminOnly: true }, // 관리자 전용 탭
];

const getProjectStatusLabel = (statusCode) => {
  const statusMap = {
    'PROG-001': '진행중',
    'PROG-002': '지연',
    'PROG-003': '개선예시 아이디어',
    'PROG-004': '완료',
    'PROG-005': '계획중',
    'PROG-006': '보류',
  };
  return statusMap[statusCode] || statusCode;
};

export default function ProjectHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const { currentUser } = useSelector((state) => state.auth);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const getCurrentTab = () => {
    const path = location.pathname;
    const matchedTab = ALL_TABS.find((tab) => {
      const fullPath = `/project/${projectId}${tab.path}`;
      return (
        path === fullPath ||
        (tab.path === '' && path === `/project/${projectId}`)
      );
    });
    return matchedTab ? matchedTab.id : 'overview';
  };

  const handleTabChange = (tabId) => {
    const tab = ALL_TABS.find((t) => t.id === tabId);
    if (tab) {
      const newPath = `/project/${projectId}${tab.path}`;
      navigate(newPath);
    }
  };

  // 관리자 권한 체크 (OWNER 또는 MANAGER)
  const isAdmin = currentProject?.prjMemList?.some(
    (member) =>
      member.userId === (currentUser?.userId || currentUser?.username) &&
      (member.authorityCode === 'OWNER' ||
        member.authorityCode === 'MANAGER') &&
      member.deleteDate === null
  );

  // OWNER 권한 체크
  const isOwner = currentProject?.prjMemList?.some(
    (member) =>
      member.userId === (currentUser?.userId || currentUser?.username) &&
      member.authorityCode === 'OWNER' &&
      member.deleteDate === null
  );

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
    currentProject.visibleTabs || ALL_TABS.map((tab) => tab.id);

  // 관리자가 아닌 경우 관리 탭 제외
  const filteredTabs = ALL_TABS.filter((tab) => {
    if (tab.adminOnly && !isAdmin) return false;
    return visibleTabs.includes(tab.id);
  });

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentProject.projectName}
            </h1>
            {isAdmin && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-2 py-1 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                관리자
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
              {getProjectStatusLabel(currentProject.projectStatus)}
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
            {isAdmin && (
              <Button
                variant="outline"
                className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                onClick={() => setIsSettingsModalOpen(true)}
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
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 flex items-center ${
                currentTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.id === 'admin' && <Shield className="w-4 h-4 mr-1" />}
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

      {/* 프로젝트 설정 모달 - 관리자도 접근 가능 */}
      {isAdmin && (
        <ProjectSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          project={currentProject}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
