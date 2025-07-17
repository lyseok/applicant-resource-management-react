"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { createProject } from "@/store/slices/projectSlice"

export default function CreateProjectModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setLoading(true)
    try {
      await dispatch(
        createProject({
          name: projectName,
          description,
          status: "진행 중",
          isFavorite: false,
        }),
      ).unwrap()

      setProjectName("")
      setDescription("")
      onClose()
    } catch (error) {
      console.error("프로젝트 생성 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">새 프로젝트 만들기</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 이름 *</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                취소
              </Button>
              <Button
                type="submit"
                disabled={loading || !projectName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "생성 중..." : "프로젝트 생성"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
