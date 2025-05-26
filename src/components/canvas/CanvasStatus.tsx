
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Mail, Image, Link, FileText } from 'lucide-react';
import { EmailAnalyticsService } from '@/services/emailAnalyticsService';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML?: string;
  subjectLine?: string;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML = '',
  subjectLine = ''
}) => {
  const analytics = useMemo(() => {
    if (!emailHTML) return null;
    return EmailAnalyticsService.analyzeEmail(emailHTML, subjectLine);
  }, [emailHTML, subjectLine]);

  return (
    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {previewMode === 'desktop' ? 
            <Monitor className="w-3 h-3" /> : 
            <Smartphone className="w-3 h-3" />
          }
          <span>{canvasWidth}px</span>
        </div>
        
        {selectedBlockId && (
          <Badge variant="outline" className="text-xs">
            Selected: {selectedBlockId.split('_')[0]}
          </Badge>
        )}

        {analytics && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{analytics.sizeKB}KB</span>
            </div>
            
            {analytics.imageCount > 0 && (
              <div className="flex items-center gap-1">
                <Image className="w-3 h-3" />
                <span>{analytics.imageCount} ({analytics.imageSizeKB}KB)</span>
              </div>
            )}
            
            {analytics.linkCount > 0 && (
              <div className="flex items-center gap-1">
                <Link className="w-3 h-3" />
                <span>{analytics.linkCount}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>Mobile: {analytics.mobileScore}%</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>Deliverability: {analytics.deliverabilityScore}%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-right">
        <span className="text-gray-400">Email Canvas</span>
        {analytics && (
          <div className="text-gray-400 mt-1">
            Est. Open: {analytics.performancePrediction.openRate}% | 
            Click: {analytics.performancePrediction.clickRate}% | 
            Convert: {analytics.performancePrediction.conversionRate}%
          </div>
        )}
      </div>
    </div>
  );
};
