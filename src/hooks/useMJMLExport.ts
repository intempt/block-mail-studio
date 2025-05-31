
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { MJMLTemplateGenerator } from '@/services/MJMLTemplateGenerator';
import { MJMLValidator } from '@/services/MJMLValidator';
import { ZipExportService, ExportOptions } from '@/services/ZipExportService';

export const useMJMLExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{
    mjml: string;
    html: string;
    errors: any[];
    warnings: string[];
  } | null>(null);

  const exportToMJML = useCallback(async (
    blocks: EmailBlock[],
    subject: string,
    settings?: any
  ) => {
    setIsExporting(true);
    
    try {
      const template = {
        subject,
        blocks,
        settings: settings || {
          width: '600px',
          backgroundColor: '#f5f5f5',
          fontFamily: 'Arial, sans-serif'
        }
      };

      const mjmlContent = MJMLTemplateGenerator.generateMJML(template);
      const { html, errors } = MJMLTemplateGenerator.generateHTML(template);
      const validation = MJMLValidator.validate(mjmlContent);

      const result = {
        mjml: mjmlContent,
        html,
        errors,
        warnings: validation.warnings
      };

      setExportResult(result);
      return result;
    } catch (error) {
      console.error('MJML export error:', error);
      return {
        mjml: '',
        html: '',
        errors: [{ message: error.message, line: 0, tagName: 'export' }],
        warnings: []
      };
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportAsZip = useCallback(async (
    blocks: EmailBlock[],
    subject: string,
    globalStyles?: string,
    options: ExportOptions = {}
  ) => {
    setIsExporting(true);
    
    try {
      await ZipExportService.exportAndDownload(blocks, subject, globalStyles, options);
      return { success: true };
    } catch (error) {
      console.error('Zip export error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadMJML = useCallback((mjmlContent: string, filename = 'email-template.mjml') => {
    const blob = new Blob([mjmlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const downloadHTML = useCallback((htmlContent: string, filename = 'email-template.html') => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
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
    exportAsZip,
    downloadMJML,
    downloadHTML,
    isExporting,
    exportResult
  };
};
