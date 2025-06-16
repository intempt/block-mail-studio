
import React from 'react';
import { Card } from '@/components/ui/card';
import { EmailBlock } from '@/types/emailBlocks';

interface EmailMetricsPanelProps {
  blocks: EmailBlock[];
  emailContent: string;
}

export const EmailMetricsPanel: React.FC<EmailMetricsPanelProps> = ({
  blocks,
  emailContent
}) => {
  const getMetrics = () => {
    const blockCount = blocks.length;
    const characterCount = emailContent.replace(/<[^>]*>/g, '').length;
    const wordCount = emailContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      blockCount,
      characterCount,
      wordCount
    };
  };

  const metrics = getMetrics();

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-medium">{metrics.blockCount}</span>
          <span>blocks</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">{metrics.wordCount}</span>
          <span>words</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">{metrics.characterCount}</span>
          <span>characters</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          Canvas-based Email Editor
        </div>
      </div>
    </div>
  );
};
