import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWorkHistory,
  fetchRecentWorkHistory,
} from '../store/slices/workHistorySlice';
import {
  getWorkTypeIcon,
  getWorkTypeColor,
  getRelativeTime,
} from '../utils/workHistoryUtils';
import {
  RefreshCw,
  Activity,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  TrendingUp,
  User,
} from 'lucide-react';

const WorkHistoryPanel = ({ projectId }) => {
  const dispatch = useDispatch();
  const { workHistory, recentWorkHistory, loading, error } = useSelector(
    (state) => state.workHistory
  );
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('recent');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadWorkHistory();
    }
  }, [projectId]);

  const loadWorkHistory = async () => {
    try {
      await Promise.all([
        dispatch(fetchWorkHistory(projectId)),
        dispatch(fetchRecentWorkHistory({ projectId, limit: 10 })),
      ]);
    } catch (error) {
      console.error('작업 내역 로드 실패:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkHistory();
    setRefreshing(false);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Plus,
      Edit,
      Trash2,
      ArrowRight,
      TrendingUp,
      User,
      Activity,
    };
    return icons[iconName] || Activity;
  };

  const renderWorkHistoryItem = (item) => {
    const IconComponent = getIconComponent(getWorkTypeIcon(item.workType));
    const colorClass = getWorkTypeColor(item.workType);

    return (
      <div
        key={item.workHistNo}
        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {item.userName?.charAt(0) || item.userId?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.userName || item.userId || '알 수 없음'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {getRelativeTime(item.workDate)}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {item.workContent}
          </p>

          {item.workTarget && (
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
              대상: {item.workTarget}
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredRecentHistory = recentWorkHistory.filter(
    (item) =>
      item.workType === 'STATUS_CHANGE' ||
      item.workType === 'PROGRESS_UPDATE' ||
      item.workType === 'ASSIGN'
  );

  if (loading && workHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>작업 내역을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            작업 내역 추적
          </h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span>새로고침</span>
          </button>
        </div>

        <div className="flex space-x-1 px-4">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'recent'
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            최근 작업 ({filteredRecentHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            전체 내역 ({workHistory.length})
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {error && (
          <div className="p-4 text-center text-red-600 bg-red-50">{error}</div>
        )}

        {activeTab === 'recent' && (
          <div className="divide-y divide-gray-100">
            {filteredRecentHistory.length > 0 ? (
              filteredRecentHistory.map(renderWorkHistoryItem)
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>최근 작업 활동이 없습니다.</p>
                <p className="text-sm mt-1">
                  작업 상태 변경, 진척도 업데이트, 담당자 할당 등의 활동이
                  여기에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="divide-y divide-gray-100">
            {workHistory.length > 0 ? (
              workHistory.map(renderWorkHistoryItem)
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>작업 내역이 없습니다.</p>
                <p className="text-sm mt-1">
                  작업을 생성, 수정, 삭제하면 내역이 여기에 기록됩니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistoryPanel;
