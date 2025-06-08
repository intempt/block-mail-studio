
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface ValueInputProps {
  operator: string;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  className?: string;
}

export const ValueInput: React.FC<ValueInputProps> = ({
  operator,
  value,
  onValueChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Operators that don't need a value input
  const noValueOperators = ['has_any_value', 'has_no_value'];
  
  // Operators that allow multiple values
  const multiValueOperators = ['contain'];

  if (noValueOperators.includes(operator)) {
    return null;
  }

  const isMultiValue = multiValueOperators.includes(operator);
  const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);

  const handleAddValue = (newValue: string) => {
    if (!newValue.trim()) return;
    
    if (isMultiValue) {
      const currentValues = Array.isArray(value) ? value : [];
      if (!currentValues.includes(newValue)) {
        onValueChange([...currentValues, newValue]);
      }
    } else {
      onValueChange(newValue);
    }
    setInputValue('');
    if (!isMultiValue) {
      setIsOpen(false);
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    if (isMultiValue && Array.isArray(value)) {
      onValueChange(value.filter(v => v !== valueToRemove));
    }
  };

  const getDisplayText = () => {
    if (isMultiValue) {
      return selectedValues.length > 0 
        ? `${selectedValues.length} value${selectedValues.length !== 1 ? 's' : ''} selected`
        : 'Select values';
    } else {
      return value || 'Enter value';
    }
  };

  if (isMultiValue) {
    return (
      <div className={`space-y-2 ${className || ''}`}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="w-full h-8 justify-between text-xs"
            >
              {getDisplayText()}
              <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <div className="flex items-center border-b px-3">
                <CommandInput
                  placeholder="Type to add value..."
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddValue(inputValue);
                    }
                  }}
                />
              </div>
              <CommandList className="max-h-32">
                <CommandEmpty>
                  <Button
                    variant="ghost"
                    className="w-full text-xs"
                    onClick={() => handleAddValue(inputValue)}
                    disabled={!inputValue.trim()}
                  >
                    Add "{inputValue}"
                  </Button>
                </CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((val, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                <span>{val}</span>
                <button
                  onClick={() => handleRemoveValue(val)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single value input
  return (
    <Input
      type="text"
      placeholder="Enter value"
      value={value as string || ''}
      onChange={(e) => onValueChange(e.target.value)}
      className={`h-8 text-xs ${className || ''}`}
    />
  );
};
