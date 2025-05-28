
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Mail, Image, Link, FileText, BarChart3, TrendingUp, RefreshCw, Shield, Clock } from 'lucide-react';
import { useCallbackEmailAnalysis } from '@/contexts/CallbackEmailAnalysisContext';

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
  const { analysis, isAnalyzing, lastAnalyzed, analyzeEmailAsync } = useCallbackEmailAnalysis();
  const [hasContent, setHasContent] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
    
    // Trigger analysis when content exists
    if (contentExists && subjectLine) {
      analyzeEmailAsync({
        emailHTML,
        subjectLine,
        variant: 'quick'
      });
    }
  }, [emailHTML, subjectLine, analyzeEmailAsync]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastAnalyzed = () => {
    if (!lastAnalyzed) return 'Not analyzed';
    const now = new Date();
    const diffMs = now.getTime() - lastAnalyzed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastAnalyzed.toLocaleDateString();
  };

  const refreshAnalysis = () => {
    if (hasContent) {
      analyzeEmailAsync({
        emailHTML,
        subjectLine,
        variant: 'quick'
      });
    }
  };

  return (
    <div className="mt-4 bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAnalysis}
              disabled={isAnalyzing || !hasContent}
              className="h-6 px-2 text-xs"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              Refresh
            </Button>
            
            {lastAnalyzed && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatLastAnalyzed()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-gray-400">AI Email Analytics</span>
        </div>
      </div>

      {/* Show message when no content */}
      {!hasContent && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Add content to see analytics</p>
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && hasContent && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-500" />
          <span className="text-sm text-gray-600">Analyzing email with AI...</span>
        </div>
      )}

      {/* Analytics display using shared analysis */}
      {analysis && !isAnalyzing && (
        <div className="grid grid-cols-12 gap-4 text-xs">
          {/* Content Metrics */}
          <div className="col-span-3 space-y-2">
            <div className="font-medium text-gray-700 mb-2">Content Metrics</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Size
                </span>
                <span className="font-medium">{analysis.contentMetrics.sizeKB}KB</span>
              </div>
              
              {analysis.contentMetrics.linkCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    Links
                  </span>
                  <span>{analysis.contentMetrics.linkCount}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Words
                </span>
                <span>{analysis.contentMetrics.wordCount}</span>
              </div>
            </div>
          </div>

          {/* Performance Scores */}
          <div className="col-span-3 space-y-2">
            <div className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Performance Scores
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Overall</span>
                <span className={`font-medium ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deliverability</span>
                <span className={`font-medium ${getScoreColor(analysis.deliverabilityScore)}`}>
                  {analysis.deliverabilityScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mobile</span>
                <span className={`font-medium ${getScoreColor(analysis.mobileScore)}`}>
                  {analysis.mobileScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Spam Risk
                </span>
                <span className={`font-medium ${analysis.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.spamScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance Predictions */}
          <div className="col-span-3 space-y-2">
            <div className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              AI Predictions
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Open Rate</span>
                <span className="font-medium text-blue-600">
                  {analysis.performancePrediction.openRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Click Rate</span>
                <span className="font-medium text-purple-600">
                  {analysis.performancePrediction.clickRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Conversion</span>
                <span className="font-medium text-green-600">
                  {analysis.performancePrediction.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Brand & Engagement Scores */}
          <div className="col-span-3 space-y-2">
            <div className="font-medium text-gray-700 mb-2">Brand Analysis</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Brand Voice</span>
                <span className={`font-medium ${getScoreColor(analysis.brandVoiceScore)}`}>
                  {analysis.brandVoiceScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Engagement</span>
                <span className={`font-medium ${getScoreColor(analysis.engagementScore)}`}>
                  {analysis.engagementScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Readability</span>
                <span className={`font-medium ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
