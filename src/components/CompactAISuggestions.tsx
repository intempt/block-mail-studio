
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  CheckCircle,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Brain,
  Type,
  Palette,
  Wand2
} from 'lucide-react';

interface CompactSuggestion {
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

interface CompactAISuggestionsProps {
  suggestions: CompactSuggestion[];
  isLoading?: boolean;
  onApplySuggestion?: (suggestion: CompactSuggestion) => void;
  onRefresh?: () => void;
}

export const CompactAISuggestions: React.FC<CompactAISuggestionsProps> = ({
  suggestions,
  isLoading = false,
  onApplySuggestion,
  onRefresh
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subject': return <Target className="w-3 h-3" />;
      case 'cta': return <Zap className="w-3 h-3" />;
      case 'copy': return <Type className="w-3 h-3" />;
      case 'tone': return <Brain className="w-3 h-3" />;
      case 'design': return <Palette className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const highPrioritySuggestions = suggestions.filter(s => s.impact === 'high' && !s.applied);
  const otherSuggestions = suggestions.filter(s => s.impact !== 'high' && !s.applied);
  const appliedCount = suggestions.filter(s => s.applied).length;

  const applyAllHighPriority = () => {
    highPrioritySuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
    });
  };

  const visibleSuggestions = isExpanded ? suggestions : suggestions.slice(0, 4);

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
          <span className="text-sm text-gray-600">Analyzing for AI suggestions...</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">All optimizations applied!</span>
          <Button variant="ghost" size="sm" onClick={onRefresh} className="ml-auto h-6">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">AI Suggestions</span>
              <Badge variant="outline" className="text-xs">
                {suggestions.length - appliedCount} pending
              </Badge>
              {appliedCount > 0 && (
                <Badge className="text-xs bg-green-100 text-green-700">
                  {appliedCount} applied
                </Badge>
              )}
            </div>

            {highPrioritySuggestions.length > 0 && (
              <Button
                onClick={applyAllHighPriority}
                size="sm"
                className="h-6 px-3 text-xs bg-red-600 hover:bg-red-700"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Apply All High Priority ({highPrioritySuggestions.length})
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {suggestions.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 px-2 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show All ({suggestions.length})
                  </>
                )}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-6 px-2">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Horizontal Suggestion Chips */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-1">
            {visibleSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  suggestion.applied 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : `bg-white border-gray-200 hover:shadow-sm ${getImpactColor(suggestion.impact)}`
                }`}
                onMouseEnter={() => setHoveredSuggestion(suggestion.id)}
                onMouseLeave={() => setHoveredSuggestion(null)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {getTypeIcon(suggestion.type)}
                  <span className="text-xs font-medium truncate max-w-32">
                    {suggestion.title}
                  </span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {suggestion.impact}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {suggestion.confidence}%
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {!suggestion.applied ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                        className="h-4 w-4 p-0 hover:bg-gray-200"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </Button>
                      <Button
                        onClick={() => onApplySuggestion?.(suggestion)}
                        size="sm"
                        className="h-5 px-2 text-xs bg-purple-600 hover:bg-purple-700"
                      >
                        Apply
                      </Button>
                    </>
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredSuggestion === suggestion.id && !suggestion.applied && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-80 max-w-96">
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="font-medium text-gray-700">Current:</span>
                        <div className="bg-gray-50 p-2 rounded mt-1 text-gray-600 font-mono text-xs">
                          {suggestion.current}
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-blue-700">Suggested:</span>
                        <div className="bg-blue-50 p-2 rounded mt-1 text-blue-700 font-mono text-xs">
                          {suggestion.suggested}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 italic">
                        💡 {suggestion.reason}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
