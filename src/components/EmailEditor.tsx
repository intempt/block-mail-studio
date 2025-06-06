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
import { OmnipresentRibbon } from './OmnipresentRibbon';
import { SnippetRibbon } from './SnippetRibbon';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { CanvasStatus } from './canvas/CanvasStatus';
import { EmailTemplate } from './TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';
import { IntegratedGmailPreview } from './IntegratedGmailPreview';
import { useNotification } from '@/contexts/NotificationContext';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';
import { UndoManager } from './UndoManager';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

export default function EmailEditor({ 
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack 
}: EmailEditorProps) {
  console.log('EmailEditor: Component starting to render');

  const { notifications, removeNotification, success, error, warning } = useNotification();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [showAIAnalytics, setShowAIAnalytics] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showGmailPreview, setShowGmailPreview] = useState(false);
  const [gmailPreviewMode, setGmailPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Replace showIntegratedPreview with viewMode
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  const canvasRef = useRef<any>(null);
  const undoManagerRef = useRef<any>(null);

  const layoutConfig = useMemo<LayoutConfig>(() => ({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  }), []);

  console.log('EmailEditor: State initialized, creating extensions');

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

  const handleEditorUpdate = useCallback(({ editor }) => {
    const newContent = editor.getHTML();
    onContentChange(newContent);
  }, [onContentChange]);

  console.log('EmailEditor: About to create TipTap editor');

  const editor = useEditor({
    extensions,
    content: '',
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      console.log('EmailEditor: Updating editor content from prop');
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    console.log('EmailEditor: Loading templates');
    const initialTemplates = DirectTemplateService.getAllTemplates();
    setTemplates(initialTemplates);
  }, []);

  // Handle blocks change from canvas
  const handleBlocksChange = useCallback((newBlocks: EmailBlock[]) => {
    console.log('EmailEditor: Received blocks update from canvas:', newBlocks.length);
    setEmailBlocks(newBlocks);
  }, []);

  // New handler for state restoration from UndoManager
  const handleStateRestore = useCallback((state: any) => {
    console.log('EmailEditor: Restoring state -', state.description);
    
    // Update email blocks
    setEmailBlocks(state.blocks);
    
    // Update subject
    onSubjectChange(state.subject);
    
    // Update canvas with restored blocks
    if (canvasRef.current && canvasRef.current.replaceAllBlocks) {
      canvasRef.current.replaceAllBlocks(state.blocks);
    }
    
    console.log('EmailEditor: State restored successfully');
  }, [onSubjectChange]);

  // Undo/Redo handlers for keyboard shortcuts
  const handleUndo = useCallback(() => {
    if (undoManagerRef.current && undoManagerRef.current.handleUndo) {
      undoManagerRef.current.handleUndo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (undoManagerRef.current && undoManagerRef.current.handleRedo) {
      undoManagerRef.current.handleRedo();
    }
  }, []);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    editor,
    canvasRef,
    onToggleLeftPanel: () => {}, // Placeholder
    onToggleRightPanel: () => {}, // Placeholder
    onToggleFullscreen: () => {}, // Placeholder
    onSave: () => {
      // Trigger save functionality
      console.log('Save triggered via keyboard shortcut');
    },
    onUndo: handleUndo,
    onRedo: handleRedo
  });

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

    // Handle layout blocks specifically
    if (blockType === 'columns' && layoutConfig) {
      console.log('EmailEditor: Processing layout configuration:', layoutConfig);
      
      // Create the layout block data structure
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
      
      // Add the block directly to the canvas
      if (canvasRef.current) {
        canvasRef.current.addBlock(newLayoutBlock);
      }
      
      return;
    }

    // Handle regular blocks
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: `New ${blockType} block`,
      styles: {}
    };

    console.log('EmailEditor: Created regular block:', newBlock);
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlocksChange2 = (newBlocks: Block[]) => {
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
      success('Template published successfully');
    } catch (err) {
      error('Failed to publish template. Please try again.');
    }
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    onContentChange(template.html);
    onSubjectChange(template.subject);
    success(`Template "${template.name}" loaded successfully`);
  };

  const handleSaveAsTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const newTemplate = DirectTemplateService.saveTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      setShowTemplateLibrary(false);
      success('Template saved successfully');
    } catch (err) {
      error('Failed to save template. Please try again.');
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
    if (viewMode !== 'edit') {
      setViewMode(mode === 'desktop' ? 'desktop-preview' : 'mobile-preview');
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'desktop-preview') {
      setPreviewMode('desktop');
    } else if (mode === 'mobile-preview') {
      setPreviewMode('mobile');
    }
  };

  const handleTemplateLibraryOpen = () => {
    setShowTemplateLibrary(true);
  };

  const handleSnippetSelect = (snippet: EmailSnippet) => {
    console.log('Adding snippet to canvas:', snippet);
    if (canvasRef.current && snippet.blockData) {
      // Create a new block from the snippet data
      const newBlock: EmailBlock = {
        ...snippet.blockData,
        id: `block-${Date.now()}`, // Generate new unique ID
      };
      canvasRef.current.addBlock(newBlock);
      setSnippetRefreshTrigger(prev => prev + 1);
    }
  };

  const handleToggleAIAnalytics = () => {
    setShowAIAnalytics(prev => !prev);
  };

  const handleBlockSelect = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };

  const handleImportBlocks = (blocks: EmailBlock[], importedSubject?: string) => {
    console.log('EmailEditor: Importing blocks', { blocks, importedSubject });
    
    // Clear existing blocks and replace with imported ones
    setBlocks([]);
    setEmailBlocks(blocks);
    
    // Update subject if provided
    if (importedSubject) {
      onSubjectChange(importedSubject);
    }
    
    // Update canvas with new blocks
    if (canvasRef.current) {
      canvasRef.current.replaceAllBlocks(blocks);
    }
    
    console.log('EmailEditor: Import completed');
  };

  // Handle auto-fix suggestions from AI Analysis Center
  const handleApplyFix = (fix: string) => {
    if (canvasRef.current && canvasRef.current.findAndReplaceText) {
      // Try to apply the fix by finding and replacing content
      canvasRef.current.findAndReplaceText('', fix);
    } else {
      // Fallback: append the fix to the content
      const updatedContent = content + '\n' + fix;
      onContentChange(updatedContent);
    }
    console.log('Applied auto-fix:', fix);
  };

  // New handler for integrated Gmail preview
  const handleToggleIntegratedPreview = () => {
  };

  const handleIntegratedPreviewModeChange = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
    setGmailPreviewMode(mode);
  };

  const handleGmailPreview = (mode: 'desktop' | 'mobile') => {
    setGmailPreviewMode(mode);
    setShowGmailPreview(true);
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div id="email-editor-container" className="h-screen flex flex-col bg-gray-50 relative" data-lov-id="src/components/EmailEditor.tsx">
      <div id="omnipresent-ribbon-wrapper">
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
          onToggleAIAnalytics={handleToggleAIAnalytics}
          onImportBlocks={handleImportBlocks}
          blocks={emailBlocks}
          onGmailPreview={handleGmailPreview}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Contextual Notifications - Position near ribbon */}
      {notifications.length > 0 && (
        <div id="notifications-container" className="px-6 py-2 bg-white border-b border-gray-200">
          <div id="notifications-wrapper">
            <InlineNotificationContainer
              notifications={notifications}
              onRemove={removeNotification}
              maxNotifications={2}
            />
          </div>
        </div>
      )}

      {/* Snippet Ribbon - Only show in edit mode */}
      {viewMode === 'edit' && (
        <div id="snippet-ribbon-wrapper">
          <SnippetRibbon
            onSnippetSelect={handleSnippetSelect}
            refreshTrigger={snippetRefreshTrigger}
          />
        </div>
      )}

      <div id="main-content-area" className="flex-1 overflow-auto bg-gray-100 min-h-0">
        <div id="content-wrapper" className="h-full w-full p-6 relative">
          <div id="canvas-container" className="max-w-4xl mx-auto h-full">
            {/* Edit Mode - Show Canvas */}
            {viewMode === 'edit' && (
              <div id="edit-mode-container" className="h-full transition-all duration-300 ease-in-out">
                <div id="email-block-canvas-wrapper">
                  <EmailBlockCanvas
                    ref={canvasRef}
                    onContentChange={handleContentChangeFromCanvas}
                    onBlockSelect={handleBlockSelect}
                    onBlocksChange={handleBlocksChange}
                    previewWidth={canvasWidth}
                    previewMode={previewMode}
                    compactMode={false}
                    subject={subject}
                    onSubjectChange={onSubjectChange}
                    showAIAnalytics={false}
                  />
                </div>
              </div>
            )}

            {/* Preview Modes - Show Gmail Preview */}
            {(viewMode === 'desktop-preview' || viewMode === 'mobile-preview') && (
              <div id="preview-mode-container" className="h-full transition-all duration-300 ease-in-out">
                <div id="integrated-gmail-preview-wrapper">
                  <IntegratedGmailPreview
                    emailHtml={content}
                    subject={subject}
                    previewMode={viewMode === 'desktop-preview' ? 'desktop' : 'mobile'}
                    onPreviewModeChange={handlePreviewModeChange}
                    fullWidth={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* UndoManager positioned relative to content-wrapper */}
          <div id="undo-manager-container" className="absolute bottom-4 right-4 z-50">
            <UndoManager 
              ref={undoManagerRef}
              blocks={emailBlocks}
              subject={subject}
              onStateRestore={handleStateRestore}
            />
          </div>
        </div>
      </div>

      {/* Unified AI Analysis Center Footer - Always visible */}
      <div id="canvas-status-footer" className="bg-white border-t border-gray-200 shadow-lg">
        <div id="canvas-status-wrapper">
          <CanvasStatus 
            selectedBlockId={selectedBlockId}
            canvasWidth={canvasWidth}
            previewMode={previewMode}
            emailHTML={content}
            subjectLine={subject}
            onApplyFix={handleApplyFix}
          />
        </div>
      </div>

      {/* Keep existing modals */}
      {showPreview && (
        <div id="email-preview-modal">
          <EmailPreview
            html={content}
            previewMode={previewMode}
            subject={subject}
          />
        </div>
      )}

      {showTemplateLibrary && (
        <div id="email-template-library-modal">
          <EmailTemplateLibrary
            editor={editor}
          />
        </div>
      )}
    </div>
  );
}
