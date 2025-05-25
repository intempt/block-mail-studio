
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Bell,
  Settings,
  User,
  Home,
  Users,
  CreditCard,
  GitBranch,
  Target,
  Eye,
  BarChart3,
  Bot,
  MoreHorizontal,
  Zap
} from 'lucide-react';

interface AuthenticIntemptLayoutProps {
  children: React.ReactNode;
  activeContext?: string;
}

export const AuthenticIntemptLayout: React.FC<AuthenticIntemptLayoutProps> = ({ 
  children, 
  activeContext = 'Journeys' 
}) => {
  const navigationItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: CreditCard, label: 'Accounts', active: false },
    { icon: GitBranch, label: 'Journeys', active: true },
    { icon: Target, label: 'Recommendations', active: false },
    { icon: Eye, label: 'Experiences', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Bot, label: 'Agents', active: false },
    { icon: MoreHorizontal, label: 'More', active: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Trollu namas</div>
              <div className="text-sm text-gray-500">Production</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  item.label === 'Journeys'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">TK</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Your Name</div>
              <div className="text-xs text-gray-500">your.email@domain.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumbs - Dynamic context */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Trollu namas</span>
                <span>{'>'}</span>
                <span>Production</span>
                <span>{'>'}</span>
                <span className="text-gray-900 font-medium">{activeContext}</span>
              </div>

              {/* Right side */}
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
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
