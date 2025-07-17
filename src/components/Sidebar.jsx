import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
  Menu,
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(['projects']);

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

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-xl">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700">
        <Button className="w-full bg-violet-600 hover:bg-violet-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
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
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            프로젝트
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start py-2 px-3 text-left font-normal text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
            onClick={() => toggleSection('projects')}
          >
            {expandedSections.includes('projects') ? (
              <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
            )}
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
            <span className="flex-1 truncate">교차 기능팀 프로젝트 개발</span>
          </Button>

          {expandedSections.includes('projects') && (
            <div className="ml-6 mt-1">
              <Button
                variant="ghost"
                className={`w-full justify-start py-2 px-3 text-left font-normal transition-all duration-200 ${
                  location.pathname === '/my-workspace'
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => navigate('/my-workspace')}
              >
                <Menu className="w-4 h-4 mr-3 flex-shrink-0" />내 작업 공간
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 하단 */}
      {/* <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="text-xs text-gray-400 mb-2">Advanced 무료 체험</div>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          업그레이드 추가
        </Button>
      </div> */}
    </div>
  );
}
