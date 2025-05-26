
import React, { useState, useEffect, useCallback } from 'react';
import { CompactAISuggestions } from './CompactAISuggestions';
import { OpenAIEmailService } from '@/services/openAIEmailService';
import { ApiKeyService } from '@/services/apiKeyService';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface AISuggestion {
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

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: AISuggestion) => void;
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
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) return;
    
    setIsAnalyzing(true);
    
    try {
      const analysis = await OpenAIEmailService.analyzeBrandVoice({
        emailHTML,
        subjectLine
      });

      const newSuggestions: AISuggestion[] = analysis.suggestions.map((suggestion, index) => ({
        id: `suggestion_${index}_${Date.now()}`,
        type: suggestion.type as 'subject' | 'copy' | 'cta' | 'tone' | 'design',
        title: suggestion.title,
        current: suggestion.current,
        suggested: suggestion.suggested,
        reason: suggestion.reason,
        impact: suggestion.impact as 'high' | 'medium' | 'low',
        confidence: suggestion.confidence,
        applied: false
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Show mock suggestions for demo
      setSuggestions([
        {
          id: '1',
          type: 'subject',
          title: 'Add urgency',
          current: 'New Products Available',
          suggested: 'Limited Time: New Products Available',
          reason: 'Adding urgency can increase open rates by 15%',
          impact: 'high',
          confidence: 87,
          applied: false
        },
        {
          id: '2',
          type: 'cta',
          title: 'Stronger CTA',
          current: 'Click here',
          suggested: 'Shop Now & Save 20%',
          reason: 'Action-oriented CTAs with benefits perform better',
          impact: 'high',
          confidence: 92,
          applied: false
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  useEffect(() => {
    if (isOpen && emailHTML && emailHTML.length > 50) {
      analyzeContent();
    }
  }, [isOpen, analyzeContent]);

  const applySuggestion = async (suggestion: AISuggestion) => {
    try {
      if (suggestion.type === 'subject' && onSubjectLineChange) {
        onSubjectLineChange(suggestion.suggested);
      } else if (canvasRef?.current) {
        switch (suggestion.type) {
          case 'copy':
          case 'cta':
            canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            break;
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
      onRefresh={analyzeContent}
    />
  );
};
