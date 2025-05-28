
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ComprehensiveEmailAnalysis, AnalysisRequest, MasterEmailAnalysisService } from '@/services/MasterEmailAnalysisService';

interface EmailAnalysisContextType {
  analysis: ComprehensiveEmailAnalysis | null;
  isAnalyzing: boolean;
  lastAnalyzed: Date | null;
  error: string | null;
  
  // Actions
  analyzeEmail: (request: AnalysisRequest) => Promise<void>;
  refreshAnalysis: () => Promise<void>;
  clearAnalysis: () => void;
  
  // Current request tracking
  currentRequest: AnalysisRequest | null;
}

const EmailAnalysisContext = createContext<EmailAnalysisContextType | undefined>(undefined);

interface EmailAnalysisProviderProps {
  children: React.ReactNode;
}

export const EmailAnalysisProvider: React.FC<EmailAnalysisProviderProps> = ({ children }) => {
  const [analysis, setAnalysis] = useState<ComprehensiveEmailAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<AnalysisRequest | null>(null);

  const analyzeEmail = useCallback(async (request: AnalysisRequest) => {
    // Don't re-analyze if the same request is already being processed
    if (isAnalyzing && currentRequest && 
        currentRequest.emailHTML === request.emailHTML && 
        currentRequest.subjectLine === request.subjectLine) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setCurrentRequest(request);

    try {
      const result = await MasterEmailAnalysisService.analyzeEmail(request);
      setAnalysis(result);
      setLastAnalyzed(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('Email analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, currentRequest]);

  const refreshAnalysis = useCallback(async () => {
    if (!currentRequest) return;
    
    MasterEmailAnalysisService.clearCache();
    await analyzeEmail(currentRequest);
  }, [currentRequest, analyzeEmail]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setLastAnalyzed(null);
    setError(null);
    setCurrentRequest(null);
    MasterEmailAnalysisService.clearCache();
  }, []);

  const value: EmailAnalysisContextType = {
    analysis,
    isAnalyzing,
    lastAnalyzed,
    error,
    analyzeEmail,
    refreshAnalysis,
    clearAnalysis,
    currentRequest
  };

  return (
    <EmailAnalysisContext.Provider value={value}>
      {children}
    </EmailAnalysisContext.Provider>
  );
};

export const useEmailAnalysis = (): EmailAnalysisContextType => {
  const context = useContext(EmailAnalysisContext);
  if (context === undefined) {
    throw new Error('useEmailAnalysis must be used within an EmailAnalysisProvider');
  }
  return context;
};
