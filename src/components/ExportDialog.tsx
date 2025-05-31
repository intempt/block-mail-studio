
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileArchive, Loader2 } from 'lucide-react';
import { useMJMLExport } from '@/hooks/useMJMLExport';
import { EmailBlock } from '@/types/emailBlocks';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: EmailBlock[];
  subject: string;
  globalStyles?: string;
  trigger?: React.ReactNode;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  blocks,
  subject,
  globalStyles,
  trigger
}) => {
  const { exportAsZip, downloadMJML, downloadHTML, exportToMJML, isExporting } = useMJMLExport();
  const [filename, setFilename] = useState('email-template');
  const [templateName, setTemplateName] = useState('Email Template');
  const [templateDescription, setTemplateDescription] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exportFormat, setExportFormat] = useState<'zip' | 'mjml' | 'html'>('zip');

  const handleExport = async () => {
    try {
      if (exportFormat === 'zip') {
        await exportAsZip(blocks, subject, globalStyles, {
          filename: `${filename}.zip`,
          templateName,
          templateDescription,
          includeMetadata
        });
      } else {
        const result = await exportToMJML(blocks, subject);
        if (exportFormat === 'mjml') {
          downloadMJML(result.mjml, `${filename}.mjml`);
        } else {
          downloadHTML(result.html, `${filename}.html`);
        }
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const DialogComponent = trigger ? Dialog : React.Fragment;
  const dialogProps = trigger ? { open: isOpen, onOpenChange: (open: boolean) => !open && onClose() } : {};

  const content = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileArchive className="w-5 h-5" />
          Export Email Template
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={exportFormat === 'zip' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('zip')}
          >
            ZIP Package
          </Button>
          <Button
            variant={exportFormat === 'mjml' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('mjml')}
          >
            MJML Only
          </Button>
          <Button
            variant={exportFormat === 'html' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('html')}
          >
            HTML Only
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="email-template"
          />
        </div>

        {exportFormat === 'zip' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Email Template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateDescription">Description (Optional)</Label>
              <Textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe your email template..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
              />
              <Label htmlFor="includeMetadata">Include metadata file</Label>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="flex-1">
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <DialogComponent {...dialogProps}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {content}
      </DialogComponent>
    );
  }

  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {content}
    </Dialog>
  ) : null;
};
