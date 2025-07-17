"use client"

import { useSelector } from "react-redux"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Plus, Edit, Trash2 } from "lucide-react"

const getWorkTypeColor = (workType) => {
  switch (workType) {
    case "CREATE":
      return "bg-green-100 text-green-800 border-green-200"
    case "UPDATE":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "DELETE":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getWorkTypeIcon = (workType) => {
  switch (workType) {
    case "CREATE":
      return <Plus className="w-4 h-4" />
    case "UPDATE":
      return <Edit className="w-4 h-4" />
    case "DELETE":
      return <Trash2 className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getWorkTypeLabel = (workType) => {
  switch (workType) {
    case "CREATE":
      return "생성"
    case "UPDATE":
      return "수정"
    case "DELETE":
      return "삭제"
    default:
      return workType
  }
}

export default function WorkHistoryPanel() {
  const { workHistory } = useSelector((state) => state.tasks)
  const { currentProject } = useSelector((state) => state.project)

  const getUserInfo = (userId) => {
    const member = currentProject?.members?.find((m) => m.userId === userId)
    return member || { userName: "알 수 없음", userEmail: "" }
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 최근 순으로 정렬
  const sortedHistory = [...workHistory].sort((a, b) => new Date(b.createDate) - new Date(a.createDate))

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          작업 내역 추적
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>아직 작업 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sortedHistory.map((history) => {
              const userInfo = getUserInfo(history.userId)
              return (
                <div
                  key={history.workHistNo}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {userInfo.userName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{userInfo.userName}</span>
                      <Badge className={`${getWorkTypeColor(history.workType)} text-xs px-2 py-1`}>
                        <span className="flex items-center space-x-1">
                          {getWorkTypeIcon(history.workType)}
                          <span>{getWorkTypeLabel(history.workType)}</span>
                        </span>
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">{history.workContent}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">대상: {history.workTarget}</span>
                      <span className="text-xs text-gray-500">{formatDateTime(history.createDate)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
