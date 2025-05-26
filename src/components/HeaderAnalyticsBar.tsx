
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Shield,
  Target,
  Zap,
  CheckCircle,
  Copy,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  overallScore: number | null;
  deliverabilityScore: number | null;
  mobileScore: number | null;
  spamScore: number | null;
}

interface BrandMetrics {
  brandVoiceScore: number;
  engagementScore: number;
  toneConsistency: number;
  readabilityScore: number;
}

interface PerformancePrediction {
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface Suggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
}

interface HeaderAnalyticsBarProps {
  performanceMetrics?: PerformanceMetrics;
  brandMetrics?: BrandMetrics;
  performancePrediction?: PerformancePrediction;
  suggestions?: Suggestion[];
  onRefreshAnalysis?: () => void;
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export const HeaderAnalyticsBar: React.FC<HeaderAnalyticsBarProps> = ({
  performanceMetrics,
  brandMetrics,
  performancePrediction,
  suggestions = [],
  onRefreshAnalysis,
  onApplySuggestion
}) => {
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion);
  };

  const copySuggestion = (suggestion: Suggestion) => {
    navigator.clipboard.writeText(suggestion.suggestion);
    console.log(`Copied: ${suggestion.title}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-6 overflow-x-auto">
        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`text-xs ${getScoreColor(performanceMetrics.overallScore)}`}>
                {performanceMetrics.overallScore || '--'}/100
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Deliverability:</span>
                <span className={`text-xs font-medium ${getScoreColor(performanceMetrics.deliverabilityScore)}`}>
                  {performanceMetrics.deliverabilityScore || '--'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Mobile:</span>
                <span className={`text-xs font-medium ${getScoreColor(performanceMetrics.mobileScore)}`}>
                  {performanceMetrics.mobileScore || '--'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span className={`text-xs font-medium ${performanceMetrics.spamScore !== null ? performanceMetrics.spamScore > 20 ? 'text-red-600' : 'text-green-600' : 'text-gray-600'}`}>
                  {performanceMetrics.spamScore !== null ? `${performanceMetrics.spamScore}% spam` : '--'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Brand Voice Metrics */}
        {brandMetrics && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Brand Voice</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`text-xs ${getScoreColor(brandMetrics.brandVoiceScore)}`}>
                {brandMetrics.brandVoiceScore}/100
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Engagement:</span>
                <span className={`text-xs font-medium ${getScoreColor(brandMetrics.engagementScore)}`}>
                  {brandMetrics.engagementScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Predictions */}
        {performancePrediction && (performancePrediction.openRate > 0 || performancePrediction.clickRate > 0) && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Predicted</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span>Open {performancePrediction.openRate}%</span>
              <span>Click {performancePrediction.clickRate}%</span>
              <span>Convert {performancePrediction.conversionRate}%</span>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">AI Suggestions</span>
              <Badge variant="outline" className="text-xs">
                {suggestions.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <ScrollArea className="max-h-12 overflow-hidden">
                <div className="flex gap-2">
                  {suggestions.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs flex-shrink-0">
                      <span className="text-blue-900 truncate max-w-24">{suggestion.title}</span>
                      <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="h-4 w-4 p-0"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Refresh Analysis Button */}
        {onRefreshAnalysis && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-4 w-px bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshAnalysis}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
