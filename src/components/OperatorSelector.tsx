
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface OperatorSelectorProps {
  selectedOperator: string;
  onOperatorSelect: (operator: string) => void;
  attributeValueType?: string;
  className?: string;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  selectedOperator,
  onOperatorSelect,
  attributeValueType = 'STR',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getOperatorsForType = (valueType: string) => {
    const type = valueType.toUpperCase();
    
    const baseOperators = [
      { value: 'equals', label: 'equals', description: 'Exactly matches the value' },
      { value: 'not_equals', label: 'does not equal', description: 'Does not match the value' },
    ];

    const stringOperators = [
      { value: 'contains', label: 'contains', description: 'Contains the text' },
      { value: 'not_contains', label: 'does not contain', description: 'Does not contain the text' },
      { value: 'starts_with', label: 'starts with', description: 'Starts with the text' },
      { value: 'ends_with', label: 'ends with', description: 'Ends with the text' },
      { value: 'is_empty', label: 'is empty', description: 'Has no value' },
      { value: 'is_not_empty', label: 'is not empty', description: 'Has any value' },
    ];

    const numberOperators = [
      { value: 'greater_than', label: 'greater than', description: 'Is greater than the value' },
      { value: 'less_than', label: 'less than', description: 'Is less than the value' },
      { value: 'greater_equal', label: 'greater than or equal', description: 'Is greater than or equal to the value' },
      { value: 'less_equal', label: 'less than or equal', description: 'Is less than or equal to the value' },
    ];

    const dateOperators = [
      { value: 'before', label: 'before', description: 'Is before the date' },
      { value: 'after', label: 'after', description: 'Is after the date' },
      { value: 'between', label: 'between', description: 'Is between two dates' },
      { value: 'in_last', label: 'in the last', description: 'Within the last time period' },
      { value: 'in_next', label: 'in the next', description: 'Within the next time period' },
    ];

    const booleanOperators = [
      { value: 'is_true', label: 'is true', description: 'Is true' },
      { value: 'is_false', label: 'is false', description: 'Is false' },
    ];

    if (type.includes('STR') || type.includes('TEXT')) {
      return [...baseOperators, ...stringOperators];
    } else if (type.includes('NUM') || type.includes('INT') || type.includes('FLOAT')) {
      return [...baseOperators, ...numberOperators];
    } else if (type.includes('DATE') || type.includes('TIME')) {
      return [...baseOperators, ...dateOperators];
    } else if (type.includes('BOOL')) {
      return [...baseOperators, ...booleanOperators];
    }

    return baseOperators;
  };

  const operators = getOperatorsForType(attributeValueType);
  const selectedOperatorLabel = operators.find(op => op.value === selectedOperator)?.label || 'Select operator';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`w-full h-8 justify-between text-xs ${className || ''}`}
        >
          {selectedOperatorLabel}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandList className="max-h-64">
            {operators.map((operator) => (
              <CommandItem
                key={operator.value}
                value={operator.value}
                onSelect={(value) => {
                  onOperatorSelect(value);
                  setIsOpen(false);
                }}
                className="flex flex-col items-start gap-1 px-3 py-2"
              >
                <div className="font-medium text-sm">{operator.label}</div>
                <div className="text-xs text-gray-500">{operator.description}</div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
