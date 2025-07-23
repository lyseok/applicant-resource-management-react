"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export default function AdminDashboard() {
  const { tasks } = useSelector((state) => state.tasks)
  const { currentProject } = useSelector((state) => state.project)
  const { currentUser } = useSelector((state) => state.auth)

  const [selectedAssignee, setSelectedAssignee] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // 관리자 권한 체크
  const isAdmin = currentProject?.prjMemList?.some(
    (member) =>
      member.userId === (currentUser?.userId || currentUser?.username) &&
      (member.authorityCode === "OWNER" || member.authorityCode === "MANAGER") &&
      member.deleteDate === null,
  )

  // 활성 멤버만 필터링
  const activeMembers = currentProject?.prjMemList?.filter((member) => member.deleteDate === null) || []

  // 멤버별 작업 통계 계산
  const memberStats = activeMembers.map((member) => {
    const memberTasks = tasks.filter((task) => task.userId === member.userId)
    const completedTasks = memberTasks.filter((task) => task.taskStatus === "PEND-003")
    const inProgressTasks = memberTasks.filter((task) => task.taskStatus === "PEND-002")
    const todoTasks = memberTasks.filter((task) => task.taskStatus === "PEND-001")

    // 지연된 작업 계산
    const overdueTasks = memberTasks.filter((task) => {
      if (!task.dueDate || task.taskStatus === "PEND-003") return false
      const dueDate = new Date(task.dueDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))
      const today = new Date()
      return dueDate < today
    })

    const completionRate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0

    return {
      ...member,
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      todoTasks: todoTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate,
    }
  })

  // 필터링된 작업 목록
  const filteredTasks = tasks.filter((task) => {
    const matchesAssignee = selectedAssignee === "all" || task.userId === selectedAssignee
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.taskStatus === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priorityCode === priorityFilter

    return matchesAssignee && matchesSearch && matchesStatus && matchesPriority
  })

  // 차트 데이터 준비
  const statusData = [
    { name: "할 일", value: tasks.filter((t) => t.taskStatus === "PEND-001").length, color: "#3B82F6" },
    { name: "진행 중", value: tasks.filter((t) => t.taskStatus === "PEND-002").length, color: "#F59E0B" },
    { name: "완료", value: tasks.filter((t) => t.taskStatus === "PEND-003").length, color: "#10B981" },
  ]

  const memberWorkloadData = memberStats.map((member) => ({
    name: member.userName,
    total: member.totalTasks,
    completed: member.completedTasks,
    inProgress: member.inProgressTasks,
    todo: member.todoTasks,
  }))

  // 우선순위별 통계
  const priorityStats = [
    { name: "높음", value: tasks.filter((t) => t.priorityCode === "PCOD001").length, color: "#EF4444" },
    { name: "보통", value: tasks.filter((t) => t.priorityCode === "PCOD002").length, color: "#F59E0B" },
    { name: "낮음", value: tasks.filter((t) => t.priorityCode === "PCOD003").length, color: "#10B981" },
  ]

  // 사용자 정보 가져오기
  const getUserInfo = (userId) => {
    const member = activeMembers.find((m) => m.userId === userId)
    return member || { userName: "미지정", userEmail: "" }
  }

  // 상태 레이블 변환
  const getStatusLabel = (status) => {
    switch (status) {
      case "PEND-001":
        return "할 일"
      case "PEND-002":
        return "진행 중"
      case "PEND-003":
        return "완료"
      default:
        return status
    }
  }

  // 우선순위 레이블 변환
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "PCOD001":
        return "높음"
      case "PCOD002":
        return "보통"
      case "PCOD003":
        return "낮음"
      default:
        return priority
    }
  }

  // 우선순위 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "PCOD001":
        return "bg-red-100 text-red-800 border-red-200"
      case "PCOD002":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "PCOD003":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // 상태 색상
  const getStatusColor = (status) => {
    switch (status) {
      case "PEND-001":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PEND-002":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "PEND-003":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-600">이 페이지는 프로젝트 관리자만 접근할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-purple-600" />
              프로젝트 관리 대시보드
            </h1>
            <p className="text-gray-600 mt-1">프로젝트 현황과 팀 성과를 관리하세요</p>
          </div>
        </div>

        {/* 주요 지표 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                  <div className="text-sm text-gray-500">전체 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tasks.filter((t) => t.taskStatus === "PEND-003").length}
                  </div>
                  <div className="text-sm text-gray-500">완료된 작업</div>
                </div>
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
                    {tasks.filter((t) => t.taskStatus === "PEND-002").length}
                  </div>
                  <div className="text-sm text-gray-500">진행 중인 작업</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{activeMembers.length}</div>
                  <div className="text-sm text-gray-500">팀 멤버</div>
                </div>
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
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                작업 상태 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
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
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 멤버별 작업량 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                멤버별 작업량
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberWorkloadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" stackId="a" fill="#10B981" name="완료" />
                    <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="진행중" />
                    <Bar dataKey="todo" stackId="a" fill="#3B82F6" name="할일" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 팀 성과 및 작업 필터링 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 팀 성과 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />팀 성과 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {memberStats.map((member) => (
                  <div key={member.userId} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-500 text-white font-medium">
                            {member.userName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{member.userName}</div>
                          <div className="text-sm text-gray-500">{member.userPosition}</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {member.completionRate}% 완료
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded">
                        <div className="font-bold">{member.todoTasks}</div>
                        <div>할 일</div>
                      </div>
                      <div className="bg-orange-100 text-orange-800 p-2 rounded">
                        <div className="font-bold">{member.inProgressTasks}</div>
                        <div>진행중</div>
                      </div>
                      <div className="bg-green-100 text-green-800 p-2 rounded">
                        <div className="font-bold">{member.completedTasks}</div>
                        <div>완료</div>
                      </div>
                      <div className="bg-red-100 text-red-800 p-2 rounded">
                        <div className="font-bold">{member.overdueTasks}</div>
                        <div>지연</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={member.completionRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 작업 필터링 및 목록 */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-indigo-600" />
                작업 필터링
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 필터 컨트롤 */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
                    <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                      <SelectTrigger>
                        <SelectValue placeholder="담당자 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {activeMembers.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {member.userName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="PEND-001">할 일</SelectItem>
                        <SelectItem value="PEND-002">진행 중</SelectItem>
                        <SelectItem value="PEND-003">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="작업 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 필터링된 작업 목록 */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">조건에 맞는 작업이 없습니다.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const assigneeInfo = getUserInfo(task.userId)
                    return (
                      <div key={task.taskNo} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{task.taskName}</h4>
                          <div className="flex space-x-1">
                            <Badge className={`text-xs ${getPriorityColor(task.priorityCode)}`}>
                              {getPriorityLabel(task.priorityCode)}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(task.taskStatus)}`}>
                              {getStatusLabel(task.taskStatus)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-gray-400 text-white text-xs">
                                {assigneeInfo.userName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{assigneeInfo.userName}</span>
                          </div>
                          <span>
                            {task.dueDate ? `${task.dueDate.slice(4, 6)}/${task.dueDate.slice(6, 8)}` : "마감일 없음"}
                          </span>
                        </div>
                        {task.progressRate && (
                          <div className="mt-2">
                            <Progress value={Number.parseInt(task.progressRate)} className="h-1" />
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
