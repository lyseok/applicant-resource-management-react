import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function ProjectOverview() {
  const { currentProject } = useSelector((state) => state.project);
  const { tasks, statistics } = useSelector((state) => state.tasks);

  const completionRate =
    statistics.total > 0
      ? Math.round((statistics.completed / statistics.total) * 100)
      : 0;

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 프로젝트 개요 카드 */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                프로젝트 개요
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                편집
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 프로젝트 설명 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">설명</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentProject.description ||
                  '프로젝트 설명이 아직 추가되지 않았습니다. 편집 버튼을 클릭하여 설명을 추가해보세요.'}
              </p>
            </div>

            {/* 프로젝트 진행률 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">진행률</h3>
                <span className="text-sm font-semibold text-gray-900">
                  {completionRate}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            {/* 프로젝트 소유자 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                프로젝트 소유자
              </h3>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-yellow-500 text-white font-medium">
                    {currentProject.owner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">
                    {currentProject.owner.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentProject.owner.role}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.total}
                  </div>
                  <div className="text-sm text-gray-500">전체 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.completed}
                  </div>
                  <div className="text-sm text-gray-500">완료된 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.incomplete}
                  </div>
                  <div className="text-sm text-gray-500">진행 중인 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.overdue}
                  </div>
                  <div className="text-sm text-gray-500">지연된 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 작업 */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                최근 작업
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50"
              >
                모두 보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.taskNo}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {task.taskName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.dueDate
                        ? `마감일: ${task.dueDate.slice(
                            4,
                            6
                          )}월 ${task.dueDate.slice(6, 8)}일`
                        : '마감일 없음'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={`px-2 py-1 text-xs ${
                        task.taskStatus === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : task.taskStatus === 'IN_PROGRESS'
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {task.taskStatus === 'COMPLETED'
                        ? '완료'
                        : task.taskStatus === 'IN_PROGRESS'
                        ? '진행 중'
                        : '할 일'}
                    </Badge>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-yellow-500 text-white text-xs font-medium">
                        미문
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 빈 상태 섹션들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 목표 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  목표
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  아직 목표가 설정되지 않았습니다.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  목표 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 팀 멤버 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />팀 멤버
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  초대
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-yellow-500 text-white font-medium">
                      {currentProject.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {currentProject.owner.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentProject.owner.role}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    소유자
                  </Badge>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    팀 멤버 초대
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
