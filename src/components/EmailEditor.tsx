import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  Send,
  Copy,
  RefreshCw,
  Layers,
  Palette,
  Settings,
  BarChart3
} from 'lucide-react';
import { EmailCodeEditor } from './EmailCodeEditor';
import { EmailPreview } from './EmailPreview';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { PropertyEditorPanel } from './PropertyEditorPanel';
import { PerformanceBrandPanel } from './PerformanceBrandPanel';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { EnhancedEmailSubjectLine } from './EnhancedEmailSubjectLine';
import { EmailTemplate } from './TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

interface Block {
  id: string;
  type: string;
  content: string;
  styles: Record<string, string>;
}

interface LayoutConfig {
  direction: 'row' | 'column';
  alignItems: 'start' | 'center' | 'end';
  justifyContent: 'start' | 'center' | 'space-between';
}

type LeftPanelTab = 'blocks' | 'design' | 'properties' | 'performance';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  onBack?: () => void;
}

export default function EmailEditor({ 
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack 
}: EmailEditorProps) {
  console.log('EmailEditor: Component starting to render');

  // Local UI state only - no content state
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [leftPanel, setLeftPanel] = useState<LeftPanelTab>('blocks');
  const [universalContent] = useState<UniversalContent[]>([]);

  // Stable layout config
  const layoutConfig = useMemo<LayoutConfig>(() => ({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  }), []);

  console.log('EmailEditor: State initialized, creating extensions');

  // Stable extensions array
  const extensions = useMemo(() => {
    console.log('EmailEditor: Creating TipTap extensions');
    return [
      StarterKit.configure({
        history: false,
      }),
      Underline,
      Link,
      Image,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ];
  }, []);

  // Stable update handler
  const handleEditorUpdate = useCallback(({ editor }) => {
    const newContent = editor.getHTML();
    onContentChange(newContent);
  }, [onContentChange]);

  console.log('EmailEditor: About to create TipTap editor');

  // Create editor once with stable configuration
  const editor = useEditor({
    extensions,
    content: '', // Start with empty content
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      console.log('EmailEditor: Updating editor content from prop');
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Load templates once
  useEffect(() => {
    console.log('EmailEditor: Loading templates');
    const initialTemplates = DirectTemplateService.getAllTemplates();
    setTemplates(initialTemplates);
  }, []);

  // Update selected block when selectedBlockId changes
  useEffect(() => {
    if (selectedBlockId) {
      const block = emailBlocks.find(b => b.id === selectedBlockId);
      setSelectedBlock(block || null);
    } else {
      setSelectedBlock(null);
    }
  }, [selectedBlockId, emailBlocks]);

  const handleBlockAdd = (blockType: string, layoutConfig?: any) => {
    if (!editor) return;

    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: `New ${blockType} block`,
      styles: {}
    };

    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
  };

  const handleBlockUpdate = (block: EmailBlock) => {
    setEmailBlocks(prev => 
      prev.map(b => b.id === block.id ? block : b)
    );
    if (selectedBlock && selectedBlock.id === block.id) {
      setSelectedBlock(block);
    }
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setEmailBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  const handleGlobalStylesChange = (styles: any) => {
    // Apply styles to all blocks or the canvas
    console.log('Applying global styles:', styles);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePublish = async () => {
    // Save template on publish
    const existingTemplateNames = templates.map(t => t.name);
    const newTemplate = DirectTemplateService.savePublishedTemplate(
      content,
      subject,
      existingTemplateNames
    );
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(content);
  };

  const handleSyncFromCode = () => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    onContentChange(template.html);
    onSubjectChange(template.subject);
  };

  const handleSaveAsTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const newTemplate = DirectTemplateService.saveTemplate(template);
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleSnippetAdd = (snippet: EmailSnippet) => {
    // Handle snippet addition
    console.log('Adding snippet:', snippet);
  };

  const handleUniversalContentAdd = (content: UniversalContent) => {
    // Handle universal content addition
    console.log('Adding universal content:', content);
  };

  const handleBlockSelect = (block: any) => {
    if (block) {
      setSelectedBlockId(block.id);
    } else {
      setSelectedBlockId(null);
    }
  };

  const handleContentChangeFromCanvas = (newContent: string) => {
    onContentChange(newContent);
  };

  const renderLeftPanel = () => {
    console.log('EmailEditor: Rendering left panel', { leftPanel });
    try {
      switch (leftPanel) {
        case 'blocks':
          console.log('EmailEditor: Rendering blocks panel');
          return (
            <EnhancedEmailBlockPalette
              onBlockAdd={handleBlockAdd}
              onSnippetAdd={handleSnippetAdd}
              universalContent={universalContent}
              onUniversalContentAdd={handleUniversalContentAdd}
              compactMode={false}
              snippetRefreshTrigger={0}
            />
          );
        case 'design':
          console.log('EmailEditor: Rendering design panel');
          return (
            <GlobalStylesPanel
              onStylesChange={handleGlobalStylesChange}
            />
          );
        case 'properties':
          console.log('EmailEditor: Rendering properties panel');
          return (
            <PropertyEditorPanel
              selectedBlock={selectedBlock}
              onBlockUpdate={handleBlockUpdate}
            />
          );
        case 'performance':
          console.log('EmailEditor: Rendering performance panel');
          return (
            <PerformanceBrandPanel
              emailHTML={content}
              subjectLine={subject}
              editor={editor}
            />
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('EmailEditor: Error rendering left panel:', error);
      return <div>Error loading panel</div>;
    }
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
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
          <h1 className="text-xl font-semibold text-gray-900">Email Builder</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <EnhancedEmailSubjectLine
            value={subject}
            onChange={onSubjectChange}
            emailContent={content}
          />
          <Button onClick={handlePreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-2">
              <button
                onClick={() => setLeftPanel('blocks')}
                className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'blocks'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs">Blocks</span>
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('design')}
                className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'design'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs">Design</span>
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('properties')}
                className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'properties'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Props</span>
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('performance')}
                className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'performance'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Analytics</span>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto min-h-0">
            <div className="h-full">
              {renderLeftPanel()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
            <div className="max-w-2xl mx-auto">
              <EmailBlockCanvas
                onContentChange={handleContentChangeFromCanvas}
                onBlockSelect={handleBlockSelect}
                previewWidth={600}
                previewMode="desktop"
                compactMode={false}
              />
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 min-h-0">
            <div className="border-b border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">HTML Code</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSyncFromCode}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden min-h-0">
              <EmailCodeEditor
                editor={editor}
                initialHtml={content}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <EmailPreview
          html={content}
          previewMode={previewMode}
        />
      )}

      {showTemplateLibrary && (
        <EmailTemplateLibrary
          editor={editor}
        />
      )}
    </div>
  );
}
