
import { useCallback, useState } from 'react';
import { EmailBlock, EmailTemplate } from '@/types/emailBlocks';
import { MJMLTemplateGenerator } from '@/services/MJMLTemplateGenerator';

export interface MJMLExportResult {
  mjml: string;
  errors?: any[];
}

export interface MJMLExportHook {
  exportToMJML: (blocks: EmailBlock[], subject: string, settings?: any) => Promise<MJMLExportResult>;
  exportToHTML: (blocks: EmailBlock[], subject: string, settings?: any) => { html: string; errors: any[] };
  downloadMJML: (content: string, filename: string) => void;
  downloadHTML: (content: string, filename: string) => void;
  isExporting: boolean;
}

export const useMJMLExport = (): MJMLExportHook => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToMJML = useCallback(async (blocks: EmailBlock[], subject: string, settings?: any): Promise<MJMLExportResult> => {
    setIsExporting(true);
    
    try {
      const template: EmailTemplate = {
        id: `temp_${Date.now()}`,
        name: 'Export Template',
        description: 'Exported template',
        subject,
        blocks,
        category: 'Export',
        tags: ['export'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        usageCount: 0,
        settings
      };
      
      const mjmlContent = MJMLTemplateGenerator.generateMJML(template);
      
      return {
        mjml: mjmlContent,
        errors: []
      };
    } catch (error) {
      console.error('MJML export error:', error);
      return {
        mjml: '',
        errors: [error]
      };
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportToHTML = useCallback((blocks: EmailBlock[], subject: string, settings?: any): { html: string; errors: any[] } => {
    const template: EmailTemplate = {
      id: `temp_${Date.now()}`,
      name: 'Export Template',
      description: 'Exported template',
      subject,
      blocks,
      category: 'Export',
      tags: ['export'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      usageCount: 0,
      settings
    };
    
    return MJMLTemplateGenerator.generateHTML(template);
  }, []);

  const downloadMJML = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const downloadHTML = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return { 
    exportToMJML, 
    exportToHTML, 
    downloadMJML, 
    downloadHTML, 
    isExporting 
  };
};
