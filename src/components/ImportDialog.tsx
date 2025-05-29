
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileText, 
  Code, 
  X, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import { HTMLImportService, ImportResult } from '@/services/HTMLImportService';
import { MJMLImportService } from '@/services/MJMLImportService';
import { EmailBlock } from '@/types/emailBlocks';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (blocks: EmailBlock[], subject?: string) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setImportResult(null);

    try {
      const content = await file.text();
      const isMJML = file.name.toLowerCase().endsWith('.mjml') || 
                     content.includes('<mjml>') || 
                     content.includes('<mj-');

      let result: ImportResult;
      if (isMJML) {
        result = await MJMLImportService.importMJML(content);
      } else {
        result = await HTMLImportService.importHTML(content);
      }

      setImportResult(result);
      setPreviewHTML(content);
    } catch (error) {
      setImportResult({
        blocks: [],
        errors: [`Failed to process file: ${error.message}`],
        warnings: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'text/html' || 
      file.name.endsWith('.html') || 
      file.name.endsWith('.mjml')
    );
    
    if (validFile) {
      handleFileSelect(validFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    if (importResult && importResult.blocks.length > 0) {
      onImport(importResult.blocks, importResult.subject);
      onClose();
      resetDialog();
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setImportResult(null);
    setPreviewHTML('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
    resetDialog();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Import Email Template</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          {!selectedFile ? (
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your email template here
                </h3>
                <p className="text-gray-600 mb-4">
                  Support for HTML and MJML files
                </p>
                <Button variant="outline">
                  Choose File
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.mjml"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">HTML Files</h4>
                    <p className="text-sm text-blue-700">Standard HTML email templates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Code className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">MJML Files</h4>
                    <p className="text-sm text-green-700">Responsive email markup language</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Import Results */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <Badge variant="outline">
                    {selectedFile.name.endsWith('.mjml') ? 'MJML' : 'HTML'}
                  </Badge>
                </div>

                {isProcessing ? (
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-700">Processing file...</span>
                  </div>
                ) : importResult ? (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Import Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Blocks found:</span>
                          <span className="font-medium">{importResult.blocks.length}</span>
                        </div>
                        {importResult.subject && (
                          <div className="flex justify-between">
                            <span>Subject line:</span>
                            <span className="font-medium">{importResult.subject}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Errors */}
                    {importResult.errors.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-900">Errors</span>
                        </div>
                        <ScrollArea className="max-h-24">
                          <div className="space-y-1">
                            {importResult.errors.map((error, index) => (
                              <p key={index} className="text-sm text-red-700">{error}</p>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Warnings */}
                    {importResult.warnings.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-900">Warnings</span>
                        </div>
                        <ScrollArea className="max-h-24">
                          <div className="space-y-1">
                            {importResult.warnings.map((warning, index) => (
                              <p key={index} className="text-sm text-yellow-700">{warning}</p>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Success */}
                    {importResult.blocks.length > 0 && importResult.errors.length === 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-900">Ready to import</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Preview</span>
                </div>
                <ScrollArea className="h-96 border rounded-lg">
                  <div className="p-4">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {previewHTML.substring(0, 2000)}
                      {previewHTML.length > 2000 && '...'}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            {selectedFile && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setImportResult(null);
                  setPreviewHTML('');
                }}
              >
                Choose Different File
              </Button>
            )}
            
            <Button
              onClick={handleImport}
              disabled={!importResult || importResult.blocks.length === 0 || importResult.errors.length > 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Import Template
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
