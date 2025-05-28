
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { useCallbackEmailAnalysis } from '@/contexts/CallbackEmailAnalysisContext';
import { useContentChangeEvents } from '@/hooks/useContentChangeEvents';

interface SubtleLightbulbProps {
  emailHTML: string;
  subjectLine: string;
  onAnalyze?: () => void;
  className?: string;
}

export const SubtleLightbulb: React.FC<SubtleLightbulbProps> = ({
  emailHTML,
  subjectLine,
  onAnalyze,
  className = ''
}) => {
  const { analysis, isAnalyzing, analyzeEmailAsync, progress } = useCallbackEmailAnalysis();
  const [lightbulbState, setLightbulbState] = useState<'idle' | 'changed' | 'analyzing' | 'complete'>('idle');

  // Handle content changes with callbacks
  const handleContentChange = useCallback((hasChanged: boolean, isStable: boolean) => {
    if (isAnalyzing) return;
    
    if (hasChanged && isStable && emailHTML.trim().length > 10) {
      setLightbulbState('changed');
    } else if (analysis && !hasChanged) {
      setLightbulbState('complete');
    } else {
      setLightbulbState('idle');
    }
  }, [isAnalyzing, analysis, emailHTML]);

  const { markAsAnalyzed } = useContentChangeEvents(
    emailHTML + subjectLine,
    handleContentChange,
    { debounceMs: 1500, changeThreshold: 0.05 }
  );

  // Update state based on analysis progress
  useEffect(() => {
    if (isAnalyzing) {
      setLightbulbState('analyzing');
    }
  }, [isAnalyzing]);

  const handleAnalyze = useCallback(() => {
    if (isAnalyzing || emailHTML.trim().length < 10) return;
    
    analyzeEmailAsync({
      emailHTML,
      subjectLine,
      variant: 'quick'
    });
    
    markAsAnalyzed();
    onAnalyze?.();
  }, [isAnalyzing, emailHTML, subjectLine, analyzeEmailAsync, markAsAnalyzed, onAnalyze]);

  // Get subtle visual styles based on state
  const getButtonStyles = () => {
    switch (lightbulbState) {
      case 'analyzing':
        return 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm';
      case 'changed':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800 shadow-sm';
      case 'complete':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';
    }
  };

  const getIcon = () => {
    switch (lightbulbState) {
      case 'complete':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getTooltipText = () => {
    switch (lightbulbState) {
      case 'analyzing':
        return progress ? `${progress.stage} (${progress.progress}%)` : 'Analyzing...';
      case 'changed':
        return 'Content changed - click to analyze';
      case 'complete':
        return 'Analysis complete';
      default:
        return 'AI Analysis';
    }
  };

  const getSuggestionCount = () => {
    if (!analysis?.suggestions) return 0;
    return analysis.suggestions.filter(s => s.impact === 'high').length;
  };

  const isDisabled = emailHTML.trim().length < 10;

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={handleAnalyze}
        disabled={isDisabled}
        variant="outline"
        size="sm"
        className={`transition-all duration-200 ${getButtonStyles()}`}
        title={getTooltipText()}
      >
        <div className={`flex items-center gap-2 ${isAnalyzing ? 'animate-pulse' : ''}`}>
          {getIcon()}
          <span className="text-sm">AI</span>
          
          {/* Subtle suggestion count */}
          {lightbulbState === 'complete' && getSuggestionCount() > 0 && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4 min-w-4">
              {getSuggestionCount()}
            </Badge>
          )}
        </div>
      </Button>

      {/* Very subtle glow for content changed state */}
      {lightbulbState === 'changed' && (
        <div className="absolute inset-0 rounded border border-yellow-300 opacity-50 pointer-events-none" />
      )}
    </div>
  );
};
