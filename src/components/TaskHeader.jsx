import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function TaskHeader({ tabs, activeTab, onTabChange }) {
  const { currentProject } = useSelector((state) => state.project);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentProject.name}
            </h1>
            <Star className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
              {currentProject.status}
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg transition-colors">
              공유
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 font-medium rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
            >
              프로젝트 작업
            </Button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
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
    </div>
  );
}
