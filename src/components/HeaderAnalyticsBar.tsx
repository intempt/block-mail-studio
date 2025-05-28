
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
import { useEmailAnalysis } from '@/contexts/EmailAnalysisContext';

interface HeaderAnalyticsBarProps {
  onApplySuggestion?: (suggestion: any) => void;
}

export const HeaderAnalyticsBar: React.FC<HeaderAnalyticsBarProps> = ({
  onApplySuggestion
}) => {
  const { analysis, isAnalyzing, refreshAnalysis } = useEmailAnalysis();
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);

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

  const applySuggestion = (suggestion: any) => {
    onApplySuggestion?.(suggestion);
  };

  const copySuggestion = (suggestion: any) => {
    navigator.clipboard.writeText(suggestion.suggested);
    console.log(`Copied: ${suggestion.title}`);
  };

  const highPrioritySuggestions = analysis?.suggestions.filter(s => s.impact === 'high') || [];
  const allSuggestions = analysis?.suggestions || [];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Analytics Bar */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          {/* Performance Metrics */}
          {analysis && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Deliverability:</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.deliverabilityScore)}`}>
                    {analysis.deliverabilityScore}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Mobile:</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.mobileScore)}`}>
                    {analysis.mobileScore}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span className={`text-xs font-medium ${analysis.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                    {analysis.spamScore}% spam
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Brand Voice Metrics */}
          {analysis && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Brand Voice</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.brandVoiceScore)}`}>
                  {analysis.brandVoiceScore}/100
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Engagement:</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.engagementScore)}`}>
                    {analysis.engagementScore}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Performance Predictions */}
          {analysis && (analysis.performancePrediction.openRate > 0 || analysis.performancePrediction.clickRate > 0) && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Predicted</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>Open {analysis.performancePrediction.openRate.toFixed(1)}%</span>
                <span>Click {analysis.performancePrediction.clickRate.toFixed(1)}%</span>
                <span>Convert {analysis.performancePrediction.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {allSuggestions.length > 0 && (
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
                  {allSuggestions.length}
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-4 w-px bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAnalysis}
              disabled={isAnalyzing}
              className="h-6 px-2 text-xs"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Suggestions Panel */}
      {suggestionsExpanded && allSuggestions.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {allSuggestions.map((suggestion) => (
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
                    <span className="text-blue-700">{suggestion.suggested}</span>
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
