
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
  ChevronUp,
  ChevronDown,
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const CompactScoreBadge = ({ 
    title, 
    score, 
    icon: Icon
  }: { 
    title: string; 
    score: number | null; 
    icon: any; 
  }) => (
    <div className="flex items-center gap-1">
      <Icon className="w-3 h-3 text-gray-500" />
      <span className="text-xs text-gray-600">{title}:</span>
      <Badge 
        variant={getBadgeVariant(score)} 
        className="text-xs px-1.5 py-0.5 h-5"
      >
        {score !== null ? score : '--'}
        {score !== null && title !== 'Spam Risk' && '/100'}
        {title === 'Spam Risk' && score !== null && '%'}
      </Badge>
    </div>
  );

  const MetricRow = ({ 
    label, 
    value, 
    icon: Icon, 
    status 
  }: { 
    label: string; 
    value: string | number; 
    icon?: any; 
    status?: 'good' | 'warning' | 'poor'; 
  }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-gray-500" />}
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <Badge 
        variant="outline" 
        className={`text-xs px-1.5 py-0.5 h-5 ${
          status === 'good' ? 'text-emerald-600 border-emerald-200' :
          status === 'warning' ? 'text-amber-600 border-amber-200' :
          status === 'poor' ? 'text-red-600 border-red-200' :
          'text-gray-600'
        }`}
      >
        {value}
      </Badge>
    </div>
  );

  return (
    <div className="bg-white border-t border-gray-200 shadow-sm">
      {/* Compact Main Analytics Bar */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4 mb-2">
          <StatusIndicator 
            status={isAnalyzing ? 'analyzing' : hasContent && analytics ? 'ready' : 'empty'} 
          />
          
          <div className="flex items-center gap-2">
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
            
            {analytics && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Details
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Compact Primary Metrics Row */}
        {analytics && (
          <div className="flex items-center gap-4 flex-wrap">
            <CompactScoreBadge
              title="Overall"
              score={analytics.overallScore}
              icon={BarChart3}
            />
            <CompactScoreBadge
              title="Deliverability"
              score={analytics.deliverabilityScore}
              icon={Shield}
            />
            <CompactScoreBadge
              title="Mobile"
              score={analytics.mobileScore}
              icon={Brain}
            />
            <CompactScoreBadge
              title="Spam Risk"
              score={analytics.spamScore}
              icon={Shield}
            />
          </div>
        )}

        {/* Compact Performance Predictions */}
        {analytics?.performancePrediction && (
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">Predictions:</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-blue-700">
                <strong>{formatPrediction(analytics.performancePrediction.openRate)}%</strong> Open
              </span>
              <span className="text-purple-700">
                <strong>{formatPrediction(analytics.performancePrediction.clickRate)}%</strong> Click
              </span>
              <span className="text-green-700">
                <strong>{formatPrediction(analytics.performancePrediction.conversionRate)}%</strong> Convert
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Expanded Details Panel */}
      {isExpanded && analytics && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Content Metrics */}
            <Card className="p-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                <BarChart3 className="w-3 h-3" />
                Content Analysis
              </h4>
              <div className="space-y-0.5">
                <MetricRow label="File Size" value={`${analytics.sizeKB} KB`} />
                <MetricRow label="Word Count" value={analytics.wordCount} />
                <MetricRow label="Character Count" value={analytics.characterCount.toLocaleString()} />
                <MetricRow label="Images" value={analytics.imageCount} />
                <MetricRow label="Links" value={analytics.linkCount} />
              </div>
            </Card>

            {/* Brand Metrics */}
            {analytics.brandVoiceScore && (
              <Card className="p-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                  <Brain className="w-3 h-3" />
                  Brand Analysis
                </h4>
                <div className="space-y-0.5">
                  <MetricRow 
                    label="Brand Voice Score" 
                    value={`${analytics.brandVoiceScore}/100`}
                    status={analytics.brandVoiceScore >= 80 ? 'good' : analytics.brandVoiceScore >= 60 ? 'warning' : 'poor'}
                  />
                  {analytics.engagementScore && (
                    <MetricRow 
                      label="Engagement Score" 
                      value={analytics.engagementScore}
                      status={analytics.engagementScore >= 80 ? 'good' : analytics.engagementScore >= 60 ? 'warning' : 'poor'}
                    />
                  )}
                  {analytics.readabilityScore && (
                    <MetricRow 
                      label="Readability Score" 
                      value={analytics.readabilityScore}
                      status={analytics.readabilityScore >= 80 ? 'good' : analytics.readabilityScore >= 60 ? 'warning' : 'poor'}
                    />
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Compact Empty State */}
      {!hasContent && !isAnalyzing && (
        <div className="px-4 py-4 text-center">
          <Lightbulb className="w-5 h-5 text-gray-300 mx-auto mb-2" />
          <h3 className="text-xs font-medium text-gray-600 mb-1">Ready for AI Analysis</h3>
          <p className="text-xs text-gray-500">Add content to see analytics</p>
        </div>
      )}
    </div>
  );
};
