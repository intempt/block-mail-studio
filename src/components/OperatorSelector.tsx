
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

  const operators = [
    { value: 'is', label: 'is', description: 'Exactly matches the value' },
    { value: 'is_not', label: 'is not', description: 'Does not match the value' },
    { value: 'has_any_value', label: 'has any value', description: 'Has any value' },
    { value: 'has_no_value', label: 'has no value', description: 'Has no value' },
    { value: 'contain', label: 'contain', description: 'Contains the text' },
    { value: 'does_not_contains', label: 'does not contains', description: 'Does not contain the text' },
    { value: 'is_greater_than', label: 'is greater than', description: 'Is greater than the value' },
    { value: 'is_less_than', label: 'is less than', description: 'Is less than the value' },
    { value: 'is_less_than_or_equal', label: 'is less than or equal', description: 'Is less than or equal to the value' },
    { value: 'is_greater_than_or_equal', label: 'is greater than or equal', description: 'Is greater than or equal to the value' },
  ];

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
