import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header() {
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
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-violet-600 rounded-full"></Badge>
          </Button>
          <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all">
            <AvatarFallback className="bg-yellow-500 text-white text-sm font-semibold">
              김
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
