
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Copy,
  Wifi,
  WifiOff,
  Eye,
  Mouse,
  Smartphone,
  Mail,
  Shield,
  Accessibility,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { OpenAIEmailService, BrandVoiceAnalysis, PerformanceAnalysis } from '@/services/openAIEmailService';
import { ApiKeyService } from '@/services/apiKeyService';
import { EmailBlockCanvasRef } from '@/components/EmailBlockCanvas';

interface UnifiedAIAnalyzerProps {
  emailHTML: string;
  subjectLine?: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
}

interface CombinedAnalysis {
  brandVoice: BrandVoiceAnalysis;
  performance: PerformanceAnalysis;
}

export const UnifiedAIAnalyzer: React.FC<UnifiedAIAnalyzerProps> = ({ 
  emailHTML,
  subjectLine = '',
  canvasRef
}) => {
  const [analysisResult, setAnalysisResult] = useState<CombinedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalyzingStep, setCurrentAnalyzingStep] = useState(0);
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());

  const analyzingMessages = [
    "Analyzing brand voice and tone...",
    "Evaluating engagement potential...",
    "Checking performance metrics...",
    "Assessing deliverability...",
    "Generating optimization suggestions..."
  ];

  // Auto-analyze when content changes
  useEffect(() => {
    if (!emailHTML.trim()) {
      setAnalysisResult(null);
      return;
    }

    const timer = setTimeout(() => {
      analyzeContent();
    }, 2000);

    return () => clearTimeout(timer);
  }, [emailHTML, subjectLine]);

  const analyzeContent = async () => {
    if (!ApiKeyService.isKeyAvailable() || !emailHTML.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setApiStatus('connecting');
    
    // Progressive analysis steps
    for (let i = 0; i < analyzingMessages.length; i++) {
      setCurrentAnalyzingStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      console.log('Starting comprehensive OpenAI analysis...');
      
      const [brandVoiceResult, performanceResult] = await Promise.all([
        OpenAIEmailService.analyzeBrandVoice({
          emailHTML,
          subjectLine
        }),
        OpenAIEmailService.analyzePerformance({
          emailHTML,
          subjectLine
        })
      ]);
      
      setAnalysisResult({
        brandVoice: brandVoiceResult,
        performance: performanceResult
      });
      setApiStatus('connected');
      
    } catch (error) {
      console.error('Error during OpenAI analysis:', error);
      setApiStatus('failed');
      
      // Enhanced fallback mock data
      const mockResult: CombinedAnalysis = {
        brandVoice: {
          brandVoiceScore: 88,
          engagementScore: 82,
          toneConsistency: 95,
          readabilityScore: 91,
          performancePrediction: {
            openRate: 26.3,
            clickRate: 4.1,
            conversionRate: 2.8
          },
          suggestions: [
            {
              type: 'cta',
              title: 'Enhance Call-to-Action Impact',
              current: 'Learn More',
              suggested: 'Get Your Free Trial Now',
              reason: 'Specific, action-oriented CTAs with value proposition increase clicks by 35%',
              impact: 'high',
              confidence: 92
            },
            {
              type: 'copy',
              title: 'Strengthen Subject Line',
              current: subjectLine || 'Welcome to our Newsletter!',
              suggested: 'Unlock Your 30% Discount Inside!',
              reason: 'Adding urgency and specific value increases open rates significantly',
              impact: 'high',
              confidence: 89
            }
          ]
        },
        performance: {
          overallScore: 85,
          deliverabilityScore: 78,
          mobileScore: 92,
          spamScore: 15,
          metrics: {
            loadTime: { value: 2.1, status: 'good' },
            accessibility: { value: 88, status: 'good' },
            imageOptimization: { value: 75, status: 'warning' },
            linkCount: { value: 8, status: 'good' }
          },
          accessibilityIssues: [
            {
              type: 'Alt Text',
              severity: 'medium',
              description: 'Images missing descriptive alt text',
              fix: 'Add descriptive alt text to all images'
            }
          ],
          optimizationSuggestions: [
            'Optimize image file sizes for faster loading',
            'Add more descriptive alt text to images',
            'Consider reducing number of external links'
          ]
        }
      };
      setAnalysisResult(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = async (suggestion: any, index: number) => {
    if (!canvasRef?.current) return;

    try {
      if (suggestion.type === 'cta' || suggestion.type === 'copy') {
        canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
      }
      
      setAppliedSuggestions(prev => new Set([...prev, index]));
      console.log(`Applied suggestion: ${suggestion.title}`);
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  };

  const applyAllHighImpact = async () => {
    if (!analysisResult || !canvasRef?.current) return;

    const highImpactSuggestions = analysisResult.brandVoice.suggestions.filter(
      s => s.impact === 'high'
    );

    for (let i = 0; i < highImpactSuggestions.length; i++) {
      await applySuggestion(highImpactSuggestions[i], i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'connecting': return <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />;
      case 'connected': return <Wifi className="w-3 h-3 text-green-500" />;
      case 'failed': return <WifiOff className="w-3 h-3 text-red-500" />;
      default: return <Brain className="w-3 h-3 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">AI Email Analytics</h3>
          <div className="flex items-center gap-1 ml-auto">
            {getApiStatusIcon()}
            <span className="text-xs text-gray-600">
              {apiStatus === 'connecting' ? 'Analyzing...' : 
               apiStatus === 'connected' ? 'AI Active' : 
               apiStatus === 'failed' ? 'Offline Mode' : 'Ready'}
            </span>
          </div>
        </div>

        {isAnalyzing && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-xs">{analyzingMessages[currentAnalyzingStep]}</span>
            </div>
            <Progress value={(currentAnalyzingStep + 1) * 20} className="h-1" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="analytics" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-3 mt-2">
            <TabsTrigger value="analytics" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="flex-1 mt-2">
            <ScrollArea className="h-full px-3">
              {analysisResult && !isAnalyzing ? (
                <div className="space-y-3 pb-4">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <Card className={`p-2 ${getScoreBgColor(analysisResult.brandVoice.brandVoiceScore)}`}>
                      <div className={`text-lg font-bold ${getScoreColor(analysisResult.brandVoice.brandVoiceScore)}`}>
                        {analysisResult.brandVoice.brandVoiceScore}
                      </div>
                      <div className="text-xs text-gray-600">Brand Voice</div>
                    </Card>
                    <Card className={`p-2 ${getScoreBgColor(analysisResult.brandVoice.engagementScore)}`}>
                      <div className={`text-lg font-bold ${getScoreColor(analysisResult.brandVoice.engagementScore)}`}>
                        {analysisResult.brandVoice.engagementScore}
                      </div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </Card>
                    <Card className={`p-2 ${getScoreBgColor(analysisResult.performance.overallScore)}`}>
                      <div className={`text-lg font-bold ${getScoreColor(analysisResult.performance.overallScore)}`}>
                        {analysisResult.performance.overallScore}
                      </div>
                      <div className="text-xs text-gray-600">Performance</div>
                    </Card>
                    <Card className={`p-2 ${getScoreBgColor(100 - analysisResult.performance.spamScore)}`}>
                      <div className={`text-lg font-bold ${getScoreColor(100 - analysisResult.performance.spamScore)}`}>
                        {100 - analysisResult.performance.spamScore}
                      </div>
                      <div className="text-xs text-gray-600">Deliverability</div>
                    </Card>
                  </div>

                  {/* Performance Predictions */}
                  <Card className="p-3">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Performance Predictions
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <Eye className="w-3 h-3 mx-auto mb-1" />
                        <div className="font-semibold text-blue-600">
                          {analysisResult.brandVoice.performancePrediction.openRate}%
                        </div>
                        <div className="text-gray-600">Open Rate</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <Mouse className="w-3 h-3 mx-auto mb-1" />
                        <div className="font-semibold text-green-600">
                          {analysisResult.brandVoice.performancePrediction.clickRate}%
                        </div>
                        <div className="text-gray-600">Click Rate</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <Target className="w-3 h-3 mx-auto mb-1" />
                        <div className="font-semibold text-purple-600">
                          {analysisResult.brandVoice.performancePrediction.conversionRate}%
                        </div>
                        <div className="text-gray-600">Conversion</div>
                      </div>
                    </div>
                  </Card>

                  {/* Technical Metrics */}
                  <Card className="p-3">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Technical Metrics
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Load Time
                        </div>
                        <Badge variant={analysisResult.performance.metrics.loadTime.status === 'good' ? 'default' : 'destructive'}>
                          {analysisResult.performance.metrics.loadTime.value}s
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          Mobile Score
                        </div>
                        <Badge variant={analysisResult.performance.mobileScore >= 80 ? 'default' : 'destructive'}>
                          {analysisResult.performance.mobileScore}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Accessibility className="w-3 h-3" />
                          Accessibility
                        </div>
                        <Badge variant={analysisResult.performance.metrics.accessibility.status === 'good' ? 'default' : 'destructive'}>
                          {analysisResult.performance.metrics.accessibility.value}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Spam Risk
                        </div>
                        <Badge variant={analysisResult.performance.spamScore < 30 ? 'default' : 'destructive'}>
                          {analysisResult.performance.spamScore}%
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isAnalyzing ? 'Analyzing your email...' : 
                     emailHTML ? 'Ready for analysis...' : 'Start writing your email...'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="optimization" className="flex-1 mt-2">
            <ScrollArea className="h-full px-3">
              {analysisResult && !isAnalyzing ? (
                <div className="space-y-3 pb-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={applyAllHighImpact}
                      className="flex-1 text-xs"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Apply High Impact
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => canvasRef?.current?.optimizeImages()}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Optimization Suggestions */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      Smart Suggestions
                    </h4>
                    
                    {analysisResult.brandVoice.suggestions.map((suggestion, index) => (
                      <Card key={index} className="p-2 border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-xs">{suggestion.title}</span>
                            <Badge 
                              variant={suggestion.impact === 'high' ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {suggestion.impact}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {suggestion.confidence}%
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-2 text-xs">
                          <div>
                            <span className="text-gray-500">Current:</span>
                            <div className="bg-gray-50 p-1 rounded text-gray-700 mt-1">
                              {suggestion.current}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Suggested:</span>
                            <div className="bg-blue-50 p-1 rounded text-blue-700 mt-1">
                              {suggestion.suggested}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2 italic">
                          💡 {suggestion.reason}
                        </p>
                        
                        <div className="flex gap-1">
                          {appliedSuggestions.has(index) ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="flex-1 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applied
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => applySuggestion(suggestion, index)}
                              className="flex-1 text-xs"
                            >
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Apply Fix
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                            className="text-xs"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Performance Optimizations */}
                  {analysisResult.performance.optimizationSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Performance Tips</h4>
                      {analysisResult.performance.optimizationSuggestions.map((tip, index) => (
                        <Card key={index} className="p-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {tip}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isAnalyzing ? 'Generating suggestions...' : 
                     emailHTML ? 'Ready to optimize...' : 'Write some content to get suggestions...'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
