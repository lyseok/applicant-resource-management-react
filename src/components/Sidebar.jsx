import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  CheckSquare,
  Inbox,
  BarChart3,
  Briefcase,
  Target,
  Plus,
  Star,
} from 'lucide-react';
import CreateProjectModal from './CreateProjectModal';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.project);
  const [expandedSections, setExpandedSections] = useState(['projects']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    { id: '/', label: '홈', icon: Home },
    { id: '/tasks', label: '내 작업', icon: CheckSquare },
    { id: '/inbox', label: '수신함', icon: Inbox, badge: 1 },
  ];

  const teamSiteItems = [
    { id: '/reports', label: '보고서', icon: BarChart3 },
    { id: '/portfolio', label: '포트폴리오', icon: Briefcase },
    { id: '/goals', label: '목표', icon: Target },
  ];

  const getProjectColor = (project) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
    ];
    return colors[
      project.prjNo.charCodeAt(project.prjNo.length - 1) % colors.length
    ];
  };

  const isProjectRoute = (projectId) => {
    return location.pathname.startsWith(`/project/${projectId}`);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-xl">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700">
        <Button
          className="w-full bg-violet-600 hover:bg-violet-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          생성
        </Button>
      </div>

      {/* 메인 메뉴 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start py-2 px-3 text-left font-normal transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => navigate(item.id)}
              >
                <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-violet-800 text-white text-xs px-2 py-1">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* 팀사이트 섹션 */}
        <div className="px-2 py-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            팀사이트
          </div>
          <div className="space-y-1">
            {teamSiteItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start py-2 px-3 text-left font-normal transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => navigate(item.id)}
                >
                  <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 프로젝트 섹션 */}
        <div className="px-2 py-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              프로젝트
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-800 rounded"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          <div className="space-y-1">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                프로젝트 로딩 중...
              </div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                프로젝트가 없습니다
              </div>
            ) : (
              projects.map((project) => {
                const isActive = isProjectRoute(project.prjNo);
                return (
                  <Button
                    key={project.prjNo}
                    variant="ghost"
                    className={`w-full justify-start py-2 px-3 text-left font-normal transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => navigate(`/project/${project.prjNo}`)}
                  >
                    <div
                      className={`w-2 h-2 ${getProjectColor(
                        project
                      )} rounded-full mr-3 flex-shrink-0`}
                    ></div>
                    <span className="flex-1 truncate">
                      {project.projectName}
                    </span>
                    {project.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-1 flex-shrink-0" />
                    )}
                  </Button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 프로젝트 생성 모달 */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
