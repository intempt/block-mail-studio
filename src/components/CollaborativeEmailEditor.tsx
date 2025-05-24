
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Comments from '@tiptap/extension-comments';
import { TipTapProCollabService, CollaborationConfig } from '@/services/TipTapProCollabService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface CollaborativeEmailEditorProps {
  documentId: string;
  userId: string;
  userName: string;
  userColor?: string;
  onContentChange?: (html: string) => void;
}

export const CollaborativeEmailEditor: React.FC<CollaborativeEmailEditorProps> = ({
  documentId,
  userId,
  userName,
  userColor = '#3B82F6',
  onContentChange
}) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: null, // Will be configured with Y.js document
      }),
      CollaborationCursor.configure({
        provider: null, // Will be configured with collaboration provider
        user: {
          name: userName,
          color: userColor,
        },
      }),
      Comments.configure({
        HTMLAttributes: {
          class: 'comment',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);
    },
  });

  useEffect(() => {
    const initCollaboration = async () => {
      try {
        await TipTapProCollabService.createDocument(documentId);
        
        const config: CollaborationConfig = {
          documentId,
          userId,
          userName,
          userColor
        };
        
        await TipTapProCollabService.joinCollaboration(config);
        loadCollaborators();
        loadComments();
      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
      }
    };

    initCollaboration();
  }, [documentId, userId, userName, userColor]);

  const loadCollaborators = async () => {
    try {
      const response = await TipTapProCollabService.getCollaborators(documentId);
      const data = await response.json();
      setCollaborators(data.users || []);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await TipTapProCollabService.getComments(documentId);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const generateAIImage = async () => {
    const prompt = window.prompt('Describe the image you want to generate:');
    if (!prompt) return;

    setIsGeneratingImage(true);
    try {
      const imageUrl = await TipTapProCollabService.generateImage(prompt, 'email-professional');
      
      if (editor) {
        editor.chain().focus().setImage({ 
          src: imageUrl, 
          alt: prompt,
          style: 'max-width: 100%; height: auto; border-radius: 8px;'
        }).run();
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const addComment = () => {
    if (!editor) return;
    
    const content = window.prompt('Add a comment:');
    if (!content) return;

    editor.chain().focus().addComment({
      content,
      author: userName
    }).run();

    TipTapProCollabService.addComment(documentId, {
      content,
      author: userName,
      resolved: false
    }).then(() => {
      loadComments();
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Collaboration Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">
              {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((user, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-white">
                <AvatarFallback 
                  className="text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ))}
            {collaborators.length > 3 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                +{collaborators.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addComment}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Comment
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIImage}
            disabled={isGeneratingImage}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            {isGeneratingImage ? 'Generating...' : 'AI Image'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <EditorContent 
          editor={editor} 
          className="h-full prose max-w-none focus:outline-none p-6"
        />
      </div>

      {/* Comments Panel (if any) */}
      {comments.length > 0 && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Comments</h4>
          <div className="space-y-2">
            {comments.slice(0, 3).map((comment, index) => (
              <div key={index} className="text-xs">
                <span className="font-medium text-slate-700">{comment.author}:</span>
                <span className="ml-2 text-slate-600">{comment.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
