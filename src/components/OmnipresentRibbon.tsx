import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Eye,
  Code,
  Palette,
  Save,
  Download,
  Send
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { EmailBlockPalette } from './EmailBlockPalette';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { UndoRedoToolbar } from './UndoRedoToolbar';

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
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
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
  canUndo = false,
  canRedo = false,
  onUndo = () => {},
  onRedo = () => {}
}) => {
  const [showBlockPalette, setShowBlockPalette] = useState(false);

  const handleDeviceChangeClick = (device: 'desktop' | 'tablet' | 'mobile') => {
    onDeviceChange(device);
  };

  const handleWidthChangeCommit = (width: number[]) => {
    onWidthChange(width[0]);
  };

  const handleViewModeChange = (mode: 'edit' | 'desktop-preview' | 'mobile-preview') => {
    onViewModeChange(mode);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button and Title */}
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-lg font-semibold">Email Editor</h1>
          </div>

          {/* Center - Main Tools */}
          <div className="flex items-center gap-4">
            {/* Undo/Redo Controls */}
            <UndoRedoToolbar
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
            />

            <Separator orientation="vertical" className="h-6" />

            {/* Layouts and Blocks */}
            <Popover open={showBlockPalette} onOpenChange={setShowBlockPalette}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Layouts & Blocks
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[500px]" align="start">
                <EnhancedEmailBlockPalette
                  onBlockAdd={onBlockAdd}
                  universalContent={universalContent}
                  onUniversalContentAdd={onUniversalContentAdd}
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={onTemplateLibraryOpen}>
              <Save className="w-4 h-4 mr-2" />
              My Templates
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* View Mode Toggles */}
            <Tabs defaultValue={viewMode} className="w-[300px]" onValueChange={handleViewModeChange}>
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="desktop-preview">Desktop</TabsTrigger>
                <TabsTrigger value="mobile-preview">Mobile</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Side - Preview and Send */}
          <div className="flex items-center gap-4">
            {/* Canvas Width Adjustment */}
            {deviceMode === 'custom' && (
              <div className="flex items-center gap-2">
                <Label htmlFor="canvas-width" className="text-sm text-muted-foreground">
                  Width:
                </Label>
                <Slider
                  defaultValue={[canvasWidth]}
                  max={1200}
                  min={320}
                  step={10}
                  onValueCommit={handleWidthChangeCommit}
                  className="w-[100px]"
                  aria-label="Canvas Width"
                />
              </div>
            )}

            {/* Device Mode Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {deviceMode === 'desktop' && 'Desktop'}
                  {deviceMode === 'tablet' && 'Tablet'}
                  {deviceMode === 'mobile' && 'Mobile'}
                  {deviceMode === 'custom' && 'Custom'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Device Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDeviceChangeClick('desktop')}>
                  Desktop
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeviceChangeClick('tablet')}>
                  Tablet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeviceChangeClick('mobile')}>
                  Mobile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeviceChange('custom')}>
                  Custom
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button size="sm" onClick={onPublish}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
