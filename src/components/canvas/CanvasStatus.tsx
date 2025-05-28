
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  RefreshCw, 
  Shield,
  Lightbulb
} from 'lucide-react';
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
  const [hasContent, setHasContent] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
  }, [emailHTML]);

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      setAnalytics(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await UnifiedEmailAnalyticsService.analyzeEmail(emailHTML, subjectLine);
      setAnalytics(result);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const refreshAnalytics = () => {
    UnifiedEmailAnalyticsService.clearCache();
    analyzeEmail();
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
      <div className="px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          {/* AI Analytics Header */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">AI Analytics</span>
          </div>

          {/* Performance Metrics */}
          {analytics && (
            <>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-xs ${getScoreColor(analytics.overallScore)}`}>
                    {analytics.overallScore || '--'}/100
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">Deliverability:</span>
                    <span className={`text-xs font-medium ${getScoreColor(analytics.deliverabilityScore)}`}>
                      {analytics.deliverabilityScore || '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">Mobile:</span>
                    <span className={`text-xs font-medium ${getScoreColor(analytics.mobileScore)}`}>
                      {analytics.mobileScore || '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span className={`text-xs font-medium ${analytics.spamScore !== null ? analytics.spamScore > 20 ? 'text-red-600' : 'text-green-600' : 'text-gray-600'}`}>
                      {analytics.spamScore !== null ? `${analytics.spamScore}% spam` : '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand Voice Metrics */}
              {analytics.brandVoiceScore && (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Brand Voice</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-xs ${getScoreColor(analytics.brandVoiceScore)}`}>
                      {analytics.brandVoiceScore}/100
                    </Badge>
                    {analytics.engagementScore && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">Engagement:</span>
                        <span className={`text-xs font-medium ${getScoreColor(analytics.engagementScore)}`}>
                          {analytics.engagementScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Predictions */}
              {analytics.performancePrediction && (analytics.performancePrediction.openRate > 0 || analytics.performancePrediction.clickRate > 0) && (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Predicted</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span>Open {analytics.performancePrediction.openRate.toFixed(1)}%</span>
                    <span>Click {analytics.performancePrediction.clickRate.toFixed(1)}%</span>
                    <span>Convert {analytics.performancePrediction.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Analyzing...</span>
            </div>
          )}

          {/* No Content State */}
          {!hasContent && !isAnalyzing && !analytics && (
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-500">Add content to see AI analytics</p>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {hasContent && (
              <>
                <div className="h-4 w-px bg-gray-300" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshAnalytics}
                  disabled={isAnalyzing}
                  className="h-6 px-2 text-xs"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <RefreshCw className="w-3 h-3 mr-1" />
                  )}
                  Refresh
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
