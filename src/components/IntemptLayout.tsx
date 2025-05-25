
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Bell,
  Settings,
  User,
  Mail,
  MessageSquare,
  BarChart3,
  Users,
  Zap,
  Plus
} from 'lucide-react';

interface IntemptLayoutProps {
  children: React.ReactNode;
}

export const IntemptLayout: React.FC<IntemptLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Nav */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Intempt</span>
              </div>
              
              <nav className="flex items-center space-x-6">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Audiences
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </div>

            {/* Search and User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border-gray-300"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};
