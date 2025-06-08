
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, RefreshCw, Zap } from 'lucide-react';

interface AnalysisHeaderProps {
  autoAnalyze: boolean;
  isAnalyzing: boolean;
  onAutoAnalyzeToggle: () => void;
  onRunAnalysis: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  autoAnalyze,
  isAnalyzing,
  onAutoAnalyzeToggle,
  onRunAnalysis
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Enhanced Performance Analysis
      </h3>
      <div className="flex items-center gap-2">
        <Badge variant={autoAnalyze ? "default" : "outline"} className="text-xs">
          Auto-analyze: {autoAnalyze ? 'ON' : 'OFF'}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoAnalyzeToggle}
          className="h-7"
        >
          {autoAnalyze ? 'Manual' : 'Auto'}
        </Button>
        <Button
          size="sm"
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="h-7"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-3 h-3 animate-spin mr-1" />
          ) : (
            <Zap className="w-3 h-3 mr-1" />
          )}
          Analyze
        </Button>
      </div>
    </div>
  );
};
