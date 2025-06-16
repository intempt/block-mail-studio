
import React from 'react';
import { ContentBlock } from '@/types/emailBlocks';

interface ContentBlockRendererProps {
  block: ContentBlock;
  isSelected: boolean;
  onUpdate: (block: ContentBlock) => void;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
  isSelected,
  onUpdate
}) => {
  const content = block.content || {
    jsonData: [],
    rows: 0,
    columns: 0,
    layout: 'table' as const,
    selectedFields: [],
    fieldMappings: {},
    showHeaders: true,
    headerStyle: 'bold' as const,
    borderStyle: 'solid' as const,
    borderColor: '#e0e0e0',
    alternateRowColors: true,
    alternateColor: '#f9f9f9'
  };

  const styling = block.styling?.desktop || {
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0'
  };

  const renderTable = () => {
    if (!content.jsonData || content.jsonData.length === 0) {
      return (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No data to display</p>
          <p className="text-sm text-gray-400 mt-1">Add JSON data to populate this content block</p>
        </div>
      );
    }

    const headers = content.selectedFields.length > 0 
      ? content.selectedFields 
      : Object.keys(content.jsonData[0] || {});

    return (
      <div className="overflow-x-auto">
        <table 
          style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: content.borderStyle !== 'none' ? `1px ${content.borderStyle} ${content.borderColor}` : 'none'
          }}
        >
          {content.showHeaders && (
            <thead>
              <tr>
                {headers.map((field, index) => (
                  <th
                    key={`header-${index}`}
                    style={{
                      border: content.borderStyle !== 'none' ? `1px ${content.borderStyle} ${content.borderColor}` : 'none',
                      padding: content.cellPadding || '8px',
                      fontWeight: content.headerStyle === 'bold' ? 'bold' : 'normal',
                      backgroundColor: '#f8fafc',
                      textAlign: 'left'
                    }}
                  >
                    {content.fieldMappings[field]?.label || field}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {content.jsonData.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {headers.map((field, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={{
                      border: content.borderStyle !== 'none' ? `1px ${content.borderStyle} ${content.borderColor}` : 'none',
                      padding: content.cellPadding || '8px',
                      backgroundColor: content.alternateRowColors && rowIndex % 2 === 1 
                        ? (content.alternateColor || '#f9f9f9') 
                        : 'transparent'
                    }}
                  >
                    {row[field] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderList = () => {
    if (!content.jsonData || content.jsonData.length === 0) {
      return (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No data to display</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {content.jsonData.map((item, index) => (
          <div key={`item-${index}`} className="p-4 border border-gray-200 rounded-lg">
            {content.selectedFields.map((field, fieldIndex) => (
              <div key={`field-${fieldIndex}`} className="mb-2">
                <span className="font-medium text-gray-700">
                  {content.fieldMappings[field]?.label || field}:
                </span>
                <span className="ml-2 text-gray-900">{item[field] || ''}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`content-block-renderer ${isSelected ? 'ring-2 ring-blue-500' : ''} relative`}
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      {content.layout === 'table' ? renderTable() : renderList()}
      
      {isSelected && (
        <div className="absolute bottom-2 left-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Content Block
          </span>
        </div>
      )}
    </div>
  );
};
