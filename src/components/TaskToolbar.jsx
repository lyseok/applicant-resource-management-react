// src/components/TaskToolbar.jsx
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export default function TaskToolbar({ onAddTask }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 hover:bg-gray-50 font-medium rounded-lg bg-transparent"
          onClick={onAddTask}
        >
          <Plus className="w-4 h-4 mr-2" />
          작업 추가
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            필터링
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            정렬
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            그룹
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            숨기기
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
