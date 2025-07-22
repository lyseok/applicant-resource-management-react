'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Star,
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
import { fetchUserProjects } from '@/store/slices/projectSlice';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state) => state.project);
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProjects());
    }
  }, [dispatch, isAuthenticated]);

  // 프로젝트 상태 코드를 한글명으로 변환하는 함수
  const getProjectStatusLabel = (statusCode) => {
    const statusMap = {
      'PROG-001': '진행중',
      'PROG-002': '지연',
      'PROG-003': '개선예시 아이디어',
      'PROG-004': '완료',
      진행중: '진행중',
      완료: '완료',
      지연: '지연',
      계획중: '계획중',
      보류: '보류',
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

  // 프로젝트 통계 계산 (상태명 기준으로)
  const projectStats = {
    total: projects.length,
    active: projects.filter(
      (p) => getProjectStatusLabel(p.projectStatus) === '진행중'
    ).length,
    completed: projects.filter(
      (p) => getProjectStatusLabel(p.projectStatus) === '완료'
    ).length,
    delayed: projects.filter(
      (p) => getProjectStatusLabel(p.projectStatus) === '지연'
    ).length,
    favorites: projects.filter((p) => p.isFavorite).length,
  };

  // 최근 프로젝트 (최대 6개)
  const recentProjects = projects.slice(0, 6);

  // 프로젝트 색상 가져오기
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

  // 프로젝트 진행률 계산 (더미 데이터)
  const getProjectProgress = (project) => {
    // 실제로는 프로젝트의 작업 통계를 기반으로 계산
    return Math.floor(Math.random() * 100);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    // 프로젝트 생성 모달 열기 또는 생성 페이지로 이동
    console.log('프로젝트 생성');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <Card className="w-96 bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              DDIT JOB에 오신 것을 환영합니다
            </h2>
            <p className="text-gray-600 mb-6">
              프로젝트 관리를 시작하려면 로그인해주세요.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              로그인하기
            </Button>
          </CardContent>
        </Card>
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
              안녕하세요, {currentUser?.userName || currentUser?.username}님! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              오늘도 멋진 프로젝트를 만들어보세요.
            </p>
          </div>
          <Button
            onClick={handleCreateProject}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />새 프로젝트
          </Button>
        </div>

        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.favorites}
                  </div>
                  <div className="text-sm text-gray-500">즐겨찾기</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 최근 프로젝트 */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    최근 프로젝트
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    모두 보기
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      아직 프로젝트가 없습니다
                    </h3>
                    <p className="text-gray-500 mb-4">
                      첫 번째 프로젝트를 만들어보세요!
                    </p>
                    <Button
                      onClick={handleCreateProject}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      프로젝트 생성
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentProjects.map((project) => {
                      const progress = getProjectProgress(project);
                      const activeMembers =
                        project.prjMemList?.filter((m) => !m.deleteDate) || [];
                      const statusLabel = getProjectStatusLabel(
                        project.projectStatus
                      );

                      return (
                        <Card
                          key={project.prjNo}
                          className="border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                          onClick={() => handleProjectClick(project.prjNo)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-3 h-3 ${getProjectColor(
                                    project
                                  )} rounded-full`}
                                ></div>
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {project.projectName}
                                </h3>
                              </div>
                              {project.isFavorite && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {project.projectContents ||
                                '프로젝트 설명이 없습니다.'}
                            </p>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>진행률</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge
                                  className={`text-xs px-2 py-1 ${getProjectStatusColor(
                                    project.projectStatus
                                  )}`}
                                >
                                  {statusLabel}
                                </Badge>

                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {activeMembers.length}
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

          {/* 사이드바 - 빠른 액세스 및 활동 */}
          <div className="space-y-6">
            {/* 빠른 액세스 */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  빠른 액세스
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-50"
                  onClick={() => navigate('/tasks')}
                >
                  <CheckCircle className="w-4 h-4 mr-3 text-green-600" />내 작업
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-50"
                  onClick={() => navigate('/calendar')}
                >
                  <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                  캘린더
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-50"
                  onClick={() => navigate('/reports')}
                >
                  <TrendingUp className="w-4 h-4 mr-3 text-purple-600" />
                  보고서
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-50"
                  onClick={() => navigate('/goals')}
                >
                  <Target className="w-4 h-4 mr-3 text-orange-600" />
                  목표
                </Button>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        새 프로젝트 "모바일 앱 개발"이 생성되었습니다
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        "UI 디자인" 작업이 완료되었습니다
                      </p>
                      <p className="text-xs text-gray-500 mt-1">4시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        팀 멤버 3명이 프로젝트에 참여했습니다
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1일 전</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 알림 */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  알림
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    새로운 알림이 없습니다
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 즐겨찾기 프로젝트 */}
        {projectStats.favorites > 0 && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                즐겨찾기 프로젝트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects
                  .filter((p) => p.isFavorite)
                  .slice(0, 3)
                  .map((project) => {
                    const progress = getProjectProgress(project);
                    const activeMembers =
                      project.prjMemList?.filter((m) => !m.deleteDate) || [];
                    const statusLabel = getProjectStatusLabel(
                      project.projectStatus
                    );

                    return (
                      <Card
                        key={project.prjNo}
                        className="border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-yellow-300"
                        onClick={() => handleProjectClick(project.prjNo)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 ${getProjectColor(
                                  project
                                )} rounded-full`}
                              ></div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {project.projectName}
                              </h3>
                            </div>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>진행률</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge
                                className={`text-xs px-2 py-1 ${getProjectStatusColor(
                                  project.projectStatus
                                )}`}
                              >
                                {statusLabel}
                              </Badge>

                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {activeMembers.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
