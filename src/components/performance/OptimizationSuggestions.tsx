
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';

interface OptimizationSuggestionsProps {
  analysis: PerformanceAnalysisResult;
  onOptimize?: (suggestion: string) => void;
}

export const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ 
  analysis, 
  onOptimize 
}) => {
  if (analysis.optimizationSuggestions.length === 0) return null;

  return (
    <Card className="p-4 animate-fade-in">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        AI Optimization Suggestions
      </h4>
      <div className="space-y-2">
        {analysis.optimizationSuggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm text-blue-900 flex-1">{suggestion}</span>
            {onOptimize && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOptimize(suggestion)}
                className="ml-2 h-7 text-xs"
              >
                Apply
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
