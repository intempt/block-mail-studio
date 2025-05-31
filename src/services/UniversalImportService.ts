
import { HTMLImportService, ImportResult } from './HTMLImportService';
import { MJMLImportService } from './MJMLImportService';

export class UniversalImportService {
  static async importContent(content: string, filename?: string): Promise<ImportResult> {
    // Auto-detect format based on content and filename
    const format = this.detectFormat(content, filename);
    
    console.log(`Detected format: ${format} for file: ${filename || 'unknown'}`);
    
    switch (format) {
      case 'mjml':
        return await MJMLImportService.importMJML(content);
      case 'html':
        return await HTMLImportService.importHTML(content);
      default:
        return {
          blocks: [],
          errors: [`Unsupported format detected. Please provide HTML or MJML content.`],
          warnings: []
        };
    }
  }

  private static detectFormat(content: string, filename?: string): 'html' | 'mjml' | 'unknown' {
    // Check filename extension first
    if (filename) {
      const extension = filename.toLowerCase().split('.').pop();
      if (extension === 'mjml') return 'mjml';
      if (extension === 'html' || extension === 'htm') return 'html';
    }

    // Check content patterns
    const trimmedContent = content.trim().toLowerCase();
    
    // MJML detection
    if (trimmedContent.includes('<mjml') || 
        trimmedContent.includes('<mj-body') ||
        trimmedContent.includes('<mj-section') ||
        trimmedContent.includes('<mj-text') ||
        trimmedContent.includes('<mj-image') ||
        trimmedContent.includes('<mj-button')) {
      return 'mjml';
    }

    // HTML detection
    if (trimmedContent.includes('<!doctype html') ||
        trimmedContent.includes('<html') ||
        trimmedContent.includes('<body') ||
        trimmedContent.includes('<div') ||
        trimmedContent.includes('<table') ||
        trimmedContent.includes('<p>')) {
      return 'html';
    }

    // Default to HTML if uncertain but has HTML-like tags
    if (trimmedContent.includes('<') && trimmedContent.includes('>')) {
      return 'html';
    }

    return 'unknown';
  }

  static getSupportedFormats(): string[] {
    return ['HTML (.html, .htm)', 'MJML (.mjml)'];
  }

  static getMaxFileSize(): number {
    // 5MB limit
    return 5 * 1024 * 1024;
  }
}
