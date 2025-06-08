
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { DirectAIService } from '@/services/directAIService';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';
import { CompatibilityBoard } from '@/components/CompatibilityBoard';
import { AnalysisHeader } from '@/components/performance/AnalysisHeader';
import { PerformanceScores } from '@/components/performance/PerformanceScores';
import { TechnicalMetrics } from '@/components/performance/TechnicalMetrics';
import { AccessibilityIssues } from '@/components/performance/AccessibilityIssues';
import { OptimizationSuggestions } from '@/components/performance/OptimizationSuggestions';
import { EmptyAnalysisState } from '@/components/performance/EmptyAnalysisState';

interface EnhancedPerformanceAnalyzerProps {
  emailHTML: string;
  subjectLine: string;
  onOptimize?: (suggestion: string) => void;
}

export const EnhancedPerformanceAnalyzer: React.FC<EnhancedPerformanceAnalyzerProps> = ({
  emailHTML,
  subjectLine,
  onOptimize
}) => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  const runAnalysis = useCallback(async () => {
    if (!emailHTML.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Direct performance analysis...');
      
      const result = await DirectAIService.analyzePerformance(emailHTML, subjectLine);
      console.log('Direct performance analysis completed:', result);
      
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setAnalysis(null);
        console.log("Analysis Failed. Unable to analyze email performance. Please try again.");
      }
    } catch (error) {
      console.error('Error analyzing performance:', error);
      console.log("Analysis Failed. Unable to analyze email performance. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  // Auto-analyze when content changes
  useEffect(() => {
    if (!autoAnalyze) return;

    const timer = setTimeout(() => {
      if (emailHTML.trim()) {
        runAnalysis();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [emailHTML, subjectLine, autoAnalyze, runAnalysis]);

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <Card className="p-4">
        <AnalysisHeader
          autoAnalyze={autoAnalyze}
          isAnalyzing={isAnalyzing}
          onAutoAnalyzeToggle={() => setAutoAnalyze(!autoAnalyze)}
          onRunAnalysis={runAnalysis}
        />

        {/* Overall Scores */}
        {analysis && <PerformanceScores analysis={analysis} />}

        {/* Loading/Empty State */}
        {(!analysis || isAnalyzing) && (
          <EmptyAnalysisState autoAnalyze={autoAnalyze} isAnalyzing={isAnalyzing} />
        )}
      </Card>

      {/* Email Provider Compatibility */}
      {emailHTML.trim() && (
        <CompatibilityBoard
          emailHTML={emailHTML}
          subjectLine={subjectLine}
          autoAnalyze={autoAnalyze}
        />
      )}

      {/* Detailed Metrics */}
      {analysis && <TechnicalMetrics analysis={analysis} />}

      {/* Accessibility Issues */}
      {analysis && <AccessibilityIssues analysis={analysis} />}

      {/* Optimization Suggestions */}
      {analysis && <OptimizationSuggestions analysis={analysis} onOptimize={onOptimize} />}
    </div>
  );
};
