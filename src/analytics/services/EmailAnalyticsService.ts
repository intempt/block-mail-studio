
import { 
  EmailContent, 
  AnalysisResult, 
  AnalyticsEngine, 
  CacheStrategy, 
  AnalyticsLogger,
  AnalyticsConfig 
} from '../core/interfaces';
import { HeuristicAnalysisEngine } from '../engines/HeuristicAnalysisEngine';
import { MemoryCacheStrategy } from '../infrastructure/MemoryCacheStrategy';
import { ConsoleLogger } from '../infrastructure/ConsoleLogger';
import { ConfigManager } from '../infrastructure/AnalyticsConfig';

export class EmailAnalyticsService {
  private engines: Map<string, AnalyticsEngine> = new Map();
  private cache: CacheStrategy;
  private logger: AnalyticsLogger;
  private config: AnalyticsConfig;

  constructor(
    cache?: CacheStrategy,
    logger?: AnalyticsLogger,
    config?: AnalyticsConfig
  ) {
    this.config = config || ConfigManager.getInstance().getConfig();
    this.cache = cache || new MemoryCacheStrategy();
    this.logger = logger || new ConsoleLogger(this.config.logging.level);
    
    // Register default engines
    this.registerEngine('heuristic', new HeuristicAnalysisEngine());
    
    this.logger.info('EmailAnalyticsService initialized', { 
      environment: ConfigManager.getInstance().getEnvironment(),
      cacheEnabled: this.config.cache.enabled
    });
  }

  registerEngine(name: string, engine: AnalyticsEngine): void {
    this.engines.set(name, engine);
    this.logger.info(`Registered analytics engine: ${name}`, { 
      capabilities: engine.getCapabilities() 
    });
  }

  async analyze(content: EmailContent, options?: { preferredEngine?: string; useCache?: boolean }): Promise<AnalysisResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(content);
    const useCache = options?.useCache ?? this.config.cache.enabled;

    this.logger.debug('Starting email analysis', { 
      subjectLength: content.subjectLine.length,
      htmlLength: content.html.length,
      useCache,
      preferredEngine: options?.preferredEngine
    });

    // Check cache first
    if (useCache) {
      try {
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          this.logger.info('Analysis result served from cache', { cacheKey });
          return cached;
        }
      } catch (error) {
        this.logger.warn('Cache retrieval failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Determine which engine to use
    const engineName = await this.selectEngine(options?.preferredEngine);
    const engine = this.engines.get(engineName);

    if (!engine) {
      throw new Error(`Analytics engine '${engineName}' not found`);
    }

    try {
      // Run analysis
      const partialResult = await engine.analyze(content);
      
      // Create complete result
      const result: AnalysisResult = {
        id: this.generateAnalysisId(),
        timestamp: new Date(),
        content,
        ...partialResult,
        metadata: {
          ...partialResult.metadata,
          processingTimeMs: Date.now() - startTime
        }
      } as AnalysisResult;

      // Cache the result
      if (useCache) {
        try {
          await this.cache.set(cacheKey, result, this.config.cache.ttlMs);
        } catch (error) {
          this.logger.warn('Failed to cache result', { error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      this.logger.info('Email analysis completed', {
        engineUsed: engineName,
        processingTimeMs: result.metadata.processingTimeMs,
        overallScore: result.scores?.overallScore
      });

      return result;

    } catch (error) {
      this.logger.error('Analysis failed', error instanceof Error ? error : new Error('Unknown error'), {
        engineUsed: engineName,
        processingTimeMs: Date.now() - startTime
      });

      // Fallback to heuristic analysis if enabled
      if (this.config.fallback.enabled && engineName !== 'heuristic') {
        this.logger.info('Falling back to heuristic analysis');
        return this.analyze(content, { ...options, preferredEngine: 'heuristic', useCache: false });
      }

      throw error;
    }
  }

  async getEngineStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};
    
    for (const [name, engine] of this.engines) {
      try {
        status[name] = await engine.isHealthy();
      } catch {
        status[name] = false;
      }
    }

    return status;
  }

  async getCacheStats() {
    return this.cache.getStats();
  }

  async clearCache(): Promise<void> {
    await this.cache.clear();
    this.logger.info('Analytics cache cleared');
  }

  private async selectEngine(preferred?: string): Promise<string> {
    if (preferred && this.engines.has(preferred)) {
      const engine = this.engines.get(preferred)!;
      const isHealthy = await engine.isHealthy();
      if (isHealthy) {
        return preferred;
      }
    }

    // Check engine health and select first available
    for (const [name, engine] of this.engines) {
      try {
        const isHealthy = await engine.isHealthy();
        if (isHealthy) {
          return name;
        }
      } catch {
        continue;
      }
    }

    throw new Error('No healthy analytics engines available');
  }

  private generateCacheKey(content: EmailContent): string {
    const hash = this.simpleHash(content.html + content.subjectLine);
    return `email_analysis_${hash}`;
  }

  private generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
