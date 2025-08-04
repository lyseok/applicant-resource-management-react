import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Settings,
  ArrowLeftCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, logout } from '@/store/slices/authSlice';
import { BASE_REDIRECT_URL } from '@/services/api';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, loading, initialized } = useSelector(
    (state) => state.auth
  );

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized, loading]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleLeaveProject = () => {
    console.log('프로젝트 나가기');
    navigate('/');
  };

  const handleMyPage = () => {
    console.log('마이페이지');
    location.href = 'http://192.168.34.70/mypage';
  };

  const handleGoToDditJob = () => {
    console.log('띹잡 돌아가기');
    location.href = 'http://192.168.34.70/';
  };

  // 사용자 이름의 첫 글자 추출
  const getUserInitial = () => {
    if (currentUser?.userName) {
      return currentUser.userName.charAt(0);
    }
    if (currentUser?.username) {
      return currentUser.username.charAt(0);
    }
    return 'U';
  };

  // 사용자 이름 표시
  const getUserDisplayName = () => {
    if (loading && !initialized) return '로딩 중...';
    if (currentUser?.userName) return currentUser.userName;
    if (currentUser?.username) return currentUser.username;
    if (!isAuthenticated) return '로그인 필요';
    location.href = BASE_REDIRECT_URL; // 로그인 안되어 있으면 띹잡으로 돌아갑니다
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl text-gray-900">DDIT JOB</span>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="검색"
              className="pl-11 bg-gray-100 border-none rounded-lg py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-violet-600 rounded-full"></Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {getUserDisplayName()}
                </span>
                <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all">
                  <AvatarFallback className="bg-yellow-500 text-white text-sm font-semibold">
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuItem onClick={handleLeaveProject}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                <span>프로젝트 나가기</span>
              </DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleMyPage}>
                <User className="mr-2 h-4 w-4" />
                <span>마이페이지</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToDditJob}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                <span>띹잡 돌아가기</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
