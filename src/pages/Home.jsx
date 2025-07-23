import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Plus,
  Users,
  CheckCircle,
  TrendingUp,
  Calendar,
  MessageCircle,
  Activity,
  ArrowRight,
  Briefcase,
  Target,
} from 'lucide-react';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchRecentWorkHistory } from '../store/slices/workHistorySlice';
import {
  getRelativeTime,
  getWorkTypeIcon,
  getWorkTypeColor,
} from '../utils/workHistoryUtils';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state) => state.project);
  const { recentWorkHistory } = useSelector((state) => state.workHistory);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchRecentWorkHistory({ limit: 5 }));
  }, [dispatch]);

  // 프로젝트 상태 코드를 한글명으로 변환하는 함수
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

  // 프로젝트 상태에 따른 색상 클래스 반환
  const getProjectStatusColor = (statusCode) => {
    const status = getProjectStatusLabel(statusCode);
    switch (status) {
      case '진행중':
        return 'bg-green-100 text-green-800 border-green-200';
      case '완료':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '지연':
        return 'bg-red-100 text-red-800 border-red-200';
      case '계획중':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '보류':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 프로젝트 완료 여부 확인 (finishDate가 있으면 완료)
  const isProjectCompleted = (project) => {
    return project.finishDate && project.finishDate !== null;
  };

  // 프로젝트 통계 계산 (수정된 로직)
  const projectStats = {
    total: projects.length,
    active: projects.filter((p) => {
      // finishDate가 없고 projectStatus가 진행중인 경우
      return (
        !isProjectCompleted(p) &&
        getProjectStatusLabel(p.projectStatus) === '진행중'
      );
    }).length,
    completed: projects.filter((p) => {
      // finishDate가 있거나 projectStatus가 완료인 경우
      return (
        isProjectCompleted(p) ||
        getProjectStatusLabel(p.projectStatus) === '완료'
      );
    }).length,
    delayed: projects.filter(
      (p) => getProjectStatusLabel(p.projectStatus) === '지연'
    ).length,
  };

  // 최근 프로젝트 (최대 6개)
  const recentProjects = projects.slice(0, 6);

  // 프로젝트 색상 가져오기 (projectColor 필드 사용)
  const getProjectColor = (project) => {
    if (project.projectColor) {
      // HEX 색상을 Tailwind 클래스로 변환하지 않고 직접 사용
      return project.projectColor;
    }

    const colors = [
      '#3B82F6',
      '#10B981',
      '#8B5CF6',
      '#EF4444',
      '#F59E0B',
      '#6366F1',
    ];
    const projectId = project.prjNo || project.id || '1';
    return colors[
      projectId.toString().charCodeAt(projectId.toString().length - 1) %
        colors.length
    ];
  };

  // 프로젝트 진행률 계산 (프로젝트별로 다른 값)
  const getProjectProgress = (project) => {
    // 완료된 프로젝트는 100%
    if (isProjectCompleted(project)) {
      return 100;
    }
    return project.avgProgress;
  };

  // 사용자 이름 안전하게 가져오기
  const getUserDisplayName = () => {
    if (!currentUser) return '사용자';
    return (
      currentUser.userName ||
      currentUser.username ||
      currentUser.userId ||
      '사용자'
    );
  };

  // 프로젝트 이름 안전하게 가져오기
  const getProjectName = (project) => {
    if (!project) return '프로젝트';
    return project.projectName || project.prjName || '프로젝트';
  };

  // 프로젝트 설명 안전하게 가져오기
  const getProjectDescription = (project) => {
    if (!project) return '';
    return (
      project.projectContents || project.prjDesc || project.description || ''
    );
  };

  // 팀원 수 가져오기 (memCnt 필드 사용)
  const getMemberCount = (project) => {
    return project.memCnt || project.memberCount || 1;
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Plus,
      Activity,
      ArrowRight,
      TrendingUp,
    };
    return icons[iconName] || Activity;
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              안녕하세요, {getUserDisplayName()}님! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              오늘도 멋진 프로젝트를 만들어보세요.
            </p>
          </div>
        </div>

        {/* 통계 카드 섹션 (즐겨찾기 제거) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.total}
                  </div>
                  <div className="text-sm text-gray-500">전체 프로젝트</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.active}
                  </div>
                  <div className="text-sm text-gray-500">진행 중</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.completed}
                  </div>
                  <div className="text-sm text-gray-500">완료됨</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 프로젝트 섹션 */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                최근 프로젝트
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 프로젝트가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  첫 번째 프로젝트를 만들어보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProjects.map((project) => {
                  const progress = getProjectProgress(project);
                  const statusLabel = getProjectStatusLabel(
                    project.projectStatus
                  );
                  const memberCount = getMemberCount(project);
                  const projectColor = getProjectColor(project);

                  return (
                    <Card
                      key={project.prjNo}
                      className="border border-gray-200 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 bg-white"
                      onClick={() => handleProjectClick(project.prjNo)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: projectColor }}
                            ></div>
                            <h3 className="font-bold text-lg text-gray-900 truncate">
                              {getProjectName(project)}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {getProjectDescription(project) ||
                            '프로젝트 설명이 없습니다.'}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span className="font-medium">진행률</span>
                              <span className="font-bold">{progress}%</span>
                            </div>
                            <Progress
                              value={progress}
                              className="h-2 bg-gray-200"
                            >
                              <div
                                className="h-full bg-gray-900 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </Progress>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              className={`text-xs px-3 py-1 font-medium rounded-full ${getProjectStatusColor(
                                project.projectStatus
                              )}`}
                            >
                              {statusLabel}
                            </Badge>

                            <div className="flex items-center space-x-1 text-gray-500">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {memberCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
