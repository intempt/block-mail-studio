import React, { useState } from 'react';
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
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
  Type,
  Smartphone,
  AlertTriangle
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
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design' | 'accessibility' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
  category?: string;
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
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false); // Explicitly set to false to ensure closed by default

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subject': return <Type className="w-3 h-3" />;
      case 'copy': return <Type className="w-3 h-3" />;
      case 'cta': return <Target className="w-3 h-3" />;
      case 'tone': return <Brain className="w-3 h-3" />;
      case 'design': return <Palette className="w-3 h-3" />;
      case 'accessibility': return <Eye className="w-3 h-3" />;
      case 'performance': return <Zap className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion);
  };

  const copySuggestion = (suggestion: Suggestion) => {
    navigator.clipboard.writeText(suggestion.suggestion);
    console.log(`Copied: ${suggestion.title}`);
  };

  const highPrioritySuggestions = suggestions.filter(s => s.impact === 'high');
  const otherSuggestions = suggestions.filter(s => s.impact !== 'high');

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Analytics Bar */}
      <div className="px-6 py-3">
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

          {/* Enhanced AI Suggestions - Always Visible */}
          {suggestions.length > 0 && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  {highPrioritySuggestions.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-sm font-medium">AI Suggestions</span>
                <Badge variant="outline" className="text-xs">
                  {suggestions.length}
                </Badge>
                {highPrioritySuggestions.length > 0 && (
                  <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                    {highPrioritySuggestions.length} High Priority
                  </Badge>
                )}
              </div>
              
              {/* Quick Actions for High Priority Suggestions */}
              <div className="flex items-center gap-2">
                {highPrioritySuggestions.slice(0, 2).map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded text-xs">
                    {getTypeIcon(suggestion.type)}
                    <span className="text-red-900 font-medium max-w-20 truncate">{suggestion.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <CheckCircle className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                  className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50"
                >
                  {suggestionsExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Hide All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      View All
                    </>
                  )}
                </Button>
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

      {/* Expanded Suggestions Panel */}
      {suggestionsExpanded && suggestions.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-3 bg-white border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-medium text-sm">{suggestion.title}</span>
                      <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySuggestion(suggestion)}
                        className="h-6 w-6 p-0"
                        title="Copy suggestion"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="h-6 w-6 p-0"
                        title="Apply suggestion"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                  
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <span className="font-medium text-blue-900">Suggestion: </span>
                    <span className="text-blue-700">{suggestion.suggestion}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Confidence: {suggestion.confidence}%
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
