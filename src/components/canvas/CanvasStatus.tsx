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
import { ComprehensiveMetricsService, ComprehensiveEmailMetrics } from '@/services/comprehensiveMetricsService';

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
  const [criticalSuggestions, setCriticalSuggestions] = useState<CriticalSuggestion[]>([]);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<CompleteAnalysisResult | null>(null);
  const [allSuggestions, setAllSuggestions] = useState<CriticalSuggestion[]>([]);

  const extractAndMergeSuggestions = useCallback((critical: CriticalSuggestion[], comprehensive: CompleteAnalysisResult | null) => {
    let merged = [...critical];

    if (comprehensive) {
      if (comprehensive.brandVoice?.suggestions) {
        comprehensive.brandVoice.suggestions.forEach((suggestion, index) => {
          merged.push({
            id: `brand-voice-${index}`,
            title: suggestion.title,
            reason: suggestion.reason,
            category: 'tone',
            type: 'tone',
            current: suggestion.current || '',
            suggested: suggestion.suggested || '',
            severity: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            impact: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            confidence: suggestion.confidence || 75,
            autoFixable: false,
            priority: index + 1,
            businessImpact: `Brand voice improvement: ${suggestion.reason}`
          });
        });
      }

      if (comprehensive.subjectVariants && comprehensive.subjectVariants.length > 0) {
        comprehensive.subjectVariants.forEach((variant, index) => {
          merged.push({
            id: `subject-variant-${index}`,
            title: `Subject Line Alternative ${index + 1}`,
            reason: 'AI-generated subject line variant to improve engagement',
            category: 'subject',
            type: 'subject',
            current: subjectLine,
            suggested: variant,
            severity: 'medium',
            impact: 'medium',
            confidence: 80,
            autoFixable: true,
            priority: index + 1,
            businessImpact: 'May improve open rates with fresh messaging'
          });
        });
      }
    }

    merged.sort((a, b) => b.confidence - a.confidence);
    return merged;
  }, [subjectLine]);

  useEffect(() => {
    const merged = extractAndMergeSuggestions(criticalSuggestions, comprehensiveAnalysis);
    setAllSuggestions(merged);
  }, [criticalSuggestions, comprehensiveAnalysis, extractAndMergeSuggestions]);

  const runCriticalAnalysis = async () => {
    if (!emailHTML.trim() || emailHTML.length < 50) {
      error('Add more content before analyzing');
      return;
    }

    setIsAnalyzing(true);
    try {
      const critical = await CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine);
      setCriticalSuggestions(critical);
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

  const runCompleteAnalysis = async () => {
    if (!emailHTML.trim() || emailHTML.length < 50) {
      error('Add more content before analyzing');
      return;
    }

    setIsAnalyzing(true);
    try {
      const comprehensive = await CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine);
      setComprehensiveAnalysis(comprehensive);
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

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {showAIAnalytics && viewMode === 'edit' && (
        <Card className="absolute top-4 left-4 z-50 w-80 bg-white/95 backdrop-blur-sm border">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">AI Analysis</h3>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {allSuggestions.length} issues
                </Badge>
              </div>

              {isAnalyzing ? (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                  <RefreshCw className="w-2 h-2 mr-1 animate-spin" />
                  Analyzing...
                </Badge>
              ) : (
                <>
                  {!isKeyAvailable ? (
                    <div className="text-red-500 text-sm">
                      <AlertTriangle className="inline w-4 h-4 mr-1" />
                      API key not available.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={runCriticalAnalysis}
                        disabled={isAnalyzing}
                      >
                        <Zap className="w-3 h-3 mr-2" />
                        Quick Scan
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={runCompleteAnalysis}
                        disabled={isAnalyzing}
                      >
                        <Brain className="w-3 h-3 mr-2" />
                        Deep Analysis
                      </Button>
                    </div>
                  )}
                </>
              )}

              {allSuggestions.length > 0 && (
                <div className="space-y-3">
                  {allSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
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
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
});
