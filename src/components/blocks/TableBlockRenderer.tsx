
import React, { useState } from 'react';
import { TableBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { TableCellEditor } from '../table/TableCellEditor';

interface TableBlockRendererProps {
  block: TableBlock;
  isSelected: boolean;
  onUpdate: (block: TableBlock) => void;
}

export const TableBlockRenderer: React.FC<TableBlockRendererProps> = ({
  block,
  isSelected,
  onUpdate
}) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);

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

  const handleCellKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextCol = e.shiftKey ? col - 1 : col + 1;
      const nextRow = nextCol < 0 ? row - 1 : nextCol >= block.content.columns ? row + 1 : row;
      const finalCol = nextCol < 0 ? block.content.columns - 1 : nextCol >= block.content.columns ? 0 : nextCol;
      
      if (nextRow >= 0 && nextRow < block.content.rows && finalCol >= 0 && finalCol < block.content.columns) {
        setEditingCell({ row: nextRow, col: finalCol });
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const nextRow = row + 1;
      if (nextRow < block.content.rows) {
        setEditingCell({ row: nextRow, col });
      } else {
        setEditingCell(null);
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  return (
    <div className={`table-block ${isSelected ? 'ring-2 ring-blue-500' : ''} p-2`}>
      <table 
        style={{ 
          width: '100%',
          borderCollapse: 'collapse',
          border: getBorderStyle()
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
                      padding: '0',
                      fontWeight: isHeader ? 'bold' : 'normal',
                      backgroundColor: isHeader ? '#f5f5f5' : 'transparent',
                      minWidth: '100px',
                      verticalAlign: 'top'
                    }}
                    className="cursor-pointer"
                  >
                    <TableCellEditor
                      content={cell.content}
                      onUpdate={(content) => updateCellContent(rowIndex, colIndex, content)}
                      onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                      isEditing={isEditing}
                      onBlur={() => setEditingCell(null)}
                      onFocus={() => setEditingCell({ row: rowIndex, col: colIndex })}
                      isHeader={isHeader}
                    />
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {isSelected && (
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={addRow}>
            Add Row
          </Button>
          <Button size="sm" variant="outline" onClick={addColumn}>
            Add Column
          </Button>
        </div>
      )}
    </div>
  );
};
