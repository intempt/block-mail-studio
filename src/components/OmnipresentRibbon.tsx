import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  Send,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { EmailTemplate } from './TemplateManager';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { createDragData } from '@/utils/dragDropUtils';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
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
  onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  onPublish: () => void;
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
  onPublish
}) => {
  const handleLayoutDragFromRibbon = (e: React.DragEvent, layoutConfig: any) => {
    console.log('Starting layout drag from ribbon:', layoutConfig);
    
    const dragData = createDragData({
      blockType: 'columns',
      isLayout: true,
      layoutData: layoutConfig
    });

    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleBlockAddFromRibbon = (blockType: string, layoutConfig?: any) => {
    if (layoutConfig) {
      // Handle layout addition
      onBlockAdd('columns', layoutConfig);
    } else {
      // Handle regular block addition
      onBlockAdd(blockType);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTemplateLibraryOpen}
            >
              Templates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Center Section - Block Palette */}
        <div className="flex-1 flex justify-center max-w-4xl mx-8">
          <div className="w-80">
            <EnhancedEmailBlockPalette
              onBlockAdd={handleBlockAddFromRibbon}
              onSnippetAdd={onSnippetAdd}
              universalContent={universalContent}
              onUniversalContentAdd={onUniversalContentAdd}
              compactMode={true}
              snippetRefreshTrigger={snippetRefreshTrigger}
              onLayoutDrag={handleLayoutDragFromRibbon}
            />
          </div>
        </div>

        {/* Right Section - Device Controls and Actions */}
        <div className="flex items-center gap-4">
          {/* Device Preview Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDeviceChange('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDeviceChange('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDeviceChange('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSaveTemplate({ name: 'New Template', html: emailHTML, subject: subjectLine })}
            >
              Save Template
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onPublish}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
