
import { EmailBlock } from '@/types/emailBlocks';
import { MJMLParser } from './MJMLParser';
import { HTMLParser } from './HTMLParser';

export interface ImportResult {
  blocks: EmailBlock[];
  subject?: string;
  errors: string[];
  warnings: string[];
}

export class EmailImportService {
  static async importFromFile(file: File): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      if (fileExtension === 'mjml') {
        return this.importFromMJML(content);
      } else if (fileExtension === 'html' || fileExtension === 'htm') {
        return this.importFromHTML(content);
      } else {
        throw new Error('Unsupported file type. Please use .mjml or .html files.');
      }
    } catch (error) {
      return {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to import file'],
        warnings: []
      };
    }
  }

  static async importFromContent(content: string, type: 'mjml' | 'html'): Promise<ImportResult> {
    try {
      if (type === 'mjml') {
        return this.importFromMJML(content);
      } else {
        return this.importFromHTML(content);
      }
    } catch (error) {
      return {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to parse content'],
        warnings: []
      };
    }
  }

  private static readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static importFromMJML(content: string): ImportResult {
    try {
      const parser = new MJMLParser();
      return parser.parse(content);
    } catch (error) {
      return {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to parse MJML'],
        warnings: []
      };
    }
  }

  private static importFromHTML(content: string): ImportResult {
    try {
      const parser = new HTMLParser();
      return parser.parse(content);
    } catch (error) {
      return {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to parse HTML'],
        warnings: []
      };
    }
  }
}
