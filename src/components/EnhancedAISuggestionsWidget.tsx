
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Sparkles,
  CheckCircle,
  Copy,
  RefreshCw,
  Zap,
  Target,
  Brain,
  AlertCircle,
  WifiOff,
  Key,
  Server,
  ChevronDown,
  ChevronUp,
  Wand2
} from 'lucide-react';
import { OpenAIEmailService } from '@/services/openAIEmailService';
import { ApiKeyService } from '@/services/apiKeyService';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface AISuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  applied?: boolean;
}

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: AISuggestion) => void;
}

export const EnhancedAISuggestionsWidget: React.FC<EnhancedAISuggestionsWidgetProps> = ({
  isOpen,
  onToggle,
  emailHTML,
  subjectLine,
  canvasRef,
  onSubjectLineChange,
  onApplySuggestion
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api-key' | 'network' | 'server' | 'unknown'>('unknown');
  const [currentStep, setCurrentStep] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const analyzingSteps = [
    "Analyzing email content...",
    "Evaluating engagement potential...",
    "Checking brand consistency...",
    "Generating optimization suggestions..."
  ];

  const getErrorDetails = (error: any) => {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      return { type: 'api-key' as const, message: 'OpenAI API key is missing or invalid' };
    } else if (errorMessage.includes('429')) {
      return { type: 'server' as const, message: 'Rate limit exceeded' };
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return { type: 'network' as const, message: 'Network connection issue' };
    } else if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
      return { type: 'server' as const, message: 'OpenAI service temporarily unavailable' };
    } else {
      return { type: 'unknown' as const, message: errorMessage };
    }
  };

  const analyzeContent = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    // Progressive analysis simulation
    for (let i = 0; i < analyzingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const analysis = await OpenAIEmailService.analyzeBrandVoice({
        emailHTML,
        subjectLine
      });

      const newSuggestions: AISuggestion[] = analysis.suggestions.map((suggestion, index) => ({
        id: `suggestion_${index}_${Date.now()}`,
        type: suggestion.type as 'subject' | 'copy' | 'cta' | 'tone' | 'design',
        title: suggestion.title,
        current: suggestion.current,
        suggested: suggestion.suggested,
        reason: suggestion.reason,
        impact: suggestion.impact as 'high' | 'medium' | 'low',
        confidence: suggestion.confidence,
        applied: false
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('AI analysis failed:', error);
      const errorDetails = getErrorDetails(error);
      setAnalysisError(errorDetails.message);
      setErrorType(errorDetails.type);
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  useEffect(() => {
    if (isOpen && emailHTML && emailHTML.length > 50) {
      analyzeContent();
    }
  }, [isOpen, analyzeContent]);

  const applySuggestion = async (suggestion: AISuggestion) => {
    try {
      if (suggestion.type === 'subject' && onSubjectLineChange) {
        onSubjectLineChange(suggestion.suggested);
      } else if (canvasRef?.current) {
        switch (suggestion.type) {
          case 'copy':
          case 'cta':
            canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            break;
          case 'tone':
            // For tone adjustments, apply to all text blocks
            canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            break;
        }
      }

      // Mark as applied
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));

      onApplySuggestion?.(suggestion);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  const applyAllSuggestions = async () => {
    const unappliedSuggestions = suggestions.filter(s => !s.applied);
    
    for (const suggestion of unappliedSuggestions) {
      await applySuggestion(suggestion);
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between applications
    }
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
      case 'design': return <Wand2 className="w-4 h-4" />;
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

  const unappliedSuggestions = suggestions.filter(s => !s.applied);
  const appliedCount = suggestions.length - unappliedSuggestions.length;

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Lightbulb className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">AI Suggestions</h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  AI Powered
                </Badge>
                {suggestions.length > 0 && (
                  <span>{appliedCount}/{suggestions.length} applied</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unappliedSuggestions.length > 0 && !isAnalyzing && (
              <Button
                onClick={applyAllSuggestions}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Apply All
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-500 h-7 w-7 p-0"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-500 h-7 w-7 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="max-h-96">
          {/* Error State */}
          {analysisError && (
            <div className="p-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
                <div className="flex-shrink-0 mt-0.5">
                  {getErrorIcon()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-900 mb-1">{analysisError}</div>
                  <div className="text-xs text-red-700 mb-2">
                    {errorType === 'api-key' && 'Configure your OpenAI API key in settings'}
                    {errorType === 'network' && 'Check your internet connection'}
                    {errorType === 'server' && 'Service temporarily unavailable'}
                    {errorType === 'unknown' && 'Please try again later'}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={analyzeContent}
                    className="text-xs h-6"
                    disabled={!ApiKeyService.isKeyAvailable()}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-700">{analyzingSteps[currentStep]}</span>
                </div>
                <Progress value={(currentStep + 1) * 25} className="h-2" />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!isAnalyzing && !analysisError && suggestions.length > 0 && (
            <ScrollArea className="max-h-72">
              <div className="p-4 space-y-3">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className={`border rounded-lg p-3 transition-all ${
                      suggestion.applied 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(suggestion.type)}
                        <span className="font-medium text-sm">{suggestion.title}</span>
                        <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact}
                        </Badge>
                        {suggestion.applied && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.confidence}%
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="text-xs">
                        <span className="text-gray-500">Current:</span>
                        <div className="bg-gray-50 p-2 rounded text-gray-700 mt-1 text-xs font-mono">
                          {suggestion.current}
                        </div>
                      </div>
                      
                      <div className="text-xs">
                        <span className="text-gray-500">Suggested:</span>
                        <div className="bg-blue-50 p-2 rounded text-blue-700 mt-1 text-xs font-mono">
                          {suggestion.suggested}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 italic">
                      💡 {suggestion.reason}
                    </p>
                    
                    <div className="flex gap-2">
                      {!suggestion.applied ? (
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          size="sm"
                          className="flex-1 text-xs h-7 bg-purple-600 hover:bg-purple-700"
                        >
                          Apply Fix
                        </Button>
                      ) : (
                        <Button
                          disabled
                          size="sm"
                          className="flex-1 text-xs h-7 bg-green-600"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Applied
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                        className="text-xs h-7"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Empty State */}
          {!isAnalyzing && !analysisError && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">All optimizations applied!</p>
              <p className="text-xs text-gray-500">Your email is performing well.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeContent}
                className="mt-3 text-xs"
                disabled={!ApiKeyService.isKeyAvailable()}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Re-analyze
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
