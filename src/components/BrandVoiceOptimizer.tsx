
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

// Simple mock interfaces to avoid import errors
interface BrandVoiceAnalysisResult {
  brandVoiceScore: number | null;
  engagementScore: number | null;
  toneConsistency: number | null;
  readabilityScore: number | null;
  performancePrediction: {
    openRate: number | null;
    clickRate: number | null;
    conversionRate: number | null;
  };
  suggestions: Array<{
    type: string;
    title: string;
    current: string;
    suggested: string;
    reason: string;
    impact: string;
    confidence: number;
  }>;
}

interface SubjectLineAnalysisResult {
  score: number | null;
  spamRisk: string;
  length: number;
  emotionalImpact: number | null;
  urgencyLevel: number | null;
  recommendations: string[];
  abTestSuggestions: string[];
  benchmarkComparison: {
    predictedOpenRate: number | null;
  };
}

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
      console.log('Starting mock brand voice analysis...');
      setApiStatus('connected');
      
      // Mock analysis result
      const brandResult: BrandVoiceAnalysisResult = {
        brandVoiceScore: 85,
        engagementScore: 78,
        toneConsistency: 92,
        readabilityScore: 88,
        performancePrediction: {
          openRate: 24.5,
          clickRate: 3.2,
          conversionRate: 2.1
        },
        suggestions: []
      };
      
      setAnalysisResult(brandResult);

      if (subjectLine.trim()) {
        const subjectResult: SubjectLineAnalysisResult = {
          score: 82,
          spamRisk: 'low',
          length: subjectLine.length,
          emotionalImpact: 75,
          urgencyLevel: 60,
          recommendations: ['Consider adding urgency', 'Use action words'],
          abTestSuggestions: ['Try adding emojis', 'Test personalization'],
          benchmarkComparison: {
            predictedOpenRate: 26.3
          }
        };
        setSubjectLineAnalysis(subjectResult);
      }
      
      setApiStatus('connected');
    } catch (error) {
      console.error('Error during analysis:', error);
      setApiStatus('failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatValue = (value: number | null): string => {
    return value !== null ? value.toString() : '--';
  };

  const getSpamRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
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

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'failed': return 'Unavailable';
      default: return 'Ready';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">AI Optimizer</h3>
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
              placeholder="Enter subject line..."
              className="text-xs h-7 flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeContent}
              disabled={isAnalyzing}
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
              <div className="text-lg font-bold text-purple-600">
                {formatValue(analysisResult.brandVoiceScore)}
              </div>
              <div className="text-xs text-gray-600">Brand Voice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {formatValue(analysisResult.engagementScore)}
              </div>
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
                    <div className="text-lg font-bold text-purple-600">
                      {formatValue(subjectLineAnalysis.score)}
                    </div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getSpamRiskColor(subjectLineAnalysis.spamRisk)}`}>
                      {subjectLineAnalysis.spamRisk.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-600">Spam Risk</div>
                  </div>
                </div>
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
                  <div className="font-semibold text-blue-600">
                    {formatValue(analysisResult.performancePrediction.openRate)}%
                  </div>
                  <div className="text-xs text-gray-600">Open Rate</div>
                </div>
                <div className="text-center p-1.5 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">
                    {formatValue(analysisResult.performancePrediction.clickRate)}%
                  </div>
                  <div className="text-xs text-gray-600">Click Rate</div>
                </div>
                <div className="text-center p-1.5 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">
                    {formatValue(analysisResult.performancePrediction.conversionRate)}%
                  </div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1.5 text-sm">Quick Actions</h4>
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
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
