
import React from 'react';
import { ProductBlock } from '@/types/emailBlocks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

  // Get current type value, default to 'static' if not set
  const currentType = (block.content as any).type || 'static';

  return (
    <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
      <div className="flex items-center gap-3">
        <Label htmlFor="product-type" className="text-sm font-medium whitespace-nowrap">
          Type:
        </Label>
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger id="product-type" className="w-40">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-xs text-gray-500">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
