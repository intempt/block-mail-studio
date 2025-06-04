
export interface EmailContent {
  html: string;
  subjectLine: string;
  previewText?: string;
}

export interface ContentMetrics {
  sizeKB: number;
  wordCount: number;
  characterCount: number;
  imageCount: number;
  linkCount: number;
  ctaCount: number;
  subjectLineLength: number;
  previewTextLength: number;
}

export interface PerformanceScores {
  overallScore: number;
  deliverabilityScore: number;
  spamScore: number;
  mobileScore: number;
  accessibilityScore: number;
}

export interface EngagementPrediction {
  openRate: number;
  clickRate: number;
  conversionRate: number;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  content: EmailContent;
  metrics: ContentMetrics;
  scores: PerformanceScores;
  prediction: EngagementPrediction;
  suggestions: AnalyticsSuggestion[];
  metadata: {
    analysisMethod: 'ai' | 'heuristic' | 'hybrid';
    processingTimeMs: number;
    version: string;
  };
}

export interface AnalyticsSuggestion {
  id: string;
  type: 'performance' | 'accessibility' | 'engagement' | 'deliverability';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  estimatedImpact: number;
}

export interface AnalyticsEngine {
  analyze(content: EmailContent): Promise<Partial<AnalysisResult>>;
  getCapabilities(): string[];
  isHealthy(): Promise<boolean>;
}

export interface CacheStrategy {
  get(key: string): Promise<AnalysisResult | null>;
  set(key: string, result: AnalysisResult, ttlMs?: number): Promise<void>;
  clear(): Promise<void>;
  getStats(): Promise<{ hits: number; misses: number; size: number }>;
}

export interface AnalyticsLogger {
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
}

export interface AnalyticsConfig {
  ai: {
    provider: 'openai' | 'anthropic' | 'local';
    model: string;
    timeout: number;
    retries: number;
  };
  cache: {
    enabled: boolean;
    ttlMs: number;
    maxSize: number;
  };
  fallback: {
    enabled: boolean;
    useHeuristics: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    destination: 'console' | 'file' | 'remote';
  };
}
