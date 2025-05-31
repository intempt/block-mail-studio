
import React, { useState, useEffect } from 'react';
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
  Shield,
  Smartphone,
  FileCheck,
  Eye,
  Layout,
  User,
  AlertTriangle
} from 'lucide-react';
import { CriticalEmailAnalysisService, CriticalSuggestion } from '@/services/criticalEmailAnalysisService';

interface CompactAISuggestionsProps {
  emailHTML?: string;
  subjectLine?: string;
  isLoading?: boolean;
  onApplySuggestion?: (suggestion: CriticalSuggestion) => void;
  onRefresh?: () => void;
}

export const CompactAISuggestions: React.FC<CompactAISuggestionsProps> = ({
  emailHTML = '',
  subjectLine = '',
  isLoading = false,
  onApplySuggestion,
  onRefresh
}) => {
  const [suggestions, setSuggestions] = useState<CriticalSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);

  const analyzeCriticalIssues = async () => {
    if (!emailHTML.trim()) {
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);
    try {
      const criticalSuggestions = await CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine);
      setSuggestions(criticalSuggestions);
    } catch (error) {
      console.error('Critical analysis failed:', error);
      setSuggestions([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefresh = () => {
    CriticalEmailAnalysisService.clearCache();
    onRefresh?.();
    analyzeCriticalIssues();
  };

  // Auto-analyze when content changes
  useEffect(() => {
    if (emailHTML.trim().length > 50) {
      analyzeCriticalIssues();
    }
  }, [emailHTML, subjectLine]);

  const getTypeIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-3 h-3" />;
      case 'deliverability': return <Shield className="w-3 h-3" />;
      case 'cta': return <Zap className="w-3 h-3" />;
      case 'mobile': return <Smartphone className="w-3 h-3" />;
      case 'compliance': return <FileCheck className="w-3 h-3" />;
      case 'accessibility': return <Eye className="w-3 h-3" />;
      case 'structure': return <Layout className="w-3 h-3" />;
      case 'personalization': return <User className="w-3 h-3" />;
      case 'tone': return <Brain className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const criticalSuggestions = suggestions.filter(s => s.severity === 'critical' && !s.applied);
  const highSuggestions = suggestions.filter(s => s.severity === 'high' && !s.applied);
  const appliedCount = suggestions.filter(s => s.applied).length;

  const applyAllCritical = () => {
    criticalSuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));
    });
  };

  const applyAllHigh = () => {
    highSuggestions.forEach(suggestion => {
      onApplySuggestion?.(suggestion);
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));
    });
  };

  const handleApplySuggestion = (suggestion: CriticalSuggestion) => {
    onApplySuggestion?.(suggestion);
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ));
  };

  if (isAnalyzing || isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
          <span className="text-sm text-gray-600">AI analyzing email for critical issues...</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            AI Critical Analysis
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
              {criticalSuggestions.length > 0 && (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Critical Email Issues</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isAnalyzing}
                className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Refresh
              </Button>
              {suggestions.length > 0 && (
                <>
                  <Badge variant="outline" className="text-xs">
                    {suggestions.length - appliedCount} issues
                  </Badge>
                  {criticalSuggestions.length > 0 && (
                    <Badge className="text-xs bg-red-100 text-red-700">
                      {criticalSuggestions.length} critical
                    </Badge>
                  )}
                  {appliedCount > 0 && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      {appliedCount} fixed
                    </Badge>
                  )}
                </>
              )}
            </div>

            {criticalSuggestions.length > 0 && (
              <Button
                onClick={applyAllCritical}
                size="sm"
                className="h-6 px-3 text-xs bg-red-600 hover:bg-red-700"
              >
                Fix All Critical ({criticalSuggestions.length})
              </Button>
            )}

            {highSuggestions.length > 0 && (
              <Button
                onClick={applyAllHigh}
                size="sm"
                className="h-6 px-3 text-xs bg-orange-600 hover:bg-orange-700"
              >
                Fix All High ({highSuggestions.length})
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-1">
            {suggestions.slice(0, isExpanded ? suggestions.length : 6).map((suggestion) => (
              <SuggestionChip 
                key={suggestion.id} 
                suggestion={suggestion} 
                onApply={handleApplySuggestion}
                hoveredSuggestion={hoveredSuggestion}
                setHoveredSuggestion={setHoveredSuggestion}
                getTypeIcon={getTypeIcon}
              />
            ))}
            {suggestions.length > 6 && (
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
                    +{suggestions.length - 6} more
                  </>
                )}
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const SuggestionChip: React.FC<{
  suggestion: CriticalSuggestion;
  onApply: (suggestion: CriticalSuggestion) => void;
  hoveredSuggestion: string | null;
  setHoveredSuggestion: (id: string | null) => void;
  getTypeIcon: (category: string) => React.ReactNode;
}> = ({ suggestion, onApply, hoveredSuggestion, setHoveredSuggestion, getTypeIcon }) => {
  const getSeverityColor = () => CriticalEmailAnalysisService.getSeverityColor(suggestion.severity);

  return (
    <div
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
        suggestion.applied 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : `bg-white border-gray-200 hover:shadow-sm ${getSeverityColor()}`
      }`}
      onMouseEnter={() => setHoveredSuggestion(suggestion.id)}
      onMouseLeave={() => setHoveredSuggestion(null)}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {getTypeIcon(suggestion.category)}
        <span className="text-xs font-medium truncate max-w-32">
          {suggestion.title}
        </span>
        <Badge variant="outline" className="text-xs px-1 py-0">
          {suggestion.severity}
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
              onClick={() => onApply(suggestion)}
              size="sm"
              className={`h-5 px-2 text-xs ${
                suggestion.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                suggestion.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {suggestion.autoFixable ? 'Auto-Fix' : 'Apply'}
            </Button>
          </>
        ) : (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
      </div>

      {hoveredSuggestion === suggestion.id && !suggestion.applied && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-80 max-w-96">
          <div className="space-y-2">
            <div className="text-xs">
              <span className="font-medium text-gray-700">Issue:</span>
              <div className="bg-gray-50 p-2 rounded mt-1 text-gray-600 font-mono text-xs">
                {suggestion.current}
              </div>
            </div>
            <div className="text-xs">
              <span className="font-medium text-blue-700">Suggested Fix:</span>
              <div className="bg-blue-50 p-2 rounded mt-1 text-blue-700 font-mono text-xs">
                {suggestion.suggested}
              </div>
            </div>
            <div className="text-xs text-gray-600 italic">
              💡 {suggestion.reason}
            </div>
            <div className="text-xs text-green-600 font-medium">
              📈 {suggestion.businessImpact}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
