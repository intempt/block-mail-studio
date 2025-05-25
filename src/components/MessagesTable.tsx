
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal,
  Mail,
  MessageSquare,
  Bell,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

interface Message {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  format: 'html' | 'rich-text';
  status: 'draft' | 'active' | 'paused';
  lastModified: string;
  opens?: number;
  clicks?: number;
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Welcome Email Series - Part 1',
    type: 'email',
    format: 'html',
    status: 'active',
    lastModified: '2 hours ago',
    opens: 1247,
    clicks: 89
  },
  {
    id: '2',
    name: 'Abandoned Cart Reminder',
    type: 'email',
    format: 'rich-text',
    status: 'active',
    lastModified: '1 day ago',
    opens: 892,
    clicks: 156
  },
  {
    id: '3',
    name: 'Flash Sale Alert',
    type: 'sms',
    format: 'rich-text',
    status: 'draft',
    lastModified: '3 days ago'
  },
  {
    id: '4',
    name: 'New Feature Announcement',
    type: 'push',
    format: 'rich-text',
    status: 'paused',
    lastModified: '1 week ago'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'sms': return <MessageSquare className="w-4 h-4" />;
    case 'push': return <Bell className="w-4 h-4" />;
    default: return <Mail className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const MessagesTable: React.FC = () => {
  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          <Button size="sm" variant="outline">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Modified</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockMessages.map((message) => (
                <tr key={message.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">
                        {getTypeIcon(message.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-500">{message.format.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="capitalize">
                      {message.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    {message.opens !== undefined ? (
                      <div className="text-sm">
                        <div className="text-gray-900">{message.opens} opens</div>
                        <div className="text-gray-500">{message.clicks} clicks</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {message.lastModified}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
