
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { UniversalImportService } from '@/services/UniversalImportService';
import { ImportResult } from '@/services/HTMLImportService';
import { EmailBlock } from '@/types/emailBlocks';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (blocks: EmailBlock[]) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [importMethod, setImportMethod] = useState<'file' | 'paste'>('file');
  const [pastedContent, setPastedContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > UniversalImportService.getMaxFileSize()) {
      setImportResult({
        blocks: [],
        errors: ['File size exceeds 5MB limit'],
        warnings: []
      });
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const processImport = async (content: string, filename?: string) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await UniversalImportService.importContent(content, filename);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        blocks: [],
        errors: [`Import failed: ${error.message}`],
        warnings: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processImport(content, selectedFile.name);
    };
    reader.readAsText(selectedFile);
  };

  const handlePasteImport = async () => {
    if (!pastedContent.trim()) return;
    await processImport(pastedContent);
  };

  const handleConfirmImport = () => {
    if (importResult?.blocks && importResult.blocks.length > 0) {
      onImport(importResult.blocks);
      onClose();
      resetDialog();
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setPastedContent('');
    setImportResult(null);
    setImportMethod('file');
  };

  const handleClose = () => {
    onClose();
    resetDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import HTML/MJML Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Import Method Tabs */}
          <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as 'file' | 'paste')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Paste Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="font-medium text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: {UniversalImportService.getSupportedFormats().join(', ')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Maximum file size: 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".html,.htm,.mjml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="hidden"
                      id="file-input"
                    />
                    <Label htmlFor="file-input">
                      <Button variant="outline" className="cursor-pointer">
                        Select File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              {selectedFile && !importResult && (
                <Button onClick={handleFileImport} disabled={isImporting} className="w-full">
                  {isImporting ? 'Processing...' : 'Import File'}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="paste" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paste-content">Paste your HTML or MJML code</Label>
                <Textarea
                  id="paste-content"
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste your HTML or MJML content here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {pastedContent.trim() && !importResult && (
                <Button onClick={handlePasteImport} disabled={isImporting} className="w-full">
                  {isImporting ? 'Processing...' : 'Import Code'}
                </Button>
              )}
            </TabsContent>
          </Tabs>

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              {/* Errors */}
              {importResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {importResult.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {importResult.warnings.map((warning, index) => (
                        <div key={index}>{warning}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Success */}
              {importResult.blocks.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-800">Import Successful</p>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Found {importResult.blocks.length} content block{importResult.blocks.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {importResult.blocks.map((block, index) => (
                      <Badge key={index} variant="secondary">
                        {block.type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {importResult?.blocks && importResult.blocks.length > 0 && (
              <Button onClick={handleConfirmImport}>
                Import {importResult.blocks.length} Block{importResult.blocks.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
