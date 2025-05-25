
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, GitBranch, Users, Clock } from 'lucide-react';

export const JourneysTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Customer Journeys</h2>
          <p className="text-gray-600">Create automated message sequences and user flows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Journey
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Welcome Series</h3>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              1,247 users enrolled
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              5 steps • 7 days
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Cart Abandonment</h3>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              892 users enrolled
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              3 steps • 3 days
            </div>
          </div>
        </Card>

        <Card className="p-6 border-dashed border-2 border-gray-300 bg-gray-50">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Create Journey</h3>
            <p className="text-sm text-gray-500">Build automated workflows</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
