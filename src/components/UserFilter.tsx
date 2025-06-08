
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AttributeSelector } from './AttributeSelector';
import { OperatorSelector } from './OperatorSelector';

interface UserFilterProps {
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [attributeValueType, setAttributeValueType] = useState<string>('STR');

  const handleAttributeSelect = async (attribute: string) => {
    setSelectedAttribute(attribute);
    setSelectedOperator(''); // Reset operator when attribute changes
    
    // Get the attribute's value type for operator filtering
    try {
      const module = await import('../../dummy/userAttributes');
      const userAttribute = module.userAttributes.find((attr: any) => attr?.name === attribute);
      if (userAttribute) {
        setAttributeValueType(userAttribute.valueType || 'STR');
      }
    } catch (error) {
      console.warn('Error loading attribute details:', error);
      setAttributeValueType('STR');
    }
  };

  const handleOperatorSelect = (operator: string) => {
    setSelectedOperator(operator);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 ${className || ''}`}
        >
          <Filter className="w-3 h-3 mr-1" />
          Filter by
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start" side="left">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Filter Options</h4>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Attribute</label>
            <AttributeSelector
              selectedAttribute={selectedAttribute}
              onAttributeSelect={handleAttributeSelect}
            />
          </div>
          {selectedAttribute && (
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Operator</label>
              <OperatorSelector
                selectedOperator={selectedOperator}
                onOperatorSelect={handleOperatorSelect}
                attributeValueType={attributeValueType}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
