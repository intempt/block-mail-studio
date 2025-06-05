
import React, { useState, useMemo, useEffect } from 'react';
import { ContentBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Database } from 'lucide-react';
import { ContentProviderDialog } from '../dialogs/ContentProviderDialog';

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
  const [jsonInput, setJsonInput] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showProviderDialog, setShowProviderDialog] = useState(false);

  // Show provider dialog if block has no data
  useEffect(() => {
    if (!block.content.jsonData || block.content.jsonData.length === 0) {
      setShowProviderDialog(true);
    }
  }, []);

  // Extract schema from JSON data
  const schema = useMemo(() => {
    if (!block.content.jsonData || block.content.jsonData.length === 0) {
      return [];
    }
    
    const firstItem = block.content.jsonData[0];
    return Object.keys(firstItem).map(key => ({
      key,
      type: typeof firstItem[key],
      sample: firstItem[key]
    }));
  }, [block.content.jsonData]);

  const handleProviderSelect = (provider: string, data?: any) => {
    if (data) {
      // Pre-configured data from provider
      const updatedBlock = {
        ...block,
        content: {
          ...block.content,
          ...data
        }
      };
      onUpdate(updatedBlock);
    }
    setShowProviderDialog(false);
  };

  const handleJsonUpdate = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (Array.isArray(parsedData)) {
        const updatedBlock = {
          ...block,
          content: {
            ...block.content,
            jsonData: parsedData,
            selectedFields: schema.length > 0 ? schema.slice(0, block.content.columns).map(s => s.key) : []
          }
        };
        onUpdate(updatedBlock);
        setShowEditor(false);
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleFieldToggle = (fieldKey: string) => {
    const selectedFields = block.content.selectedFields.includes(fieldKey)
      ? block.content.selectedFields.filter(f => f !== fieldKey)
      : [...block.content.selectedFields, fieldKey];
    
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        selectedFields: selectedFields.slice(0, block.content.columns)
      }
    };
    onUpdate(updatedBlock);
  };

  const handleLayoutChange = (layout: 'table' | 'grid' | 'list') => {
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        layout
      }
    };
    onUpdate(updatedBlock);
  };

  const handleRowsChange = (rows: number) => {
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        rows: Math.max(1, rows)
      }
    };
    onUpdate(updatedBlock);
  };

  const handleColumnsChange = (columns: number) => {
    const newColumns = Math.max(1, Math.min(10, columns));
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        columns: newColumns,
        selectedFields: block.content.selectedFields.slice(0, newColumns)
      }
    };
    onUpdate(updatedBlock);
  };

  const handleItemsToShowChange = (itemsToShow: number) => {
    const newItemsToShow = Math.max(1, Math.min(50, itemsToShow));
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        itemsToShow: newItemsToShow
      }
    };
    onUpdate(updatedBlock);
  };

  const renderDataPreview = () => {
    const { jsonData, selectedFields, columns, layout, itemsToShow = block.content.rows } = block.content;
    
    if (!jsonData || jsonData.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-lg font-medium mb-2">No Data Selected</div>
          <div className="text-sm mb-4">Choose a data provider to get started</div>
          <Button onClick={() => setShowProviderDialog(true)} variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Select Data Provider
          </Button>
        </div>
      );
    }

    const displayData = jsonData.slice(0, itemsToShow);
    const displayFields = selectedFields.slice(0, columns);

    if (layout === 'table') {
      return (
        <div className="border rounded-lg overflow-hidden">
          {block.content.showHeaders && (
            <div className="bg-gray-50 border-b">
              <div className="grid gap-2 p-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {displayFields.map(field => (
                  <div key={field} className="font-semibold text-sm text-gray-700">
                    {block.content.fieldMappings[field]?.label || field}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="divide-y">
            {displayData.map((item, index) => (
              <div
                key={index}
                className={`grid gap-2 p-3 ${
                  block.content.alternateRowColors && index % 2 === 1 
                    ? 'bg-gray-50' 
                    : 'bg-white'
                }`}
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {displayFields.map(field => (
                  <div key={field} className="text-sm">
                    {renderFieldValue(item[field], field)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (layout === 'grid') {
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(columns, 3)}, 1fr)` }}>
          {displayData.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                {displayFields.map(field => (
                  <div key={field}>
                    <Label className="text-xs text-gray-500">
                      {block.content.fieldMappings[field]?.label || field}
                    </Label>
                    <div className="text-sm">
                      {renderFieldValue(item[field], field)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      );
    }

    // List layout
    return (
      <div className="space-y-3">
        {displayData.map((item, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex flex-wrap gap-4">
              {displayFields.map(field => (
                <div key={field} className="flex-1 min-w-0">
                  <Label className="text-xs text-gray-500">
                    {block.content.fieldMappings[field]?.label || field}
                  </Label>
                  <div className="text-sm">
                    {renderFieldValue(item[field], field)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFieldValue = (value: any, fieldKey: string) => {
    const mapping = block.content.fieldMappings[fieldKey];
    
    if (mapping?.type === 'image' && typeof value === 'string') {
      return <img src={value} alt="" className="w-16 h-16 object-cover rounded" />;
    }
    
    if (mapping?.type === 'link' && typeof value === 'string') {
      return <a href={value} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{value}</a>;
    }
    
    if (mapping?.type === 'currency' && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    
    if (mapping?.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    return String(value || '');
  };

  return (
    <div className={`content-block ${isSelected ? 'ring-2 ring-blue-500' : ''} p-4 bg-white border rounded-lg`}>
      {/* Controls */}
      {isSelected && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Content Block Settings</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProviderDialog(true)}
              >
                <Database className="w-4 h-4 mr-2" />
                Change Provider
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditor(!showEditor)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {showEditor ? 'Hide' : 'Edit'} JSON
              </Button>
            </div>
          </div>

          {showEditor && (
            <div className="space-y-3">
              <div>
                <Label>JSON Data Array</Label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"name": "John", "email": "john@example.com", "age": 25}]'
                  rows={4}
                />
              </div>
              <Button onClick={handleJsonUpdate}>Update Data</Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Layout</Label>
              <Select value={block.content.layout} onValueChange={handleLayoutChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Items to Show</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={block.content.itemsToShow || block.content.rows || 5}
                onChange={(e) => handleItemsToShowChange(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Columns</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={block.content.columns}
                onChange={(e) => handleColumnsChange(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showHeaders"
                checked={block.content.showHeaders}
                onCheckedChange={(checked) => {
                  const updatedBlock = {
                    ...block,
                    content: { ...block.content, showHeaders: checked as boolean }
                  };
                  onUpdate(updatedBlock);
                }}
              />
              <Label htmlFor="showHeaders">Show Headers</Label>
            </div>
          </div>

          {/* Schema Fields Selection */}
          {schema.length > 0 && (
            <div>
              <Label className="mb-2 block">Available Fields (Schema)</Label>
              <div className="flex flex-wrap gap-2">
                {schema.map(field => (
                  <Badge
                    key={field.key}
                    variant={block.content.selectedFields.includes(field.key) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFieldToggle(field.key)}
                  >
                    {field.key} ({field.type})
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click to select fields. Max {block.content.columns} fields.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Data Preview */}
      {renderDataPreview()}

      {/* Provider Selection Dialog */}
      <ContentProviderDialog
        isOpen={showProviderDialog}
        onClose={() => setShowProviderDialog(false)}
        onProviderSelect={handleProviderSelect}
      />
    </div>
  );
};
