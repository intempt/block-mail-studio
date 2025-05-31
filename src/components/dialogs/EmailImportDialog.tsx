
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Code, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useEmailImport } from '@/hooks/useEmailImport';
import { EmailBlock } from '@/types/emailBlocks';

interface EmailImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (blocks: EmailBlock[], subject?: string) => void;
}

export const EmailImportDialog: React.FC<EmailImportDialogProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [pasteType, setPasteType] = useState<'mjml' | 'html'>('mjml');
  
  const { importFromFile, importFromContent, isImporting, importResult, previewBlocks, clearImport } = useEmailImport();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      await importFromFile(file);
    }
  }, [importFromFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importFromFile(file);
    }
  }, [importFromFile]);

  const handlePasteImport = useCallback(async () => {
    if (pasteContent.trim()) {
      await importFromContent(pasteContent, pasteType);
    }
  }, [importFromContent, pasteContent, pasteType]);

  const handleConfirmImport = useCallback(() => {
    if (importResult && importResult.blocks.length > 0) {
      onImport(importResult.blocks, importResult.subject);
      handleClose();
    }
  }, [importResult, onImport]);

  const handleClose = useCallback(() => {
    clearImport();
    setPasteContent('');
    onClose();
  }, [clearImport, onClose]);

  const renderFileUpload = () => (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Drop your MJML or HTML file here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse files
          </p>
        </div>
        <input
          type="file"
          accept=".mjml,.html,.htm"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Browse Files
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Supported formats: <Badge variant="outline">.mjml</Badge> <Badge variant="outline">.html</Badge>
      </div>
    </div>
  );

  const renderPasteImport = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={pasteType === 'mjml' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPasteType('mjml')}
        >
          MJML
        </Button>
        <Button
          variant={pasteType === 'html' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPasteType('html')}
        >
          HTML
        </Button>
      </div>
      
      <Textarea
        placeholder={`Paste your ${pasteType.toUpperCase()} content here...`}
        value={pasteContent}
        onChange={(e) => setPasteContent(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
      />
      
      <Button
        onClick={handlePasteImport}
        disabled={!pasteContent.trim() || isImporting}
        className="w-full"
      >
        Import from {pasteType.toUpperCase()}
      </Button>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      {importResult?.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-1">
              {importResult.errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {importResult?.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Warnings:</p>
              {importResult.warnings.map((warning, index) => (
                <div key={index} className="text-sm">{warning}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {previewBlocks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium">Import Preview</h4>
          </div>
          
          {importResult?.subject && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Subject Line:</p>
              <p className="text-sm text-gray-600">{importResult.subject}</p>
            </div>
          )}
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Found {previewBlocks.length} block{previewBlocks.length !== 1 ? 's' : ''}:
            </p>
            <div className="space-y-1">
              {previewBlocks.map((block, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {block.type}
                  </Badge>
                  {block.type === 'text' && (
                    <span className="truncate">
                      {typeof block.content === 'object' && 'text' in block.content 
                        ? block.content.text.replace(/<[^>]*>/g, '').substring(0, 50) + '...'
                        : 'Text content'
                      }
                    </span>
                  )}
                  {block.type === 'image' && (
                    <span className="truncate">
                      {typeof block.content === 'object' && 'alt' in block.content 
                        ? block.content.alt || 'Image'
                        : 'Image'
                      }
                    </span>
                  )}
                  {block.type === 'button' && (
                    <span className="truncate">
                      {typeof block.content === 'object' && 'text' in block.content 
                        ? block.content.text
                        : 'Button'
                      }
                    </span>
                  )}
                  {block.type === 'columns' && (
                    <span>
                      {typeof block.content === 'object' && 'columnCount' in block.content 
                        ? `${block.content.columnCount} columns`
                        : 'Column layout'
                      }
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Warning:</strong> This will replace all current content in your email editor.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleConfirmImport} className="flex-1">
              Replace Content
            </Button>
            <Button variant="outline" onClick={clearImport}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Import Email
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {!importResult ? (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="paste">Paste Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                {renderFileUpload()}
              </TabsContent>
              
              <TabsContent value="paste" className="mt-4">
                {renderPasteImport()}
              </TabsContent>
            </Tabs>
          ) : (
            renderPreview()
          )}

          {isImporting && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Processing import...
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
