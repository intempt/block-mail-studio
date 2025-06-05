import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Eye,
  Send,
  Save,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Maximize,
  BarChart3,
  Library,
  Download,
  Upload,
  Mail,
  Globe
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TemplateStylePanel } from './TemplateStylePanel';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd: (snippet: any) => void;
  universalContent: any[];
  onUniversalContentAdd: (content: any) => void;
  onGlobalStylesChange: (styles: any) => void;
  emailHTML: string;
  subjectLine: string;
  editor: any;
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
  onSaveTemplate: (template: any) => void;
  onPublish: () => void;
  onToggleAIAnalytics: () => void;
  onImportBlocks: (blocks: any[], importedSubject?: string) => void;
  blocks: any[];
  onGmailPreview: (mode: 'desktop' | 'mobile') => void;
  viewMode: 'edit' | 'desktop-preview' | 'mobile-preview';
  onViewModeChange: (mode: 'edit' | 'desktop-preview' | 'mobile-preview') => void;
  onToggleUniversalPanel?: () => void;
  showUniversalPanel?: boolean;
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
  onImportBlocks,
  blocks,
  onGmailPreview,
  viewMode,
  onViewModeChange,
  onToggleUniversalPanel,
  showUniversalPanel = false
}) => {
  const [subject, setSubject] = useState(subjectLine);
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleBlockAdd = (blockType: string, layoutConfig?: any) => {
    onBlockAdd(blockType, layoutConfig);
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    onDeviceChange(device);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width)) {
      onWidthChange(width);
    }
  };

  const handleImport = () => {
    setShowImport(true);
  };

  const handleImportDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportData(e.target.value);
  };

  const handleImportSubmit = () => {
    try {
      const parsedData = JSON.parse(importData);
      if (Array.isArray(parsedData)) {
        onImportBlocks(parsedData);
      } else if (parsedData && parsedData.blocks && Array.isArray(parsedData.blocks)) {
        onImportBlocks(parsedData.blocks, parsedData.subject);
      } else {
        alert('Invalid JSON format. Please provide an array of blocks or an object with a blocks array.');
      }
      setShowImport(false);
    } catch (error) {
      alert('Failed to parse JSON. Please ensure the data is valid JSON.');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Side - Back and Add Blocks */}
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBlockAdd('text')}
              className="h-8"
            >
              Add Block
            </Button>
          </div>

          {/* Center - Subject and View Mode */}
          <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl mx-4">
            <Input
              type="text"
              placeholder="Subject Line"
              value={subject}
              onChange={handleSubjectChange}
              className="flex-grow text-center"
            />
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant={viewMode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('edit')}
              className="h-8"
            >
              Edit
            </Button>
            <Button
              variant={viewMode === 'desktop-preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('desktop-preview')}
              className="h-8"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile-preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('mobile-preview')}
              className="h-8"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGmailPreview(previewMode)}
              className="flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Gmail</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveTemplate}
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onPublish}
              className="flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Publish</span>
            </Button>
            
            {/* Universal Panel Toggle */}
            <Button
              variant={showUniversalPanel ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleUniversalPanel}
              className="flex items-center gap-1"
              title="Universal Updates"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Universal</span>
            </Button>
          </div>
        </div>

        {/* Second Row - Device Mode and Settings */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDeviceChange('desktop')}
              className="h-7"
            >
              <Monitor className="w-3 h-3" />
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDeviceChange('tablet')}
              className="h-7"
            >
              <Tablet className="w-3 h-3" />
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDeviceChange('mobile')}
              className="h-7"
            >
              <Smartphone className="w-3 h-3" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant={deviceMode === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('custom')}
                className="h-7"
              >
                <Maximize className="w-3 h-3" />
              </Button>
              {deviceMode === 'custom' && (
                <Input
                  type="number"
                  placeholder="Width"
                  value={canvasWidth.toString()}
                  onChange={handleWidthChange}
                  className="w-16 h-7 text-xs"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAIAnalytics}
              className="flex items-center gap-1"
            >
              <BarChart3 className="w-3 h-3" />
              <span className="hidden sm:inline">AI Analysis</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onTemplateLibraryOpen}
              className="flex items-center gap-1"
            >
              <Library className="w-3 h-3" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  <span className="hidden sm:inline">Styles</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <TemplateStylePanel onStylesChange={onGlobalStylesChange} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
