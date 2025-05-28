
import React, { useState } from 'react';
import { TableBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { TableCellEditor } from '../TableCellEditor';

interface MJMLTableBlockRendererProps {
  block: TableBlock;
  isSelected: boolean;
  onUpdate: (block: TableBlock) => void;
}

export const MJMLTableBlockRenderer: React.FC<MJMLTableBlockRendererProps> = ({
  block,
  isSelected,
  onUpdate
}) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const styling = block.styling.desktop;

  const updateCellContent = (row: number, col: number, content: string) => {
    const newCells = [...block.content.cells];
    newCells[row][col] = { ...newCells[row][col], content };
    
    onUpdate({
      ...block,
      content: {
        ...block.content,
        cells: newCells
      }
    });
  };

  const addRow = () => {
    const newRow = Array(block.content.columns).fill(null).map(() => ({
      type: 'text' as const,
      content: 'New cell'
    }));
    
    onUpdate({
      ...block,
      content: {
        ...block.content,
        rows: block.content.rows + 1,
        cells: [...block.content.cells, newRow]
      }
    });
  };

  const addColumn = () => {
    const newCells = block.content.cells.map(row => [
      ...row,
      { type: 'text' as const, content: 'New cell' }
    ]);
    
    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: block.content.columns + 1,
        cells: newCells
      }
    });
  };

  const getBorderStyle = () => {
    const { borderStyle, borderColor, borderWidth } = block.content;
    return `${borderWidth} ${borderStyle} ${borderColor}`;
  };

  return (
    <div 
      className={`mjml-table-block-renderer ${isSelected ? 'ring-2 ring-blue-500' : ''} p-2 relative`}
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      <div className="overflow-x-auto">
        <table 
          style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: getBorderStyle(),
            minWidth: '400px'
          }}
        >
          <tbody>
            {block.content.cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isHeader = block.content.headerRow && rowIndex === 0;
                  const CellTag = isHeader ? 'th' : 'td';
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                  
                  return (
                    <CellTag
                      key={colIndex}
                      style={{
                        border: getBorderStyle(),
                        padding: '8px',
                        fontWeight: isHeader ? 'bold' : 'normal',
                        backgroundColor: isHeader ? '#f8fafc' : 'transparent',
                        minWidth: '80px',
                        position: 'relative'
                      }}
                      onClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {isEditing ? (
                        <TableCellEditor
                          content={cell.content}
                          onChange={(content) => updateCellContent(rowIndex, colIndex, content)}
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                        />
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ __html: cell.content }}
                          className="min-h-[24px] w-full"
                        />
                      )}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isSelected && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button size="sm" variant="outline" onClick={addRow}>
            Add Row
          </Button>
          <Button size="sm" variant="outline" onClick={addColumn}>
            Add Column
          </Button>
        </div>
      )}

      {isSelected && (
        <div className="absolute bottom-2 left-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            MJML Table
          </span>
        </div>
      )}
    </div>
  );
};
