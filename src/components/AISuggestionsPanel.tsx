
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
  Brain,
  Type
} from 'lucide-react';
import { CentralizedAIAnalysisService, UnifiedAISuggestion } from '@/services/CentralizedAIAnalysisService';

interface AISuggestionsPanelProps {
  emailHTML: string;
  subjectLine: string;
  onApplySuggestion?: (suggestion: UnifiedAISuggestion) => void;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  emailHTML,
  subjectLine,
  onApplySuggestion
}) => {
  const [suggestions, setSuggestions] = useState<UnifiedAISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!emailHTML.trim() || emailHTML.length < 50) {
      console.warn('AISuggestionsPanel: Email content too short for analysis');
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('AISuggestionsPanel: Generating comprehensive AI suggestions...');
      
      // Use the centralized AI service for real analysis
      const analysis = await CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine);
      const unifiedSuggestions = CentralizedAIAnalysisService.convertToUnifiedSuggestions(analysis, emailHTML);
      
      // Sort by priority (high impact first, then by confidence)
      const sortedSuggestions = unifiedSuggestions.sort((a, b) => {
        const impactOrder = { high: 3, medium: 2, low: 1 };
        const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
        if (impactDiff !== 0) return impactDiff;
        return b.confidence - a.confidence;
      });

      setSuggestions(sortedSuggestions);
      console.log('AISuggestionsPanel: Generated', sortedSuggestions.length, 'AI suggestions');
      
    } catch (error) {
      console.error('AISuggestionsPanel: Error generating AI suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (emailHTML && emailHTML.length > 50) {
      const timer = setTimeout(generateSuggestions, 1500);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [emailHTML, subjectLine]);

  const applySuggestion = (suggestion: UnifiedAISuggestion) => {
    onApplySuggestion?.(suggestion);
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ));
    console.log(`AISuggestionsPanel: Applied suggestion:`, suggestion.title);
  };

  const copySuggestion = (suggestion: UnifiedAISuggestion) => {
    navigator.clipboard.writeText(suggestion.suggested);
    console.log(`AISuggestionsPanel: Copied suggestion:`, suggestion.title);
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
      case 'copy': return <Type className="w-4 h-4" />;
      case 'design': return <TrendingUp className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'optimization': return <Sparkles className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'brandVoice': return 'bg-purple-100 text-purple-700';
      case 'performance': return 'bg-green-100 text-green-700';
      case 'variants': return 'bg-blue-100 text-blue-700';
      case 'optimization': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Suggestion AI
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
              <Card key={suggestion.id} className={`p-3 border hover:shadow-sm transition-shadow ${suggestion.applied ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </Badge>
                    {suggestion.applied && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3" />
                    {suggestion.confidence}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                
                {suggestion.current && (
                  <div className="text-xs mb-2">
                    <span className="font-medium text-gray-700">Current:</span>
                    <div className="bg-gray-50 p-2 rounded mt-1 text-gray-600 font-mono text-xs">
                      {suggestion.current.length > 100 
                        ? suggestion.current.substring(0, 100) + '...' 
                        : suggestion.current}
                    </div>
                  </div>
                )}
                
                <div className="text-sm bg-blue-50 p-2 rounded mb-3">
                  <div className="text-xs text-blue-600 font-medium mb-1">💡 Suggested:</div>
                  <span className="text-blue-800">{suggestion.suggested}</span>
                </div>
                
                {suggestion.blockId && (
                  <div className="text-xs text-purple-600 mb-2">
                    🎯 Targets: {suggestion.targetElement || 'specific block'} ({suggestion.blockId})
                  </div>
                )}
                
                {!suggestion.applied && (
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
                )}
              </Card>
            ))
          ) : !isLoading ? (
            <div className="text-center py-8">
              <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Add email content to get Suggestion AI
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
