
import React from 'react';
import { TableBlock } from '@/types/emailBlocks';

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
  return (
    <div className="mjml-table-block">
      <table className="w-full border-collapse">
        <tbody>
          {block.content.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
