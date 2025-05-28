import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  Sparkles, 
  Target, 
  Zap,
  Copy,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Brain
} from 'lucide-react';
import { directAIService } from '@/services/directAIService';
import { CentralizedAIAnalysisService } from '@/services/CentralizedAIAnalysisService';

interface Suggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
}

interface AISuggestionsPanelProps {
  emailHTML: string;
  subjectLine: string;
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  emailHTML,
  subjectLine,
  onApplySuggestion
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!emailHTML.trim()) return;

    setIsLoading(true);
    try {
      console.log('Generating real AI suggestions...');
      
      // Use the centralized AI service to get comprehensive analysis
      const analysis = await CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine);
      const unifiedSuggestions = CentralizedAIAnalysisService.convertToUnifiedSuggestions(analysis);
      
      // Convert to the format expected by this component
      const formattedSuggestions: Suggestion[] = unifiedSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.type as 'subject' | 'copy' | 'cta' | 'tone' | 'design',
        title: suggestion.title,
        description: suggestion.reason,
        impact: suggestion.impact,
        confidence: suggestion.confidence,
        suggestion: suggestion.suggested
      }));

      setSuggestions(formattedSuggestions);
      console.log('Generated real AI suggestions:', formattedSuggestions);
      
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback to basic suggestions if API fails
      const fallbackSuggestions: Suggestion[] = [
        {
          id: 'fallback_1',
          type: 'subject',
          title: 'Optimize Subject Line',
          description: 'Make your subject line more compelling',
          impact: 'high',
          confidence: 75,
          suggestion: 'Consider adding urgency or personalization to your subject line'
        }
      ];
      setSuggestions(fallbackSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (emailHTML) {
      const timer = setTimeout(generateSuggestions, 1500);
      return () => clearTimeout(timer);
    }
  }, [emailHTML, subjectLine]);

  const applySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    console.log(`Applied: ${suggestion.title}`);
  };

  const copySuggestion = (suggestion: Suggestion) => {
    navigator.clipboard.writeText(suggestion.suggestion);
    console.log(`Copied: ${suggestion.title}`);
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
      case 'design': return <TrendingUp className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Suggestions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSuggestions}
            disabled={isLoading}
            className="h-7"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-2">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-gray-600">Generating AI suggestions...</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-3 border hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3" />
                    {suggestion.confidence}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                
                <div className="text-sm bg-blue-50 p-2 rounded mb-3">
                  <span className="text-blue-800">💡 {suggestion.suggestion}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-1 text-xs h-7"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copySuggestion(suggestion)}
                    className="text-xs h-7"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))
          ) : !isLoading ? (
            <div className="text-center py-8">
              <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Add email content to get AI suggestions
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSuggestions}
                className="h-7"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate Suggestions
              </Button>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};
