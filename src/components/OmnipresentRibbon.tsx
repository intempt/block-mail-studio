
import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  Eye,
  Send,
  Settings,
  Download,
  Palette,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  FolderOpen,
  BarChart3,
  Upload
} from 'lucide-react';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { EmailPropertiesPanel } from './EmailPropertiesPanel';
import { ResponsiveLayoutControls } from './ResponsiveLayoutControls';
import { EmailTemplate } from './TemplateManager';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  onGlobalStylesChange: (styles: any) => void;
  emailHTML: string;
  subjectLine: string;
  editor: Editor | null;
  snippetRefreshTrigger: number;
  onTemplateLibraryOpen: () => void;
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  previewMode: 'desktop' | 'mobile';
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  onPublish: () => void;
  onToggleAIAnalytics: () => void;
  emailBlocks?: EmailBlock[];
  globalStyles?: string;
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
  snippetRefreshTrigger,
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
  onToggleAIAnalytics,
  emailBlocks = [],
  globalStyles
}) => {
  const [showGlobalStyles, setShowGlobalStyles] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleGlobalStylesToggle = () => {
    setShowGlobalStyles(!showGlobalStyles);
  };

  const handleDeviceSettingsToggle = () => {
    setShowDeviceSettings(!showDeviceSettings);
  };

  const handleTemplateSettingsToggle = () => {
    setShowTemplateSettings(!showTemplateSettings);
  };

  const handleSaveTemplate = () => {
    const templateData = {
      name: 'Untitled Template',
      description: 'Imported template',
      html: emailHTML || '<p>Empty template</p>',
      subject: subjectLine || 'No subject',
      category: 'imported',
      tags: [],
      isFavorite: false
    };
    onSaveTemplate(templateData);
  };

  const handleImportBlocks = (blocks: EmailBlock[]) => {
    console.log('Importing blocks:', blocks);
    
    blocks.forEach((block, index) => {
      setTimeout(() => {
        if (block.type === 'columns') {
          onBlockAdd('columns', block.content);
        } else {
          onBlockAdd(block.type);
        }
      }, index * 100);
    });
    
    setShowImportDialog(false);
  };

  return (
    <>
      <div className="ribbon-container relative z-40">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="flex items-center gap-2 hover:bg-gray-100 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Email Editor</span>
            </div>
          </div>

          {/* Center Section - Tools */}
          <div className="button-group">
            <EnhancedEmailBlockPalette
              onBlockAdd={onBlockAdd}
              universalContent={universalContent}
              onUniversalContentAdd={onUniversalContentAdd}
            />
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImportDialog(true)}
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Import</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Import HTML/MJML template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGlobalStylesToggle}
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <Palette className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Design</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Edit global styles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeviceSettingsToggle}
                    className="toolbar-button hover:bg-gray-100"
                  >
                    {deviceMode === 'desktop' && <Monitor className="w-4 h-4" />}
                    {deviceMode === 'tablet' && <Tablet className="w-4 h-4" />}
                    {deviceMode === 'mobile' && <Smartphone className="w-4 h-4" />}
                    {deviceMode === 'custom' && <Settings className="w-4 h-4" />}
                    <span className="ml-2 hidden sm:block">{deviceMode === 'custom' ? 'Custom' : deviceMode}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Adjust for different screen sizes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTemplateSettingsToggle}
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Templates</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Open template library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right Section */}
          <div className="button-group">
            <ResponsiveLayoutControls
              currentDevice={deviceMode}
              onDeviceChange={onDeviceChange}
              onWidthChange={onWidthChange}
            />

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onPreviewModeChange(previewMode === 'desktop' ? 'mobile' : 'desktop')} 
              className="toolbar-button hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">
                {previewMode === 'desktop' ? 'Mobile' : 'Desktop'}
              </span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreview} 
              className="toolbar-button hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Preview</span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowExportDialog(true)} 
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Export as MJML, HTML, or ZIP</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSaveTemplate} 
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <Save className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Save</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Save as template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              variant="default" 
              size="sm" 
              onClick={onPublish} 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-smooth"
            >
              <Send className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Publish</span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onToggleAIAnalytics} 
                    className="toolbar-button hover:bg-gray-100"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip-content">
                  <p>Toggle AI Analytics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportBlocks}
      />

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        blocks={emailBlocks}
        subject={subjectLine}
        globalStyles={globalStyles}
      />

      {/* Dropdown Panels with improved styling */}
      {showGlobalStyles && (
        <div className="absolute top-14 right-6 w-96 dropdown-content p-0 z-50 animate-scale-in">
          <EmailPropertiesPanel
            emailHTML={emailHTML}
            onPropertyChange={onGlobalStylesChange}
          />
        </div>
      )}

      {showDeviceSettings && (
        <div className="absolute top-14 right-6 w-80 dropdown-content z-50 animate-scale-in">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Device Settings</h3>
            <ResponsiveLayoutControls
              currentDevice={deviceMode}
              onDeviceChange={onDeviceChange}
              onWidthChange={onWidthChange}
            />
          </div>
        </div>
      )}

      {showTemplateSettings && (
        <div className="absolute top-14 right-6 w-80 dropdown-content z-50 animate-scale-in">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Template Settings</h3>
            <div className="space-y-2">
              <Button 
                onClick={onTemplateLibraryOpen}
                className="w-full justify-start"
                variant="outline"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
