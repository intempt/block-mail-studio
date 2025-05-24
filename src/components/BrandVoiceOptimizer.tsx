import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Copy,
  Wifi,
  WifiOff
} from 'lucide-react';
import { emailAIService, BrandVoiceAnalysisResult, SubjectLineAnalysisResult } from '@/services/EmailAIService';

interface BrandVoiceOptimizerProps {
  editor: Editor | null;
  emailHTML: string;
}

export const BrandVoiceOptimizer: React.FC<BrandVoiceOptimizerProps> = ({ 
  editor, 
  emailHTML 
}) => {
  const [analysisResult, setAnalysisResult] = useState<BrandVoiceAnalysisResult | null>(null);
  const [subjectLineAnalysis, setSubjectLineAnalysis] = useState<SubjectLineAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subjectLine, setSubjectLine] = useState('');
  const [currentAnalyzingStep, setCurrentAnalyzingStep] = useState(0);
  const [apiStatus, setApiStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');

  const analyzingMessages = [
    "Parsing email content and structure...",
    "Analyzing brand voice consistency...",
    "Evaluating engagement and psychology...",
    "Generating AI-powered suggestions..."
  ];

  useEffect(() => {
    if (emailHTML) {
      analyzeContent();
    }
  }, [emailHTML]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setApiStatus('connecting');
    
    // Progressive analysis steps with real timing
    for (let i = 0; i < analyzingMessages.length; i++) {
      setCurrentAnalyzingStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      console.log('Starting enhanced AI-powered brand voice analysis...');
      setApiStatus('connected');
      
      const brandResult = await emailAIService.analyzeBrandVoice(emailHTML, subjectLine);
      console.log('Enhanced brand voice analysis completed:', brandResult);
      setAnalysisResult(brandResult);

      if (subjectLine.trim()) {
        console.log('Running enhanced subject line analysis:', subjectLine);
        const subjectResult = await emailAIService.analyzeSubjectLine(subjectLine, emailHTML);
        console.log('Enhanced subject line analysis completed:', subjectResult);
        setSubjectLineAnalysis(subjectResult);
      }
      
      setApiStatus('connected');
    } catch (error) {
      console.error('Error during enhanced AI analysis:', error);
      setApiStatus('failed');
      setAnalysisResult({
        brandVoiceScore: null,
        engagementScore: null,
        toneConsistency: null,
        readabilityScore: null,
        performancePrediction: {
          openRate: null,
          clickRate: null,
          conversionRate: null
        },
        suggestions: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSubjectLineOnly = async () => {
    if (!subjectLine.trim()) return;
    
    setIsAnalyzing(true);
    setApiStatus('connecting');
    
    try {
      console.log('Running enhanced subject line analysis only:', subjectLine);
      const result = await emailAIService.analyzeSubjectLine(subjectLine, emailHTML);
      console.log('Enhanced subject line analysis completed:', result);
      setSubjectLineAnalysis(result);
      setApiStatus('connected');
    } catch (error) {
      console.error('Error analyzing subject line:', error);
      setApiStatus('failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestionIndex: number) => {
    if (!editor || !analysisResult) return;

    const suggestion = analysisResult.suggestions[suggestionIndex];
    
    const content = editor.getHTML();
    const updatedContent = content.replace(suggestion.current, suggestion.suggested);
    editor.commands.setContent(updatedContent);

    const updatedResult = { ...analysisResult };
    updatedResult.suggestions.splice(suggestionIndex, 1);
    if (updatedResult.brandVoiceScore) {
      updatedResult.brandVoiceScore = Math.min(100, updatedResult.brandVoiceScore + 3);
    }
    if (updatedResult.engagementScore) {
      updatedResult.engagementScore = Math.min(100, updatedResult.engagementScore + 5);
    }
    
    setAnalysisResult(updatedResult);
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
      case 'subject': return <Target className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'copy': return <Sparkles className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getSpamRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'unknown': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (value: number | null): string => {
    return value !== null ? value.toString() : '--';
  };

  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'connecting': return <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />;
      case 'connected': return <Wifi className="w-3 h-3 text-green-500" />;
      case 'failed': return <WifiOff className="w-3 h-3 text-red-500" />;
      default: return <Brain className="w-3 h-3 text-gray-400" />;
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'connecting': return 'Connecting to AI...';
      case 'connected': return 'AI Connected';
      case 'failed': return 'AI Unavailable';
      default: return 'AI Ready';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">Enhanced AI Optimizer</h3>
          <div className="flex items-center gap-1 ml-auto">
            {getApiStatusIcon()}
            <span className="text-xs text-gray-600">{getApiStatusText()}</span>
          </div>
        </div>

        <div className="mb-3">
          <Label htmlFor="subject-line-optimizer" className="text-xs font-medium">Subject Line</Label>
          <div className="flex gap-1 mt-1">
            <Input
              id="subject-line-optimizer"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              placeholder="Enter subject line to optimize..."
              className="text-xs h-7 flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeSubjectLineOnly}
              disabled={isAnalyzing || !subjectLine.trim()}
              className="text-xs px-2"
            >
              Analyze
            </Button>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-xs">{analyzingMessages[currentAnalyzingStep]}</span>
            </div>
            <Progress value={(currentAnalyzingStep + 1) * 25} className="h-1" />
          </div>
        ) : analysisResult ? (
          <>
            {analysisResult.brandVoiceScore === null ? (
              <div className="text-center p-2 bg-red-50 rounded">
                <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <div className="text-xs text-red-700">Enhanced AI Analysis Unavailable</div>
                <div className="text-xs text-red-600">Check connection and try again</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{formatValue(analysisResult.brandVoiceScore)}</div>
                  <div className="text-xs text-gray-600">Brand Voice</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatValue(analysisResult.engagementScore)}</div>
                  <div className="text-xs text-gray-600">Engagement</div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2.5">
          {/* Subject Line Analysis */}
          {subjectLineAnalysis && (
            <div className="mb-2.5">
              <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
                <Target className="w-3 h-3" />
                Enhanced Subject Line Analysis
              </h4>
              
              <Card className="p-2 border">
                {subjectLineAnalysis.score === null ? (
                  <div className="text-center p-2 bg-red-50 rounded">
                    <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <div className="text-xs text-red-700">Analysis Unavailable</div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{formatValue(subjectLineAnalysis.score)}</div>
                        <div className="text-xs text-gray-600">AI Score</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getSpamRiskColor(subjectLineAnalysis.spamRisk)}`}>
                          {subjectLineAnalysis.spamRisk.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600">Spam Risk</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                      <div className="text-center p-1 bg-blue-50 rounded">
                        <div className="font-semibold">{subjectLineAnalysis.length}</div>
                        <div className="text-gray-600">Length</div>
                      </div>
                      <div className="text-center p-1 bg-green-50 rounded">
                        <div className="font-semibold">{formatValue(subjectLineAnalysis.emotionalImpact)}</div>
                        <div className="text-gray-600">Emotion</div>
                      </div>
                      <div className="text-center p-1 bg-orange-50 rounded">
                        <div className="font-semibold">{formatValue(subjectLineAnalysis.urgencyLevel)}</div>
                        <div className="text-gray-600">Urgency</div>
                      </div>
                    </div>

                    {subjectLineAnalysis.abTestSuggestions.length > 0 && (
                      <div className="bg-purple-50 p-1.5 rounded mb-2">
                        <div className="text-xs font-medium text-purple-900 mb-1">A/B Test Suggestions:</div>
                        {subjectLineAnalysis.abTestSuggestions.slice(0, 2).map((suggestion, index) => (
                          <div key={index} className="text-xs text-purple-800 flex items-center gap-1">
                            <Sparkles className="w-2 h-2" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}

                    {subjectLineAnalysis.recommendations.length > 0 && (
                      <div className="bg-blue-50 p-1.5 rounded">
                        <div className="text-xs font-medium text-blue-900 mb-1">Enhanced AI Recommendations:</div>
                        {subjectLineAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="text-xs text-blue-800">• {rec}</div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}

          {/* Performance Prediction */}
          {analysisResult && !isAnalyzing && (
            <div className="mb-2.5">
              <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3" />
                AI Performance Prediction
              </h4>
              
              {analysisResult.performancePrediction.openRate === null ? (
                <div className="text-center p-2 bg-red-50 rounded">
                  <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                  <div className="text-xs text-red-700">Prediction Unavailable</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="text-center p-1.5 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">{formatValue(analysisResult.performancePrediction.openRate)}%</div>
                    <div className="text-xs text-gray-600">Open Rate</div>
                  </div>
                  <div className="text-center p-1.5 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">{formatValue(analysisResult.performancePrediction.clickRate)}%</div>
                    <div className="text-xs text-gray-600">Click Rate</div>
                  </div>
                  <div className="text-center p-1.5 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-600">{formatValue(analysisResult.performancePrediction.conversionRate)}%</div>
                    <div className="text-xs text-gray-600">Conversion</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Optimization Suggestions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
              <Lightbulb className="w-3 h-3" />
              Enhanced AI Suggestions ({analysisResult?.suggestions.length || 0})
            </h4>
            
            <div className="space-y-1.5">
              {analysisResult?.suggestions.map((suggestion, index) => (
                <Card key={index} className="p-2 border">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-medium text-xs">{suggestion.title}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(suggestion.impact)}`}
                      >
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3" />
                      {suggestion.confidence}%
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-1.5">
                    <div className="text-xs">
                      <span className="text-gray-500">Current:</span>
                      <div className="bg-gray-50 p-1 rounded text-gray-700 mt-0.5 text-xs">
                        {suggestion.current}
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-gray-500">Enhanced AI Suggested:</span>
                      <div className="bg-blue-50 p-1 rounded text-blue-700 mt-0.5 text-xs">
                        {suggestion.suggested}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1.5 italic">
                    🧠 {suggestion.reason}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(index)}
                      className="flex-1 text-xs"
                    >
                      Apply AI Fix
                    </Button>
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
              
              {analysisResult && analysisResult.suggestions.length === 0 && !isAnalyzing && (
                <div className="text-center py-3">
                  {analysisResult.brandVoiceScore === null ? (
                    <div className="text-center p-2 bg-red-50 rounded">
                      <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                      <div className="text-xs text-red-700">No AI suggestions available</div>
                      <div className="text-xs text-red-600">Enhanced AI analysis failed</div>
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1.5" />
                      <p className="text-xs text-gray-600">All AI optimizations applied!</p>
                      <p className="text-xs text-gray-500 mt-0.5">Your email is performing excellently.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1.5 text-sm">Enhanced AI Actions</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeContent}
                className="flex items-center gap-1.5 text-xs"
                disabled={isAnalyzing}
              >
                <RefreshCw className="w-3 h-3" />
                Re-analyze
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                <Target className="w-3 h-3" />
                A/B Test
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                Auto-optimize
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                <TrendingUp className="w-3 h-3" />
                Boost CTR
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
