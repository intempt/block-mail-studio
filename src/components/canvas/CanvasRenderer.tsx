
import React, { useState } from 'react';
import { UniversalTipTapEditor } from '../UniversalTipTapEditor';
import { BlockControls } from './BlockControls';
import { ColumnRenderer } from './ColumnRenderer';
import { EmailBlock } from '@/types/emailBlocks';

interface CanvasRendererProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
  isDraggingOver: boolean;
  dragOverIndex: number | null;
  onBlockClick: (blockId: string) => void;
  onBlockDoubleClick: (blockId: string, blockType: string) => void;
  onBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  onBlockDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  onTipTapChange: (blockId: string, html: string) => void;
  onTipTapBlur: () => void;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  blocks,
  selectedBlockId,
  editingBlockId,
  isDraggingOver,
  dragOverIndex,
  onBlockClick,
  onBlockDoubleClick,
  onBlockDragStart,
  onBlockDrop,
  onDeleteBlock,
  onDuplicateBlock,
  onSaveAsSnippet,
  onTipTapChange,
  onTipTapBlur,
  onColumnDrop
}) => {
  const [editingContent, setEditingContent] = useState<{
    blockId: string;
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video';
    property: string;
    position?: { x: number; y: number };
  } | null>(null);

  const handleContentClick = (
    e: React.MouseEvent,
    blockId: string,
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video',
    property: string
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setEditingContent({
      blockId,
      contentType,
      property,
      position: { x: rect.left, y: rect.top - 80 }
    });
  };

  const handleUniversalEditorChange = (html: string) => {
    if (editingContent) {
      onTipTapChange(editingContent.blockId, html);
    }
  };

  const handleUniversalEditorBlur = () => {
    setEditingContent(null);
    onTipTapBlur();
  };

  const getContentForProperty = (block: EmailBlock, property: string): string => {
    switch (property) {
      case 'html':
        return block.type === 'text' ? block.content.html || '' : '';
      case 'text':
        return block.type === 'button' ? block.content.text || '' : '';
      case 'alt':
        return block.type === 'image' ? block.content.alt || '' : '';
      case 'src':
        return block.type === 'image' ? block.content.src || '' : '';
      case 'link':
        return block.type === 'button' ? block.content.link || '' : 
               block.type === 'image' ? block.content.link || '' : '';
      default: return '';
    }
  };

  const renderEditableContent = (
    block: EmailBlock, 
    content: string, 
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video', 
    property: string,
    placeholder?: string
  ) => {
    const isEditing = editingContent?.blockId === block.id && editingContent?.property === property;
    
    if (isEditing) {
      return (
        <UniversalTipTapEditor
          content={getContentForProperty(block, property)}
          contentType={contentType}
          onChange={handleUniversalEditorChange}
          onBlur={handleUniversalEditorBlur}
          position={editingContent.position}
          placeholder={placeholder}
        />
      );
    }

    const isEmpty = !content || content.trim() === '';
    const displayContent = isEmpty ? 
      `<span style="color: #999; font-style: italic;">${placeholder || 'Click to edit...'}</span>` : 
      content;

    return (
      <div
        onClick={(e) => handleContentClick(e, block.id, contentType, property)}
        className="cursor-text hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 transition-all rounded p-1 -m-1"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    );
  };

  const renderBlock = (block: EmailBlock): React.ReactNode => {
    if (block.type === 'columns') {
      return (
        <ColumnRenderer
          block={block}
          onColumnDrop={onColumnDrop}
          renderBlock={renderBlock}
        />
      );
    }

    switch (block.type) {
      case 'text':
        return (
          <div className="min-h-[20px]">
            {renderEditableContent(block, block.content.html, 'html', 'html', 'Enter your text...')}
          </div>
        );
      
      case 'button':
        return (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <a
              href={block.content.link}
              style={{
                background: '#007bff',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '6px',
                display: 'inline-block',
                position: 'relative'
              }}
              onClick={(e) => e.preventDefault()}
            >
              {renderEditableContent(block, block.content.text, 'text', 'text', 'Button text')}
            </a>
          </div>
        );
      
      case 'image':
        return (
          <div className="relative text-center">
            <img
              src={block.content.src || 'https://via.placeholder.com/400x200?text=Click+to+add+image'}
              alt={block.content.alt}
              style={{ maxWidth: '100%', height: 'auto' }}
              onClick={(e) => handleContentClick(e, block.id, 'url', 'src')}
              className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
            />
            <div className="mt-2">
              {renderEditableContent(block, block.content.alt, 'text', 'alt', 'Image description...')}
            </div>
          </div>
        );

      case 'spacer':
        return <div style={{ height: block.content.height, backgroundColor: 'transparent' }} />;

      case 'divider':
        return (
          <hr 
            style={{
              border: 'none',
              borderTop: `${block.content.thickness || '1px'} ${block.content.style || 'solid'} ${block.content.color || '#ddd'}`,
              margin: '20px 0'
            }} 
          />
        );

      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <>
      {isDraggingOver && dragOverIndex === 0 && (
        <div className="h-2 bg-blue-400 rounded-full mb-4 opacity-75" />
      )}
      
      {blocks.map((block, index) => (
        <div key={block.id}>
          <div
            className={`email-block group cursor-pointer transition-all duration-200 mb-4 relative ${
              selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            draggable
            onClick={() => onBlockClick(block.id)}
            onDragStart={(e) => onBlockDragStart(e, block.id)}
            onDrop={(e) => onBlockDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <BlockControls
              blockId={block.id}
              onDelete={onDeleteBlock}
              onDuplicate={onDuplicateBlock}
              onDragStart={onBlockDragStart}
              onSaveAsSnippet={onSaveAsSnippet}
            />
            {renderBlock(block)}
          </div>
          
          {isDraggingOver && dragOverIndex === index + 1 && (
            <div className="h-2 bg-blue-400 rounded-full mb-4 opacity-75" />
          )}
        </div>
      ))}
      
      {blocks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-2">Drop blocks here to start building</div>
          <div className="text-gray-500 text-sm">Drag blocks from the palette to create your email</div>
        </div>
      )}
    </>
  );
};
