
import React from 'react';
import { TableBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TableBlockPropertyEditorProps {
  block: TableBlock;
  onUpdate: (block: TableBlock) => void;
}

export const TableBlockPropertyEditor: React.FC<TableBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const rows = block.content.rows || [];
  const headers = block.content.headers || [];
  const rowCount = rows.length;
  const columnCount = headers.length > 0 ? headers.length : (rows.length > 0 ? rows[0].length : 2);

  const addRow = () => {
    const newRow = Array(columnCount).fill('New Cell');
    onUpdate({
      ...block,
      content: {
        ...block.content,
        rows: [...rows, newRow]
      }
    });
  };

  const removeRow = () => {
    if (rowCount > 1) {
      const newRows = rows.slice(0, -1);
      onUpdate({
        ...block,
        content: {
          ...block.content,
          rows: newRows
        }
      });
    }
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Header ${columnCount + 1}`];
    const newRows = rows.map(row => [...row, 'New Cell']);
    
    onUpdate({
      ...block,
      content: {
        ...block.content,
        headers: newHeaders,
        rows: newRows
      }
    });
  };

  const removeColumn = () => {
    if (columnCount > 1) {
      const newHeaders = headers.slice(0, -1);
      const newRows = rows.map(row => row.slice(0, -1));
      
      onUpdate({
        ...block,
        content: {
          ...block.content,
          headers: newHeaders,
          rows: newRows
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Table Structure</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label className="text-xs">Rows: {rowCount}</Label>
            <div className="flex gap-1">
              <Button size="sm" onClick={addRow}>+</Button>
              <Button size="sm" onClick={removeRow} disabled={rowCount <= 1}>-</Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">Columns: {columnCount}</Label>
            <div className="flex gap-1">
              <Button size="sm" onClick={addColumn}>+</Button>
              <Button size="sm" onClick={removeColumn} disabled={columnCount <= 1}>-</Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Border Style</Label>
        <Select
          value={block.content.borderStyle || 'solid'}
          onValueChange={(value) => onUpdate({
            ...block,
            content: { ...block.content, borderStyle: value as 'solid' | 'dashed' | 'dotted' | 'none' }
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Border Color</Label>
        <Input
          type="color"
          value={block.content.borderColor || '#dddddd'}
          onChange={(e) => onUpdate({
            ...block,
            content: { ...block.content, borderColor: e.target.value }
          })}
        />
      </div>

      <div>
        <Label>Border Width</Label>
        <Input
          value={block.content.borderWidth || '1px'}
          onChange={(e) => onUpdate({
            ...block,
            content: { ...block.content, borderWidth: e.target.value }
          })}
          placeholder="1px"
        />
      </div>
    </div>
  );
};
