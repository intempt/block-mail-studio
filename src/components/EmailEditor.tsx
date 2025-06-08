
import React, { useRef, useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { OmnipresentRibbon } from './OmnipresentRibbon';
import { EmailEditorLayout } from './EmailEditorLayout';
import { EmailEditorModals } from './EmailEditorModals';
import { UndoManager } from './UndoManager';
import { useNotification } from '@/contexts/NotificationContext';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';
import { useEmailEditorState } from '@/hooks/useEmailEditorState';
import { useEmailEditorHandlers } from '@/hooks/useEmailEditorHandlers';

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

  const { notifications, removeNotification, success } = useNotification();
  const canvasRef = useRef<any>(null);

  // Use custom hooks for state and handlers
  const {
    emailBlocks,
    setEmailBlocks,
    showPreview,
    setShowPreview,
    showTemplateLibrary,
    setShowTemplateLibrary,
    templates,
    universalContent,
    snippetRefreshTrigger,
    setSnippetRefreshTrigger,
    showAIAnalytics,
    setShowAIAnalytics,
    selectedBlockId,
    setSelectedBlockId,
    canvasWidth,
    setCanvasWidth,
    deviceMode,
    previewMode,
    setPreviewMode,
    viewMode,
    emailContent,
    setEmailContent
  } = useEmailEditorState(content, subject);

  const {
    handleBlockAdd,
    handleSnippetAdd,
    handleContentChange,
    handleDeviceChange,
    handleViewModeChange,
    handleImportBlocks,
    handleSaveTemplate,
    handlePublish,
    handlePreview
  } = useEmailEditorHandlers({
    canvasRef,
    onContentChange,
    onSubjectChange,
    setEmailContent,
    setTemplates: () => {},
    setDeviceMode: () => {},
    setCanvasWidth,
    setPreviewMode,
    setViewMode: () => {},
    setShowPreview,
    canvasWidth
  });

  // Handle blocks change from canvas
  const handleBlocksChange = (blocks: any[]) => {
    console.log('EmailEditor: Received blocks update from canvas:', blocks.length);
    setEmailBlocks(blocks);
  };

  console.log('EmailEditor: Creating TipTap editor');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
      Color,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your email content...',
      }),
    ],
    content: emailContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEmailContent(html);
      onContentChange(html);
    },
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  // Sync emailContent when content prop changes
  useEffect(() => {
    if (content !== emailContent) {
      console.log('EmailEditor: Updating editor content from prop');
      setEmailContent(content);
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }
  }, [content, emailContent, editor, setEmailContent]);

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <InlineNotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Omnipresent Ribbon */}
      <OmnipresentRibbon
        onBlockAdd={handleBlockAdd}
        onSnippetAdd={handleSnippetAdd}
        universalContent={universalContent}
        onUniversalContentAdd={() => {}}
        onGlobalStylesChange={() => {}}
        emailHTML={emailContent}
        subjectLine={subject}
        editor={editor}
        snippetRefreshTrigger={snippetRefreshTrigger}
        onTemplateLibraryOpen={() => setShowTemplateLibrary(true)}
        onPreviewModeChange={setPreviewMode}
        previewMode={previewMode}
        onBack={onBack}
        canvasWidth={canvasWidth}
        deviceMode={deviceMode}
        onDeviceChange={handleDeviceChange}
        onWidthChange={setCanvasWidth}
        onPreview={handlePreview}
        onSaveTemplate={handleSaveTemplate}
        onPublish={handlePublish}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectChange}
        onToggleAIAnalytics={() => setShowAIAnalytics(!showAIAnalytics)}
        onImportBlocks={handleImportBlocks}
        blocks={emailBlocks}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Main Content Area */}
      <EmailEditorLayout
        viewMode={viewMode}
        canvasRef={canvasRef}
        handleContentChange={handleContentChange}
        setSelectedBlockId={setSelectedBlockId}
        handleBlocksChange={handleBlocksChange}
        canvasWidth={canvasWidth}
        previewMode={previewMode}
        subject={subject}
        onSubjectChange={onSubjectChange}
        showAIAnalytics={showAIAnalytics}
        snippetRefreshTrigger={snippetRefreshTrigger}
        setSnippetRefreshTrigger={setSnippetRefreshTrigger}
        handleSnippetAdd={handleSnippetAdd}
      />

      {/* Modals */}
      <EmailEditorModals
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        emailContent={emailContent}
        previewMode={previewMode}
        subject={subject}
        showTemplateLibrary={showTemplateLibrary}
        setShowTemplateLibrary={setShowTemplateLibrary}
        templates={templates}
        canvasRef={canvasRef}
        onSubjectChange={onSubjectChange}
        success={success}
      />

      {/* Undo Manager */}
      <UndoManager 
        blocks={emailBlocks} 
        onUndo={() => {}}
        onRedo={() => {}}
      />
    </div>
  );
}
