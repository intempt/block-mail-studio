
import React, { useState } from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';
import { regenerateBlockIds } from '@/utils/idGenerator';

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
  onBlockHover?: (blockId: string) => void;
  onBlockLeave?: (blockId: string) => void;
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
  onUnstarBlock,
  onBlockHover,
  onBlockLeave
}) => {
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);
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

  const handleColumnDragEnter = (e: React.DragEvent, columnIndex: number) => {
    console.log('=== Column Drag Enter ===');
    console.log('Column drag enter for column:', columnIndex);
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumnIndex(columnIndex);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnIndex: number) => {
    console.log('Column drag over for column:', columnIndex);
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumnIndex(columnIndex);
  };

  const handleColumnDragLeave = (e: React.DragEvent, columnIndex: number) => {
    console.log('Column drag leave for column:', columnIndex);
    // Only clear if we're actually leaving the column area
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumnIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnIndex: number) => {
    console.log('=== Column Drop Handler ===');
    console.log('ColumnsBlockRenderer: Drop event in column', columnIndex, 'for layout', block.id);
    console.log('Event target:', e.target);
    console.log('Event currentTarget:', e.currentTarget);
    
    e.preventDefault();
    e.stopPropagation();
    
    setDragOverColumnIndex(null);
    
    // Debug drag data availability
    const dataTypes = Array.from(e.dataTransfer.types);
    console.log('Available data types in column drop:', dataTypes);
    
    dataTypes.forEach(type => {
      const data = e.dataTransfer.getData(type);
      console.log(`Column drop - ${type}:`, data);
    });
    
    onColumnDrop(e, block.id, columnIndex);
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
    console.log('Duplicating nested block:', blockId);
    
    const blockToDuplicate = block.content.columns
      .flatMap(col => col.blocks)
      .find(b => b.id === blockId);
    
    if (!blockToDuplicate) {
      console.error('Block not found for duplication in columns:', blockId);
      return;
    }

    console.log('Found nested block to duplicate:', blockToDuplicate.type);
    
    const duplicatedBlock = regenerateBlockIds(blockToDuplicate);
    
    console.log('Generated duplicated nested block with new ID:', duplicatedBlock.id);

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
    
    console.log('Nested block duplication completed successfully');
  };

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

    return (
      <div 
        key={innerBlock.id} 
        className="relative mb-2"
        style={{
          isolation: 'isolate',
          position: 'relative',
          zIndex: isBlockSelected ? 10 : 1,
        }}
        onMouseEnter={() => onBlockHover?.(innerBlock.id)}
        onMouseLeave={() => onBlockLeave?.(innerBlock.id)}
        data-testid={`email-block-${innerBlock.id}`}
        data-block-type={innerBlock.type}
      >
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
                className={`min-h-24 rounded-lg border-2 border-dashed transition-all duration-200 relative ${
                  dragOverColumnIndex === index 
                    ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg' 
                    : 'border-gray-300 hover:border-blue-300 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: dragOverColumnIndex === index ? '#eff6ff' : (column.blocks.length > 0 ? '#f8fafc' : '#fafafa'),
                }}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnter={(e) => handleColumnDragEnter(e, index)}
                onDragOver={(e) => handleColumnDragOver(e, index)}
                onDragLeave={(e) => handleColumnDragLeave(e, index)}
                data-column-index={index}
                data-layout-id={block.id}
              >
                {dragOverColumnIndex === index && (
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-lg bg-blue-100 bg-opacity-30 flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-blue-600 font-medium text-sm bg-white px-2 py-1 rounded shadow">
                      Drop here
                    </div>
                  </div>
                )}
                
                {column.blocks.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm relative z-0">
                    <div className="text-xs text-slate-400 mb-2">Column {index + 1}</div>
                    <div className="text-xs text-slate-500">
                      Drop blocks here ({columnWidths[index]})
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-2 relative z-0">
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
