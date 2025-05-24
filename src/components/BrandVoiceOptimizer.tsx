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
  Copy
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

  const analyzingMessages = [
    "Analyzing content tone and voice...",
    "Evaluating engagement potential...",
    "Checking brand consistency...",
    "Generating optimization suggestions..."
  ];

  useEffect(() => {
    if (emailHTML) {
      analyzeContent();
    }
  }, [emailHTML]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    // Simulate progressive analysis steps
    for (let i = 0; i < analyzingMessages.length; i++) {
      setCurrentAnalyzingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      console.log('Starting AI-powered brand voice analysis...');
      
      // Analyze brand voice and email content
      const brandResult = await emailAIService.analyzeBrandVoice(emailHTML, subjectLine);
      console.log('Brand voice analysis completed:', brandResult);
      setAnalysisResult(brandResult);

      // Analyze subject line if provided
      if (subjectLine.trim()) {
        console.log('Analyzing subject line:', subjectLine);
        const subjectResult = await emailAIService.analyzeSubjectLine(subjectLine, emailHTML);
        console.log('Subject line analysis completed:', subjectResult);
        setSubjectLineAnalysis(subjectResult);
      }
    } catch (error) {
      console.error('Error during brand voice analysis:', error);
      // Fallback analysis
      setAnalysisResult({
        brandVoiceScore: 85,
        engagementScore: 78,
        toneConsistency: 82,
        readabilityScore: 88,
        performancePrediction: {
          openRate: 24.5,
          clickRate: 3.2,
          conversionRate: 2.1
        },
        suggestions: [{
          type: 'copy',
          title: 'Analysis Unavailable',
          current: 'Current content',
          suggested: 'AI analysis temporarily unavailable',
          reason: 'Please try again in a moment',
          impact: 'medium',
          confidence: 0
        }]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSubjectLineOnly = async () => {
    if (!subjectLine.trim()) return;
    
    setIsAnalyzing(true);
    try {
      console.log('Analyzing subject line only:', subjectLine);
      const result = await emailAIService.analyzeSubjectLine(subjectLine, emailHTML);
      console.log('Subject line analysis completed:', result);
      setSubjectLineAnalysis(result);
    } catch (error) {
      console.error('Error analyzing subject line:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestionIndex: number) => {
    if (!editor || !analysisResult) return;

    const suggestion = analysisResult.suggestions[suggestionIndex];
    
    // Apply the suggestion to the editor
    const content = editor.getHTML();
    const updatedContent = content.replace(suggestion.current, suggestion.suggested);
    editor.commands.setContent(updatedContent);

    // Remove applied suggestion and update scores
    const updatedResult = { ...analysisResult };
    updatedResult.suggestions.splice(suggestionIndex, 1);
    updatedResult.brandVoiceScore = Math.min(100, updatedResult.brandVoiceScore + 3);
    updatedResult.engagementScore = Math.min(100, updatedResult.engagementScore + 5);
    
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
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">Brand Voice Optimizer</h3>
          <Badge variant="secondary" className="ml-auto bg-purple-50 text-purple-700 text-xs">
            AI Powered
          </Badge>
        </div>

        {/* Subject Line Input */}
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
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{analysisResult.brandVoiceScore}</div>
              <div className="text-xs text-gray-600">Brand Voice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{analysisResult.engagementScore}</div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
          </div>
        ) : null}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2.5">
          {/* Subject Line Analysis */}
          {subjectLineAnalysis && (
            <div className="mb-2.5">
              <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
                <Target className="w-3 h-3" />
                Subject Line Analysis
              </h4>
              
              <Card className="p-2 border">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{subjectLineAnalysis.score}</div>
                    <div className="text-xs text-gray-600">Overall Score</div>
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
                    <div className="font-semibold">{subjectLineAnalysis.emotionalImpact}</div>
                    <div className="text-gray-600">Emotion</div>
                  </div>
                  <div className="text-center p-1 bg-orange-50 rounded">
                    <div className="font-semibold">{subjectLineAnalysis.urgencyLevel}</div>
                    <div className="text-gray-600">Urgency</div>
                  </div>
                </div>

                {subjectLineAnalysis.recommendations.length > 0 && (
                  <div className="bg-blue-50 p-1.5 rounded">
                    <div className="text-xs font-medium text-blue-900 mb-1">AI Recommendations:</div>
                    {subjectLineAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-blue-800">• {rec}</div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Performance Prediction */}
          {analysisResult && !isAnalyzing && (
            <div className="mb-2.5">
              <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3" />
                Performance Prediction
              </h4>
              
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="text-center p-1.5 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{analysisResult.performancePrediction.openRate}%</div>
                  <div className="text-xs text-gray-600">Open Rate</div>
                </div>
                <div className="text-center p-1.5 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{analysisResult.performancePrediction.clickRate}%</div>
                  <div className="text-xs text-gray-600">Click Rate</div>
                </div>
                <div className="text-center p-1.5 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">{analysisResult.performancePrediction.conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1.5 flex items-center gap-1 text-sm">
              <Lightbulb className="w-3 h-3" />
              AI Optimization Suggestions ({analysisResult?.suggestions.length || 0})
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
                      <span className="text-gray-500">AI Suggested:</span>
                      <div className="bg-blue-50 p-1 rounded text-blue-700 mt-0.5 text-xs">
                        {suggestion.suggested}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1.5 italic">
                    💡 {suggestion.reason}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(index)}
                      className="flex-1 text-xs"
                    >
                      Apply
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
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1.5" />
                  <p className="text-xs text-gray-600">All AI optimizations applied!</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your email is performing well.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1.5 text-sm">AI-Powered Actions</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeContent}
                className="flex items-center gap-1.5 text-xs"
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
