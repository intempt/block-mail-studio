
import JSZip from 'jszip';
import { EmailBlock } from '@/types/emailBlocks';
import { MJMLTemplateGenerator } from './MJMLTemplateGenerator';

export interface ExportOptions {
  filename?: string;
  includeMetadata?: boolean;
  templateName?: string;
  templateDescription?: string;
}

export interface ExportMetadata {
  name: string;
  description: string;
  subject: string;
  exportDate: string;
  blockCount: number;
  blocks: EmailBlock[];
  version: string;
}

export class ZipExportService {
  static async createEmailTemplateZip(
    blocks: EmailBlock[],
    subject: string,
    globalStyles?: string,
    options: ExportOptions = {}
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Create template data
    const template = {
      subject,
      blocks,
      globalStyles,
      settings: {
        width: '600px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }
    };

    // Generate MJML content
    const mjmlContent = MJMLTemplateGenerator.generateMJML(template);
    
    // Generate HTML content
    const { html, errors } = MJMLTemplateGenerator.generateHTML(template);

    // Add MJML file
    zip.file('template.mjml', mjmlContent);
    
    // Add HTML file
    zip.file('template.html', html);

    // Add metadata if requested
    if (options.includeMetadata !== false) {
      const metadata: ExportMetadata = {
        name: options.templateName || 'Email Template',
        description: options.templateDescription || 'Exported email template',
        subject,
        exportDate: new Date().toISOString(),
        blockCount: blocks.length,
        blocks,
        version: '1.0.0'
      };
      
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    }

    // Add compilation errors if any
    if (errors.length > 0) {
      const errorReport = {
        errors,
        timestamp: new Date().toISOString(),
        note: 'These errors were encountered during MJML compilation'
      };
      zip.file('compilation-errors.json', JSON.stringify(errorReport, null, 2));
    }

    // Generate and return zip
    return await zip.generateAsync({ type: 'blob' });
  }

  static downloadZip(blob: Blob, filename: string = 'email-template.zip'): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportAndDownload(
    blocks: EmailBlock[],
    subject: string,
    globalStyles?: string,
    options: ExportOptions = {}
  ): Promise<void> {
    try {
      const zipBlob = await this.createEmailTemplateZip(blocks, subject, globalStyles, options);
      const filename = options.filename || 'email-template.zip';
      this.downloadZip(zipBlob, filename);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error.message}`);
    }
  }
}
