import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Shield,
  Target,
  BarChart3,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertTriangle,
  Eye,
  Palette,
  Smartphone,
  Zap,
  Clock,
  Sparkles,
  Type
} from 'lucide-react';
import { useEmailAnalysis } from '@/contexts/EmailAnalysisContext';

interface UnifiedAISuggestionsPanelProps {
  emailHTML: string;
  subjectLine: string;
  onApplySuggestion?: (suggestion: any) => void;
}

export const UnifiedAISuggestionsPanel: React.FC<UnifiedAISuggestionsPanelProps> = ({
  emailHTML,
  subjectLine,
  onApplySuggestion
}) => {
  const { 
    analysis, 
    isAnalyzing, 
    lastAnalyzed, 
    error, 
    analyzeEmail, 
    refreshAnalysis 
  } = useEmailAnalysis();

  const [activeTab, setActiveTab] = useState('overview');

  // Auto-analyze when content changes
  useEffect(() => {
    if (emailHTML.trim() && subjectLine) {
      const timer = setTimeout(() => {
        analyzeEmail({
          emailHTML,
          subjectLine,
          variant: 'comprehensive'
        });
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
  }, [emailHTML, subjectLine, analyzeEmail]);

  const getScoreColor = (score: number) => {
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
      case 'subject': return <Target className="w-3 h-3" />;
      case 'copy': return <Type className="w-3 h-3" />;
      case 'cta': return <Target className="w-3 h-3" />;
      case 'tone': return <Brain className="w-3 h-3" />;
      case 'design': return <Palette className="w-3 h-3" />;
      case 'accessibility': return <Eye className="w-3 h-3" />;
      case 'performance': return <Zap className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const formatLastAnalyzed = () => {
    if (!lastAnalyzed) return 'Not analyzed';
    const diffMs = Date.now() - lastAnalyzed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastAnalyzed.toLocaleDateString();
  };

  const applySuggestion = (suggestion: any) => {
    onApplySuggestion?.(suggestion);
    navigator.clipboard.writeText(suggestion.suggested);
    console.log(`Applied suggestion: ${suggestion.title}`);
  };

  const copySuggestion = (suggestion: any) => {
    navigator.clipboard.writeText(suggestion.suggested);
    console.log(`Copied: ${suggestion.title}`);
  };

  const highPrioritySuggestions = analysis?.suggestions.filter(s => s.impact === 'high') || [];
  const otherSuggestions = analysis?.suggestions.filter(s => s.impact !== 'high') || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header with AI Analysis Button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              {isAnalyzing && (
                <div className="absolute inset-0 animate-pulse">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">AI Email Assistant</h3>
            {analysis && (
              <Badge variant="secondary" className="text-xs">
                {analysis.suggestions.length} insights
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {lastAnalyzed && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatLastAnalyzed()}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAnalysis}
              disabled={isAnalyzing || !emailHTML.trim()}
              className="flex items-center gap-1"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Brain className="w-3 h-3" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Brain className="w-4 h-4 animate-pulse" />
              Running comprehensive AI analysis...
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Quick Overview */}
        {analysis && !isAnalyzing && (
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}
              </div>
              <div className="text-xs text-gray-600">Overall</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${getScoreColor(analysis.brandVoiceScore)}`}>
                {analysis.brandVoiceScore}
              </div>
              <div className="text-xs text-gray-600">Brand Voice</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${getScoreColor(analysis.engagementScore)}`}>
                {analysis.engagementScore}
              </div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${analysis.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                {analysis.spamScore}%
              </div>
              <div className="text-xs text-gray-600">Spam Risk</div>
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      {analysis && !isAnalyzing && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">
              Suggestions {highPrioritySuggestions.length > 0 && (
                <Badge className="ml-1 text-xs bg-red-100 text-red-700">
                  {highPrioritySuggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="accessibility" className="text-xs">Accessibility</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <TabsContent value="overview" className="mt-0 space-y-4">
                {/* Performance Predictions */}
                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    AI Performance Predictions
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {analysis.performancePrediction.openRate.toFixed(1)}%
                      </div>
                      <div className="text-gray-600">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {analysis.performancePrediction.clickRate.toFixed(1)}%
                      </div>
                      <div className="text-gray-600">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {analysis.performancePrediction.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-gray-600">Conversion</div>
                    </div>
                  </div>
                </Card>

                {/* Content Metrics */}
                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4" />
                    Content Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Words</span>
                      <span className="font-medium">{analysis.contentMetrics.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Characters</span>
                      <span className="font-medium">{analysis.contentMetrics.characterCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Links</span>
                      <span className="font-medium">{analysis.contentMetrics.linkCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images</span>
                      <span className="font-medium">{analysis.contentMetrics.imageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size</span>
                      <span className="font-medium">{analysis.contentMetrics.sizeKB}KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Read Time</span>
                      <span className="font-medium">{analysis.contentMetrics.estimatedReadTime}</span>
                    </div>
                  </div>
                </Card>

                {/* Top Suggestions Preview */}
                {highPrioritySuggestions.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      High Priority Suggestions
                    </h4>
                    <div className="space-y-2">
                      {highPrioritySuggestions.slice(0, 3).map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <div className="flex items-center gap-2 flex-1">
                            {getTypeIcon(suggestion.type)}
                            <span className="text-sm font-medium text-red-900">{suggestion.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applySuggestion(suggestion)}
                            className="h-6 px-2 text-xs"
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="suggestions" className="mt-0 space-y-3">
                {/* High Priority Suggestions */}
                {highPrioritySuggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      High Priority ({highPrioritySuggestions.length})
                    </h4>
                    <div className="space-y-2">
                      {highPrioritySuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="p-3 border-red-200 bg-red-50">
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
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => applySuggestion(suggestion)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 mb-2">{suggestion.description}</p>
                          <div className="bg-white p-2 rounded text-xs border">
                            <div className="font-medium text-gray-700 mb-1">Suggested:</div>
                            <div className="text-blue-700">{suggestion.suggested}</div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>Confidence: {suggestion.confidence}%</span>
                            <span>{suggestion.reason}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Suggestions */}
                {otherSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      Additional Suggestions ({otherSuggestions.length})
                    </h4>
                    <div className="space-y-2">
                      {otherSuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="p-3">
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
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => applySuggestion(suggestion)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 mb-2">{suggestion.description}</p>
                          <div className="bg-blue-50 p-2 rounded text-xs">
                            <div className="font-medium text-blue-900 mb-1">Suggested:</div>
                            <div className="text-blue-700">{suggestion.suggested}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="mt-0 space-y-3">
                {/* Performance Metrics */}
                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4" />
                    Performance Scores
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(analysis.metrics).map(([key, metric]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {typeof metric.value === 'number' ? 
                              (key === 'loadTime' ? `${metric.value}s` : metric.value) : 
                              metric.value
                            }
                          </span>
                          <Badge variant={metric.status === 'good' ? 'default' : 'secondary'} className="text-xs">
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Optimization Suggestions */}
                {analysis.optimizationSuggestions.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" />
                      Optimization Opportunities
                    </h4>
                    <div className="space-y-2">
                      {analysis.optimizationSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-900">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="accessibility" className="mt-0 space-y-3">
                {analysis.accessibilityIssues.length > 0 ? (
                  <Card className="p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4" />
                      Accessibility Issues
                    </h4>
                    <div className="space-y-3">
                      {analysis.accessibilityIssues.map((issue, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {issue.severity}
                            </Badge>
                            <span className="text-sm font-medium">{issue.type}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            💡 {issue.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 text-center">
                    <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium text-green-700 mb-1">Great Accessibility!</h4>
                    <p className="text-sm text-gray-600">No major accessibility issues detected.</p>
                  </Card>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      )}

      {/* Empty State */}
      {!analysis && !isAnalyzing && !error && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-700 mb-2">Ready for AI Analysis</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add content to your email and I'll provide comprehensive insights and suggestions.
            </p>
            <Button
              variant="outline"
              onClick={() => emailHTML.trim() && analyzeEmail({ emailHTML, subjectLine, variant: 'comprehensive' })}
              disabled={!emailHTML.trim()}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
