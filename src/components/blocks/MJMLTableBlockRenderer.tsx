
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
  
  // Defensive programming: ensure content and styling exist with defaults
  const content = block.content || {
    rows: 2,
    columns: 2,
    cells: [
      [
        { type: 'text' as const, content: 'Header 1' },
        { type: 'text' as const, content: 'Header 2' }
      ],
      [
        { type: 'text' as const, content: 'Cell 1' },
        { type: 'text' as const, content: 'Cell 2' }
      ]
    ],
    headerRow: true,
    borderStyle: 'solid' as const,
    borderColor: '#e0e0e0',
    borderWidth: '1px'
  };

  const styling = block.styling?.desktop || {
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0'
  };

  // Ensure cells array exists and has proper structure
  const safeRows = Math.max(1, content.rows || 2);
  const safeColumns = Math.max(1, content.columns || 2);
  const safeCells = content.cells || [];

  // Fill missing cells with default content
  const ensureCellsStructure = () => {
    const cells = [...safeCells];
    
    // Ensure we have enough rows
    while (cells.length < safeRows) {
      cells.push([]);
    }
    
    // Ensure each row has enough columns
    cells.forEach((row, rowIndex) => {
      while (row.length < safeColumns) {
        row.push({ 
          type: 'text' as const, 
          content: `Cell ${rowIndex + 1},${row.length + 1}` 
        });
      }
    });
    
    return cells;
  };

  const structuredCells = ensureCellsStructure();

  const updateCellContent = (row: number, col: number, newContent: string) => {
    console.log(`Updating cell [${row}][${col}] with content:`, newContent);
    
    try {
      const newCells = structuredCells.map((cellRow, rowIndex) =>
        cellRow.map((cell, colIndex) =>
          rowIndex === row && colIndex === col
            ? { ...cell, content: newContent }
            : cell
        )
      );
      
      onUpdate({
        ...block,
        content: {
          ...content,
          cells: newCells
        }
      });
    } catch (error) {
      console.error('Error updating cell content:', error);
    }
  };

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Cell clicked: [${row}][${col}]`);
    setEditingCell({ row, col });
  };

  const handleCellBlur = () => {
    console.log('Cell editor blurred');
    setEditingCell(null);
  };

  const addRow = () => {
    try {
      const newRow = Array(safeColumns).fill(null).map((_, index) => ({
        type: 'text' as const,
        content: `New cell ${structuredCells.length + 1},${index + 1}`
      }));
      
      onUpdate({
        ...block,
        content: {
          ...content,
          rows: safeRows + 1,
          cells: [...structuredCells, newRow]
        }
      });
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const addColumn = () => {
    try {
      const newCells = structuredCells.map((row, rowIndex) => [
        ...row,
        { type: 'text' as const, content: `New cell ${rowIndex + 1},${row.length + 1}` }
      ]);
      
      onUpdate({
        ...block,
        content: {
          ...content,
          columns: safeColumns + 1,
          cells: newCells
        }
      });
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const getBorderStyle = () => {
    const borderStyle = content.borderStyle || 'solid';
    const borderColor = content.borderColor || '#e0e0e0';
    const borderWidth = content.borderWidth || '1px';
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
            {structuredCells.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => {
                  const isHeader = content.headerRow && rowIndex === 0;
                  const CellTag = isHeader ? 'th' : 'td';
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                  
                  return (
                    <CellTag
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={{
                        border: getBorderStyle(),
                        padding: '4px',
                        fontWeight: isHeader ? 'bold' : 'normal',
                        backgroundColor: isHeader ? '#f8fafc' : 'transparent',
                        minWidth: '80px',
                        position: 'relative',
                        verticalAlign: 'top'
                      }}
                      onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {isEditing ? (
                        <TableCellEditor
                          content={cell?.content || ''}
                          onChange={(newContent) => updateCellContent(rowIndex, colIndex, newContent)}
                          onBlur={handleCellBlur}
                          autoFocus
                        />
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: cell?.content || '<p>Click to edit</p>' 
                          }}
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
