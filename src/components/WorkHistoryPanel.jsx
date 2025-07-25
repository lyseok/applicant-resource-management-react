import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  RefreshCw,
  Activity,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  TrendingUp,
  User,
  FileText,
  Settings,
} from 'lucide-react';

const WorkHistoryPanel = ({ projectId }) => {
  const { currentProject } = useSelector((state) => state.project);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // 안전한 프로젝트 멤버 정보 가져오기
  const projectMembers = currentProject?.prjMemList?.filter(
    (member) => member.deleteDate === null
  ) || [
    {
      userId: 'testUser',
      userName: '테스터',
      userPosition: 'PM',
    },
    {
      userId: 'user01',
      userName: '홍길동',
      userPosition: 'UA',
    },
    {
      userId: 'user03',
      userName: '이철수',
      userPosition: 'TA',
    },
  ];

  useEffect(() => {
    if (projectId) {
      loadWorkHistory();
    }
  }, [projectId]);

  const loadWorkHistory = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost/api/projects/${projectId}/work-history`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWorkHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('작업 내역 로드 실패:', error);
      setError('작업 내역을 불러오는데 실패했습니다.');
      setWorkHistory();
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkHistory();
    setRefreshing(false);
  };

  // userId를 userName으로 변환하는 함수 - 안전한 처리
  const getUserInfo = (userId) => {
    if (!userId) {
      return {
        userId: 'unknown',
        userName: '알 수 없음',
        userPosition: 'Unknown',
      };
    }

    if (!Array.isArray(projectMembers)) {
      return { userId, userName: userId, userPosition: 'Unknown' };
    }

    const member = projectMembers.find(
      (member) => member && member.userId === userId
    );
    return member || { userId, userName: userId, userPosition: 'Unknown' };
  };

  const getIconComponent = (workType) => {
    const icons = {
      CREATE: Plus,
      STATUS_CHANGE: ArrowRight,
      PROGRESS_UPDATE: TrendingUp,
      ASSIGN: User,
      EDIT: Edit,
      DELETE: Trash2,
      C: Plus,
    };
    return icons[workType] || Activity;
  };

  const getWorkTypeColor = (workType) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-600',
      STATUS_CHANGE: 'bg-blue-100 text-blue-600',
      PROGRESS_UPDATE: 'bg-yellow-100 text-yellow-600',
      ASSIGN: 'bg-purple-100 text-purple-600',
      EDIT: 'bg-orange-100 text-orange-600',
      DELETE: 'bg-red-100 text-red-600',
      C: 'bg-green-100 text-green-600',
    };
    return colors[workType] || 'bg-gray-100 text-gray-600';
  };

  const getUserAvatarColor = (userId) => {
    if (!userId) return 'bg-gray-500';

    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 없음';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) return '방금 전';
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)}시간 전`;
      if (diffInMinutes < 10080)
        return `${Math.floor(diffInMinutes / 1440)}일 전`;

      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '날짜 오류';
    }
  };

  const renderWorkHistoryItem = (item, index) => {
    if (!item) return null;

    const key = item.workHistNo || `work-item-${index}`;
    const IconComponent = getIconComponent(item.workType);
    const colorClass = getWorkTypeColor(item.workType);
    const userInfo = getUserInfo(item.userId);
    const avatarColor = getUserAvatarColor(item.userId);

    return (
      <div
        key={key}
        className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}
              >
                {userInfo.userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {userInfo.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {userInfo.userPosition}
                </span>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {item.workType === 'CREATE'
                  ? '생성'
                  : item.workType === 'STATUS_CHANGE'
                  ? '상태변경'
                  : item.workType === 'C'
                  ? '생성'
                  : item.workType}
              </span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDate(item.workDate)}
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            {item.workContent || '내용 없음'}
          </p>

          {item.workTarget && (
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-xs text-blue-700">
                <FileText className="w-3 h-3 mr-1" />
                대상: {item.workTarget}
              </div>
              {item.workTable && (
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-xs text-gray-600">
                  <Settings className="w-3 h-3 mr-1" />
                  테이블: {item.workTable}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 프로젝트 데이터가 로딩 중일 때
  if (!currentProject && !projectId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>프로젝트 정보를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading && workHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>작업 내역을 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 헤더 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              작업 내역 추적
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              전체 {workHistory.length}개의 작업 내역
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 내용 영역 - 스크롤 가능 */}
      <div className="max-h-96 overflow-y-auto">
        {error && (
          <div className="p-4 text-center text-red-600 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {workHistory.length > 0 ? (
            workHistory
              .map((item, index) => renderWorkHistoryItem(item, index))
              .filter(Boolean)
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-base font-medium">작업 내역이 없습니다</p>
              <p className="text-sm mt-1">
                작업을 생성, 수정, 삭제하면 내역이 여기에 기록됩니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 */}
      {workHistory.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            최신 작업 내역부터 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkHistoryPanel;
