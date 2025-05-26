
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  CheckCircle,
  RefreshCw,
  Zap,
  Target,
  Brain,
  ChevronDown,
  ChevronUp,
  Wand2,
  X,
  Mail,
  MousePointer
} from 'lucide-react';
import { OpenAIEmailService } from '@/services/openAIEmailService';
import { ApiKeyService } from '@/services/apiKeyService';

interface CompactAISuggestion {
  id: string;
  type: 'subject' | 'cta' | 'copy' | 'deliverability';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  applied?: boolean;
}

interface CompactAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: CompactAISuggestion) => void;
}

export const CompactAISuggestionsWidget: React.FC<CompactAISuggestionsWidgetProps> = ({
  isOpen,
  onToggle,
  emailHTML,
  subjectLine,
  onSubjectLineChange,
  onApplySuggestion
}) => {
  const [suggestions, setSuggestions] = useState<CompactAISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const analyzeContent = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) return;
    
    setIsAnalyzing(true);
    
    try {
      const analysis = await OpenAIEmailService.analyzeBrandVoice({
        emailHTML,
        subjectLine
      });

      const newSuggestions: CompactAISuggestion[] = analysis.suggestions.slice(0, 4).map((suggestion, index) => ({
        id: `suggestion_${index}_${Date.now()}`,
        type: suggestion.type as 'subject' | 'cta' | 'copy' | 'deliverability',
        title: suggestion.title,
        current: suggestion.current,
        suggested: suggestion.suggested,
        reason: suggestion.reason,
        impact: suggestion.impact as 'high' | 'medium' | 'low',
        applied: false
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setSuggestions([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  useEffect(() => {
    if (isOpen && emailHTML && emailHTML.length > 50) {
      analyzeContent();
    }
  }, [isOpen, analyzeContent]);

  const applySuggestion = async (suggestion: CompactAISuggestion) => {
    if (suggestion.type === 'subject' && onSubjectLineChange) {
      onSubjectLineChange(suggestion.suggested);
    }

    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ));

    onApplySuggestion?.(suggestion);
  };

  const applyAllSuggestions = async () => {
    const unappliedSuggestions = suggestions.filter(s => !s.applied);
    for (const suggestion of unappliedSuggestions) {
      await applySuggestion(suggestion);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subject': return <Target className="w-3 h-3" />;
      case 'cta': return <MousePointer className="w-3 h-3" />;
      case 'copy': return <Brain className="w-3 h-3" />;
      case 'deliverability': return <Mail className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const unappliedSuggestions = suggestions.filter(s => !s.applied);

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 mx-4 shadow-lg bg-white">
      {/* Compact Header */}
      <div className="px-4 py-2 border-b bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium">AI Suggestions</span>
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              {suggestions.length - unappliedSuggestions.length}/{suggestions.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {unappliedSuggestions.length > 0 && !isAnalyzing && (
            <Button
              onClick={applyAllSuggestions}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white h-6 px-2 text-xs"
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Apply All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Compact Content */}
      <div className="max-h-32">
        {isAnalyzing ? (
          <div className="p-3 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
            <span className="text-xs text-gray-600">Analyzing email marketing potential...</span>
          </div>
        ) : suggestions.length > 0 ? (
          <ScrollArea className="max-h-28">
            <div className="p-2 space-y-1">
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className={`border rounded p-2 transition-all ${
                    suggestion.applied 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-medium text-xs truncate">{suggestion.title}</span>
                      <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </Badge>
                      {suggestion.applied && (
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedItem(
                          expandedItem === suggestion.id ? null : suggestion.id
                        )}
                        className="h-5 w-5 p-0"
                      >
                        {expandedItem === suggestion.id ? 
                          <ChevronUp className="w-3 h-3" /> : 
                          <ChevronDown className="w-3 h-3" />
                        }
                      </Button>
                      
                      {!suggestion.applied && (
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          size="sm"
                          className="h-5 px-2 text-xs bg-purple-600 hover:bg-purple-700"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {expandedItem === suggestion.id && (
                    <div className="mt-2 pt-2 border-t space-y-1">
                      <div className="text-xs">
                        <span className="text-gray-500">Current:</span>
                        <div className="bg-gray-50 p-1 rounded text-gray-700 mt-1 font-mono text-xs">
                          {suggestion.current}
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">Suggested:</span>
                        <div className="bg-blue-50 p-1 rounded text-blue-700 mt-1 font-mono text-xs">
                          {suggestion.suggested}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 italic">💡 {suggestion.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Email optimized!</p>
          </div>
        )}
      </div>
    </Card>
  );
};
