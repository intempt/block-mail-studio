
import React from 'react';

interface SimpleBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

interface ColumnRendererProps {
  block: SimpleBlock;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  renderBlock: (block: SimpleBlock) => React.ReactNode;
}

export const ColumnRenderer: React.FC<ColumnRendererProps> = ({
  block,
  onColumnDrop,
  renderBlock
}) => {
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
    <div className="columns-block" style={block.styles}>
      <div className="flex gap-4">
        {block.content.columns?.map((column: any, index: number) => (
          <div
            key={column.id || index}
            className="column-drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400"
            style={{ width: columnWidths[index] }}
            onDrop={(e) => onColumnDrop(e, block.id, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-center text-gray-500 text-sm">
              Column {index + 1} ({columnWidths[index]})
              <br />
              <span className="text-xs">Drop blocks here</span>
            </div>
            {column.blocks?.map((innerBlock: SimpleBlock) => (
              <div key={innerBlock.id} className="mt-2">
                {renderBlock(innerBlock)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
