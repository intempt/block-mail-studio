
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield } from 'lucide-react';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';

interface AccessibilityIssuesProps {
  analysis: PerformanceAnalysisResult;
}

export const AccessibilityIssues: React.FC<AccessibilityIssuesProps> = ({ analysis }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (analysis.accessibilityIssues.length === 0) return null;

  return (
    <Card className="p-4 animate-slide-in-right">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Accessibility Issues ({analysis.accessibilityIssues.length})
      </h4>
      <ScrollArea className="max-h-48">
        <div className="space-y-2">
          {analysis.accessibilityIssues.map((issue, index) => (
            <div key={index} className="p-3 border rounded hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </Badge>
                  <span className="text-sm font-medium">{issue.type}</span>
                </div>
                <AlertTriangle className={`w-4 h-4 ${getSeverityColor(issue.severity)}`} />
              </div>
              <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 {issue.fix}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
