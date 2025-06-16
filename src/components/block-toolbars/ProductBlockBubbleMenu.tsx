
import React from 'react';
import { ProductBlock } from '@/types/emailBlocks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Database } from 'lucide-react';

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
