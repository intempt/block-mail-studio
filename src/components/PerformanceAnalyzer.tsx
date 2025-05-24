
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Mail, MousePointer, Eye } from 'lucide-react';

interface PerformanceAnalyzerProps {
  editor: any;
  emailHTML: string;
}

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ editor, emailHTML }) => {
  const metrics = [
    { name: 'Open Rate', value: 24.5, target: 25, icon: Eye, trend: 'up' },
    { name: 'Click Rate', value: 3.2, target: 4, icon: MousePointer, trend: 'down' },
    { name: 'Deliverability', value: 98.5, target: 99, icon: Mail, trend: 'up' }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm mb-3">Performance Analytics</h3>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                {metric.value}%
              </Badge>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">Target: {metric.target}%</p>
          </Card>
        ))}
      </div>

      <Card className="p-3">
        <h4 className="font-medium text-sm mb-2">Content Analysis</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Character count:</span>
            <span>{emailHTML.replace(/<[^>]*>/g, '').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Reading time:</span>
            <span>~2 min</span>
          </div>
          <div className="flex justify-between">
            <span>Mobile friendly:</span>
            <Badge variant="default" className="text-xs">Yes</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
