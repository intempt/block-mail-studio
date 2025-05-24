
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Zap, CheckCircle } from 'lucide-react';

interface BrandVoiceOptimizerProps {
  editor: any;
  emailHTML: string;
}

export const BrandVoiceOptimizer: React.FC<BrandVoiceOptimizerProps> = ({ editor, emailHTML }) => {
  const voiceMetrics = [
    { name: 'Tone Consistency', score: 85, color: 'bg-green-500' },
    { name: 'Clarity', score: 92, color: 'bg-blue-500' },
    { name: 'Engagement', score: 78, color: 'bg-yellow-500' },
    { name: 'Brand Alignment', score: 88, color: 'bg-purple-500' }
  ];

  const suggestions = [
    'Add more personal touches to increase engagement',
    'Consider using active voice for clearer messaging',
    'Include social proof elements'
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm mb-3">Brand Voice Optimization</h3>
      
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-sm">Voice Analysis</span>
        </div>
        
        <div className="space-y-3">
          {voiceMetrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{metric.name}</span>
                <span className="text-xs font-medium">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm">Suggestions</span>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{suggestion}</span>
            </div>
          ))}
        </div>
      </Card>

      <Button className="w-full" size="sm">
        <Zap className="w-4 h-4 mr-2" />
        Optimize Content
      </Button>
    </div>
  );
};
