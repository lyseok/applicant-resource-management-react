import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Mail, Link } from 'lucide-react';
import {
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
} from '@/store/slices/projectSlice';

const MEMBER_ROLES = [
  { value: 'OWNER', label: '소유자', color: 'bg-purple-100 text-purple-800' },
  { value: 'ADMIN', label: '관리자', color: 'bg-blue-100 text-blue-800' },
  { value: 'MEMBER', label: '멤버', color: 'bg-green-100 text-green-800' },
  { value: 'VIEWER', label: '뷰어', color: 'bg-gray-100 text-gray-800' },
];

export default function ProjectMemberModal({ isOpen, onClose, project }) {
  const dispatch = useDispatch();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setLoading(true);
    try {
      await dispatch(
        addProjectMember({
          projectId: project.prjNo,
          memberData: {
            email: inviteEmail,
            role: inviteRole,
          },
        })
      ).unwrap();

      setInviteEmail('');
      setInviteRole('MEMBER');
    } catch (error) {
      console.error('멤버 초대 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await dispatch(
        updateMemberRole({
          projectId: project.prjNo,
          memberId,
          role: newRole,
        })
      ).unwrap();
    } catch (error) {
      console.error('역할 변경 실패:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('정말로 이 멤버를 제거하시겠습니까?')) {
      try {
        await dispatch(
          removeProjectMember({
            projectId: project.prjNo,
            memberId,
          })
        ).unwrap();
      } catch (error) {
        console.error('멤버 제거 실패:', error);
      }
    }
  };

  const getRoleInfo = (role) => {
    return MEMBER_ROLES.find((r) => r.value === role) || MEMBER_ROLES[2];
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/project/${project.prjNo}/invite`;
    navigator.clipboard.writeText(inviteLink);
    // TODO: 토스트 메시지 표시
  };

  if (!isOpen || !project) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              프로젝트 멤버 관리
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* 멤버 초대 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">멤버 초대</h3>

              <form onSubmit={handleInviteMember} className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="이메일 주소를 입력하세요"
                    className="flex-1"
                  />
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBER_ROLES.filter(
                        (role) => role.value !== 'OWNER'
                      ).map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    disabled={loading || !inviteEmail.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    초대
                  </Button>
                </div>
              </form>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInviteLink}
                  className="text-sm bg-transparent"
                >
                  <Link className="w-4 h-4 mr-2" />
                  초대 링크 복사
                </Button>
              </div>
            </div>

            {/* 현재 멤버 목록 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  프로젝트 멤버 ({project.members?.length || 0})
                </h3>
              </div>

              <div className="space-y-3">
                {project.members?.map((member) => {
                  const roleInfo = getRoleInfo(member.authorityCode);
                  return (
                    <div
                      key={member.userId}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-500 text-white font-medium">
                          {member.userName?.charAt(0) ||
                            member.userEmail?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                          {member.userName || member.userEmail}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.userEmail}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {member.authorityCode === 'OWNER' ? (
                          <Badge className={roleInfo.color}>
                            {roleInfo.label}
                          </Badge>
                        ) : (
                          <Select
                            value={member.authorityCode}
                            onValueChange={(newRole) =>
                              handleRoleChange(member.userId, newRole)
                            }
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MEMBER_ROLES.filter(
                                (role) => role.value !== 'OWNER'
                              ).map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {member.authorityCode !== 'OWNER' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.userId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(!project.members || project.members.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    아직 프로젝트 멤버가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <Button onClick={onClose} className="w-full">
              완료
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
