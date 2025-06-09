import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';
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
  WifiOff,
  Key,
  Server
} from 'lucide-react';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';
import { OpenAIEmailService } from '@/services/openAIEmailService';
import { ApiKeyService } from '@/services/apiKeyService';
import { useInlineNotifications } from '@/hooks/useInlineNotifications';

interface ContentSuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

interface IntelligentAssistantProps {
  editor: Editor | null;
  emailHTML: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  subjectLine?: string;
  onSubjectLineChange?: (subjectLine: string) => void;
}

export const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({ 
  editor, 
  emailHTML,
  canvasRef,
  subjectLine = '',
  onSubjectLineChange
}) => {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brandVoiceScore, setBrandVoiceScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [performancePrediction, setPerformancePrediction] = useState({
    openRate: 0,
    clickRate: 0,
    conversionRate: 0
  });
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api-key' | 'network' | 'server' | 'unknown'>('unknown');

  const { notifications, removeNotification, error } = useInlineNotifications();

  const analyzingMessages = [
    "Analyzing content tone and voice...",
    "Evaluating engagement potential...",
    "Checking brand consistency...",
    "Generating optimization suggestions..."
  ];

  const [currentAnalyzingStep, setCurrentAnalyzingStep] = useState(0);

  useEffect(() => {
    if (emailHTML && emailHTML.length > 50) {
      analyzeContent();
    }
  }, [emailHTML]);

  const getErrorDetails = (analysisError: any) => {
    const errorMessage = analysisError?.message || analysisError?.toString() || 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      return {
        type: 'api-key' as const,
        message: 'OpenAI API key is missing or invalid',
        suggestion: 'Please configure your OpenAI API key in the settings'
      };
    } else if (errorMessage.includes('429')) {
      return {
        type: 'server' as const,
        message: 'Rate limit exceeded',
        suggestion: 'Please wait a moment and try again'
      };
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'network' as const,
        message: 'Network connection issue',
        suggestion: 'Check your internet connection and try again'
      };
    } else if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
      return {
        type: 'server' as const,
        message: 'OpenAI service temporarily unavailable',
        suggestion: 'The service is experiencing issues. Please try again later'
      };
    } else {
      return {
        type: 'unknown' as const,
        message: errorMessage,
        suggestion: 'Please try again or contact support if the issue persists'
      };
    }
  };

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    // Simulate progressive analysis steps
    for (let i = 0; i < analyzingMessages.length; i++) {
      setCurrentAnalyzingStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const analysisRequest = {
        emailHTML,
        subjectLine
      };

      const analysis = await OpenAIEmailService.analyzeBrandVoice(analysisRequest);
      
      // Update scores from real analysis
      setBrandVoiceScore(analysis.brandVoiceScore);
      setEngagementScore(analysis.engagementScore);
      setPerformancePrediction(analysis.performancePrediction);

      // Convert analysis suggestions to our format
      const newSuggestions: ContentSuggestion[] = analysis.suggestions.map((suggestion, index) => ({
        id: `suggestion_${index}`,
        type: suggestion.type as 'subject' | 'copy' | 'cta' | 'tone',
        title: suggestion.title,
        current: suggestion.current,
        suggested: suggestion.suggested,
        reason: suggestion.reason,
        impact: suggestion.impact as 'high' | 'medium' | 'low',
        confidence: suggestion.confidence
      }));

      setSuggestions(newSuggestions);
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError);
      const errorDetails = getErrorDetails(analysisError);
      setAnalysisError(errorDetails.message);
      setErrorType(errorDetails.type);
      
      error(`Analysis failed: ${errorDetails.message}`, {
        action: {
          label: 'Retry',
          onClick: analyzeContent
        }
      });
      
      // Clear scores on error
      setBrandVoiceScore(0);
      setEngagementScore(0);
      setPerformancePrediction({
        openRate: 0,
        clickRate: 0,
        conversionRate: 0
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: ContentSuggestion) => {
    if (suggestion.type === 'subject' && onSubjectLineChange) {
      // Apply subject line suggestion
      onSubjectLineChange(suggestion.suggested);
    } else if (canvasRef?.current) {
      // Apply content suggestions through canvas
      switch (suggestion.type) {
        case 'copy':
          canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
          break;
        case 'cta':
          canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
          break;
        case 'tone':
          // For tone adjustments, we could modify text style or content
          console.log('Applying tone adjustment:', suggestion.suggested);
          break;
      }
    }

    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    // Update scores
    setBrandVoiceScore(prev => Math.min(100, prev + 3));
    setEngagementScore(prev => Math.min(100, prev + 5));
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

  const getErrorIcon = () => {
    switch (errorType) {
      case 'api-key': return <Key className="w-4 h-4" />;
      case 'network': return <WifiOff className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getErrorColor = () => {
    switch (errorType) {
      case 'api-key': return 'bg-red-50 border-red-200 text-red-700';
      case 'network': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'server': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">Intelligent Assistant</h3>
          <Badge variant="secondary" className="ml-auto bg-purple-50 text-purple-700 text-xs">
            AI Powered
          </Badge>
        </div>

        {/* Inline Notifications */}
        {notifications.length > 0 && (
          <div className="mb-3">
            <InlineNotificationContainer
              notifications={notifications}
              onRemove={removeNotification}
              maxNotifications={1}
            />
          </div>
        )}

        {analysisError ? (
          <div className={`flex items-start gap-2 p-3 border rounded-lg ${getErrorColor()}`}>
            <div className="flex-shrink-0 mt-0.5">
              {getErrorIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-1">{analysisError}</div>
              <div className="text-xs opacity-90 mb-2">
                {errorType === 'api-key' && 'Configure your OpenAI API key in settings'}
                {errorType === 'network' && 'Check your internet connection'}
                {errorType === 'server' && 'Service temporarily unavailable'}
                {errorType === 'unknown' && 'Please try again later'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeContent}
                className="text-xs h-7"
                disabled={!ApiKeyService.isKeyAvailable()}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry Analysis
              </Button>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-xs">{analyzingMessages[currentAnalyzingStep]}</span>
            </div>
            <Progress value={(currentAnalyzingStep + 1) * 25} className="h-1" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{brandVoiceScore}</div>
              <div className="text-xs text-gray-600">Brand Voice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{engagementScore}</div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Performance Prediction */}
          {!isAnalyzing && !analysisError && (brandVoiceScore > 0 || engagementScore > 0) && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3" />
                Performance Prediction
              </h4>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{performancePrediction.openRate}%</div>
                  <div className="text-xs text-gray-600">Open Rate</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{performancePrediction.clickRate}%</div>
                  <div className="text-xs text-gray-600">Click Rate</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">{performancePrediction.conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
              <Lightbulb className="w-3 h-3" />
              Optimization Suggestions ({suggestions.length})
            </h4>
            
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-2 border">
                  <div className="flex items-start justify-between mb-2">
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
                  
                  <div className="space-y-1 mb-2">
                    <div className="text-xs">
                      <span className="text-gray-500">Current:</span>
                      <div className="bg-gray-50 p-1 rounded text-gray-700 mt-1 text-xs">
                        {suggestion.current}
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-gray-500">Suggested:</span>
                      <div className="bg-blue-50 p-1 rounded text-blue-700 mt-1 text-xs">
                        {suggestion.suggested}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 italic">
                    💡 {suggestion.reason}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
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
              
              {suggestions.length === 0 && !isAnalyzing && !analysisError && (
                <div className="text-center py-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">All optimizations applied!</p>
                  <p className="text-xs text-gray-500 mt-1">Your email is performing well.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Quick Optimizations</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeContent}
                disabled={isAnalyzing || !ApiKeyService.isKeyAvailable()}
                className="flex items-center gap-1 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Re-analyze
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Target className="w-3 h-3" />
                A/B Test
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                Auto-fix
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3" />
                Optimize
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
