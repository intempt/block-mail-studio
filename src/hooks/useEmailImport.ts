
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { EmailImportService, ImportResult } from '@/services/EmailImportService';

export const useEmailImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewBlocks, setPreviewBlocks] = useState<EmailBlock[]>([]);

  const importFromFile = useCallback(async (file: File) => {
    setIsImporting(true);
    setImportResult(null);
    setPreviewBlocks([]);

    try {
      const result = await EmailImportService.importFromFile(file);
      setImportResult(result);
      setPreviewBlocks(result.blocks);
      return result;
    } catch (error) {
      const errorResult: ImportResult = {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to import file'],
        warnings: []
      };
      setImportResult(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const importFromContent = useCallback(async (content: string, type: 'mjml' | 'html') => {
    setIsImporting(true);
    setImportResult(null);
    setPreviewBlocks([]);

    try {
      const result = await EmailImportService.importFromContent(content, type);
      setImportResult(result);
      setPreviewBlocks(result.blocks);
      return result;
    } catch (error) {
      const errorResult: ImportResult = {
        blocks: [],
        errors: [error instanceof Error ? error.message : 'Failed to import content'],
        warnings: []
      };
      setImportResult(errorResult);
      return errorResult;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const clearImport = useCallback(() => {
    setImportResult(null);
    setPreviewBlocks([]);
  }, []);

  return {
    importFromFile,
    importFromContent,
    clearImport,
    isImporting,
    importResult,
    previewBlocks
  };
};
