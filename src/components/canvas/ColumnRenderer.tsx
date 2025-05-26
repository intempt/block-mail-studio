
import React from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';
import { mjmlService } from '@/services/MJMLService';

interface ColumnRendererProps {
  block: ColumnsBlock;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  renderBlock: (block: EmailBlock) => React.ReactNode;
}

export const ColumnRenderer: React.FC<ColumnRendererProps> = ({
  block,
  onColumnDrop,
  renderBlock
}) => {
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
  
  return (
    <div className="columns-block border border-gray-200 rounded-lg p-2" style={block.styling?.desktop}>
      <div className="flex gap-2">
        {block.content.columns?.map((column: any, index: number) => (
          <div
            key={column.id || index}
            className="column-drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 min-h-[100px]"
            style={{ width: columnWidths[index] }}
            onDrop={(e) => onColumnDrop(e, block.id, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-center text-gray-500 text-sm mb-2">
              <div className="font-medium">Column {index + 1}</div>
              <div className="text-xs opacity-75">{columnWidths[index]}</div>
              <div className="text-xs opacity-60">Drop blocks here</div>
              <div className="text-xs opacity-50 mt-1">MJML: mj-column</div>
            </div>
            
            <div className="space-y-2">
              {column.blocks?.map((innerBlock: EmailBlock) => (
                <div key={innerBlock.id} className="border border-gray-100 rounded p-2 hover:border-gray-300 transition-colors">
                  {renderBlock(innerBlock)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 mt-2 text-center">
        MJML Structure: mj-section → mj-column ({block.content.columnRatio})
      </div>
    </div>
  );
};
