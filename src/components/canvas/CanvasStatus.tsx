
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  RefreshCw, 
  Shield,
  Lightbulb,
  Info
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
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBadgeVariant = (score: number | null) => {
    if (score === null) return 'outline';
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const refreshAnalytics = () => {
    UnifiedEmailAnalyticsService.clearCache();
    analyzeEmail();
  };

  const formatPrediction = (value: number) => value.toFixed(1);

  const StatusIndicator = ({ status }: { status: 'analyzing' | 'ready' | 'empty' }) => {
    const config = {
      analyzing: { icon: RefreshCw, text: 'Analyzing...', className: 'text-blue-600 animate-spin' },
      ready: { icon: Lightbulb, text: 'AI Active', className: 'text-emerald-600' },
      empty: { icon: Info, text: 'Add content to analyze', className: 'text-gray-400' }
    };
    
    const { icon: Icon, text, className } = config[status];
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`w-3 h-3 ${className}`} />
        <span className="text-xs font-medium text-gray-700">{text}</span>
      </div>
    );
  };

  const CompactMetric = ({ 
    label, 
    value, 
    icon: Icon,
    variant = 'outline'
  }: { 
    label: string; 
    value: string | number; 
    icon?: any;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }) => (
    <div className="flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3 text-gray-500" />}
      <span className="text-xs text-gray-600">{label}:</span>
      <Badge variant={variant} className="text-xs px-1.5 py-0.5 h-5">
        {value}
      </Badge>
    </div>
  );

  return (
    <div className="bg-white border-t border-gray-200 shadow-sm">
      <div className="px-4 py-2">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <StatusIndicator 
            status={isAnalyzing ? 'analyzing' : hasContent && analytics ? 'ready' : 'empty'} 
          />
          
          {hasContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAnalytics}
              disabled={isAnalyzing}
              className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>

        {analytics && (
          <div className="space-y-2">
            {/* Primary AI Scores Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <CompactMetric
                label="Overall"
                value={analytics.overallScore !== null ? analytics.overallScore : '--'}
                icon={BarChart3}
                variant={getBadgeVariant(analytics.overallScore)}
              />
              <CompactMetric
                label="Deliverability"
                value={analytics.deliverabilityScore !== null ? analytics.deliverabilityScore : '--'}
                icon={Shield}
                variant={getBadgeVariant(analytics.deliverabilityScore)}
              />
              <CompactMetric
                label="Mobile"
                value={analytics.mobileScore !== null ? analytics.mobileScore : '--'}
                icon={Brain}
                variant={getBadgeVariant(analytics.mobileScore)}
              />
              <CompactMetric
                label="Spam Risk"
                value={analytics.spamScore !== null ? `${analytics.spamScore}%` : '--'}
                icon={Shield}
                variant={getBadgeVariant(analytics.spamScore)}
              />
            </div>

            {/* Performance Predictions Row */}
            {analytics.performancePrediction && (
              <div className="flex items-center gap-4 flex-wrap border-t border-gray-100 pt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">Predictions:</span>
                </div>
                <CompactMetric
                  label="Open Rate"
                  value={`${formatPrediction(analytics.performancePrediction.openRate)}%`}
                  variant="outline"
                />
                <CompactMetric
                  label="Click Rate"
                  value={`${formatPrediction(analytics.performancePrediction.clickRate)}%`}
                  variant="outline"
                />
                <CompactMetric
                  label="Conversion"
                  value={`${formatPrediction(analytics.performancePrediction.conversionRate)}%`}
                  variant="outline"
                />
              </div>
            )}

            {/* Content Analysis Row */}
            <div className="flex items-center gap-4 flex-wrap border-t border-gray-100 pt-2">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Content:</span>
              </div>
              <CompactMetric label="Size" value={`${analytics.sizeKB} KB`} />
              <CompactMetric label="Words" value={analytics.wordCount} />
              <CompactMetric label="Characters" value={analytics.characterCount.toLocaleString()} />
              <CompactMetric label="Images" value={analytics.imageCount} />
              <CompactMetric label="Links" value={analytics.linkCount} />
            </div>

            {/* Brand Analysis Row */}
            {(analytics.brandVoiceScore || analytics.engagementScore || analytics.readabilityScore) && (
              <div className="flex items-center gap-4 flex-wrap border-t border-gray-100 pt-2">
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">Brand:</span>
                </div>
                {analytics.brandVoiceScore && (
                  <CompactMetric
                    label="Voice Score"
                    value={analytics.brandVoiceScore}
                    variant={getBadgeVariant(analytics.brandVoiceScore)}
                  />
                )}
                {analytics.engagementScore && (
                  <CompactMetric
                    label="Engagement"
                    value={analytics.engagementScore}
                    variant={getBadgeVariant(analytics.engagementScore)}
                  />
                )}
                {analytics.readabilityScore && (
                  <CompactMetric
                    label="Readability"
                    value={analytics.readabilityScore}
                    variant={getBadgeVariant(analytics.readabilityScore)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasContent && !isAnalyzing && (
          <div className="text-center py-3">
            <Lightbulb className="w-5 h-5 text-gray-300 mx-auto mb-2" />
            <h3 className="text-xs font-medium text-gray-600 mb-1">Ready for AI Analysis</h3>
            <p className="text-xs text-gray-500">Add content to see all 15 analytics metrics</p>
          </div>
        )}
      </div>
    </div>
  );
};
