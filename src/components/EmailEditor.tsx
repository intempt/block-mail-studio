
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
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { EmailPreview } from './EmailPreview';
import { EmailBlockCanvas, EmailBlockCanvasRef } from './EmailBlockCanvas';
import { RibbonInterface } from './ribbon/RibbonInterface';
import { StatusBar } from './ribbon/StatusBar';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const canvasRef = useRef<EmailBlockCanvasRef>(null);

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
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setEmailBlocks(prev => prev.filter(block => block.id !== blockId));
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

  const handleContentChangeFromCanvas = (newContent: string) => {
    onContentChange(newContent);
  };

  const handleBlockSelect = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };

  const handlePreviewModeChange = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Professional Ribbon Interface */}
      <RibbonInterface
        onContentChange={handleContentChangeFromCanvas}
        onBlockAdd={handleBlockAdd}
        onSnippetAdd={handleSnippetAdd}
        onGlobalStylesChange={handleGlobalStylesChange}
        selectedBlockId={selectedBlockId}
        emailHTML={content}
        subjectLine={subject}
        editor={editor}
        canvasRef={canvasRef}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
          <div className="max-w-4xl mx-auto">
            <EmailBlockCanvas
              ref={canvasRef}
              onContentChange={handleContentChangeFromCanvas}
              onBlockSelect={handleBlockSelect}
              previewWidth={600}
              previewMode={previewMode}
              compactMode={false}
              subject={subject}
              onSubjectChange={onSubjectChange}
            />
          </div>
        </div>

        {/* Professional Status Bar */}
        <StatusBar
          selectedBlockId={selectedBlockId}
          canvasWidth={previewMode === 'mobile' ? 375 : 600}
          previewMode={previewMode}
          wordCount={content.split(' ').length}
          blockCount={emailBlocks.length}
          onPreviewModeChange={handlePreviewModeChange}
        />
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
