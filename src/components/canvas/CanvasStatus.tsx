import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Mail, Image, Link, FileText, BarChart3, TrendingUp, RefreshCw, Shield, Clock } from 'lucide-react';
import { UnifiedEmailAnalyticsService, UnifiedEmailAnalytics } from '@/services/unifiedEmailAnalytics';

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
  const [analytics, setAnalytics] = useState<UnifiedEmailAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [hasContent, setHasContent] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
    
    // Run initial analysis only if content exists and no previous analysis
    if (contentExists && !analytics && !isAnalyzing) {
      analyzeEmail();
    }
  }, [emailHTML]);

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      setAnalytics(null);
      setLastAnalyzed(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await UnifiedEmailAnalyticsService.analyzeEmail(emailHTML, subjectLine);
      setAnalytics(result);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const refreshAnalytics = () => {
    UnifiedEmailAnalyticsService.clearCache();
    analyzeEmail();
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
              onClick={refreshAnalytics}
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

      {/* Analytics display - keep existing comprehensive analytics display */}
      {analytics && !isAnalyzing && (
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
                <span className="font-medium">{analytics.sizeKB}KB</span>
              </div>
              
              {analytics.imageCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    Images
                  </span>
                  <span>{analytics.imageCount}</span>
                </div>
              )}
              
              {analytics.linkCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    Links
                  </span>
                  <span>{analytics.linkCount}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Words
                </span>
                <span>{analytics.wordCount}</span>
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
                <span className={`font-medium ${getScoreColor(analytics.overallScore)}`}>
                  {analytics.overallScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deliverability</span>
                <span className={`font-medium ${getScoreColor(analytics.deliverabilityScore)}`}>
                  {analytics.deliverabilityScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mobile</span>
                <span className={`font-medium ${getScoreColor(analytics.mobileScore)}`}>
                  {analytics.mobileScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Spam Risk
                </span>
                <span className={`font-medium ${analytics.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                  {analytics.spamScore}%
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
                  {analytics.performancePrediction.openRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Click Rate</span>
                <span className="font-medium text-purple-600">
                  {analytics.performancePrediction.clickRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Conversion</span>
                <span className="font-medium text-green-600">
                  {analytics.performancePrediction.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Brand & Engagement Scores */}
          {analytics.brandVoiceScore && (
            <div className="col-span-3 space-y-2">
              <div className="font-medium text-gray-700 mb-2">Brand Analysis</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Brand Voice</span>
                  <span className={`font-medium ${getScoreColor(analytics.brandVoiceScore)}`}>
                    {analytics.brandVoiceScore}
                  </span>
                </div>
                {analytics.engagementScore && (
                  <div className="flex items-center justify-between">
                    <span>Engagement</span>
                    <span className={`font-medium ${getScoreColor(analytics.engagementScore)}`}>
                      {analytics.engagementScore}
                    </span>
                  </div>
                )}
                {analytics.readabilityScore && (
                  <div className="flex items-center justify-between">
                    <span>Readability</span>
                    <span className={`font-medium ${getScoreColor(analytics.readabilityScore)}`}>
                      {analytics.readabilityScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
