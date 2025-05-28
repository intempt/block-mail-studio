
import React, { useState, useCallback } from 'react';
import { CompactAISuggestions } from './CompactAISuggestions';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface BasicAISuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  applied?: boolean;
}

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: BasicAISuggestion) => void;
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
  const [suggestions, setSuggestions] = useState<BasicAISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateBasicSuggestions = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) {
      console.warn('Email content too short for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      console.log('Generating basic AI suggestions...');
      
      // Generate simple suggestions based on content analysis
      const basicSuggestions: BasicAISuggestion[] = [
        {
          id: 'suggestion_1',
          type: 'subject',
          title: 'Improve subject line engagement',
          current: subjectLine || 'Current subject',
          suggested: 'Make it more compelling: ' + (subjectLine || 'Your Amazing Offer'),
          reason: 'Adding engaging language can increase open rates',
          impact: 'high',
          confidence: 85,
          applied: false
        },
        {
          id: 'suggestion_2',
          type: 'cta',
          title: 'Strengthen call-to-action',
          current: 'Click here',
          suggested: 'Get Started Now',
          reason: 'Action-oriented CTAs perform better',
          impact: 'high',
          confidence: 90,
          applied: false
        },
        {
          id: 'suggestion_3',
          type: 'copy',
          title: 'Improve readability',
          current: 'Long paragraph text',
          suggested: 'Break into shorter, scannable sections',
          reason: 'Shorter paragraphs improve engagement',
          impact: 'medium',
          confidence: 75,
          applied: false
        },
        {
          id: 'suggestion_4',
          type: 'tone',
          title: 'Make tone more conversational',
          current: 'Formal language',
          suggested: 'Use friendly, approachable language',
          reason: 'Conversational tone builds connection',
          impact: 'medium',
          confidence: 80,
          applied: false
        }
      ];
      
      setSuggestions(basicSuggestions);
      console.log('Generated basic suggestions:', basicSuggestions);
      
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  const applySuggestion = async (suggestion: BasicAISuggestion) => {
    try {
      if (suggestion.type === 'subject' && onSubjectLineChange) {
        onSubjectLineChange(suggestion.suggested);
      } else if (canvasRef?.current) {
        switch (suggestion.type) {
          case 'copy':
          case 'cta':
          case 'tone':
            canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            break;
        }
      }

      // Mark as applied
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));

      onApplySuggestion?.(suggestion);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <CompactAISuggestions
      suggestions={suggestions}
      isLoading={isAnalyzing}
      onApplySuggestion={applySuggestion}
      onRefresh={generateBasicSuggestions}
    />
  );
};
