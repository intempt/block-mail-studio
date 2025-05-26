import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Image, 
  MousePointer, 
  Minus, 
  Video, 
  Share2, 
  Table,
  ArrowLeft,
  Eye,
  Send,
  Save,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { CompactEmailResponsiveControls } from './CompactEmailResponsiveControls';
import { CompactAISuggestionsWidget } from './CompactAISuggestionsWidget';

interface BlockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface LayoutOption {
  id: string;
  name: string;
  columns: number;
  ratio: string;
  preview: string[];
}

const blockItems: BlockItem[] = [
  { id: 'text', name: 'Text', icon: <Type className="w-6 h-6" /> },
  { id: 'image', name: 'Image', icon: <Image className="w-6 h-6" /> },
  { id: 'button', name: 'Button', icon: <MousePointer className="w-6 h-6" /> },
  { id: 'spacer', name: 'Spacer', icon: <Minus className="w-6 h-6" /> },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-6 h-6" /> },
  { id: 'video', name: 'Video', icon: <Video className="w-6 h-6" /> },
  { id: 'social', name: 'Social', icon: <Share2 className="w-6 h-6" /> },
  { id: 'html', name: 'HTML', icon: <Table className="w-6 h-6" /> },
  { id: 'table', name: 'Table', icon: <Table className="w-6 h-6" /> }
];

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  onGlobalStylesChange: (styles: any) => void;
  emailHTML: string;
  subjectLine: string;
  editor?: any;
  snippetRefreshTrigger?: number;
  onTemplateLibraryOpen?: () => void;
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
  previewMode?: 'desktop' | 'mobile';
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: any) => void;
  onPublish: () => void;
  canvasRef?: React.RefObject<any>;
  onSubjectLineChange?: (subject: string) => void;
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
  previewMode = 'desktop',
  onBack,
  canvasWidth,
  deviceMode,
  onDeviceChange,
  onWidthChange,
  onPreview,
  onSaveTemplate,
  onPublish,
  canvasRef,
  onSubjectLineChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('New Email Campaign');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    console.log('Campaign title saved:', campaignTitle);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Ribbon Hidden</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="text-gray-600"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Top Bar - Compact Layout */}
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left Section - Campaign Title */}
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 h-7"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="text-lg font-semibold border-none p-0 h-auto focus:ring-0"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">{campaignTitle}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-gray-400 hover:text-gray-600 h-5 w-5 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Center Section - Compact Email Responsive Controls */}
        <CompactEmailResponsiveControls
          currentWidth={canvasWidth}
          onWidthChange={onWidthChange}
        />
        
        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className={`h-7 ${showAISuggestions ? 'bg-purple-100 text-purple-700' : ''}`}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            AI
          </Button>
          
          <Button onClick={onPreview} variant="outline" size="sm" className="h-7">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          
          <Button onClick={() => onSaveTemplate({})} variant="outline" size="sm" className="h-7">
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          
          <Button onClick={onPublish} className="bg-blue-600 hover:bg-blue-700 h-7" size="sm">
            <Send className="w-3 h-3 mr-1" />
            Send Test
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-gray-600 h-7 w-7 p-0"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Blocks Toolbar - Simplified */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto">
          {blockItems.map((block) => (
            <Button
              key={block.id}
              variant="outline"
              size="sm"
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onClick={() => onBlockAdd(block.id)}
              className="flex items-center gap-1 h-8 px-3 bg-white hover:bg-gray-100 flex-shrink-0"
            >
              <div className="w-4 h-4">{block.icon}</div>
              <span className="text-xs">{block.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* AI Suggestions Widget */}
      <CompactAISuggestionsWidget
        isOpen={showAISuggestions}
        onToggle={() => setShowAISuggestions(!showAISuggestions)}
        emailHTML={emailHTML}
        subjectLine={subjectLine}
        onSubjectLineChange={onSubjectLineChange}
      />
    </div>
  );
};
