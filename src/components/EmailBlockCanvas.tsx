import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EmailBlockNode } from '@/extensions/EmailBlockExtensions';
import { EmailBlock } from '@/types/emailBlocks';
import { ContextualEditor } from './ContextualEditor';
import { Card } from '@/components/ui/card';
import { generateUniqueId, createDefaultStyling } from '@/utils/blockUtils';
import './EmailBlockCanvas.css';

interface EmailBlockCanvasProps {
  onContentChange?: (html: string) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile' | 'tablet';
}

export const EmailBlockCanvas: React.FC<EmailBlockCanvasProps> = ({
  onContentChange,
  previewWidth,
  previewMode
}) => {
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const [showContextualEditor, setShowContextualEditor] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      EmailBlockNode,
    ],
    
    content: `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div data-email-block="text" class="email-block-wrapper">
          <div class="p-6 text-center">
            <h1 style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 0 0 16px 0;">Welcome to Your Email</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 0;">Drag blocks from the left panel to start building your email.</p>
          </div>
        </div>
      </div>
    `,
    
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const selectedNode = editor.state.doc.nodeAt(from);
      
      if (selectedNode && selectedNode.type.name === 'emailBlock') {
        const blockData = selectedNode.attrs.blockData as EmailBlock;
        if (blockData) {
          setSelectedBlock(blockData);
          setShowContextualEditor(true);
        }
      } else {
        setSelectedBlock(null);
        setShowContextualEditor(false);
      }
    },
    
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);
    },
  });

  const insertBlock = (blockType: string) => {
    if (!editor) return;

    const blockData = createBlockFromType(blockType);
    editor.chain().focus().insertEmailBlock(blockData).run();
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock) => {
    if (!editor) return;
    
    editor.chain().focus().updateEmailBlock(updatedBlock).run();
    setSelectedBlock(updatedBlock);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.blockType) {
        insertBlock(data.blockType);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Add this method to expose the insertBlock function
  React.useImperativeHandle(
    React.useRef(),
    () => ({
      insertBlock,
    }),
    [insertBlock]
  );

  return (
    <div className="relative h-full">
      <Card 
        className="mx-auto transition-all duration-300 shadow-lg"
        style={{ maxWidth: `${previewWidth}px` }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-xs text-slate-500 ml-2">Email Canvas</span>
          </div>
        </div>
        
        <div className="bg-white min-h-[600px]">
          <EditorContent 
            editor={editor} 
            className="block-canvas focus:outline-none"
          />
        </div>
      </Card>

      {showContextualEditor && selectedBlock && (
        <ContextualEditor
          block={selectedBlock}
          onBlockUpdate={handleBlockUpdate}
          onClose={() => {
            setShowContextualEditor(false);
            setSelectedBlock(null);
          }}
        />
      )}
    </div>
  );
};

// Update the createBlockFromType function to use the new utility
const createBlockFromType = (type: string): EmailBlock => {
  const baseBlock = {
    id: generateUniqueId(),
    position: { x: 0, y: 0 },
    styling: createDefaultStyling(),
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Your text content here...</p>',
          placeholder: 'Click to add text...',
        },
      } as EmailBlock;
      
    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        content: {
          src: 'https://via.placeholder.com/400x200',
          alt: 'Placeholder image',
          link: '',
        },
      } as EmailBlock;
      
    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        content: {
          text: 'Click Here',
          link: '#',
          style: 'solid',
        },
      } as EmailBlock;
      
    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: '40px',
        },
      } as EmailBlock;
      
    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        content: {
          style: 'solid',
          thickness: '1px',
          color: '#e0e0e0',
        },
      } as EmailBlock;
      
    default:
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Unknown block type</p>',
        },
      } as EmailBlock;
  }
};
