
import React, { useState, useRef } from 'react';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, SpacerBlock, DividerBlock } from '@/types/emailBlocks';
import { ContextualEditor } from './ContextualEditor';
import { Card } from '@/components/ui/card';
import { generateUniqueId, createDefaultStyling } from '@/utils/blockUtils';
import { BlockRenderer } from './BlockRenderer';
import './EmailBlockCanvas.css';

interface EmailBlockCanvasProps {
  onContentChange?: (html: string) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile' | 'tablet';
}

export interface EmailBlockCanvasRef {
  insertBlock: (blockType: string) => void;
}

export const EmailBlockCanvas = React.forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  previewWidth,
  previewMode
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showContextualEditor, setShowContextualEditor] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  const insertBlock = (blockType: string) => {
    const newBlock = createBlockFromType(blockType);
    setBlocks(prev => [...prev, newBlock]);
    generateHTML([...blocks, newBlock]);
  };

  const handleBlockClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    setShowContextualEditor(true);
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock) => {
    setBlocks(prev => {
      const updated = prev.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      );
      generateHTML(updated);
      return updated;
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => {
      const updated = prev.filter(block => block.id !== blockId);
      generateHTML(updated);
      return updated;
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setShowContextualEditor(false);
    }
  };

  const generateHTML = (currentBlocks: EmailBlock[]) => {
    const emailHTML = `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${currentBlocks.map(block => renderBlockToHTML(block)).join('\n')}
      </div>
    `;
    onContentChange?.(emailHTML);
  };

  const renderBlockToHTML = (block: EmailBlock): string => {
    const styling = block.styling.desktop;
    const baseStyles = `
      background-color: ${styling.backgroundColor || 'transparent'};
      padding: ${styling.padding || '16px'};
      margin: ${styling.margin || '0'};
      border-radius: ${styling.borderRadius || '0'};
      border: ${styling.border || 'none'};
    `;

    switch (block.type) {
      case 'text':
        const textBlock = block as TextBlock;
        return `<div style="${baseStyles} color: ${styling.textColor || '#000'}; font-size: ${styling.fontSize || '16px'}; font-weight: ${styling.fontWeight || 'normal'};">${textBlock.content.html || ''}</div>`;
      case 'image':
        const imageBlock = block as ImageBlock;
        const imageEl = `<img src="${imageBlock.content.src || ''}" alt="${imageBlock.content.alt || ''}" style="width: 100%; height: auto; border-radius: ${styling.borderRadius || '0'};" />`;
        return `<div style="${baseStyles} text-align: center;">${imageBlock.content.link ? `<a href="${imageBlock.content.link}">${imageEl}</a>` : imageEl}</div>`;
      case 'button':
        const buttonBlock = block as ButtonBlock;
        return `<div style="${baseStyles} text-align: center;"><a href="${buttonBlock.content.link || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">${buttonBlock.content.text || 'Button'}</a></div>`;
      case 'spacer':
        const spacerBlock = block as SpacerBlock;
        return `<div style="height: ${spacerBlock.content.height || '40px'}; line-height: ${spacerBlock.content.height || '40px'}; font-size: 1px;">&nbsp;</div>`;
      case 'divider':
        const dividerBlock = block as DividerBlock;
        return `<div style="${baseStyles}"><hr style="border: 0; height: ${dividerBlock.content.thickness || '1px'}; background-color: ${dividerBlock.content.color || '#e0e0e0'}; margin: 0;" /></div>`;
      default:
        return `<div style="${baseStyles}">Unknown block type</div>`;
    }
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

  // Expose the insertBlock function through ref
  React.useImperativeHandle(ref, () => ({
    insertBlock,
  }));

  React.useEffect(() => {
    // Initialize with a welcome block
    if (blocks.length === 0) {
      const welcomeBlock = createBlockFromType('text');
      const textBlock = welcomeBlock as TextBlock;
      textBlock.content.html = '<h1 style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">Welcome to Your Email</h1><p style="color: #6b7280; font-size: 16px; margin: 0; text-align: center;">Drag blocks from the left panel to start building your email.</p>';
      setBlocks([welcomeBlock]);
      generateHTML([welcomeBlock]);
    }
  }, []);

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
            <span className="text-xs text-slate-500 ml-2">Email Canvas ({blocks.length} blocks)</span>
          </div>
        </div>
        
        <div 
          ref={canvasRef}
          className="bg-white min-h-[600px] p-4"
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`block-wrapper mb-4 cursor-pointer transition-all duration-200 ${
                selectedBlockId === block.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
              }`}
              onClick={() => handleBlockClick(block.id)}
            >
              <BlockRenderer 
                block={block}
                isSelected={selectedBlockId === block.id}
                onUpdate={handleBlockUpdate}
              />
            </div>
          ))}
          
          {blocks.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>Drop blocks here to start building your email</p>
            </div>
          )}
        </div>
      </Card>

      {showContextualEditor && selectedBlock && (
        <ContextualEditor
          block={selectedBlock}
          onBlockUpdate={handleBlockUpdate}
          onClose={() => {
            setShowContextualEditor(false);
            setSelectedBlockId(null);
          }}
          onDelete={() => handleDeleteBlock(selectedBlock.id)}
        />
      )}
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';

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
