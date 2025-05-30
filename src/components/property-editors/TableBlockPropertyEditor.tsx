
import React from 'react';
import { TableBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface TableBlockPropertyEditorProps {
  block: TableBlock;
  onUpdate: (block: TableBlock) => void;
}

export const TableBlockPropertyEditor: React.FC<TableBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<TableBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const addRow = () => {
    const newRow = Array(block.content.columns).fill(null).map(() => ({
      type: 'text' as const,
      content: 'New cell'
    }));
    
    updateContent({
      rows: block.content.rows + 1,
      cells: [...block.content.cells, newRow]
    });
  };

  const removeRow = () => {
    if (block.content.rows > 1) {
      updateContent({
        rows: block.content.rows - 1,
        cells: block.content.cells.slice(0, -1)
      });
    }
  };

  const addColumn = () => {
    const newCells = block.content.cells.map(row => [
      ...row,
      { type: 'text' as const, content: 'New cell' }
    ]);
    
    updateContent({
      columns: block.content.columns + 1,
      cells: newCells
    });
  };

  const removeColumn = () => {
    if (block.content.columns > 1) {
      const newCells = block.content.cells.map(row => row.slice(0, -1));
      
      updateContent({
        columns: block.content.columns - 1,
        cells: newCells
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Table Structure</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Rows: {block.content.rows}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={addRow}>+</Button>
                <Button size="sm" variant="outline" onClick={removeRow}>-</Button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Columns: {block.content.columns}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={addColumn}>+</Button>
                <Button size="sm" variant="outline" onClick={removeColumn}>-</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="header-row"
          checked={block.content.headerRow}
          onCheckedChange={(checked) => updateContent({ headerRow: checked })}
        />
        <Label htmlFor="header-row">Header Row</Label>
      </div>

      <div>
        <Label>Border Style</Label>
        <Select
          value={block.content.borderStyle}
          onValueChange={(value) => updateContent({ borderStyle: value as any })}
        >
          <SelectTrigger className="mt-2">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="border-color">Border Color</Label>
          <Input
            id="border-color"
            type="color"
            value={block.content.borderColor}
            onChange={(e) => updateContent({ borderColor: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="border-width">Border Width</Label>
          <Input
            id="border-width"
            value={block.content.borderWidth}
            onChange={(e) => updateContent({ borderWidth: e.target.value })}
            className="mt-2"
            placeholder="1px"
          />
        </div>
      </div>
    </div>
  );
};
