
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Wand2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { UnifiedAISuggestion, CompleteAnalysisResult } from '@/services/CentralizedAIAnalysisService';

interface CompactAISuggestionsProps {
  suggestions: UnifiedAISuggestion[];
  isLoading?: boolean;
  onApplySuggestion?: (suggestion: UnifiedAISuggestion) => void;
  onRefresh?: () => void;
  analysisResult?: CompleteAnalysisResult | null;
}

export const CompactAISuggestions: React.FC<CompactAISuggestionsProps> = ({
  suggestions,
  isLoading = false,
  onApplySuggestion,
  onRefresh,
  analysisResult
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('suggestions');

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
      case 'performance': return <TrendingUp className="w-3 h-3" />;
      case 'optimization': return <Wand2 className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  // Group suggestions by category
  const suggestionsByCategory = {
    brandVoice: suggestions.filter(s => s.category === 'brandVoice'),
    performance: suggestions.filter(s => s.category === 'performance'),
    variants: suggestions.filter(s => s.category === 'variants'),
    optimization: suggestions.filter(s => s.category === 'optimization')
  };

  const highPrioritySuggestions = suggestions.filter(s => s.impact === 'high' && !s.applied);
  const appliedCount = suggestions.filter(s => s.applied).length;

  const applyAllHighPriority = () => {
    highPrioritySuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
          <span className="text-sm text-gray-600">Running complete AI analysis...</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && !analysisResult) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-gray-600">Click to run complete AI analysis</span>
          <Button variant="outline" size="sm" onClick={onRefresh} className="ml-auto h-6">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analyze
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
              <span className="text-sm font-medium">Complete AI Analysis</span>
              {suggestions.length > 0 && (
                <>
                  <Badge variant="outline" className="text-xs">
                    {suggestions.length - appliedCount} pending
                  </Badge>
                  {appliedCount > 0 && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      {appliedCount} applied
                    </Badge>
                  )}
                </>
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
            {analysisResult && (
              <span className="text-xs text-gray-500">
                {(analysisResult.executionTime / 1000).toFixed(1)}s
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-6 px-2">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Show analysis results in tabs if we have comprehensive data */}
        {analysisResult && (suggestionsByCategory.brandVoice.length > 0 || suggestionsByCategory.performance.length > 0) ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-6 text-xs">
              <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
              <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
              <TabsTrigger value="optimization" className="text-xs">Optimize</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-2">
              <ScrollArea className="w-full max-h-32">
                <div className="flex gap-2 pb-1">
                  {suggestionsByCategory.brandVoice.map((suggestion) => (
                    <SuggestionChip 
                      key={suggestion.id} 
                      suggestion={suggestion} 
                      onApply={onApplySuggestion}
                      hoveredSuggestion={hoveredSuggestion}
                      setHoveredSuggestion={setHoveredSuggestion}
                      getImpactColor={getImpactColor}
                      getTypeIcon={getTypeIcon}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="variants" className="mt-2">
              <ScrollArea className="w-full max-h-32">
                <div className="flex gap-2 pb-1">
                  {suggestionsByCategory.variants.length > 0 ? (
                    suggestionsByCategory.variants.map((suggestion) => (
                      <SuggestionChip 
                        key={suggestion.id} 
                        suggestion={suggestion} 
                        onApply={onApplySuggestion}
                        hoveredSuggestion={hoveredSuggestion}
                        setHoveredSuggestion={setHoveredSuggestion}
                        getImpactColor={getImpactColor}
                        getTypeIcon={getTypeIcon}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 p-2">
                      {analysisResult.subjectVariants.length} subject line variants generated
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analytics" className="mt-2">
              <div className="text-xs space-y-1">
                {analysisResult.brandVoice && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>Brand Voice: {analysisResult.brandVoice.brandVoiceScore}/100</div>
                    <div>Engagement: {analysisResult.brandVoice.engagementScore}/100</div>
                  </div>
                )}
                {analysisResult.performance && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>Performance: {analysisResult.performance.overallScore}/100</div>
                    <div>Mobile: {analysisResult.performance.mobileScore}/100</div>
                  </div>
                )}
                {analysisResult.errors.length > 0 && (
                  <div className="text-orange-600">{analysisResult.errors.length} warnings</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="mt-2">
              <ScrollArea className="w-full max-h-32">
                <div className="flex gap-2 pb-1">
                  {suggestionsByCategory.optimization.map((suggestion) => (
                    <SuggestionChip 
                      key={suggestion.id} 
                      suggestion={suggestion} 
                      onApply={onApplySuggestion}
                      hoveredSuggestion={hoveredSuggestion}
                      setHoveredSuggestion={setHoveredSuggestion}
                      getImpactColor={getImpactColor}
                      getTypeIcon={getTypeIcon}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          // Simple horizontal suggestion chips for basic results
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {suggestions.slice(0, isExpanded ? suggestions.length : 4).map((suggestion) => (
                <SuggestionChip 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  onApply={onApplySuggestion}
                  hoveredSuggestion={hoveredSuggestion}
                  setHoveredSuggestion={setHoveredSuggestion}
                  getImpactColor={getImpactColor}
                  getTypeIcon={getTypeIcon}
                />
              ))}
              {suggestions.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-7 px-2 text-xs whitespace-nowrap"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      +{suggestions.length - 4} more
                    </>
                  )}
                </Button>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

// Helper component for suggestion chips
const SuggestionChip: React.FC<{
  suggestion: UnifiedAISuggestion;
  onApply?: (suggestion: UnifiedAISuggestion) => void;
  hoveredSuggestion: string | null;
  setHoveredSuggestion: (id: string | null) => void;
  getImpactColor: (impact: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
}> = ({ suggestion, onApply, hoveredSuggestion, setHoveredSuggestion, getImpactColor, getTypeIcon }) => (
  <div
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
            onClick={() => onApply?.(suggestion)}
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
);
