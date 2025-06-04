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
  Upload,
  Monitor,
  Smartphone,
  Save,
  Settings,
  Edit3,
  Trash2,
  Minus,
  Code
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { ButtonsCard } from './ButtonsCard';
import { LinksCard } from './LinksCard';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { EnhancedAISuggestionsWidget } from './EnhancedAISuggestionsWidget';
import { DynamicLayoutIcon } from './DynamicLayoutIcon';
import { EmailImportDialog } from './dialogs/EmailImportDialog';
import { EmailExportDialog } from './dialogs/EmailExportDialog';
import { createDragData } from '@/utils/dragDropUtils';
import { generateUniqueId } from '@/utils/blockUtils';
import { EmailBlock } from '@/types/emailBlocks';

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
  { id: 'text', name: 'Text', icon: <Type className="w-8 h-8" /> },
  { id: 'image', name: 'Image', icon: <Image className="w-8 h-8" /> },
  { id: 'button', name: 'Button', icon: <MousePointer className="w-8 h-8" /> },
  { id: 'spacer', name: 'Spacer', icon: <Space className="w-8 h-8" /> },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-8 h-8" /> },
  { id: 'video', name: 'Video', icon: <Video className="w-8 h-8" /> },
  { id: 'social', name: 'Social', icon: <Share2 className="w-8 h-8" /> },
  { id: 'html', name: 'HTML', icon: <Code className="w-8 h-8" /> },
  { id: 'table', name: 'Table', icon: <Table className="w-8 h-8" /> }
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
  onImportBlocks?: (blocks: EmailBlock[], subject?: string) => void;
  blocks: EmailBlock[];
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
  onSubjectLineChange,
  onToggleAIAnalytics,
  onImportBlocks,
  blocks
}) => {
  const [showButtons, setShowButtons] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showTextHeadings, setShowTextHeadings] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
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
  };

  const handleExport = () => {
    console.log('OmnipresentRibbon: Opening export dialog with blocks:', blocks.length);
    setShowExportDialog(true);
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

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const handleImportBlocks = (blocks: EmailBlock[], subject?: string) => {
    if (onImportBlocks) {
      onImportBlocks(blocks, subject);
    }
    setShowImportDialog(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Top Header - Increased padding */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
        
        <div className="flex items-center gap-6">
          {onBack && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              <span className="text-base font-medium">Back</span>
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className="text-2xl font-semibold border-none p-0 h-auto focus:ring-0 focus:border-none text-lg"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{campaignTitle}</h1>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-blue-50 h-8 w-8 p-0 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Desktop/Mobile Toggle */}
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-gray-100 rounded-xl p-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onPreviewModeChange?.('desktop')}
              className={`flex items-center gap-3 h-12 px-6 rounded-lg transition-all duration-200 ${
                previewMode === 'desktop' 
                  ? 'bg-white shadow-md text-gray-900 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-base">Desktop</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onPreviewModeChange?.('mobile')}
              className={`flex items-center gap-3 h-12 px-6 rounded-lg transition-all duration-200 ${
                previewMode === 'mobile' 
                  ? 'bg-white shadow-md text-gray-900 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-base">Mobile</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleDeleteCanvas}
            className="flex items-center gap-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-base font-medium">Delete</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={handleImport} variant="outline" size="lg" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200">
            <Upload className="w-5 h-5 mr-3" />
            <span className="text-base font-medium">Import</span>
          </Button>
          <Button onClick={handleExport} variant="outline" size="lg" className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-200">
            <Download className="w-5 h-5 mr-3" />
            <span className="text-base font-medium">Export</span>
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <Save className="w-5 h-5 mr-3" />
            <span className="text-base font-medium">Save</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Toolbar - Much bigger buttons and spacing */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-center gap-6 overflow-x-auto">
          {/* Content Blocks */}
          <div className="flex-shrink-0">
            <div className="flex gap-3">
              {blockItems.map((block) => (
                <Button
                  key={block.id}
                  variant="ghost"
                  size="lg"
                  className="p-6 min-w-[80px] min-h-[80px] cursor-grab active:cursor-grabbing hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:border-blue-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onClick={() => onBlockAdd(block.id)}
                  title={`Add ${block.name}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {React.cloneElement(block.icon as React.ReactElement, { className: "w-8 h-8" })}
                    <span className="text-xs font-medium">{block.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-16" />

          {/* Layout Options */}
          <div className="flex-shrink-0">
            <div className="flex gap-3">
              {layoutOptions.map((layout) => (
                <Button
                  key={layout.id}
                  variant="ghost"
                  size="lg"
                  className={`p-6 min-w-[80px] min-h-[80px] cursor-grab active:cursor-grabbing hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 hover:text-green-600 hover:border-green-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md ${
                    draggedLayout === layout.id ? 'bg-green-100 scale-105 border-green-200' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleLayoutDragStart(e, layout)}
                  onDragEnd={handleLayoutDragEnd}
                  onClick={() => handleLayoutSelect(layout)}
                  title={`Add ${layout.name} Layout`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <DynamicLayoutIcon layout={layout} className="w-8 h-8" />
                    <span className="text-xs font-medium">{layout.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-16" />

          {/* Tool Buttons */}
          <div className="flex-shrink-0">
            <div className="flex gap-3">
              <Button
                variant={showEmailSettings ? 'default' : 'ghost'}
                size="lg"
                className="p-6 min-w-[80px] min-h-[80px] hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 hover:border-purple-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  closeAllPanels();
                  setShowEmailSettings(!showEmailSettings);
                }}
                title="Email Settings"
              >
                <div className="flex flex-col items-center gap-2">
                  <Settings className="w-8 h-8" />
                  <span className="text-xs font-medium">Settings</span>
                </div>
              </Button>

              <Button
                variant={showTextHeadings ? 'default' : 'ghost'}
                size="lg"
                className="p-6 min-w-[80px] min-h-[80px] hover:bg-gradient-to-br hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 hover:border-orange-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  closeAllPanels();
                  setShowTextHeadings(!showTextHeadings);
                }}
                title="Text & Headings"
              >
                <div className="flex flex-col items-center gap-2">
                  <Type className="w-8 h-8" />
                  <span className="text-xs font-medium">Text</span>
                </div>
              </Button>

              <Button
                variant={showButtons ? 'default' : 'ghost'}
                size="lg"
                className="p-6 min-w-[80px] min-h-[80px] hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-600 hover:border-indigo-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  closeAllPanels();
                  setShowButtons(!showButtons);
                }}
                title="Buttons"
              >
                <div className="flex flex-col items-center gap-2">
                  <MousePointer className="w-8 h-8" />
                  <span className="text-xs font-medium">Buttons</span>
                </div>
              </Button>

              <Button
                variant={showLinks ? 'default' : 'ghost'}
                size="lg"
                className="p-6 min-w-[80px] min-h-[80px] hover:bg-gradient-to-br hover:from-teal-50 hover:to-cyan-50 hover:text-teal-600 hover:border-teal-200 border-2 border-transparent transition-all duration-300 transform hover:scale-105 rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  closeAllPanels();
                  setShowLinks(!showLinks);
                }}
                title="Links"
              >
                <div className="flex flex-col items-center gap-2">
                  <Link className="w-8 h-8" />
                  <span className="text-xs font-medium">Links</span>
                </div>
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

      <ButtonsCard
        isOpen={showButtons}
        onToggle={() => setShowButtons(!showButtons)}
        onStylesChange={onGlobalStylesChange}
      />

      <LinksCard
        isOpen={showLinks}
        onToggle={() => setShowLinks(!showLinks)}
        onStylesChange={onGlobalStylesChange}
      />

      <EmailImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportBlocks}
      />

      <EmailExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        blocks={blocks}
        subject={subjectLine}
        emailHTML={emailHTML}
        campaignTitle={campaignTitle}
      />
    </div>
  );
};

export default OmnipresentRibbon;
