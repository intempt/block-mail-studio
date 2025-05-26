
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Mail, MessageSquare } from 'lucide-react';

export const SnippetsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Welcome Header</span>
            </div>
            <span className="text-xs text-gray-500">Email</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            "Welcome to our community! We're excited to have you on board..."
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">Edit</Button>
            <Button variant="outline" size="sm" className="text-xs">Use</Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">CTA Button</span>
            </div>
            <span className="text-xs text-gray-500">Universal</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            "Get Started Today - Limited Time Offer!"
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">Edit</Button>
            <Button variant="outline" size="sm" className="text-xs">Use</Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Footer</span>
            </div>
            <span className="text-xs text-gray-500">Email</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            "Thanks for being part of our community. Unsubscribe anytime..."
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">Edit</Button>
            <Button variant="outline" size="sm" className="text-xs">Use</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
