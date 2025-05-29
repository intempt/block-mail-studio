
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

  const getScoreBg = (score: number | null) => {
    if (score === null) return 'bg-gray-50';
    if (score >= 80) return 'bg-emerald-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-red-50';
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
        <Icon className={`w-4 h-4 ${className}`} />
        <span className="text-sm font-medium text-gray-700">{text}</span>
      </div>
    );
  };

  const ScoreCard = ({ 
    title, 
    score, 
    icon: Icon, 
    className = "" 
  }: { 
    title: string; 
    score: number | null; 
    icon: any; 
    className?: string; 
  }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
      </div>
      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score !== null ? score : '--'}
        {score !== null && title !== 'Spam Risk' && '/100'}
        {title === 'Spam Risk' && score !== null && '%'}
      </div>
      <div className={`h-2 rounded-full mt-2 ${getScoreBg(score)}`}>
        {score !== null && title !== 'Spam Risk' && (
          <div 
            className={`h-full rounded-full transition-all ${
              score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        )}
      </div>
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
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <Badge 
        variant="outline" 
        className={`text-xs ${
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
      {/* Main Analytics Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <StatusIndicator 
            status={isAnalyzing ? 'analyzing' : hasContent && analytics ? 'ready' : 'empty'} 
          />
          
          <div className="flex items-center gap-3">
            {hasContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isAnalyzing}
                className="h-8 px-3 text-xs text-gray-600 hover:text-gray-900"
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
                className="h-8 px-3 text-xs text-gray-600 hover:text-gray-900"
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

        {/* Primary Metrics Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <ScoreCard
              title="Overall Score"
              score={analytics.overallScore}
              icon={BarChart3}
            />
            <ScoreCard
              title="Deliverability"
              score={analytics.deliverabilityScore}
              icon={Shield}
            />
            <ScoreCard
              title="Mobile Ready"
              score={analytics.mobileScore}
              icon={Brain}
            />
            <ScoreCard
              title="Spam Risk"
              score={analytics.spamScore}
              icon={Shield}
            />
          </div>
        )}

        {/* Performance Predictions */}
        {analytics?.performancePrediction && (
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Performance Predictions</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {formatPrediction(analytics.performancePrediction.openRate)}%
                </div>
                <div className="text-xs text-blue-600">Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {formatPrediction(analytics.performancePrediction.clickRate)}%
                </div>
                <div className="text-xs text-purple-600">Click Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {formatPrediction(analytics.performancePrediction.conversionRate)}%
                </div>
                <div className="text-xs text-green-600">Conversion</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && analytics && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Metrics */}
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Content Analysis
              </h4>
              <div className="space-y-1">
                <MetricRow label="File Size" value={`${analytics.sizeKB} KB`} />
                <MetricRow label="Word Count" value={analytics.wordCount} />
                <MetricRow label="Character Count" value={analytics.characterCount.toLocaleString()} />
                <MetricRow label="Images" value={analytics.imageCount} />
                <MetricRow label="Links" value={analytics.linkCount} />
              </div>
            </Card>

            {/* Brand Metrics */}
            {analytics.brandVoiceScore && (
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Brand Analysis
                </h4>
                <div className="space-y-1">
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

      {/* Empty State */}
      {!hasContent && !isAnalyzing && (
        <div className="px-6 py-8 text-center">
          <Lightbulb className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-600 mb-1">Ready for AI Analysis</h3>
          <p className="text-xs text-gray-500">Add content to your email to see detailed analytics and performance insights</p>
        </div>
      )}
    </div>
  );
};
