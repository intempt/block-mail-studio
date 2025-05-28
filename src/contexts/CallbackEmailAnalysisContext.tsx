
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CallbackEmailAnalysisService, AnalysisRequest, AnalysisResult } from '@/services/CallbackEmailAnalysisService';

interface CallbackEmailAnalysisContextType {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  lastAnalyzed: Date | null;
  error: string | null;
  progress: { stage: string; progress: number } | null;
  
  // Callback-based actions
  analyzeEmailAsync: (request: AnalysisRequest) => void;
  cancelAnalysis: () => void;
  clearAnalysis: () => void;
}

const CallbackEmailAnalysisContext = createContext<CallbackEmailAnalysisContextType | undefined>(undefined);

interface CallbackEmailAnalysisProviderProps {
  children: React.ReactNode;
}

export const CallbackEmailAnalysisProvider: React.FC<CallbackEmailAnalysisProviderProps> = ({ children }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ stage: string; progress: number } | null>(null);
  
  const cancelFunctionRef = useRef<(() => void) | null>(null);

  const analyzeEmailAsync = useCallback((request: AnalysisRequest) => {
    // Cancel any existing analysis
    if (cancelFunctionRef.current) {
      cancelFunctionRef.current();
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress({ stage: 'Preparing...', progress: 0 });

    // Start analysis with callbacks
    const cancelFn = CallbackEmailAnalysisService.analyzeEmailAsync(
      request,
      (result, errorMsg) => {
        setIsAnalyzing(false);
        setProgress(null);
        
        if (errorMsg) {
          setError(errorMsg);
        } else if (result) {
          setAnalysis(result);
          setLastAnalyzed(new Date());
          setError(null);
        }
      },
      (stage, progressValue) => {
        setProgress({ stage, progress: progressValue });
      }
    );

    cancelFunctionRef.current = cancelFn;
  }, []);

  const cancelAnalysis = useCallback(() => {
    if (cancelFunctionRef.current) {
      cancelFunctionRef.current();
      cancelFunctionRef.current = null;
    }
    setIsAnalyzing(false);
    setProgress(null);
  }, []);

  const clearAnalysis = useCallback(() => {
    cancelAnalysis();
    setAnalysis(null);
    setLastAnalyzed(null);
    setError(null);
    CallbackEmailAnalysisService.clearCache();
  }, [cancelAnalysis]);

  const value: CallbackEmailAnalysisContextType = {
    analysis,
    isAnalyzing,
    lastAnalyzed,
    error,
    progress,
    analyzeEmailAsync,
    cancelAnalysis,
    clearAnalysis
  };

  return (
    <CallbackEmailAnalysisContext.Provider value={value}>
      {children}
    </CallbackEmailAnalysisContext.Provider>
  );
};

export const useCallbackEmailAnalysis = (): CallbackEmailAnalysisContextType => {
  const context = useContext(CallbackEmailAnalysisContext);
  if (context === undefined) {
    throw new Error('useCallbackEmailAnalysis must be used within a CallbackEmailAnalysisProvider');
  }
  return context;
};
