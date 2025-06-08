
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor } from 'lucide-react';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';

interface TechnicalMetricsProps {
  analysis: PerformanceAnalysisResult;
}

export const TechnicalMetrics: React.FC<TechnicalMetricsProps> = ({ analysis }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-4 animate-scale-in">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Monitor className="w-4 h-4" />
        Technical Metrics
      </h4>
      <div className="space-y-3">
        {Object.entries(analysis.metrics).map(([key, metric]) => (
          <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                {metric.status}
              </Badge>
            </div>
            <div className="text-sm font-mono">
              {metric.value !== null ? 
                (key === 'loadTime' ? `${metric.value}s` : metric.value) : 
                '--'
              }
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
