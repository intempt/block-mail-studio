
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  RefreshCw, 
  Shield,
  Lightbulb,
  Info,
  Eye,
  MousePointer,
  Target,
  FileText,
  Image,
  Link,
  Type,
  Hash
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

  const MetricIcon = ({ 
    icon: Icon, 
    value, 
    tooltip,
    variant = 'outline'
  }: { 
    icon: any; 
    value: string | number; 
    tooltip: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 text-xs">
          <Icon className="w-3 h-3 text-gray-500" />
          <Badge variant={variant} className="text-xs px-1 py-0 h-4 min-w-6 justify-center">
            {value}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="bg-white border-t border-gray-200 shadow-sm">
        <div className="px-4 py-1.5">
          {/* Single Line Analytics */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="flex items-center gap-1">
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                ) : hasContent && analytics ? (
                  <Lightbulb className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Info className="w-3 h-3 text-gray-400" />
                )}
                <span className="text-xs text-gray-600 font-medium">
                  {isAnalyzing ? 'Analyzing...' : hasContent && analytics ? 'Analyze AI' : 'Add content'}
                </span>
              </div>

              {/* Analytics Metrics */}
              {analytics && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-px h-4 bg-gray-300" />
                  
                  {/* AI Scores */}
                  <MetricIcon
                    icon={BarChart3}
                    value={analytics.overallScore !== null ? analytics.overallScore : '--'}
                    tooltip={`Overall Score: ${analytics.overallScore !== null ? analytics.overallScore : 'N/A'}`}
                    variant={getBadgeVariant(analytics.overallScore)}
                  />
                  <MetricIcon
                    icon={Shield}
                    value={analytics.deliverabilityScore !== null ? analytics.deliverabilityScore : '--'}
                    tooltip={`Deliverability Score: ${analytics.deliverabilityScore !== null ? analytics.deliverabilityScore : 'N/A'}`}
                    variant={getBadgeVariant(analytics.deliverabilityScore)}
                  />
                  <MetricIcon
                    icon={Brain}
                    value={analytics.mobileScore !== null ? analytics.mobileScore : '--'}
                    tooltip={`Mobile Score: ${analytics.mobileScore !== null ? analytics.mobileScore : 'N/A'}`}
                    variant={getBadgeVariant(analytics.mobileScore)}
                  />
                  <MetricIcon
                    icon={Shield}
                    value={analytics.spamScore !== null ? `${analytics.spamScore}%` : '--'}
                    tooltip={`Spam Risk: ${analytics.spamScore !== null ? analytics.spamScore + '%' : 'N/A'}`}
                    variant={getBadgeVariant(analytics.spamScore)}
                  />

                  <div className="w-px h-4 bg-gray-300" />

                  {/* Performance Predictions */}
                  {analytics.performancePrediction && (
                    <>
                      <MetricIcon
                        icon={Eye}
                        value={`${formatPrediction(analytics.performancePrediction.openRate)}%`}
                        tooltip={`Predicted Open Rate: ${formatPrediction(analytics.performancePrediction.openRate)}%`}
                      />
                      <MetricIcon
                        icon={MousePointer}
                        value={`${formatPrediction(analytics.performancePrediction.clickRate)}%`}
                        tooltip={`Predicted Click Rate: ${formatPrediction(analytics.performancePrediction.clickRate)}%`}
                      />
                      <MetricIcon
                        icon={Target}
                        value={`${formatPrediction(analytics.performancePrediction.conversionRate)}%`}
                        tooltip={`Predicted Conversion Rate: ${formatPrediction(analytics.performancePrediction.conversionRate)}%`}
                      />

                      <div className="w-px h-4 bg-gray-300" />
                    </>
                  )}

                  {/* Content Metrics */}
                  <MetricIcon
                    icon={FileText}
                    value={`${analytics.sizeKB}KB`}
                    tooltip={`Email Size: ${analytics.sizeKB} KB`}
                  />
                  <MetricIcon
                    icon={Type}
                    value={analytics.wordCount}
                    tooltip={`Word Count: ${analytics.wordCount}`}
                  />
                  <MetricIcon
                    icon={Hash}
                    value={analytics.characterCount.toLocaleString()}
                    tooltip={`Character Count: ${analytics.characterCount.toLocaleString()}`}
                  />
                  <MetricIcon
                    icon={Image}
                    value={analytics.imageCount}
                    tooltip={`Images: ${analytics.imageCount}`}
                  />
                  <MetricIcon
                    icon={Link}
                    value={analytics.linkCount}
                    tooltip={`Links: ${analytics.linkCount}`}
                  />

                  {/* Brand Metrics */}
                  {(analytics.brandVoiceScore || analytics.engagementScore || analytics.readabilityScore) && (
                    <>
                      <div className="w-px h-4 bg-gray-300" />
                      {analytics.brandVoiceScore && (
                        <MetricIcon
                          icon={Brain}
                          value={analytics.brandVoiceScore}
                          tooltip={`Brand Voice Score: ${analytics.brandVoiceScore}`}
                          variant={getBadgeVariant(analytics.brandVoiceScore)}
                        />
                      )}
                      {analytics.engagementScore && (
                        <MetricIcon
                          icon={TrendingUp}
                          value={analytics.engagementScore}
                          tooltip={`Engagement Score: ${analytics.engagementScore}`}
                          variant={getBadgeVariant(analytics.engagementScore)}
                        />
                      )}
                      {analytics.readabilityScore && (
                        <MetricIcon
                          icon={FileText}
                          value={analytics.readabilityScore}
                          tooltip={`Readability Score: ${analytics.readabilityScore}`}
                          variant={getBadgeVariant(analytics.readabilityScore)}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            {hasContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isAnalyzing}
                className="h-5 px-1.5 text-xs text-gray-600 hover:text-gray-900 ml-4"
              >
                <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>

          {/* Empty State */}
          {!hasContent && !isAnalyzing && (
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs">Add content to see AI analytics with 15 metrics</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
