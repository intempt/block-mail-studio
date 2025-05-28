import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Image, 
  MousePointer, 
  Space, 
  Video, 
  Share2, 
  Table,
  Layout,
  Link,
  ArrowLeft,
  Download,
  Monitor,
  Smartphone,
  Save,
  Settings,
  Lightbulb,
  Edit3,
  Trash2,
  Minus,
  Code
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { ButtonsLinksCard } from './ButtonsLinksCard';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { AISuggestionsCard } from './AISuggestionsCard';
import { EnhancedAISuggestionsWidget } from './EnhancedAISuggestionsWidget';
import { DynamicLayoutIcon } from './DynamicLayoutIcon';
import { createDragData } from '@/utils/dragDropUtils';
import { generateUniqueId } from '@/utils/blockUtils';

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
  { id: 'text', name: 'Text', icon: <Type className="w-5 h-5" /> },
  { id: 'image', name: 'Image', icon: <Image className="w-5 h-5" /> },
  { id: 'button', name: 'Button', icon: <MousePointer className="w-5 h-5" /> },
  { id: 'spacer', name: 'Spacer', icon: <Space className="w-5 h-5" /> },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-5 h-5" /> },
  { id: 'video', name: 'Video', icon: <Video className="w-5 h-5" /> },
  { id: 'social', name: 'Social', icon: <Share2 className="w-5 h-5" /> },
  { id: 'html', name: 'HTML', icon: <Code className="w-5 h-5" /> },
  { id: 'table', name: 'Table', icon: <Table className="w-5 h-5" /> }
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
  onToggleAIAnalytics?: () => void;
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
  const [showButtons, setShowButtons] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showTextHeadings, setShowTextHeadings] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('New Email Campaign');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draggedLayout, setDraggedLayout] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem('email-builder-draft');
    if (savedDraft) {
      try {
        const { title } = JSON.parse(savedDraft);
        if (title) {
          setCampaignTitle(title);
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  const createLayoutConfig = (layout: LayoutOption) => {
    const columnElements = Array.from({ length: layout.columns }, (_, index) => ({
      id: generateUniqueId(),
      blocks: [],
      width: layout.preview[index] || `${100 / layout.columns}%`
    }));

    return {
      columnCount: layout.columns,
      columnRatio: layout.ratio,
      columns: columnElements,
      gap: '16px'
    };
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    console.log('OmnipresentRibbon: Starting block drag:', blockType);
    const dragData = createDragData({ blockType });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayoutDragStart = (e: React.DragEvent, layout: LayoutOption) => {
    console.log('OmnipresentRibbon: Starting layout drag:', layout.name);
    setDraggedLayout(layout.id);
    
    const layoutConfig = createLayoutConfig(layout);
    const dragData = createDragData({
      blockType: 'columns',
      isLayout: true,
      layoutData: layoutConfig
    });

    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';

    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-white border-2 border-blue-400 rounded-lg p-3 shadow-lg';
    dragPreview.style.transform = 'rotate(2deg)';
    dragPreview.innerHTML = `
      <div class="text-sm font-medium text-blue-700 mb-2">${layout.name}</div>
      <div class="flex gap-1 h-6">
        ${layout.preview.map(width => `<div class="bg-blue-200 rounded border" style="width: ${width}"></div>`).join('')}
      </div>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 60, 30);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayout(null);
  };

  const handleLayoutSelect = (layout: LayoutOption) => {
    console.log('OmnipresentRibbon: Layout clicked:', layout.name);
    const layoutConfig = createLayoutConfig(layout);
    onBlockAdd('columns', layoutConfig);
  };

  const closeAllPanels = () => {
    setShowButtons(false);
    setShowLinks(false);
    setShowEmailSettings(false);
    setShowTextHeadings(false);
    setShowAISuggestions(false);
  };

  const handleAISuggestionsClick = () => {
    closeAllPanels();
    setShowAISuggestions(!showAISuggestions);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || `email_${timestamp}`;
    
    const htmlBlob = new Blob([emailHTML], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `${fileName}.html`;
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlUrl);

    const emailData = {
      title: campaignTitle,
      subject: subjectLine,
      html: emailHTML,
      exportedAt: new Date().toISOString()
    };
    const jsonBlob = new Blob([JSON.stringify(emailData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${fileName}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);

    console.log('Email exported as HTML and JSON');
  };

  const handleSave = () => {
    const draftData = {
      title: campaignTitle,
      subject: subjectLine,
      html: emailHTML,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('email-builder-draft', JSON.stringify(draftData));
    console.log('Email saved to localStorage');
  };

  const handleDeleteCanvas = () => {
    if (confirm('Are you sure you want to clear all content? This will also clear your saved draft.')) {
      localStorage.removeItem('email-builder-draft');
      console.log('Canvas cleared and draft removed');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      <EnhancedAISuggestionsWidget
        isOpen={showAISuggestions}
        onToggle={() => setShowAISuggestions(!showAISuggestions)}
        emailHTML={emailHTML}
        subjectLine={subjectLine}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectLineChange}
        onApplySuggestion={(suggestion) => {
          console.log('Applied suggestion:', suggestion);
        }}
      />

      {/* Top Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
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
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
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
        
        {/* Fixed Desktop/Mobile Toggle with Better Text Visibility */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreviewModeChange?.('desktop')}
              className={`flex items-center gap-2 h-8 px-3 rounded-md transition-all ${
                previewMode === 'desktop' 
                  ? 'bg-white shadow-sm text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="text-sm">Desktop</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreviewModeChange?.('mobile')}
              className={`flex items-center gap-2 h-8 px-3 rounded-md transition-all ${
                previewMode === 'mobile' 
                  ? 'bg-white shadow-sm text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">Mobile</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteCanvas}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Toolbar - Centered with bigger icons but reduced height */}
      <div className="px-3 py-1">
        <div className="flex items-center justify-center gap-3 overflow-x-auto">
          {/* Content Blocks */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              {blockItems.map((block) => (
                <Button
                  key={block.id}
                  variant="ghost"
                  size="sm"
                  className="p-2 cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onClick={() => onBlockAdd(block.id)}
                  title={`Add ${block.name}`}
                >
                  {React.cloneElement(block.icon as React.ReactElement, { className: "w-6 h-6" })}
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Layout Options */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              {layoutOptions.map((layout) => (
                <Button
                  key={layout.id}
                  variant="ghost"
                  size="sm"
                  className={`p-2 cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                    draggedLayout === layout.id ? 'bg-blue-100 scale-105' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleLayoutDragStart(e, layout)}
                  onDragEnd={handleLayoutDragEnd}
                  onClick={() => handleLayoutSelect(layout)}
                  title={`Add ${layout.name} Layout`}
                >
                  <DynamicLayoutIcon layout={layout} className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Tool Buttons */}
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              <Button
                variant={showEmailSettings ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => {
                  closeAllPanels();
                  setShowEmailSettings(!showEmailSettings);
                }}
                title="Email Settings"
              >
                <Settings className="w-6 h-6" />
              </Button>

              <Button
                variant={showTextHeadings ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => {
                  closeAllPanels();
                  setShowTextHeadings(!showTextHeadings);
                }}
                title="Text & Headings"
              >
                <Type className="w-6 h-6" />
              </Button>

              <Button
                variant={showButtons ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => {
                  closeAllPanels();
                  setShowButtons(!showButtons);
                }}
                title="Buttons & Links"
              >
                <MousePointer className="w-6 h-6" />
              </Button>

              <Button
                variant={showLinks ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => {
                  closeAllPanels();
                  setShowLinks(!showLinks);
                }}
                title="Links"
              >
                <Link className="w-6 h-6" />
              </Button>

              <Button
                variant={showAISuggestions ? 'default' : 'ghost'}
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={handleAISuggestionsClick}
                title="AI Suggestions"
              >
                <Lightbulb className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panels */}
      <EmailSettingsCard
        isOpen={showEmailSettings}
        onToggle={() => setShowEmailSettings(!showEmailSettings)}
        onStylesChange={onGlobalStylesChange}
      />

      <TextHeadingsCard
        isOpen={showTextHeadings}
        onToggle={() => setShowTextHeadings(!showTextHeadings)}
        onStylesChange={onGlobalStylesChange}
      />

      <ButtonsLinksCard
        isOpen={showButtons}
        onToggle={() => setShowButtons(!showButtons)}
        onStylesChange={onGlobalStylesChange}
      />

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
              onClick={() => setShowLinks(false)}
              className="text-gray-500"
            >
              ×
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
