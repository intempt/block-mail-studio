
import React, { useState } from 'react';
import { BlockControls } from './BlockControls';
import { ColumnRenderer } from './ColumnRenderer';
import { BlockContextMenu } from './BlockContextMenu';
import { InlineEditor } from './InlineEditor';
import { DragVisualFeedback } from './DragVisualFeedback';
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
  onMoveBlockUp?: (blockId: string) => void;
  onMoveBlockDown?: (blockId: string) => void;
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
  onColumnDrop,
  onMoveBlockUp,
  onMoveBlockDown
}) => {
  const [editingContent, setEditingContent] = useState<{
    blockId: string;
    contentType: 'text' | 'button' | 'image' | 'link';
    property: string;
    position?: { x: number; y: number };
  } | null>(null);

  const [dragState, setDragState] = useState({
    isDragging: false,
    dragPreview: ''
  });

  const handleContentClick = (
    e: React.MouseEvent,
    blockId: string,
    contentType: 'text' | 'button' | 'image' | 'link',
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

  const handleInlineEditorChange = (html: string) => {
    if (editingContent) {
      onTipTapChange(editingContent.blockId, html);
    }
  };

  const handleInlineEditorBlur = () => {
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
    contentType: 'text' | 'button' | 'image' | 'link', 
    property: string,
    placeholder?: string
  ) => {
    const isEditing = editingContent?.blockId === block.id && editingContent?.property === property;
    
    if (isEditing) {
      return (
        <InlineEditor
          content={getContentForProperty(block, property)}
          contentType={contentType}
          onUpdate={handleInlineEditorChange}
          onBlur={handleInlineEditorBlur}
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

  const handleContextMenuAction = (blockId: string, action: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    switch (action) {
      case 'edit':
        onBlockDoubleClick(blockId, blocks[blockIndex].type);
        break;
      case 'duplicate':
        onDuplicateBlock(blockId);
        break;
      case 'delete':
        onDeleteBlock(blockId);
        break;
      case 'saveAsSnippet':
        if (onSaveAsSnippet) onSaveAsSnippet(blockId);
        break;
      case 'moveUp':
        if (onMoveBlockUp) onMoveBlockUp(blockId);
        break;
      case 'moveDown':
        if (onMoveBlockDown) onMoveBlockDown(blockId);
        break;
      case 'settings':
        onBlockClick(blockId);
        break;
    }
  };

  const renderBlock = (block: EmailBlock, index: number): React.ReactNode => {
    if (block.type === 'columns') {
      return (
        <ColumnRenderer
          block={block}
          onColumnDrop={onColumnDrop}
          renderBlock={(innerBlock) => renderBlock(innerBlock, 0)}
        />
      );
    }

    const blockContent = (() => {
      switch (block.type) {
        case 'text':
          return (
            <div className="min-h-[20px]">
              {renderEditableContent(block, block.content.html, 'text', 'html', 'Enter your text...')}
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
                {renderEditableContent(block, block.content.text, 'button', 'text', 'Button text')}
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
                onClick={(e) => handleContentClick(e, block.id, 'image', 'src')}
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
    })();

    return (
      <BlockContextMenu
        onEdit={() => handleContextMenuAction(block.id, 'edit')}
        onDuplicate={() => handleContextMenuAction(block.id, 'duplicate')}
        onDelete={() => handleContextMenuAction(block.id, 'delete')}
        onSaveAsSnippet={() => handleContextMenuAction(block.id, 'saveAsSnippet')}
        onMoveUp={() => handleContextMenuAction(block.id, 'moveUp')}
        onMoveDown={() => handleContextMenuAction(block.id, 'moveDown')}
        onSettings={() => handleContextMenuAction(block.id, 'settings')}
        canMoveUp={index > 0}
        canMoveDown={index < blocks.length - 1}
      >
        {blockContent}
      </BlockContextMenu>
    );
  };

  return (
    <div className="relative">
      <DragVisualFeedback 
        isDragging={dragState.isDragging}
        dragOverIndex={dragOverIndex}
        totalBlocks={blocks.length}
        isOverCanvas={isDraggingOver}
        dragPreview={dragState.dragPreview}
      />
      
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
            onDragStart={(e) => {
              setDragState({ isDragging: true, dragPreview: block.type });
              onBlockDragStart(e, block.id);
            }}
            onDragEnd={() => setDragState({ isDragging: false, dragPreview: '' })}
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
            {renderBlock(block, index)}
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
    </div>
  );
};
