
import React from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';

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
  return (
    <div className="columns-renderer">
      <div className="flex gap-4">
        {block.content.columns.map((column, index) => (
          <div
            key={column.id}
            className="flex-1 min-h-24 border-2 border-dashed border-gray-300 rounded p-2"
            onDrop={(e) => onColumnDrop(e, block.id, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            {column.blocks.map(renderBlock)}
          </div>
        ))}
      </div>
    </div>
  );
};
