import { useCallback } from 'react';
import { EmailBlock, EmailTemplate } from '@/types/emailBlocks';
import { MJMLTemplateGenerator } from '@/services/MJMLTemplateGenerator';

export interface MJMLExportHook {
  exportToMJML: (blocks: EmailBlock[], subject: string, settings?: any) => string;
  exportToHTML: (blocks: EmailBlock[], subject: string, settings?: any) => { html: string; errors: any[] };
}

export const useMJMLExport = (): MJMLExportHook => {
  const exportToMJML = useCallback((blocks: EmailBlock[], subject: string, settings?: any): string => {
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
    
    return MJMLTemplateGenerator.generateMJML(template);
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

  return { exportToMJML, exportToHTML };
};
