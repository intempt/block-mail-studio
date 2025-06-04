
import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Shield,
  Smartphone,
  TrendingUp,
  Zap,
  CheckCircle,
  Copy,
  Target,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useEmailAnalytics } from '@/analytics/react/useEmailAnalytics';
import { CentralizedAIAnalysisService } from '@/services/CentralizedAIAnalysisService';
import { CriticalEmailAnalysisService } from '@/services/criticalEmailAnalysisService';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML?: string;
  subjectLine?: string;
  onApplyFix?: (fix: string) => void;
}

interface UnifiedSuggestion {
  id: string;
  type: 'critical' | 'performance' | 'enhancement';
  category: string;
  title: string;
  description: string;
  current: string;
  suggested: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  autoFixable: boolean;
  fix?: string;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML = '',
  subjectLine = '',
  onApplyFix
}) => {
  const { analyze, result, isAnalyzing, error, clearCache } = useEmailAnalytics();
  const [hasContent, setHasContent] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [unifiedSuggestions, setUnifiedSuggestions] = useState<UnifiedSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
  }, [emailHTML]);

  // Auto-expand results when analysis completes
  useEffect(() => {
    if (result && !isAnalyzing) {
      setShowResults(true);
      loadUnifiedSuggestions();
    }
  }, [result, isAnalyzing]);

  const loadUnifiedSuggestions = async () => {
    if (!emailHTML.trim()) return;

    setIsLoadingSuggestions(true);
    try {
      // Get comprehensive analysis and critical issues
      const [comprehensiveAnalysis, criticalIssues] = await Promise.all([
        CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine),
        CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine)
      ]);

      const suggestions: UnifiedSuggestion[] = [];

      // Add critical issues first
      criticalIssues.forEach(issue => {
        suggestions.push({
          id: issue.id,
          type: 'critical',
          category: issue.category,
          title: issue.title,
          description: issue.reason,
          current: issue.current,
          suggested: issue.suggested,
          impact: issue.severity,
          confidence: issue.confidence,
          autoFixable: issue.autoFixable,
          fix: issue.suggested
        });
      });

      // Add performance suggestions
      if (comprehensiveAnalysis.performance?.accessibilityIssues) {
        comprehensiveAnalysis.performance.accessibilityIssues.forEach((issue, index) => {
          suggestions.push({
            id: `perf_${index}`,
            type: 'performance',
            category: 'accessibility',
            title: `Fix ${issue.type}`,
            description: issue.description,
            current: issue.description,
            suggested: issue.fix,
            impact: issue.severity as any,
            confidence: 85,
            autoFixable: true,
            fix: issue.fix
          });
        });
      }

      // Add enhancement suggestions from brand voice analysis
      if (comprehensiveAnalysis.brandVoice?.suggestions) {
        comprehensiveAnalysis.brandVoice.suggestions.forEach((suggestion, index) => {
          suggestions.push({
            id: `brand_${index}`,
            type: 'enhancement',
            category: 'brand',
            title: suggestion.title,
            description: suggestion.reason,
            current: suggestion.current,
            suggested: suggestion.suggested,
            impact: suggestion.impact as any,
            confidence: suggestion.confidence,
            autoFixable: false,
            fix: suggestion.suggested
          });
        });
      }

      // Sort by priority: critical first, then by impact
      suggestions.sort((a, b) => {
        if (a.type !== b.type) {
          const typeOrder = { critical: 3, performance: 2, enhancement: 1 };
          return typeOrder[b.type] - typeOrder[a.type];
        }
        const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      });

      setUnifiedSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading unified suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      return;
    }

    await analyze({
      html: emailHTML,
      subjectLine: subjectLine
    });
  };

  const refreshAnalytics = async () => {
    await clearCache();
    CriticalEmailAnalysisService.clearCache();
    setUnifiedSuggestions([]);
    setAppliedFixes(new Set());
    analyzeEmail();
  };

  const applyFix = (suggestion: UnifiedSuggestion) => {
    if (suggestion.fix && onApplyFix) {
      onApplyFix(suggestion.fix);
      setAppliedFixes(prev => new Set(prev).add(suggestion.id));
      console.log(`Applied fix: ${suggestion.title}`);
    }
  };

  const copyFix = (suggestion: UnifiedSuggestion) => {
    if (suggestion.fix) {
      navigator.clipboard.writeText(suggestion.fix);
      console.log(`Copied fix: ${suggestion.title}`);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <Zap className="w-4 h-4 text-red-600" />;
      case 'performance': return <BarChart3 className="w-4 h-4 text-orange-600" />;
      case 'enhancement': return <Sparkles className="w-4 h-4 text-blue-600" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 border-t border-purple-500">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">AI Analysis Center</h3>
              <p className="text-purple-100 text-sm">Analyze • Suggest • Fix your email automatically</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isAnalyzing}
                className="h-8 px-3 text-xs text-white hover:bg-white/20 hover:text-white border border-white/30"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Refresh
              </Button>
            )}
            
            <Button 
              onClick={analyzeEmail} 
              className="bg-white text-purple-700 hover:bg-purple-50 font-medium px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : result ? 'Re-analyze & Fix' : 'Analyze & Fix Email'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 px-3 py-2 bg-red-500/20 border border-red-400/30 rounded text-red-100 text-sm">
            {error}
          </div>
        )}

        {/* Unified Analysis Results Panel */}
        {result && (
          <Collapsible open={showResults} onOpenChange={setShowResults} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-white hover:bg-white/10 p-3"
              >
                <span className="font-medium">Analysis Results & AI Suggestions</span>
                {showResults ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3">
              <Card className="bg-white/95 backdrop-blur-sm p-4 space-y-4">
                {/* Scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.overallScore)}`}>
                      {result.scores.overallScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Overall
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.deliverabilityScore)}`}>
                      {result.scores.deliverabilityScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Delivery
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.mobileScore)}`}>
                      {result.scores.mobileScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${result.scores.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.scores.spamScore}
                    </div>
                    <div className="text-xs text-gray-600">
                      Spam Risk
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="bg-blue-50 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Predicted Performance</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-700">Open: {result.prediction.openRate}%</span>
                    <span className="text-blue-700">Click: {result.prediction.clickRate}%</span>
                    <span className="text-blue-700">Convert: {result.prediction.conversionRate}%</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{result.metrics.sizeKB} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium">{result.metrics.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className="font-medium">{result.metrics.imageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Links:</span>
                    <span className="font-medium">{result.metrics.linkCount}</span>
                  </div>
                </div>

                {/* Unified AI Suggestions & Fixes */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      AI Suggestions & Auto-Fixes
                    </h4>
                    {isLoadingSuggestions && (
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    )}
                  </div>

                  {unifiedSuggestions.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {unifiedSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(suggestion.type)}
                              <span className="font-medium text-sm">{suggestion.title}</span>
                              <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                                {suggestion.impact}
                              </Badge>
                              {suggestion.autoFixable && (
                                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">
                                  Auto-fixable
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CheckCircle className="w-3 h-3" />
                              {suggestion.confidence}%
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          
                          {suggestion.fix && (
                            <div className="text-sm bg-green-50 border border-green-200 p-2 rounded mb-3">
                              <span className="text-green-800">✨ {suggestion.fix}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            {suggestion.autoFixable && suggestion.fix && !appliedFixes.has(suggestion.id) && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => applyFix(suggestion)}
                                className="flex-1 text-xs h-7 bg-green-600 hover:bg-green-700"
                              >
                                <Zap className="w-3 h-3 mr-1" />
                                Auto-Fix
                              </Button>
                            )}
                            {appliedFixes.has(suggestion.id) && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="flex-1 text-xs h-7 bg-green-50 text-green-700"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Applied
                              </Button>
                            )}
                            {suggestion.fix && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyFix(suggestion)}
                                className="text-xs h-7"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isLoadingSuggestions ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No specific suggestions found. Your email looks good!
                    </div>
                  ) : null}
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};
