
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table as TableIcon, 
  Plus, 
  Minus, 
  Upload, 
  Download,
  Settings,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface TableData {
  rows: number;
  cols: number;
  headers: string[];
  data: string[][];
  style: {
    headerBg: string;
    headerText: string;
    cellBg: string;
    cellText: string;
    borderColor: string;
    borderWidth: number;
  };
}

interface AdvancedTableBuilderProps {
  editor: Editor | null;
}

export const AdvancedTableBuilder: React.FC<AdvancedTableBuilderProps> = ({ editor }) => {
  const [tableData, setTableData] = useState<TableData>({
    rows: 3,
    cols: 3,
    headers: ['Header 1', 'Header 2', 'Header 3'],
    data: [
      ['Cell 1,1', 'Cell 1,2', 'Cell 1,3'],
      ['Cell 2,1', 'Cell 2,2', 'Cell 2,3'],
      ['Cell 3,1', 'Cell 3,2', 'Cell 3,3']
    ],
    style: {
      headerBg: '#3B82F6',
      headerText: '#FFFFFF',
      cellBg: '#FFFFFF',
      cellText: '#374151',
      borderColor: '#D1D5DB',
      borderWidth: 1
    }
  });

  const [showStylePanel, setShowStylePanel] = useState(false);

  const addRow = () => {
    const newRow = Array(tableData.cols).fill('New cell');
    setTableData({
      ...tableData,
      rows: tableData.rows + 1,
      data: [...tableData.data, newRow]
    });
  };

  const removeRow = () => {
    if (tableData.rows > 1) {
      setTableData({
        ...tableData,
        rows: tableData.rows - 1,
        data: tableData.data.slice(0, -1)
      });
    }
  };

  const addColumn = () => {
    setTableData({
      ...tableData,
      cols: tableData.cols + 1,
      headers: [...tableData.headers, `Header ${tableData.cols + 1}`],
      data: tableData.data.map(row => [...row, 'New cell'])
    });
  };

  const removeColumn = () => {
    if (tableData.cols > 1) {
      setTableData({
        ...tableData,
        cols: tableData.cols - 1,
        headers: tableData.headers.slice(0, -1),
        data: tableData.data.map(row => row.slice(0, -1))
      });
    }
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[index] = value;
    setTableData({ ...tableData, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData.data];
    newData[rowIndex][colIndex] = value;
    setTableData({ ...tableData, data: newData });
  };

  const generateTableHTML = () => {
    const { style } = tableData;
    
    let html = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">`;
    
    // Header row
    html += `<thead><tr>`;
    tableData.headers.forEach(header => {
      html += `<th style="background-color: ${style.headerBg}; color: ${style.headerText}; padding: 12px; border: ${style.borderWidth}px solid ${style.borderColor}; text-align: left; font-weight: bold;">${header}</th>`;
    });
    html += `</tr></thead>`;
    
    // Data rows
    html += `<tbody>`;
    tableData.data.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => {
        html += `<td style="background-color: ${style.cellBg}; color: ${style.cellText}; padding: 12px; border: ${style.borderWidth}px solid ${style.borderColor};">${cell}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    
    return html;
  };

  const insertTable = () => {
    if (editor) {
      const tableHTML = generateTableHTML();
      editor.chain().focus().insertContent(tableHTML).run();
    }
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim());
          const data = lines.slice(1).map(line => 
            line.split(',').map(cell => cell.trim())
          );
          
          setTableData({
            ...tableData,
            rows: data.length,
            cols: headers.length,
            headers,
            data
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const exportCSV = () => {
    const csv = [
      tableData.headers.join(','),
      ...tableData.data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Table Builder</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStylePanel(!showStylePanel)}
            >
              <Palette className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={insertTable}>
              Insert Table
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={removeRow} disabled={tableData.rows <= 1}>
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">{tableData.rows} rows</span>
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={removeColumn} disabled={tableData.cols <= 1}>
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">{tableData.cols} cols</span>
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {showStylePanel && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Table Styling</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Header Background</Label>
              <input
                type="color"
                value={tableData.style.headerBg}
                onChange={(e) => setTableData({
                  ...tableData,
                  style: { ...tableData.style, headerBg: e.target.value }
                })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <Label className="text-xs">Header Text</Label>
              <input
                type="color"
                value={tableData.style.headerText}
                onChange={(e) => setTableData({
                  ...tableData,
                  style: { ...tableData.style, headerText: e.target.value }
                })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <Label className="text-xs">Cell Background</Label>
              <input
                type="color"
                value={tableData.style.cellBg}
                onChange={(e) => setTableData({
                  ...tableData,
                  style: { ...tableData.style, cellBg: e.target.value }
                })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <Label className="text-xs">Border Color</Label>
              <input
                type="color"
                value={tableData.style.borderColor}
                onChange={(e) => setTableData({
                  ...tableData,
                  style: { ...tableData.style, borderColor: e.target.value }
                })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 overflow-auto">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      backgroundColor: tableData.style.headerBg,
                      color: tableData.style.headerText,
                      border: `${tableData.style.borderWidth}px solid ${tableData.style.borderColor}`
                    }}
                    className="p-2"
                  >
                    <Input
                      value={header}
                      onChange={(e) => updateHeader(index, e.target.value)}
                      className="border-0 bg-transparent text-center font-bold"
                      style={{ color: tableData.style.headerText }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        backgroundColor: tableData.style.cellBg,
                        color: tableData.style.cellText,
                        border: `${tableData.style.borderWidth}px solid ${tableData.style.borderColor}`
                      }}
                      className="p-2"
                    >
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="border-0 bg-transparent text-center"
                        style={{ color: tableData.style.cellText }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
