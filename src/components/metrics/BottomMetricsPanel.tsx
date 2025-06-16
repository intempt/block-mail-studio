
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BottomMetricsPanelProps {
  emailContent: string;
  subjectLine: string;
}

export const BottomMetricsPanel: React.FC<BottomMetricsPanelProps> = ({ 
  emailContent, 
  subjectLine 
}) => {
  // Simple metrics calculation
  const wordCount = emailContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = emailContent.replace(/<[^>]*>/g, '').length;
  const subjectLength = subjectLine.length;

  return (
    <Card className="border-t border-gray-200 bg-white rounded-none">
      <div className="px-6 py-3">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Words:</span>
            <span>{wordCount}</span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Characters:</span>
            <span>{characterCount}</span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Subject Length:</span>
            <span className={subjectLength > 50 ? 'text-amber-600' : 'text-green-600'}>
              {subjectLength}/50
            </span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className="text-green-600">Draft</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
