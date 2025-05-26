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
  Send
} from 'lucide-react';
import { EmailPreview } from './EmailPreview';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingFallback } from './LoadingFallback';
import { EmailTemplate } from './TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

// Lazy imports with error handling
const OmnipresentRibbon = React.lazy(() => 
  import('./OmnipresentRibbon').catch(() => ({
    default: () => <div className="h-16 bg-gray-100 border-b flex items-center px-4">
      <span className="text-gray-500">Toolbar loading...</span>
    </div>
  }))
);

const EmailTemplateLibrary = React.lazy(() => 
  import('./EmailTemplateLibrary').catch(() => ({
    default: () => <div>Template library unavailable</div>
  }))
);

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

type LeftPanelTab = 'blocks' | 'design' | 'performance';

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

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const canvasRef = useRef<any>(null);

  const layoutConfig = useMemo<LayoutConfig>(() => ({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  }), []);

  console.log('EmailEditor: State initialized, creating extensions');

  const extensions = useMemo(() => {
    console.log('EmailEditor: Creating TipTap extensions');
    try {
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
    } catch (error) {
      console.error('Error creating TipTap extensions:', error);
      setLoadingError('Failed to initialize text editor');
      return [];
    }
  }, []);

  const handleEditorUpdate = useCallback(({ editor }) => {
    try {
      const newContent = editor.getHTML();
      onContentChange(newContent);
    } catch (error) {
      console.error('Error updating editor content:', error);
    }
  }, [onContentChange]);

  console.log('EmailEditor: About to create TipTap editor');

  const editor = useEditor({
    extensions,
    content: '',
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  // Initialize editor and handle loading states
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        setIsLoading(true);
        
        if (editor && editor.getHTML() !== content) {
          console.log('EmailEditor: Updating editor content from prop');
          editor.commands.setContent(content);
        }

        // Simulate loading time for heavy components
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('EmailEditor: Loading templates');
        
        // Load templates with error handling
        try {
          const { DirectTemplateService } = await import('@/services/directTemplateService');
          const initialTemplates = DirectTemplateService.getAllTemplates();
          setTemplates(initialTemplates);
        } catch (error) {
          console.warn('Failed to load templates:', error);
          setTemplates([]);
        }

        setIsLoading(false);
        setLoadingError(null);
      } catch (error) {
        console.error('Failed to initialize editor:', error);
        setLoadingError('Failed to initialize editor');
        setIsLoading(false);
      }
    };

    initializeEditor();
  }, [editor, content]);

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    setDeviceMode(device);
    const widthMap = {
      desktop: 1200,
      tablet: 768,
      mobile: 375,
      custom: canvasWidth
    };
    if (device !== 'custom') {
      setCanvasWidth(widthMap[device]);
    }
    setPreviewMode(device === 'mobile' ? 'mobile' : 'desktop');
  };

  const handleWidthChange = (width: number) => {
    setCanvasWidth(width);
    setDeviceMode('custom');
  };

  const handleBlockAdd = (blockType: string, layoutConfig?: any) => {
    console.log('EmailEditor: handleBlockAdd called with:', { blockType, layoutConfig });
    
    if (!canvasRef.current) {
      console.warn('EmailEditor: Canvas ref not available, cannot add block');
      return;
    }

    if (blockType === 'columns' && layoutConfig) {
      console.log('EmailEditor: Processing layout configuration:', layoutConfig);
      
      const columnCount = layoutConfig.columnCount || layoutConfig.columns || 2;
      const columnRatio = layoutConfig.columnRatio || layoutConfig.ratio || '50-50';
      const columnElements = layoutConfig.columnElements || [];
      
      const newLayoutBlock: EmailBlock = {
        id: `layout-${Date.now()}`,
        type: 'columns',
        content: {
          columnCount: columnCount as 1 | 2 | 3 | 4,
          columnRatio: columnRatio,
          columns: columnElements.length > 0 ? columnElements : Array.from({ length: columnCount }, (_, i) => ({
            id: `col-${i}-${Date.now()}`,
            blocks: [],
            width: `${100 / columnCount}%`
          })),
          gap: '16px'
        },
        styling: {
          desktop: { width: '100%', height: 'auto' },
          tablet: { width: '100%', height: 'auto' },
          mobile: { width: '100%', height: 'auto' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      console.log('EmailEditor: Created layout block:', newLayoutBlock);
      
      if (canvasRef.current) {
        canvasRef.current.addBlock(newLayoutBlock);
      }
      
      return;
    }

    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: `New ${blockType} block`,
      styles: {}
    };

    console.log('EmailEditor: Created regular block:', newBlock);
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
    console.log('Applying global styles:', styles);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePublish = async () => {
    try {
      const existingTemplateNames = templates.map(t => t.name);
      const newTemplate = DirectTemplateService.savePublishedTemplate(
        content,
        subject,
        existingTemplateNames
      );
      setTemplates(prev => [...prev, newTemplate]);
      setShowTemplateLibrary(false);
    } catch (error) {
      console.error('Failed to publish template:', error);
    }
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    onContentChange(template.html);
    onSubjectChange(template.subject);
  };

  const handleSaveAsTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const newTemplate = DirectTemplateService.saveTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      setShowTemplateLibrary(false);
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleSnippetAdd = (snippet: EmailSnippet) => {
    console.log('Adding snippet:', snippet);
    setSnippetRefreshTrigger(prev => prev + 1);
  };

  const handleUniversalContentAdd = (content: UniversalContent) => {
    console.log('Adding universal content:', content);
  };

  const handleContentChangeFromCanvas = (newContent: string) => {
    onContentChange(newContent);
  };

  const handlePreviewModeChange = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
  };

  const handleTemplateLibraryOpen = () => {
    setShowTemplateLibrary(true);
  };

  console.log('EmailEditor: About to render main component');

  // Show loading state
  if (isLoading) {
    return <LoadingFallback message="Initializing email editor..." height="100vh" />;
  }

  // Show error state with recovery option
  if (loadingError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Failed to Load Editor</h2>
          <p className="text-gray-600 mb-4">{loadingError}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Editor Error</h2>
          <p className="text-gray-600 mb-4">The email editor encountered an error.</p>
          <Button onClick={() => window.location.reload()}>
            Reload Editor
          </Button>
        </div>
      </div>
    }>
      <div className="h-screen flex flex-col bg-gray-50">
        <React.Suspense fallback={
          <div className="h-16 bg-white border-b flex items-center px-4">
            <span className="text-gray-500">Loading toolbar...</span>
          </div>
        }>
          <OmnipresentRibbon
            onBlockAdd={handleBlockAdd}
            onSnippetAdd={handleSnippetAdd}
            universalContent={universalContent}
            onUniversalContentAdd={handleUniversalContentAdd}
            onGlobalStylesChange={handleGlobalStylesChange}
            emailHTML={content}
            subjectLine={subject}
            editor={editor}
            snippetRefreshTrigger={snippetRefreshTrigger}
            onTemplateLibraryOpen={handleTemplateLibraryOpen}
            onPreviewModeChange={handlePreviewModeChange}
            previewMode={previewMode}
            onBack={onBack}
            canvasWidth={canvasWidth}
            deviceMode={deviceMode}
            onDeviceChange={handleDeviceChange}
            onWidthChange={handleWidthChange}
            onPreview={handlePreview}
            onSaveTemplate={handleSaveAsTemplate}
            onPublish={handlePublish}
          />
        </React.Suspense>

        <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
          <div className="max-w-4xl mx-auto">
            <ErrorBoundary fallback={
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Canvas failed to load</p>
                <Button onClick={() => window.location.reload()}>
                  Reload Canvas
                </Button>
              </div>
            }>
              <EmailBlockCanvas
                ref={canvasRef}
                onContentChange={handleContentChangeFromCanvas}
                onBlockSelect={() => {}}
                previewWidth={canvasWidth}
                previewMode={previewMode}
                compactMode={false}
                subject={subject}
                onSubjectChange={onSubjectChange}
              />
            </ErrorBoundary>
          </div>
        </div>

        {showPreview && (
          <EmailPreview
            html={content}
            previewMode={previewMode}
          />
        )}

        {showTemplateLibrary && (
          <React.Suspense fallback={<LoadingFallback message="Loading templates..." />}>
            <EmailTemplateLibrary
              editor={editor}
            />
          </React.Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}
