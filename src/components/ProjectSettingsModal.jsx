import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Save, Trash2, MessageCircle, AlertTriangle } from 'lucide-react';
import {
  updateProjectDetails,
  deleteProject,
  updateProjectVisibleTabs,
  updateChatroomName,
} from '@/store/slices/projectSlice';
import { useNavigate } from 'react-router-dom';

const PROJECT_STATUSES = [
  { value: 'PROG-000', label: '계획 중' },
  { value: 'PROG-001', label: '진행 중' },
  { value: 'PROG-004', label: '완료' },
  { value: 'PROG-003', label: '보류' },
];

const ALL_TABS = [
  { id: 'overview', label: '요약' },
  { id: 'board', label: '보드' },
  { id: 'list', label: '목록' },
  { id: 'timeline', label: '타임라인' },
  { id: 'dashboard', label: '대시보드' },
  { id: 'calendar', label: '캘린더' },
  { id: 'bulletin', label: '게시판' },
  { id: 'chat', label: '채팅' },
];

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  isOwner = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState(project?.projectName || '');
  const [projectStatus, setProjectStatus] = useState(
    project?.projectStatus || '계획중'
  );
  const [projectContents, setProjectContents] = useState(
    project?.projectContents || ''
  );
  const [visibleTabs, setVisibleTabs] = useState(
    project?.visibleTabs || ALL_TABS.map((tab) => tab.id)
  );
  const [chatroomName, setChatroomName] = useState(project?.chatroomName || '');

  useEffect(() => {
    if (project) {
      setProjectName(project.projectName || '');
      setProjectStatus(project.projectStatus || '계획중');
      setProjectContents(project.projectContents || '');
      setVisibleTabs(project.visibleTabs || ALL_TABS.map((tab) => tab.id));
      setChatroomName(project.chatroomName || '');
    }
  }, [project]);

  const handleSave = async () => {
    if (!project?.prjNo) return;

    try {
      await dispatch(
        updateProjectDetails({
          projectId: project.prjNo,
          projectData: {
            projectName,
            projectStatus,
            projectContents,
          },
        })
      ).unwrap();

      // await dispatch(
      //   updateProjectVisibleTabs({
      //     projectId: project.prjNo,
      //     visibleTabs,
      //   })
      // ).unwrap();

      // await dispatch(
      //   updateChatroomName({
      //     projectId: project.prjNo,
      //     chatroomName: chatroomName,
      //   })
      // ).unwrap();

      onClose();
    } catch (error) {
      console.error('프로젝트 설정 저장 실패:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!project?.prjNo) return;
    if (
      window.confirm(
        `정말로 프로젝트 '${project.projectName}'을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      try {
        await dispatch(deleteProject(project.prjNo)).unwrap();
        onClose();
        navigate('/');
      } catch (error) {
        console.error('프로젝트 삭제 실패:', error);
      }
    }
  };

  const handleTabToggle = (tabId, checked) => {
    setVisibleTabs((prev) =>
      checked ? [...prev, tabId] : prev.filter((id) => id !== tabId)
    );
  };

  if (!isOpen || !project) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              프로젝트 설정
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">기본 정보</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 이름
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 상태
                </label>
                <Select value={projectStatus} onValueChange={setProjectStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 설명
                </label>
                <Textarea
                  value={projectContents}
                  onChange={(e) => setProjectContents(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* 탭 가시성 설정 */}
            {/* <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">탭 가시성</h3>
              <div className="grid grid-cols-2 gap-3">
                {ALL_TABS.map((tab) => (
                  <div key={tab.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tab-${tab.id}`}
                      checked={visibleTabs.includes(tab.id)}
                      onCheckedChange={(checked) =>
                        handleTabToggle(tab.id, checked)
                      }
                    />
                    <label
                      htmlFor={`tab-${tab.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tab.label}
                    </label>
                  </div>
                ))}
              </div>
            </div> */}

            {/* 채팅방 설정 */}
            {/* <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                채팅방 설정
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  채팅방 이름
                </label>
                <Input
                  value={chatroomName}
                  onChange={(e) => setChatroomName(e.target.value)}
                />
              </div>
            </div> */}

            {/* 프로젝트 삭제 - OWNER만 가능 */}
            {isOwner && (
              <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-medium text-red-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  위험 구역
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-3">
                    프로젝트를 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이
                    작업은 되돌릴 수 없습니다.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteProject}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    프로젝트 삭제
                  </Button>
                </div>
              </div>
            )}

            {/* 관리자 권한 안내 */}
            {!isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  관리자 권한으로 접근 중입니다. 프로젝트 삭제는 소유자만
                  가능합니다.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              변경사항 저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
