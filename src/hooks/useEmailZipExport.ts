
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { EmailZipExportService } from '@/services/EmailZipExportService';

export const useEmailZipExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportToZip = useCallback(async (
    blocks: EmailBlock[],
    subject: string,
    settings?: any,
    filename?: string
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress for user feedback
      setExportProgress(25);
      
      const zipBlob = await EmailZipExportService.exportToZip(blocks, subject, settings);
      
      setExportProgress(75);
      
      EmailZipExportService.downloadZip(zipBlob, filename);
      
      setExportProgress(100);
      
      return { success: true };
    } catch (error) {
      console.error('ZIP export error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export ZIP' 
      };
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  return {
    exportToZip,
    isExporting,
    exportProgress
  };
};
