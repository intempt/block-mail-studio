
import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, RefreshCw } from 'lucide-react';

interface EmptyAnalysisStateProps {
  autoAnalyze: boolean;
  isAnalyzing: boolean;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({
  autoAnalyze,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <Card className="p-4">
        <div className="text-center py-6">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Analyzing email performance...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">
        {autoAnalyze ? 'Add email content to see performance analysis' : 'Click Analyze to check performance'}
      </p>
    </Card>
  );
};
