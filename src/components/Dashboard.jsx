import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Users,
  Calendar,
  Activity,
} from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

export default function Dashboard() {
  const { tasks, statistics } = useSelector((state) => state.tasks);
  const { currentProject } = useSelector((state) => state.project);

  // 차트 데이터 준비
  const statusData = [
    {
      name: '할 일',
      value: tasks.filter((t) => t.taskStatus === 'TODO').length,
      color: '#3B82F6',
    },
    {
      name: '진행 중',
      value: tasks.filter((t) => t.taskStatus === 'IN_PROGRESS').length,
      color: '#F59E0B',
    },
    {
      name: '완료',
      value: tasks.filter((t) => t.taskStatus === 'COMPLETED').length,
      color: '#10B981',
    },
  ];

  const priorityData = [
    {
      name: '높음',
      value: tasks.filter((t) => t.priorityCode === 'HIGH').length,
    },
    {
      name: '중간',
      value: tasks.filter((t) => t.priorityCode === 'MEDIUM').length,
    },
    {
      name: '낮음',
      value: tasks.filter((t) => t.priorityCode === 'LOW').length,
    },
  ];

  const weeklyProgress = [
    { week: '1주', completed: 2, total: 5 },
    { week: '2주', completed: 4, total: 8 },
    { week: '3주', completed: 3, total: 6 },
    { week: '4주', completed: 1, total: 4 },
  ];

  const completionRate =
    statistics.total > 0
      ? Math.round((statistics.completed / statistics.total) * 100)
      : 0;

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 주요 지표 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.total}
                  </div>
                  <div className="text-sm text-gray-500">전체 작업</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={completionRate} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {completionRate}% 완료
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.completed}
                  </div>
                  <div className="text-sm text-gray-500">완료된 작업</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-green-600 font-medium">
                +
                {statistics.completed > 0
                  ? Math.round((statistics.completed / statistics.total) * 100)
                  : 0}
                % 이번 주
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.incomplete}
                  </div>
                  <div className="text-sm text-gray-500">진행 중인 작업</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-orange-600 font-medium">
                {statistics.incomplete > 0 ? '진행 중' : '모든 작업 완료'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statistics.overdue}
                  </div>
                  <div className="text-sm text-gray-500">지연된 작업</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-red-600 font-medium">
                {statistics.overdue > 0 ? '주의 필요' : '지연 없음'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 작업 상태 분포 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                작업 상태 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 우선순위별 작업 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                우선순위별 작업
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주간 진행률 */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              주간 진행률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    name="완료된 작업"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6B7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                    name="전체 작업"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 팀 성과 및 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 팀 성과 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />팀 성과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-yellow-500 text-white font-medium">
                        미문
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">미문석</div>
                      <div className="text-sm text-gray-500">
                        프로젝트 소유자
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {statistics.completed}
                    </div>
                    <div className="text-sm text-gray-500">완료한 작업</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">이번 주 생산성</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                  <Progress value={85} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 최근 활동 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                최근 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.slice(0, 4).map((task, index) => (
                  <div key={task.taskNo} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{task.taskName}</span>
                        {task.taskStatus === 'COMPLETED'
                          ? ' 작업이 완료되었습니다'
                          : ' 작업이 생성되었습니다'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {task.dueDate
                          ? `마감일: ${task.dueDate.slice(
                              4,
                              6
                            )}월 ${task.dueDate.slice(6, 8)}일`
                          : '방금 전'}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${
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
                        ? '진행중'
                        : '대기'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
