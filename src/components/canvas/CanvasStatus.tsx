
import React, { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  BarChart3,
  Shield,
  Lightbulb,
  FileCheck,
  Eye,
  Layout,
  User,
  Brain,
  Type,
  Target,
  Smartphone,
  Mail
} from 'lucide-react';
import { CriticalEmailAnalysisService, CriticalSuggestion } from '@/services/criticalEmailAnalysisService';
import { CentralizedAIAnalysisService, CompleteAnalysisResult } from '@/services/CentralizedAIAnalysisService';
import { ApiKeyService } from '@/services/apiKeyService';
import { useNotification } from '@/contexts/NotificationContext';

interface CanvasStatusProps {
  emailHTML: string;
  subjectLine: string;
  showAIAnalytics: boolean;
  onSnippetRefresh: () => void;
  viewMode: 'edit' | 'desktop-preview' | 'mobile-preview';
}

export const CanvasStatus: React.FC<CanvasStatusProps> = React.memo(({
  emailHTML,
  subjectLine,
  showAIAnalytics,
  onSnippetRefresh,
  viewMode
}) => {
  const { error } = useNotification();
  const [isKeyAvailable, setIsKeyAvailable] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [allSuggestions, setAllSuggestions] = useState<CriticalSuggestion[]>([]);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());

  const transformComprehensiveAnalysisToSuggestions = useCallback((analysis: CompleteAnalysisResult): CriticalSuggestion[] => {
    const suggestions: CriticalSuggestion[] = [];

    // Phase 1: Convert Brand Voice Suggestions
    if (analysis.brandVoice?.suggestions) {
      analysis.brandVoice.suggestions.forEach((suggestion, index) => {
        const confidence = suggestion.impact === 'high' ? 90 : suggestion.impact === 'medium' ? 75 : 60;
        suggestions.push({
          id: `brand-voice-${index}`,
          title: suggestion.title,
          reason: suggestion.reason,
          category: 'tone',
          type: 'tone',
          current: suggestion.current || '',
          suggested: suggestion.suggested || '',
          severity: 'medium',
          impact: suggestion.impact as 'high' | 'medium' | 'low',
          confidence,
          autoFixable: suggestion.type === 'subject' || suggestion.type === 'cta',
          priority: index + 1,
          businessImpact: `Brand voice improvement: ${suggestion.reason}`
        });
      });
    }

    // Phase 2: Convert Subject Line Alternatives
    if (analysis.subjectVariants && analysis.subjectVariants.length > 0) {
      analysis.subjectVariants.forEach((variant, index) => {
        suggestions.push({
          id: `subject-variant-${index}`,
          title: `Subject Line Alternative ${index + 1}`,
          reason: 'AI-generated subject line variant optimized for engagement',
          category: 'subject',
          type: 'subject',
          current: subjectLine,
          suggested: variant,
          severity: 'medium',
          impact: 'medium',
          confidence: 85,
          autoFixable: true,
          priority: index + 1,
          businessImpact: 'May improve open rates with fresh, engaging messaging'
        });
      });
    }

    // Phase 3: Convert Content Optimizations
    Object.entries(analysis.optimizations).forEach(([type, content], index) => {
      if (content) {
        const categoryMap: Record<string, string> = {
          engagement: 'content',
          conversion: 'cta',
          clarity: 'structure',
          brevity: 'content'
        };
        
        suggestions.push({
          id: `optimization-${type}-${index}`,
          title: `Optimize Content for ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          reason: `AI-optimized content to improve ${type} and overall performance`,
          category: categoryMap[type] || 'content',
          type: 'content',
          current: 'Current email content',
          suggested: content,
          severity: 'medium',
          impact: 'medium',
          confidence: 80,
          autoFixable: true,
          priority: index + 1,
          businessImpact: `Enhanced ${type} may increase user ${type === 'engagement' ? 'interaction' : type === 'conversion' ? 'conversions' : 'readability'}`
        });
      }
    });

    // Phase 4: Convert Performance Analysis Accessibility Issues
    if (analysis.performance?.accessibilityIssues) {
      analysis.performance.accessibilityIssues.forEach((issue, index) => {
        const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
          high: 'high',
          medium: 'medium',
          low: 'low'
        };

        suggestions.push({
          id: `accessibility-${index}`,
          title: `Fix ${issue.type}`,
          reason: issue.description,
          category: 'accessibility',
          type: 'accessibility',
          current: issue.description,
          suggested: issue.fix,
          severity: severityMap[issue.severity] || 'medium',
          impact: issue.severity as 'high' | 'medium' | 'low',
          confidence: 95,
          autoFixable: issue.type.includes('alt') || issue.type.includes('heading') || issue.type.includes('contrast'),
          priority: index + 1,
          businessImpact: 'Improves accessibility compliance and user experience'
        });
      });
    }

    // Phase 4.5: Convert Performance Optimization Suggestions
    if (analysis.performance?.optimizationSuggestions) {
      analysis.performance.optimizationSuggestions.forEach((suggestion, index) => {
        suggestions.push({
          id: `performance-opt-${index}`,
          title: 'Performance Optimization',
          reason: suggestion,
          category: 'structure',
          type: 'performance',
          current: 'Current implementation',
          suggested: suggestion,
          severity: 'medium',
          impact: 'medium',
          confidence: 85,
          autoFixable: false,
          priority: index + 1,
          businessImpact: 'Improves email loading speed and user experience'
        });
      });
    }

    return suggestions;
  }, [subjectLine]);

  const runCompleteAnalysis = async () => {
    if (!emailHTML.trim() || emailHTML.length < 50) {
      error('Add more content before analyzing');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Run both critical analysis and comprehensive analysis
      const [criticalResults, comprehensiveResults] = await Promise.allSettled([
        CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine),
        CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine)
      ]);

      let mergedSuggestions: CriticalSuggestion[] = [];

      // Add critical suggestions
      if (criticalResults.status === 'fulfilled') {
        mergedSuggestions = [...criticalResults.value];
      }

      // Transform and add comprehensive analysis suggestions
      if (comprehensiveResults.status === 'fulfilled') {
        const transformedSuggestions = transformComprehensiveAnalysisToSuggestions(comprehensiveResults.value);
        mergedSuggestions = [...mergedSuggestions, ...transformedSuggestions];
      }

      // Phase 5: Implement Confidence-Based Sorting
      mergedSuggestions.sort((a, b) => {
        // First sort by confidence (highest first)
        if (a.confidence !== b.confidence) {
          return b.confidence - a.confidence;
        }
        // Then by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

      setAllSuggestions(mergedSuggestions);
    } catch (analysisError: any) {
      if (analysisError.message?.includes('OpenAI API key')) {
        error('OpenAI API key issue: ' + analysisError.message);
      } else if (analysisError.message?.includes('rate limit')) {
        error('OpenAI rate limit exceeded. Please try again later.');
      } else if (analysisError.message?.includes('network')) {
        error('Network error. Please check your connection and try again.');
      } else {
        error('Analysis failed: ' + (analysisError.message || 'Unknown error'));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = async (suggestion: CriticalSuggestion) => {
    if (!suggestion.autoFixable) return;
    
    setAppliedFixes(prev => new Set([...prev, suggestion.id]));
    
    // Here you would implement the actual fix application logic
    // For now, we just mark it as applied
    console.log('Applying fix for suggestion:', suggestion.id);
  };

  useEffect(() => {
    const checkKey = async () => {
      const keyAvailable = await ApiKeyService.isKeyAvailable();
      setIsKeyAvailable(keyAvailable);
    };

    checkKey();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-4 h-4" />;
      case 'deliverability': return <Shield className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'compliance': return <FileCheck className="w-4 h-4" />;
      case 'accessibility': return <Eye className="w-4 h-4" />;
      case 'structure': return <Layout className="w-4 h-4" />;
      case 'personalization': return <User className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      case 'content': return <Type className="w-4 h-4" />;
      case 'compatibility': return <Mail className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const autoFixableCount = allSuggestions.filter(s => s.autoFixable && !appliedFixes.has(s.id)).length;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {showAIAnalytics && viewMode === 'edit' && (
        <Card className="absolute top-4 left-4 z-50 w-96 bg-white/95 backdrop-blur-sm border max-h-[80vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">AI Suggestions & Auto-Fixes</h3>
              <div className="flex gap-1">
                {allSuggestions.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {allSuggestions.length} issues
                  </Badge>
                )}
                {autoFixableCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {autoFixableCount} auto-fixable
                  </Badge>
                )}
              </div>
            </div>

            {!isKeyAvailable ? (
              <div className="text-red-500 text-sm">
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                API key not available.
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={runCompleteAnalysis}
                  disabled={isAnalyzing || !emailHTML.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-3 h-3 mr-2" />
                      Run Complete Analysis
                    </>
                  )}
                </Button>
                
                {autoFixableCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      allSuggestions
                        .filter(s => s.autoFixable && !appliedFixes.has(s.id))
                        .forEach(handleApplyFix);
                    }}
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    Apply All Auto-Fixes ({autoFixableCount})
                  </Button>
                )}
              </div>
            )}

            {isAnalyzing && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 mt-2">
                <RefreshCw className="w-2 h-2 mr-1 animate-spin" />
                Analyzing...
              </Badge>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {allSuggestions.length === 0 && !isAnalyzing ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Ready</h4>
                  <p className="text-gray-600 text-sm">
                    Get intelligent suggestions to improve your email's performance, deliverability, and engagement.
                  </p>
                </div>
              ) : (
                allSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-3 rounded-lg border ${
                      appliedFixes.has(suggestion.id)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(suggestion.category)}
                        <span className="font-medium text-gray-900 text-sm">{suggestion.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getSeverityIcon(suggestion.severity)}
                        <span className="text-xs text-gray-500">{suggestion.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          suggestion.severity === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : suggestion.severity === 'high'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : suggestion.severity === 'medium'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {suggestion.severity}
                      </Badge>
                      {suggestion.autoFixable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Auto-fixable
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

                    {suggestion.businessImpact && (
                      <p className="text-sm text-blue-600 mb-3 italic">💼 {suggestion.businessImpact}</p>
                    )}

                    {suggestion.current && suggestion.suggested && (
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Current:</span>
                          <div className="bg-red-50 p-2 rounded text-red-700 mt-1 text-sm font-mono">
                            {suggestion.current.length > 100 ? `${suggestion.current.substring(0, 100)}...` : suggestion.current}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Suggested:</span>
                          <div className="bg-green-50 p-2 rounded text-green-700 mt-1 text-sm font-mono">
                            {suggestion.suggested.length > 100 ? `${suggestion.suggested.substring(0, 100)}...` : suggestion.suggested}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {suggestion.autoFixable ? (
                        <Button
                          size="sm"
                          onClick={() => handleApplyFix(suggestion)}
                          disabled={appliedFixes.has(suggestion.id)}
                          className={
                            appliedFixes.has(suggestion.id)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }
                        >
                          {appliedFixes.has(suggestion.id) ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-2" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 mr-2" />
                              Auto-Fix
                            </>
                          )}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          Manual review required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
});
