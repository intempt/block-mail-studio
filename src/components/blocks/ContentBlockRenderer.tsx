
import React, { useState, useMemo, useEffect } from 'react';
import { ContentBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Database, Package } from 'lucide-react';
import { dummyProductData } from '@/data/dummyProductData';

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

  const handleLoadProductFeed = () => {
    const productData = {
      jsonData: dummyProductData,
      selectedFields: ['title', 'price', 'description', 'image_link'],
      fieldMappings: {
        title: { label: 'Product Name', type: 'text' as const },
        price: { label: 'Price', type: 'currency' as const },
        description: { label: 'Description', type: 'text' as const },
        image_link: { label: 'Image', type: 'image' as const }
      }
    };

    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        ...productData
      }
    };
    onUpdate(updatedBlock);
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
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-lg font-medium mb-2">No Product Data</div>
          <div className="text-sm mb-4">Load the product feed to display your product catalog</div>
          <Button onClick={handleLoadProductFeed} variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Load Product Feed
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
          <h3 className="font-semibold">Product Feed Settings</h3>

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
    </div>
  );
};
