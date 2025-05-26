
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

export default function EmailEditor({ 
  initialHTML = '', 
  initialSubject = '', 
  onBack 
}: { 
  initialHTML?: string; 
  initialSubject?: string; 
  onBack?: () => void;
}) {
  const [emailHTML, setEmailHTML] = useState(initialHTML);
  const [subjectLine, setSubjectLine] = useState(initialSubject);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [leftPanel, setLeftPanel] = useState<LeftPanelTab>('blocks');
  const [universalContent] = useState<UniversalContent[]>([]);
  const [editorReady, setEditorReady] = useState(false);

  // Stabilize extensions array to prevent recreating editor on every render
  const extensions = useMemo(() => [
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
  ], []);

  // Handle content changes from editor
  const handleEditorUpdate = useCallback(({ editor }: any) => {
    const newHTML = editor.getHTML();
    setEmailHTML(newHTML);
  }, []);

  const editor = useEditor({
    extensions,
    content: emailHTML,
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  }, [extensions]); // Only depend on extensions, not content

  // Set initial content when editor is ready
  useEffect(() => {
    if (editor && !editorReady) {
      if (initialHTML) {
        editor.commands.setContent(initialHTML);
        setEmailHTML(initialHTML);
      }
      setEditorReady(true);
    }
  }, [editor, initialHTML, editorReady]);

  // Set initial subject when component mounts
  useEffect(() => {
    if (initialSubject && !subjectLine) {
      setSubjectLine(initialSubject);
    }
  }, [initialSubject, subjectLine]);

  useEffect(() => {
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
      emailHTML,
      subjectLine,
      existingTemplateNames
    );
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(emailHTML);
  };

  const handleSyncFromCode = () => {
    if (editor) {
      editor.commands.setContent(emailHTML);
    }
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    setEmailHTML(template.html);
    setSubjectLine(template.subject);
    if (editor) {
      editor.commands.setContent(template.html);
    }
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

  const handleContentChange = (content: string) => {
    setEmailHTML(content);
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const renderLeftPanel = () => {
    switch (leftPanel) {
      case 'blocks':
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
        return (
          <GlobalStylesPanel
            onStylesChange={handleGlobalStylesChange}
          />
        );
      case 'properties':
        return (
          <PropertyEditorPanel
            selectedBlock={selectedBlock}
            onBlockUpdate={handleBlockUpdate}
          />
        );
      case 'performance':
        return (
          <PerformanceBrandPanel
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            editor={editor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
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
            value={subjectLine}
            onChange={setSubjectLine}
            emailContent={emailHTML}
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

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setLeftPanel('blocks')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'blocks'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4" />
                  Blocks
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('design')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'design'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </div>
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => setLeftPanel('properties')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'properties'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Properties
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('performance')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'performance'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {renderLeftPanel()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
              <EmailBlockCanvas
                onContentChange={handleContentChange}
                onBlockSelect={handleBlockSelect}
                previewWidth={600}
                previewMode="desktop"
                compactMode={false}
              />
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="border-b border-gray-200 p-4">
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
            
            <div className="flex-1 overflow-hidden">
              <EmailCodeEditor
                editor={editor}
                initialHtml={emailHTML}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <EmailPreview
          html={emailHTML}
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
