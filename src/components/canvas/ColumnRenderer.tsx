
import React, { useState } from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';

interface ColumnRendererProps {
  block: ColumnsBlock;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  renderBlock: (block: EmailBlock) => React.ReactNode;
  editingBlockId: string | null;
  onBlockEditStart: (blockId: string) => void;
  onBlockEditEnd: () => void;
  onBlockUpdate: (block: EmailBlock) => void;
}

export const ColumnRenderer: React.FC<ColumnRendererProps> = ({
  block,
  onColumnDrop,
  renderBlock,
  editingBlockId,
  onBlockEditStart,
  onBlockEditEnd,
  onBlockUpdate
}) => {
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);

  // Type guard to ensure we have a columns block
  if (block.type !== 'columns') {
    return <div className="error">Invalid block type for ColumnRenderer</div>;
  }

  const getColumnWidths = (ratio: string) => {
    const ratioMap: Record<string, string[]> = {
      '100': ['100%'],
      '50-50': ['50%', '50%'],
      '33-67': ['33%', '67%'],
      '67-33': ['67%', '33%'],
      '25-75': ['25%', '75%'],
      '75-25': ['75%', '25%'],
      '33-33-33': ['33.33%', '33.33%', '33.33%'],
      '25-50-25': ['25%', '50%', '25%'],
      '25-25-50': ['25%', '25%', '50%'],
      '50-25-25': ['50%', '25%', '25%'],
      '25-25-25-25': ['25%', '25%', '25%', '25%']
    };
    return ratioMap[ratio] || ['100%'];
  };

  const columnWidths = getColumnWidths(block.content.columnRatio);

  const handleDragOver = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    setDragOverColumnIndex(columnIndex);
  };

  const handleDragLeave = (e: React.DragEvent, columnIndex: number) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumnIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    setDragOverColumnIndex(null);
    onColumnDrop(e, block.id, columnIndex);
  };

  // Safe styling with proper type conversion
  const columnStyling = block.styling?.desktop ? {
    backgroundColor: block.styling.desktop.backgroundColor,
    padding: block.styling.desktop.padding,
    borderRadius: block.styling.desktop.borderRadius,
    border: block.styling.desktop.border
  } : {};
  
  return (
    <div className="columns-block border border-gray-200 rounded-lg p-4 bg-white" style={columnStyling}>
      <div className="flex gap-4">
        {block.content.columns?.map((column: any, index: number) => {
          const isHighlighted = dragOverColumnIndex === index;
          
          return (
            <div
              key={column.id || index}
              className={`column-drop-zone border-2 border-dashed rounded-lg p-4 transition-all duration-200 min-h-[120px] ${
                isHighlighted 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
              style={{ width: columnWidths[index] }}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
            >
              {column.blocks?.length === 0 ? (
                <div className="text-center text-gray-500 text-sm h-full flex flex-col justify-center">
                  <div className="font-medium text-gray-600">Column {index + 1}</div>
                  <div className="text-xs opacity-75 mt-1">{columnWidths[index]} width</div>
                  <div className="text-xs opacity-60 mt-2 p-4 border border-dashed border-gray-300 rounded bg-gray-50">
                    Drop blocks here
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {column.blocks?.map((innerBlock: EmailBlock) => (
                    <div key={innerBlock.id} className="border border-gray-100 rounded p-2 hover:border-gray-300 transition-colors">
                      {innerBlock.type === 'text' ? (
                        <EnhancedTextBlockRenderer
                          block={innerBlock as any}
                          isSelected={false}
                          isEditing={editingBlockId === innerBlock.id}
                          onUpdate={onBlockUpdate}
                          onEditStart={() => onBlockEditStart(innerBlock.id)}
                          onEditEnd={onBlockEditEnd}
                        />
                      ) : (
                        renderBlock(innerBlock)
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
