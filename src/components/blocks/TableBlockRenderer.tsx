
import React from 'react';
import { TableBlock } from '@/types/emailBlocks';

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
  const styling = block.styling.desktop;

  // Ensure we have valid table data
  const hasHeaders = block.content.headers && block.content.headers.length > 0;
  const rows = block.content.rows || [];
  
  // Calculate columns from existing data
  const columns = hasHeaders 
    ? block.content.headers.length 
    : (rows.length > 0 ? rows[0].length : 2);

  // Ensure we have at least some default data
  const defaultRows = rows.length === 0 ? [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']] : rows;
  const defaultHeaders = hasHeaders ? block.content.headers : ['Header 1', 'Header 2'];

  const addRow = () => {
    const newRow = Array(columns).fill('New Cell');
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        rows: [...defaultRows, newRow]
      }
    };
    onUpdate(updatedBlock);
  };

  const addColumn = () => {
    const newHeaders = hasHeaders ? [...defaultHeaders, 'New Header'] : [...defaultHeaders, 'New Header'];
    const newRows = defaultRows.map(row => [...row, 'New Cell']);
    
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        headers: newHeaders,
        rows: newRows
      }
    };
    onUpdate(updatedBlock);
  };

  const borderStyle = `1px ${block.content.borderStyle || 'solid'} ${block.content.borderColor || '#ddd'}`;

  return (
    <div className={`table-block ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: styling.backgroundColor,
          margin: styling.margin,
          border: borderStyle
        }}
      >
        {hasHeaders && (
          <thead>
            <tr>
              {defaultHeaders.map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: borderStyle,
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold'
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {defaultRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: borderStyle,
                    padding: '8px'
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {isSelected && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={addRow}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Add Row
          </button>
          <button
            onClick={addColumn}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Add Column
          </button>
        </div>
      )}
    </div>
  );
};
