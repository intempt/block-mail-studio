
import React, { useState } from 'react';
import { ProductBlock } from '@/types/emailBlocks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Database, X } from 'lucide-react';

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

export const ProductBlockBubbleMenu: React.FC<ProductBlockBubbleMenuProps> = ({
  block,
  onUpdate
}) => {
  const [isSchemaDropdownOpen, setIsSchemaDropdownOpen] = useState(false);

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

  const handleSchemaKeyToggle = (key: string) => {
    const currentSchemaKeys = block.content.schemaKeys || [];
    const updatedSchemaKeys = currentSchemaKeys.includes(key)
      ? currentSchemaKeys.filter(k => k !== key)
      : [...currentSchemaKeys, key];
    
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        schemaKeys: updatedSchemaKeys
      }
    };
    onUpdate(updatedBlock);
  };

  const removeSchemaKey = (key: string) => {
    const currentSchemaKeys = block.content.schemaKeys || [];
    const updatedSchemaKeys = currentSchemaKeys.filter(k => k !== key);
    
    const updatedBlock = {
      ...block,
      content: {
        ...block.content,
        schemaKeys: updatedSchemaKeys
      }
    };
    onUpdate(updatedBlock);
  };

  const handleAddProducts = () => {
    // TODO: Implement add products functionality
    console.log('Add products clicked');
  };

  const handleSelectFeed = () => {
    // TODO: Implement select feed functionality
    console.log('Select feed clicked');
  };

  // Get current type value, default to 'static' if not set
  const currentType = (block.content as any).type || 'static';
  const currentOption = typeOptions.find(option => option.value === currentType);
  const currentSchemaKeys = block.content.schemaKeys || [];

  return (
    <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
      <div className="flex items-center gap-3 mb-3">
        <Label htmlFor="product-type" className="text-sm font-medium whitespace-nowrap">
          Type:
        </Label>
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger id="product-type" className="w-40">
            <SelectValue>
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
      </div>

      {/* Schema Keys Multi-Selector */}
      <div className="mb-3">
        <Label className="text-sm font-medium mb-2 block">Schema Keys:</Label>
        
        {/* Selected Keys Display */}
        {currentSchemaKeys.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {currentSchemaKeys.map((key) => {
              const keyOption = schemaKeyOptions.find(opt => opt.value === key);
              return (
                <div key={key} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>{keyOption?.text || key}</span>
                  <button
                    onClick={() => removeSchemaKey(key)}
                    className="hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Multi-Select Dropdown */}
        <Select 
          open={isSchemaDropdownOpen} 
          onOpenChange={setIsSchemaDropdownOpen}
          value=""
          onValueChange={(value) => {
            handleSchemaKeyToggle(value);
            setIsSchemaDropdownOpen(false);
          }}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select schema keys..." />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-[60]">
            {schemaKeyOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className="cursor-pointer text-xs"
                disabled={currentSchemaKeys.includes(option.value)}
              >
                <div className="flex items-center gap-2">
                  <span>{option.text}</span>
                  {currentSchemaKeys.includes(option.value) && (
                    <span className="text-green-600 text-xs">✓</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Conditional toolbar based on type */}
      <div className="border-t border-gray-200 pt-3">
        {currentType === 'static' ? (
          <Button
            onClick={handleAddProducts}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add products
          </Button>
        ) : (
          <Button
            onClick={handleSelectFeed}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Database className="w-4 h-4 mr-2" />
            Select feed
          </Button>
        )}
      </div>
    </div>
  );
};
