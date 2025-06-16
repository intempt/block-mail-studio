
import React, { useState } from 'react';
import { ProductBlock } from '@/types/emailBlocks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Database, X, Type, Bold, Italic, Underline } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductBlockBubbleMenuProps {
  block: ProductBlock;
  onUpdate: (block: ProductBlock) => void;
}

const typeOptions = [
  {
    value: 'dynamic',
    text: 'Dynamic',
    description: 'Showcase products using product feed'
  },
  {
    value: 'static', 
    text: 'Static',
    description: 'Select the product manually'
  }
];

const schemaKeyOptions = [
  {
    text: 'Title',
    value: 'title'
  },
  {
    text: 'Description',
    value: 'description'
  },
  {
    text: 'Price',
    value: 'price'
  },
  {
    text: 'Original Price',
    value: 'originalPrice'
  }
];

const fontSizeOptions = [
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' }
];

const fontFamilyOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Verdana, sans-serif', label: 'Verdana' }
];

export const ProductBlockBubbleMenu: React.FC<ProductBlockBubbleMenuProps> = ({
  block,
  onUpdate
}) => {
  const handleTypeChange = (value: string) => {
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        type: value as 'dynamic' | 'static'
      }
    };
    onUpdate(updatedBlock);
  };

  const handleSchemaKeyChange = (value: string) => {
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        selectedSchemaKey: value,
        schemaKeyStyles: {
          ...block.content.schemaKeyStyles,
          [value]: block.content.schemaKeyStyles?.[value] || {
            color: '#000000',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none'
          }
        }
      }
    };
    onUpdate(updatedBlock);
  };

  const handleStyleChange = (property: string, value: string) => {
    const selectedKey = block.content.selectedSchemaKey;
    if (!selectedKey) return;

    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        schemaKeyStyles: {
          ...block.content.schemaKeyStyles,
          [selectedKey]: {
            ...block.content.schemaKeyStyles?.[selectedKey],
            [property]: value
          }
        }
      }
    };
    onUpdate(updatedBlock);
  };

  const toggleStyleProperty = (property: string, activeValue: string, inactiveValue: string) => {
    const selectedKey = block.content.selectedSchemaKey;
    if (!selectedKey) return;

    const currentValue = block.content.schemaKeyStyles?.[selectedKey]?.[property] || inactiveValue;
    const newValue = currentValue === activeValue ? inactiveValue : activeValue;
    handleStyleChange(property, newValue);
  };

  const handleAddProducts = () => {
    console.log('Add products clicked');
  };

  const handleSelectFeed = () => {
    console.log('Select feed clicked');
  };

  const currentType = (block.content as any).type || 'static';
  const currentOption = typeOptions.find(option => option.value === currentType);
  const selectedSchemaKey = block.content.selectedSchemaKey;
  const currentStyles = selectedSchemaKey ? block.content.schemaKeyStyles?.[selectedSchemaKey] : null;

  return (
    <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 flex items-center gap-3 min-w-fit">
      {/* Type selector */}
      <div className="flex flex-col gap-2">
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="Select type">
              {currentOption?.text || 'Select type'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-[60]">
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">{option.text}</span>
                  <span className="text-xs text-gray-500 mt-0.5">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Conditional button under type selector */}
        {currentType === 'static' ? (
          <Button
            onClick={handleAddProducts}
            size="sm"
            className="w-32 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add products
          </Button>
        ) : (
          <Button
            onClick={handleSelectFeed}
            size="sm"
            className="w-32 h-8 bg-green-600 hover:bg-green-700 text-white text-xs"
          >
            <Database className="w-3 h-3 mr-1" />
            Select feed
          </Button>
        )}
      </div>

      <div className="w-px h-12 bg-gray-300" />

      {/* Schema Key selector */}
      <Select 
        value={selectedSchemaKey || ""}
        onValueChange={handleSchemaKeyChange}
      >
        <SelectTrigger className="w-32 h-8">
          <SelectValue placeholder="Schema key..." />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-[60]">
          {schemaKeyOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="cursor-pointer"
            >
              <span>{option.text}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Typography Controls - Show only when schema key is selected */}
      {selectedSchemaKey && (
        <>
          <div className="w-px h-12 bg-gray-300" />

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyles?.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Text Color"
            />
          </div>

          <div className="w-px h-12 bg-gray-300" />

          {/* Font Size */}
          <Select 
            value={currentStyles?.fontSize || '16px'} 
            onValueChange={(value) => handleStyleChange('fontSize', value)}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-[60]">
              {fontSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Family */}
          <Select 
            value={currentStyles?.fontFamily || 'Arial, sans-serif'} 
            onValueChange={(value) => handleStyleChange('fontFamily', value)}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-[60]">
              {fontFamilyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-12 bg-gray-300" />

          {/* Style Toggle Buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={currentStyles?.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => toggleStyleProperty('fontWeight', 'bold', 'normal')}
              className="h-8 w-8 p-0"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentStyles?.fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => toggleStyleProperty('fontStyle', 'italic', 'normal')}
              className="h-8 w-8 p-0"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentStyles?.textDecoration === 'underline' ? 'default' : 'outline'}
              onClick={() => toggleStyleProperty('textDecoration', 'underline', 'none')}
              className="h-8 w-8 p-0"
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
