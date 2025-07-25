import { Card, CardContent } from "@/components/ui/card"

export default function LoadingSpinner({ message = "로딩 중..." }) {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
      <Card className="w-96 bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* 스피너 애니메이션 */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-20"></div>
            </div>

            {/* 로딩 메시지 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
              <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
            </div>

            {/* 진행 표시 점들 */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
