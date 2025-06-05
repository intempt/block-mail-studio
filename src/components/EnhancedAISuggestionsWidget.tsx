import React from 'react';
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
  // This component is now deprecated - functionality moved to CanvasStatus AI Analysis Center
  // Keeping for backward compatibility but rendering nothing
  console.log('EnhancedAISuggestionsWidget: Deprecated - use CanvasStatus AI Analysis Center instead');
  
  return null;
};
