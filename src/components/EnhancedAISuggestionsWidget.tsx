
import React, { useState, useCallback, useEffect } from 'react';
import { CompactAISuggestions } from './CompactAISuggestions';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';
import { CentralizedAIAnalysisService, UnifiedAISuggestion } from '@/services/CentralizedAIAnalysisService';

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion?: (suggestion: UnifiedAISuggestion) => void;
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
  const [suggestions, setSuggestions] = useState<UnifiedAISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateRealAISuggestions = useCallback(async () => {
    if (!emailHTML || emailHTML.length < 50) {
      console.warn('EnhancedAI: Email content too short for analysis');
      setSuggestions([]);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      console.log('EnhancedAI: Starting real AI analysis...');
      
      // Get canvas blocks for contextual analysis
      const canvasBlocks = canvasRef?.current?.getBlocks() || [];
      
      // Run both complete analysis and contextual analysis
      const [completeAnalysis, contextualSuggestions] = await Promise.all([
        CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine),
        CentralizedAIAnalysisService.generateContextualSuggestions(canvasBlocks, subjectLine)
      ]);
      
      // Convert complete analysis to suggestions
      const analysisBasedSuggestions = CentralizedAIAnalysisService.convertToUnifiedSuggestions(
        completeAnalysis, 
        emailHTML
      );
      
      // Combine and deduplicate suggestions
      const allSuggestions = [...analysisBasedSuggestions, ...contextualSuggestions];
      const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
        index === self.findIndex(s => s.title === suggestion.title || s.current === suggestion.current)
      );
      
      // Sort by impact and confidence
      const sortedSuggestions = uniqueSuggestions.sort((a, b) => {
        const impactOrder = { high: 3, medium: 2, low: 1 };
        const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
        if (impactDiff !== 0) return impactDiff;
        return b.confidence - a.confidence;
      });
      
      setSuggestions(sortedSuggestions.slice(0, 6)); // Limit to top 6 suggestions
      console.log('EnhancedAI: Generated', sortedSuggestions.length, 'real AI suggestions');
      
    } catch (error) {
      console.error('EnhancedAI: Failed to generate suggestions:', error);
      
      // Fallback to contextual suggestions only
      try {
        const canvasBlocks = canvasRef?.current?.getBlocks() || [];
        const contextualSuggestions = await CentralizedAIAnalysisService.generateContextualSuggestions(
          canvasBlocks, 
          subjectLine
        );
        setSuggestions(contextualSuggestions.slice(0, 4));
        console.log('EnhancedAI: Used contextual fallback suggestions');
      } catch (fallbackError) {
        console.error('EnhancedAI: Fallback also failed:', fallbackError);
        setSuggestions([]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine, canvasRef]);

  // Auto-generate suggestions when content changes
  useEffect(() => {
    if (emailHTML && emailHTML.length > 50) {
      const timer = setTimeout(() => {
        generateRealAISuggestions();
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [emailHTML, subjectLine, generateRealAISuggestions]);

  const applySuggestion = async (suggestion: UnifiedAISuggestion) => {
    try {
      console.log('EnhancedAI: Applying suggestion:', suggestion.title);
      
      if (!canvasRef?.current) {
        console.warn('EnhancedAI: No canvas reference available');
        return;
      }

      // Apply suggestion based on type
      switch (suggestion.type) {
        case 'subject':
          if (onSubjectLineChange) {
            onSubjectLineChange(suggestion.suggested);
          } else {
            canvasRef.current.updateSubjectLine(suggestion.suggested);
          }
          break;
          
        case 'copy':
        case 'tone':
          if (suggestion.blockId && canvasRef.current.updateBlockContent) {
            // Update specific block if we have block ID
            canvasRef.current.updateBlockContent(suggestion.blockId, {
              html: `<p>${suggestion.suggested}</p>`
            });
          } else {
            // Fallback to text replacement
            canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
          }
          break;
          
        case 'cta':
          if (suggestion.blockId && canvasRef.current.updateBlockContent) {
            // Update specific button block
            canvasRef.current.updateBlockContent(suggestion.blockId, {
              text: suggestion.suggested
            });
          } else {
            // Fallback to text replacement
            canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
          }
          break;
          
        case 'design':
          if (suggestion.blockId && suggestion.styleChanges && canvasRef.current.updateBlockStyle) {
            canvasRef.current.updateBlockStyle(suggestion.blockId, suggestion.styleChanges);
          }
          break;
          
        default:
          console.warn('EnhancedAI: Unknown suggestion type:', suggestion.type);
          // Generic fallback
          canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
      }

      // Mark as applied
      setSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));

      // Notify parent component
      onApplySuggestion?.(suggestion);
      
      console.log('EnhancedAI: Successfully applied suggestion:', suggestion.title);
      
    } catch (error) {
      console.error('EnhancedAI: Failed to apply suggestion:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <CompactAISuggestions
      suggestions={suggestions}
      isLoading={isAnalyzing}
      onApplySuggestion={applySuggestion}
      onRefresh={generateRealAISuggestions}
    />
  );
};
