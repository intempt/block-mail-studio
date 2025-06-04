
import { AnalyticsConfig } from '../core/interfaces';

export const defaultConfig: AnalyticsConfig = {
  ai: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    timeout: 30000,
    retries: 2
  },
  cache: {
    enabled: true,
    ttlMs: 300000, // 5 minutes
    maxSize: 100
  },
  fallback: {
    enabled: true,
    useHeuristics: true
  },
  logging: {
    level: 'info',
    destination: 'console'
  }
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AnalyticsConfig = defaultConfig;

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  getEnvironment(): 'client' | 'server' {
    return this.isServerSide() ? 'server' : 'client';
  }
}
