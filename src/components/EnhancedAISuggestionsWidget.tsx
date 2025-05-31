
import React from 'react';
import { CompactAISuggestions } from './CompactAISuggestions';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';
import { CriticalSuggestion } from '@/services/criticalEmailAnalysisService';

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: CriticalSuggestion) => void;
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
  const applySuggestion = async (suggestion: CriticalSuggestion) => {
    try {
      if (suggestion.type === 'subject' && onSubjectLineChange) {
        onSubjectLineChange(suggestion.suggested);
      } else if (canvasRef?.current) {
        switch (suggestion.type) {
          case 'copy':
          case 'cta':
          case 'tone':
          case 'structure':
          case 'accessibility':
            canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            break;
        }
      }

      onApplySuggestion?.(suggestion);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <CompactAISuggestions
      emailHTML={emailHTML}
      subjectLine={subjectLine}
      onApplySuggestion={applySuggestion}
    />
  );
};
