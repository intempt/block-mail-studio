import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Eye, 
  Send, 
  Download, 
  Upload, 
  Save,
  Settings,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  MousePointer,
  Plus,
  MoreHorizontal,
  Sparkles,
  Zap,
  BarChart3,
  PenTool,
  Edit,
  MonitorSpeaker,
  Laptop
} from 'lucide-react';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EnhancedEmailBlockPalette } from './BlockManager';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  onGlobalStylesChange: (styles: string) => void;
  emailHTML: string;
  subjectLine: string;
  editor: Editor | null;
  snippetRefreshTrigger?: number;
  onTemplateLibraryOpen: () => void;
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  previewMode: 'desktop' | 'mobile';
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: any) => void;
  onPublish: () => void;
  canvasRef: any;
  onSubjectLineChange: (subject: string) => void;
  onToggleAIAnalytics: () => void;
  onImportBlocks: (blocks: EmailBlock[], subject?: string) => void;
  blocks: EmailBlock[];
  viewMode: 'edit' | 'desktop-preview' | 'mobile-preview';
  onViewModeChange: (mode: 'edit' | 'desktop-preview' | 'mobile-preview') => void;
}

export const OmnipresentRibbon: React.FC<OmnipresentRibbonProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  onGlobalStylesChange,
  emailHTML,
  subjectLine,
  editor,
  snippetRefreshTrigger = 0,
  onTemplateLibraryOpen,
  onPreviewModeChange,
  previewMode,
  onBack,
  canvasWidth,
  deviceMode,
  onDeviceChange,
  onWidthChange,
  onPreview,
  onSaveTemplate,
  onPublish,
  canvasRef,
  onSubjectLineChange,
  onToggleAIAnalytics,
  onImportBlocks,
  blocks,
  viewMode,
  onViewModeChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [newWidth, setNewWidth] = useState(canvasWidth);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedBlocks, setImportedBlocks] = useState<EmailBlock[]>([]);
  const [importedSubject, setImportedSubject] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWidthChange = (width: number) => {
    setNewWidth(width);
  };

  const handleApplyWidth = () => {
    onWidthChange(newWidth);
    setShowSettings(false);
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    onDeviceChange(device);
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data && Array.isArray(data.blocks)) {
            setImportedBlocks(data.blocks);
            if (data.subject) {
              setImportedSubject(data.subject);
            }
          } else {
            console.error('Invalid data format: Must be an object with a "blocks" array.');
            alert('Invalid data format. Please upload a valid JSON file.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error parsing JSON. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    onImportBlocks(importedBlocks, importedSubject);
    setIsImportModalOpen(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ blocks, subject: subjectLine });
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileName = `email-template-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleViewModeChange = (mode: 'edit' | 'desktop-preview' | 'mobile-preview') => {
    onViewModeChange(mode);
  };

  const deviceButtonClasses = (mode: string) => {
    return `flex-1 ${deviceMode === mode ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'} rounded-md p-2 transition-colors`;
  };

  const viewModeButtonClasses = (mode: string) => {
    return `flex-1 ${viewMode === mode ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'} rounded-md p-2 transition-colors`;
  };

  const isEditMode = viewMode === 'edit';

  return (
    <div className="bg-white border-b shadow-sm z-50">
      <div className="px-4 py-2 flex items-center justify-between space-x-4">
        {/* Back Button */}
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        {/* Title and Subject Line */}
        <div className="flex-1 min-w-0 flex items-center space-x-4">
          <h1 className="text-lg font-semibold truncate">Email Editor</h1>
          {isEditMode && (
            <Input
              type="text"
              placeholder="Subject Line"
              value={subjectLine}
              onChange={(e) => onSubjectLineChange(e.target.value)}
              className="flex-1 min-w-0 h-8 text-sm"
            />
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('edit')} className={viewModeButtonClasses('edit')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('desktop-preview')} className={viewModeButtonClasses('desktop-preview')}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Desktop Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('mobile-preview')} className={viewModeButtonClasses('mobile-preview')}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mobile Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* AI Analytics Toggle */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onToggleAIAnalytics} className="h-8">
                    <Zap className="w-4 h-4 mr-2" />
                    AI
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle AI Analytics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Template Library */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onTemplateLibraryOpen} className="h-8">
                    <Palette className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Template Library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Preview */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onPreview} className="h-8">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview Email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings Dropdown */}
          {isEditMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Canvas Width
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Save Template */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onSaveTemplate} className="h-8">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save as Template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Publish */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" size="sm" onClick={onPublish} className="h-8">
                    <Send className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Publish Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Canvas Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="width" className="text-right">
                Width
              </Label>
              <Input type="number" id="width" value={newWidth} onChange={(e) => handleWidthChange(Number(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Device
              </Label>
              <div className="col-span-3 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDeviceChange('desktop')} className={deviceButtonClasses('desktop')}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeviceChange('tablet')} className={deviceButtonClasses('tablet')}>
                  <Tablet className="w-4 h-4 mr-2" />
                  Tablet
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeviceChange('mobile')} className={deviceButtonClasses('mobile')}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeviceChange('custom')} className={deviceButtonClasses('custom')}>
                  <MousePointer className="w-4 h-4 mr-2" />
                  Custom
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={handleApplyWidth}>Apply</Button>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="importFile">Select JSON File</Label>
            <Input
              type="file"
              id="importFile"
              accept=".json"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmImport}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
