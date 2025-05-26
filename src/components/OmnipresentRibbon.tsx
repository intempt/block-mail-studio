import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Type, 
  Image, 
  MousePointer, 
  Minus, 
  Video, 
  Share2, 
  Table,
  Layout,
  Link,
  ArrowLeft,
  Eye,
  Send,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  ChevronDown,
  ChevronUp,
  Settings,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { ButtonsLinksCard } from './ButtonsLinksCard';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { AISuggestionsCard } from './AISuggestionsCard';
import { EnhancedAISuggestionsWidget } from './EnhancedAISuggestionsWidget';
import { DynamicLayoutIcon } from './DynamicLayoutIcon';

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

const layoutOptions: LayoutOption[] = [
  { id: '1-column', name: '1 Col', columns: 1, ratio: '100', preview: ['100%'] },
  { id: '2-column-50-50', name: '50/50', columns: 2, ratio: '50-50', preview: ['50%', '50%'] },
  { id: '2-column-33-67', name: '33/67', columns: 2, ratio: '33-67', preview: ['33%', '67%'] },
  { id: '2-column-67-33', name: '67/33', columns: 2, ratio: '67-33', preview: ['67%', '33%'] },
  { id: '2-column-25-75', name: '25/75', columns: 2, ratio: '25-75', preview: ['25%', '75%'] },
  { id: '2-column-75-25', name: '75/25', columns: 2, ratio: '75-25', preview: ['75%', '25%'] },
  { id: '3-column-equal', name: '33/33/33', columns: 3, ratio: '33-33-33', preview: ['33%', '33%', '33%'] },
  { id: '3-column-25-50-25', name: '25/50/25', columns: 3, ratio: '25-50-25', preview: ['25%', '50%', '25%'] },
  { id: '3-column-25-25-50', name: '25/25/50', columns: 3, ratio: '25-25-50', preview: ['25%', '25%', '50%'] },
  { id: '3-column-50-25-25', name: '50/25/25', columns: 3, ratio: '50-25-25', preview: ['50%', '25%', '25%'] },
  { id: '4-column-equal', name: '25/25/25/25', columns: 4, ratio: '25-25-25-25', preview: ['25%', '25%', '25%', '25%'] }
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
  const [showButtons, setShowButtons] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showTextHeadings, setShowTextHeadings] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('New Email Campaign');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Email-standard device configurations
  const emailDeviceConfig = {
    mobile: { icon: Smartphone, width: 375, label: 'Mobile Email' },
    desktop: { icon: Monitor, width: 600, label: 'Desktop Email' }
  };

  // Email industry standard widths
  const emailWidthPresets = [
    { label: 'Mobile S', width: 320 },
    { label: 'Mobile M', width: 375 },
    { label: 'Mobile L', width: 414 },
    { label: 'Email Standard', width: 600 },
    { label: 'Email Wide', width: 640 }
  ];

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayoutSelect = (layout: LayoutOption) => {
    const columns = Array.from({ length: layout.columns }, (_, index) => ({
      id: `col-${index}`,
      blocks: [],
      width: layout.preview[index] || '100%'
    }));

    const layoutConfig = {
      ...layout,
      columns
    };

    onBlockAdd('columns', layoutConfig);
  };

  const deviceConfig = {
    desktop: { icon: Monitor, width: 1200, label: 'Desktop' },
    tablet: { icon: Tablet, width: 768, label: 'Tablet' },
    mobile: { icon: Smartphone, width: 375, label: 'Mobile' }
  };

  const closeAllPanels = () => {
    setShowButtons(false);
    setShowLinks(false);
    setShowEmailSettings(false);
    setShowTextHeadings(false);
    setShowAISuggestions(false);
  };

  const handleButtonsToggle = () => {
    if (!showButtons) closeAllPanels();
    setShowButtons(!showButtons);
  };

  const handleLinksToggle = () => {
    if (!showLinks) closeAllPanels();
    setShowLinks(!showLinks);
  };

  const handleEmailSettingsToggle = () => {
    if (!showEmailSettings) closeAllPanels();
    setShowEmailSettings(!showEmailSettings);
  };

  const handleTextHeadingsToggle = () => {
    if (!showTextHeadings) closeAllPanels();
    setShowTextHeadings(!showTextHeadings);
  };

  const handleAISuggestionsToggle = () => {
    if (!showAISuggestions) closeAllPanels();
    setShowAISuggestions(!showAISuggestions);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // Auto-save functionality can be added here
    console.log('Campaign title saved:', campaignTitle);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  const handleWidthPresetSelect = (width: number) => {
    onWidthChange(width);
    // Set device mode based on width
    if (width <= 414) {
      onDeviceChange('mobile');
    } else {
      onDeviceChange('desktop');
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
      {/* AI Suggestions Bar - Always visible when showAISuggestions is true */}
      <EnhancedAISuggestionsWidget
        isOpen={showAISuggestions}
        onToggle={handleAISuggestionsToggle}
        emailHTML={emailHTML}
        subjectLine={subjectLine}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectLineChange}
        onApplySuggestion={(suggestion) => {
          console.log('Applied suggestion:', suggestion);
        }}
      />

      {/* Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        {/* Left Section - Editable Campaign Title */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
                className="text-xl font-semibold border-none p-0 h-auto focus:ring-0 focus:border-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">{campaignTitle}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Center Section - Email-Standard Device Controls and Width Presets */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(emailDeviceConfig).map(([device, config]) => {
              const IconComponent = config.icon;
              const isActive = (device === 'mobile' && canvasWidth <= 414) || 
                              (device === 'desktop' && canvasWidth > 414);
              
              return (
                <Button
                  key={device}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleWidthPresetSelect(config.width)}
                  className={`flex items-center gap-2 h-8 px-3 ${
                    isActive ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{config.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {emailWidthPresets.map((preset) => (
                <Button
                  key={preset.width}
                  variant={canvasWidth === preset.width ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleWidthPresetSelect(preset.width)}
                  className="h-7 px-2 text-xs"
                >
                  {preset.width}px
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-gray-500 min-w-[60px]">{canvasWidth}px</span>
              <Slider
                value={[canvasWidth]}
                onValueChange={(value) => onWidthChange(value[0])}
                min={320}
                max={640}
                step={10}
                className="w-24"
              />
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button onClick={onPreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => onSaveTemplate({})} variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onPublish} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Ribbon Content */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Blocks Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              {blockItems.map((block) => (
                <Button
                  key={block.id}
                  variant="ghost"
                  size="sm"
                  className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-100"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onClick={() => onBlockAdd(block.id)}
                >
                  {block.icon}
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Layouts Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              {layoutOptions.map((layout) => (
                <Button
                  key={layout.id}
                  variant="ghost"
                  size="sm"
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleLayoutSelect(layout)}
                >
                  <DynamicLayoutIcon layout={layout} className="w-6 h-5" />
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Email Settings Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showEmailSettings ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={handleEmailSettingsToggle}
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Text & Headings Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showTextHeadings ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={handleTextHeadingsToggle}
              >
                <Type className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Buttons Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showButtons ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={handleButtonsToggle}
              >
                <MousePointer className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Links Section */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showLinks ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={handleLinksToggle}
              >
                <Link className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* AI Suggestions Section - Updated to show compact state */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showAISuggestions ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={handleAISuggestionsToggle}
              >
                <Lightbulb className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Cards - keep existing cards but remove the old AI suggestions widget */}
      <EmailSettingsCard
        isOpen={showEmailSettings}
        onToggle={handleEmailSettingsToggle}
        onStylesChange={onGlobalStylesChange}
      />

      <TextHeadingsCard
        isOpen={showTextHeadings}
        onToggle={handleTextHeadingsToggle}
        onStylesChange={onGlobalStylesChange}
      />

      <ButtonsLinksCard
        isOpen={showButtons}
        onToggle={handleButtonsToggle}
        onStylesChange={onGlobalStylesChange}
      />

      {/* Links Card placeholder */}
      {showLinks && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200 bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Link className="w-4 h-4" />
              Links
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLinksToggle}
              className="text-gray-500"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Link styling controls will be implemented here.
          </div>
        </div>
      )}
    </div>
  );
};

export default OmnipresentRibbon;
