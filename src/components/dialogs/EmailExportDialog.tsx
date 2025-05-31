
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  Code, 
  Package,
  Image,
  Loader2
} from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';
import { useEmailZipExport } from '@/hooks/useEmailZipExport';
import { useMJMLExport } from '@/hooks/useMJMLExport';

interface EmailExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: EmailBlock[];
  subject: string;
  emailHTML: string;
  campaignTitle: string;
}

type ExportFormat = 'mjml' | 'html' | 'zip';

export const EmailExportDialog: React.FC<EmailExportDialogProps> = ({
  isOpen,
  onClose,
  blocks,
  subject,
  emailHTML,
  campaignTitle
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('zip');
  const [filename, setFilename] = useState(() => {
    const cleanTitle = campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return cleanTitle || 'email_template';
  });

  const { exportToZip, isExporting: isZipExporting, exportProgress } = useEmailZipExport();
  const { exportToMJML, downloadMJML, downloadHTML, isExporting: isMJMLExporting } = useMJMLExport();

  const isExporting = isZipExporting || isMJMLExporting;

  const handleExport = async () => {
    try {
      switch (exportFormat) {
        case 'zip':
          await exportToZip(blocks, subject, undefined, `${filename}.zip`);
          break;
        case 'mjml':
          const mjmlResult = await exportToMJML(blocks, subject);
          if (mjmlResult.mjml) {
            downloadMJML(mjmlResult.mjml, `${filename}.mjml`);
          }
          break;
        case 'html':
          downloadHTML(emailHTML, `${filename}.html`);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getImageCount = () => {
    let count = 0;
    const countImages = (blocks: EmailBlock[]) => {
      blocks.forEach(block => {
        if (block.type === 'image' && block.content.src?.startsWith('data:image/')) {
          count++;
        }
        if (block.type === 'columns' && block.content.columns) {
          block.content.columns.forEach(column => {
            countImages(column.blocks);
          });
        }
      });
    };
    countImages(blocks);
    return count;
  };

  const imageCount = getImageCount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Email Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="filename" className="text-sm font-medium">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="email_template"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Export Format
            </Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value: ExportFormat) => setExportFormat(value)}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="zip" id="zip" />
                <div className="flex-1">
                  <label htmlFor="zip" className="flex items-center gap-2 cursor-pointer">
                    <Package className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">ZIP Package</div>
                      <div className="text-xs text-gray-500">
                        MJML + HTML + Images ({imageCount} assets)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="mjml" id="mjml" />
                <div className="flex-1">
                  <label htmlFor="mjml" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">MJML Source</div>
                      <div className="text-xs text-gray-500">
                        Editable MJML file
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="html" id="html" />
                <div className="flex-1">
                  <label htmlFor="html" className="flex items-center gap-2 cursor-pointer">
                    <Code className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="font-medium">HTML</div>
                      <div className="text-xs text-gray-500">
                        Compiled HTML file
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {exportFormat === 'zip' && imageCount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Image className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {imageCount} image{imageCount > 1 ? 's' : ''} will be included
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Images will be exported as separate files with relative paths updated in the templates.
              </p>
            </div>
          )}

          {isExporting && exportProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || !filename.trim()}
              className="flex-1"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
