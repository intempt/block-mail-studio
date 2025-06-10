
import React, { useState } from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';
import { BlockControls } from '../canvas/BlockControls';

interface ColumnsBlockRendererProps {
  block: ColumnsBlock;
  isSelected: boolean;
  onUpdate: (block: ColumnsBlock) => void;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  selectedBlockId?: string | null;
  editingBlockId?: string | null;
  onBlockSelect?: (blockId: string | null) => void;
  onBlockEditStart?: (blockId: string) => void;
  onBlockEditEnd?: () => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  onUnstarBlock?: (blockId: string) => void;
}

export const ColumnsBlockRenderer: React.FC<ColumnsBlockRendererProps> = ({ 
  block, 
  isSelected,
  onUpdate,
  onColumnDrop,
  selectedBlockId,
  editingBlockId,
  onBlockSelect,
  onBlockEditStart,
  onBlockEditEnd,
  onBlockDelete,
  onBlockDuplicate,
  onSaveAsSnippet,
  onUnstarBlock
}) => {
  // Add hover state management for blocks within columns
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [controlsLocked, setControlsLocked] = useState<string | null>(null);

  const styling = block.styling.desktop;
  
  const getColumnWidths = () => {
    switch (block.content.columnRatio) {
      case '100%':
        return ['100%'];
      case '50-50':
        return ['50%', '50%'];
      case '33-67':
        return ['33%', '67%'];
      case '67-33':
        return ['67%', '33%'];
      case '25-75':
        return ['25%', '75%'];
      case '75-25':
        return ['75%', '25%'];
      case '60-40':
        return ['60%', '40%'];
      case '40-60':
        return ['40%', '60%'];
      case '33-33-33':
        return ['33.33%', '33.33%', '33.33%'];
      case '25-50-25':
        return ['25%', '50%', '25%'];
      case '25-25-50':
        return ['25%', '25%', '50%'];
      case '50-25-25':
        return ['50%', '25%', '25%'];
      case '25-25-25-25':
        return ['25%', '25%', '25%', '25%'];
      default:
        return ['100%'];
    }
  };

  const columnWidths = getColumnWidths();

  const handleDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('ColumnsBlockRenderer: Drop event in column', columnIndex, 'for layout', block.id);
    onColumnDrop(e, block.id, columnIndex);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock, columnId: string) => {
    const updatedColumns = block.content.columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          blocks: column.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        };
      }
      return column;
    });

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });
  };

  const handleBlockClick = (blockId: string) => {
    onBlockSelect?.(blockId);
  };

  const handleBlockDoubleClick = (blockId: string) => {
    onBlockEditStart?.(blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedColumns = block.content.columns.map(column => ({
      ...column,
      blocks: column.blocks.filter(b => b.id !== blockId)
    }));

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });

    onBlockDelete?.(blockId);
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = block.content.columns
      .flatMap(col => col.blocks)
      .find(b => b.id === blockId);
    
    if (!blockToDuplicate) return;

    const duplicatedBlock: EmailBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}_copy_${Date.now()}`,
      isStarred: false
    };

    const updatedColumns = block.content.columns.map(column => {
      const blockIndex = column.blocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        const newBlocks = [...column.blocks];
        newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
        return { ...column, blocks: newBlocks };
      }
      return column;
    });

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });

    onBlockDuplicate?.(blockId);
  };

  // Hover state handlers for blocks within columns
  const handleBlockHover = (blockId: string) => {
    if (!controlsLocked || controlsLocked === blockId) {
      setHoveredBlockId(blockId);
    }
  };

  const handleBlockLeave = (blockId: string) => {
    if (!controlsLocked || controlsLocked !== blockId) {
      setHoveredBlockId(null);
    }
  };

  const handleControlsEnter = (blockId: string) => {
    setControlsLocked(blockId);
    setHoveredBlockId(blockId);
  };

  const handleControlsLeave = (blockId: string) => {
    setControlsLocked(null);
    setTimeout(() => {
      if (controlsLocked === null) {
        setHoveredBlockId(null);
      }
    }, 100);
  };

  // Ensure blocks have all required properties for EmailBlock interface
  const ensureCompleteBlock = (innerBlock: EmailBlock): EmailBlock => {
    const defaultStyling = {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    };

    const defaultPosition = { x: 0, y: 0 };

    const defaultDisplayOptions = {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true
    };

    return {
      ...innerBlock,
      styling: innerBlock.styling ?? defaultStyling,
      position: innerBlock.position ?? defaultPosition,
      displayOptions: innerBlock.displayOptions ?? defaultDisplayOptions
    } as EmailBlock;
  };

  const renderColumnBlock = (innerBlock: EmailBlock, columnId: string) => {
    const completeBlock = ensureCompleteBlock(innerBlock);
    const isBlockSelected = selectedBlockId === innerBlock.id;
    const isBlockEditing = editingBlockId === innerBlock.id;
    const isBlockHovered = hoveredBlockId === innerBlock.id;

    return (
      <div 
        key={innerBlock.id} 
        className="relative mb-2"
        style={{
          isolation: 'isolate',
          position: 'relative',
          zIndex: isBlockSelected ? 10 : isBlockHovered ? 5 : 1,
          paddingLeft: '60px', // Space for controls
        }}
        onMouseEnter={() => handleBlockHover(innerBlock.id)}
        onMouseLeave={() => handleBlockLeave(innerBlock.id)}
      >
        {/* Block Controls */}
        <BlockControls
          blockId={innerBlock.id}
          isVisible={isBlockHovered}
          onDelete={handleBlockDelete}
          onDuplicate={handleBlockDuplicate}
          onDragStart={() => {}} // Disable drag for now within columns
          onSaveAsSnippet={onSaveAsSnippet || (() => {})}
          isStarred={innerBlock.isStarred}
          onUnstar={onUnstarBlock}
          onAddVariable={() => {}} // Handle variable insertion
          onControlsEnter={handleControlsEnter}
          onControlsLeave={handleControlsLeave}
        />

        {/* Block Content */}
        <div
          className={`border border-gray-100 rounded p-2 transition-colors cursor-pointer ${
            isBlockSelected ? 'border-blue-300 bg-blue-50' : 'hover:border-gray-300'
          }`}
          onClick={() => handleBlockClick(innerBlock.id)}
          onDoubleClick={() => handleBlockDoubleClick(innerBlock.id)}
        >
          {innerBlock.type === 'text' ? (
            <EnhancedTextBlockRenderer
              block={completeBlock as any}
              editor={null}
              isSelected={isBlockSelected}
              isEditing={isBlockEditing}
              onUpdate={(updatedBlock: EmailBlock) => handleBlockUpdate(updatedBlock, columnId)}
              onEditStart={() => onBlockEditStart?.(innerBlock.id)}
              onEditEnd={onBlockEditEnd}
            />
          ) : (
            <BlockRenderer 
              block={completeBlock}
              isSelected={isBlockSelected}
              onUpdate={(updatedBlock: EmailBlock) => handleBlockUpdate(updatedBlock, columnId)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="columns-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        borderRadius: styling.borderRadius,
        border: styling.border,
      }}
    >
      <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
        <tr>
          {block.content.columns.map((column, index) => (
            <td
              key={column.id}
              style={{
                width: columnWidths[index],
                verticalAlign: 'top',
                paddingLeft: index > 0 ? block.content.gap || '8px' : '0',
                paddingRight: index < block.content.columns.length - 1 ? block.content.gap || '8px' : '0'
              }}
            >
              <div 
                className="min-h-24 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-blue-300"
                style={{
                  backgroundColor: isSelected ? '#f1f5f9' : '#f8fafc',
                  borderColor: column.blocks.length > 0 ? '#e2e8f0' : '#cbd5e1'
                }}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {column.blocks.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    <div className="text-xs text-slate-400 mb-2">Column {index + 1}</div>
                    <div className="text-xs text-slate-500">
                      Drop blocks here ({columnWidths[index]})
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {column.blocks.map((innerBlock) => 
                      renderColumnBlock(innerBlock, column.id)
                    )}
                  </div>
                )}
              </div>
            </td>
          ))}
        </tr>
      </table>
    </div>
  );
};
