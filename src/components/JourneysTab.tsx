
import React from 'react';
import { Card } from '@/components/ui/card';
import { GitBranch, Users, Clock } from 'lucide-react';

export const JourneysTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 u-gap-6">
        <Card className="u-p-6">
          <div className="flex items-center u-gap-3 u-m-4">
            <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-h4 font-medium text-brand-fg">Welcome Series</h3>
              <p className="text-caption text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="space-y-2 text-caption text-brand-fg">
            <div className="flex items-center u-gap-2">
              <Users className="w-4 h-4" />
              1,247 users enrolled
            </div>
            <div className="flex items-center u-gap-2">
              <Clock className="w-4 h-4" />
              5 steps • 7 days
            </div>
          </div>
        </Card>

        <Card className="u-p-6">
          <div className="flex items-center u-gap-3 u-m-4">
            <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-h4 font-medium text-brand-fg">Cart Abandonment</h3>
              <p className="text-caption text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="space-y-2 text-caption text-brand-fg">
            <div className="flex items-center u-gap-2">
              <Users className="w-4 h-4" />
              892 users enrolled
            </div>
            <div className="flex items-center u-gap-2">
              <Clock className="w-4 h-4" />
              3 steps • 3 days
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
