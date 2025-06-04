
import { AnalyticsLogger } from '../core/interfaces';

export class ConsoleLogger implements AnalyticsLogger {
  constructor(private level: 'debug' | 'info' | 'warn' | 'error' = 'info') {}

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      console.log(`[ANALYTICS] ${message}`, context || '');
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      console.warn(`[ANALYTICS] ${message}`, context || '');
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      console.error(`[ANALYTICS] ${message}`, error || '', context || '');
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      console.debug(`[ANALYTICS] ${message}`, context || '');
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}
