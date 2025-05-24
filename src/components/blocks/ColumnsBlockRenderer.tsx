import React from 'react';
import { ColumnsBlock } from '@/types/emailBlocks';

interface ColumnsBlockRendererProps {
  block: ColumnsBlock;
  isSelected: boolean;
  onUpdate: (block: ColumnsBlock) => void;
}

export const ColumnsBlockRenderer: React.FC<ColumnsBlockRendererProps> = ({ 
  block, 
  isSelected 
}) => {
  const styling = block.styling.desktop;
  
  const getColumnWidths = () => {
    switch (block.content.columnRatio) {
      // 1 Column
      case '100%':
        return ['100%'];
      // 2 Column layouts
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
      // Legacy 2 column (keeping for backwards compatibility)
      case '60-40':
        return ['60%', '40%'];
      case '40-60':
        return ['40%', '60%'];
      // 3 Column layouts
      case '33-33-33':
        return ['33.33%', '33.33%', '33.33%'];
      case '25-50-25':
        return ['25%', '50%', '25%'];
      case '25-25-50':
        return ['25%', '25%', '50%'];
      case '50-25-25':
        return ['50%', '25%', '25%'];
      // 4 Column layout
      case '25-25-25-25':
        return ['25%', '25%', '25%', '25%'];
      default:
        return ['100%'];
    }
  };

  const columnWidths = getColumnWidths();

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
                className="min-h-24 bg-slate-100 rounded-lg p-4 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300"
                style={{
                  backgroundColor: isSelected ? '#f1f5f9' : '#f8fafc'
                }}
              >
                <div className="text-xs text-slate-400 mb-2">Column {index + 1}</div>
                <div className="text-xs text-slate-500">
                  Drop blocks here ({columnWidths[index]})
                </div>
                {column.blocks.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    {column.blocks.length} block{column.blocks.length !== 1 ? 's' : ''}
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
