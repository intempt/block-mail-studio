
import React, { useState, useCallback } from 'react';
import { CompactAISuggestions } from './CompactAISuggestions';
import { CentralizedAIAnalysisService, CompleteAnalysisResult, UnifiedAISuggestion } from '@/services/CentralizedAIAnalysisService';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: UnifiedAISuggestion) => void;
  triggerAnalysis?: boolean;
  onAnalysisTriggered?: () => void;
}

export const EnhancedAISuggestionsWidget: React.FC<EnhancedAISuggestionsWidgetProps> = ({
  isOpen,
  onToggle,
  emailHTML,
  subjectLine,
  canvasRef,
  onSubjectLineChange,
  onApplySuggestion,
  triggerAnalysis = false,
  onAnalysisTriggered
}) => {
  const [suggestions, setSuggestions] = useState<UnifiedAISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CompleteAnalysisResult | null>(null);

  const runCompleteAnalysis = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) {
      console.warn('Email content too short for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      console.log('Starting complete AI analysis...');
      const result = await CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine);
      
      const unifiedSuggestions = CentralizedAIAnalysisService.convertToUnifiedSuggestions(result);
      
      setSuggestions(unifiedSuggestions);
      setAnalysisResult(result);
      
      console.log('Complete analysis finished:', result);
      console.log('Generated suggestions:', unifiedSuggestions);
      
    } catch (error) {
      console.error('Complete AI analysis failed:', error);
      
      // Show demo suggestions for development
      const demoSuggestions: UnifiedAISuggestion[] = [
        {
          id: 'demo_1',
          type: 'subject',
          category: 'brandVoice',
          title: 'Add urgency to subject',
          current: subjectLine || 'Current subject',
          suggested: 'Limited Time: ' + (subjectLine || 'Your Amazing Offer'),
          reason: 'Adding urgency can increase open rates by 15%',
          impact: 'high',
          confidence: 87,
          applied: false
        },
        {
          id: 'demo_2',
          type: 'cta',
          category: 'brandVoice',
          title: 'Strengthen call-to-action',
          current: 'Click here',
          suggested: 'Get Started Now',
          reason: 'Action-oriented CTAs perform 23% better',
          impact: 'high',
          confidence: 92,
          applied: false
        },
        {
          id: 'demo_3',
          type: 'design',
          category: 'performance',
          title: 'Improve mobile layout',
          current: 'Current layout',
          suggested: 'Single column mobile-first design',
          reason: 'Mobile opens account for 70% of email opens',
          impact: 'medium',
          confidence: 78,
          applied: false
        }
      ];
      
      setSuggestions(demoSuggestions);
    } finally {
      setIsAnalyzing(false);
      onAnalysisTriggered?.();
    }
  }, [emailHTML, subjectLine, onAnalysisTriggered]);

  // Handle manual analysis trigger from parent
  React.useEffect(() => {
    if (triggerAnalysis && !isAnalyzing) {
      runCompleteAnalysis();
    }
  }, [triggerAnalysis, runCompleteAnalysis, isAnalyzing]);

  const applySuggestion = async (suggestion: UnifiedAISuggestion) => {
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
      onRefresh={runCompleteAnalysis}
      analysisResult={analysisResult}
    />
  );
};
