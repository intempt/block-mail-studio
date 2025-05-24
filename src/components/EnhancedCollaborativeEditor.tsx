
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, MessageSquare, Users, Settings } from 'lucide-react';
import { CollaborationProvider, useCollaboration } from './CollaborationProvider';
import { PresenceIndicator } from './PresenceIndicator';
import { CommentSystem } from './CommentSystem';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface EnhancedCollaborativeEditorProps {
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
  onContentChange?: (html: string) => void;
  onEditorReady?: (editor: any) => void;
}

const EditorContent_: React.FC<EnhancedCollaborativeEditorProps> = ({
  documentId,
  userId,
  userName,
  userColor = '#3B82F6',
  onContentChange,
  onEditorReady
}) => {
  const { ydoc, provider } = useCollaboration();
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable history extension for collaboration
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName,
          color: userColor,
        },
      }),
    ],
    content: `
      <div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
            Collaborative Email Editor
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Start collaborating on your email with real-time editing, live cursors, and Google Docs-style comments.
          </p>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Select text to add comments or see other users' cursors in real-time as they edit. Use <strong>Ctrl+B</strong> for bold, <strong>Ctrl+I</strong> for italic, <strong>Ctrl+K</strong> for links.
          </p>
        </div>
      </div>
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);
    },
  });

  // Pass editor instance to parent when ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Set up keyboard shortcuts for collaboration mode
  useKeyboardShortcuts({
    editor,
    canvasRef: undefined,
    onToggleLeftPanel: () => {},
    onToggleRightPanel: () => {},
    onToggleFullscreen: () => {},
    onSave: () => {},
    collaborationMode: true
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* Collaboration Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Collaborative Email Editor
          </h2>
          <PresenceIndicator />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Comments
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareDialog(true)}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <div className="h-full overflow-hidden">
          <EditorContent 
            editor={editor} 
            className="h-full prose max-w-none focus:outline-none p-6 overflow-y-auto"
          />
        </div>

        {/* Comment System Overlay */}
        <CommentSystem 
          isOpen={showComments}
          onClose={() => setShowComments(false)}
        />
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Real-time collaborative editing enabled</span>
          <div className="flex items-center gap-4">
            <span>Document: {documentId}</span>
            <span>User: {userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EnhancedCollaborativeEditor: React.FC<EnhancedCollaborativeEditorProps> = (props) => {
  return (
    <CollaborationProvider
      documentId={props.documentId}
      userId={props.userId}
      userName={props.userName}
      userColor={props.userColor}
    >
      <EditorContent_ {...props} />
    </CollaborationProvider>
  );
};
