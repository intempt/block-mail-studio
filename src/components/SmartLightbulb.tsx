
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, RefreshCw, CheckCircle } from 'lucide-react';
import { useEmailAnalysis } from '@/contexts/EmailAnalysisContext';
import { useContentChangeDetection } from '@/hooks/useContentChangeDetection';

interface SmartLightbulbProps {
  emailHTML: string;
  subjectLine: string;
  onAnalyze?: () => void;
  className?: string;
}

export const SmartLightbulb: React.FC<SmartLightbulbProps> = ({
  emailHTML,
  subjectLine,
  onAnalyze,
  className = ''
}) => {
  const { analysis, isAnalyzing, analyzeEmail, lastAnalyzed } = useEmailAnalysis();
  const { hasChanged, isStable, markAsAnalyzed } = useContentChangeDetection(
    emailHTML + subjectLine,
    { debounceMs: 2000, changeThreshold: 0.05 }
  );

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    
    await analyzeEmail({
      emailHTML,
      subjectLine,
      variant: 'comprehensive'
    });
    
    markAsAnalyzed();
    onAnalyze?.();
  };

  // Determine lightbulb state
  const getLightbulbState = () => {
    if (isAnalyzing) return 'analyzing';
    if (hasChanged && isStable && emailHTML.trim().length > 10) return 'suggestion';
    if (analysis && !hasChanged) return 'current';
    return 'idle';
  };

  const state = getLightbulbState();

  // Get visual styles based on state
  const getButtonStyles = () => {
    switch (state) {
      case 'analyzing':
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg';
      case 'suggestion':
        return 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-lg animate-pulse border-2 border-yellow-300';
      case 'current':
        return 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'analyzing':
        return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'current':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTooltipText = () => {
    switch (state) {
      case 'analyzing':
        return 'AI is analyzing your email...';
      case 'suggestion':
        return 'Content has changed - click to analyze with AI';
      case 'current':
        return 'Analysis is up to date';
      default:
        return 'Analyze email with AI';
    }
  };

  const getSuggestionCount = () => {
    if (!analysis?.suggestions) return 0;
    return analysis.suggestions.filter(s => s.impact === 'high').length;
  };

  const isDisabled = isAnalyzing || (!hasChanged && !isStable) || emailHTML.trim().length < 10;

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={handleAnalyze}
        disabled={isDisabled}
        className={`relative transition-all duration-300 ${getButtonStyles()}`}
        title={getTooltipText()}
        size="sm"
      >
        {getIcon()}
        <span className="ml-2">
          {state === 'analyzing' ? 'Analyzing...' : 'AI Analysis'}
        </span>
        
        {/* Suggestion count badge */}
        {state === 'current' && getSuggestionCount() > 0 && (
          <Badge className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5">
            {getSuggestionCount()}
          </Badge>
        )}
      </Button>

      {/* Glowing effect for suggestion state */}
      {state === 'suggestion' && (
        <div className="absolute inset-0 rounded-md bg-yellow-400 opacity-30 animate-ping" />
      )}
    </div>
  );
};
