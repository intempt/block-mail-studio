
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AttributeSelector } from './AttributeSelector';
import { OperatorSelector } from './OperatorSelector';
import { ValueInput } from './ValueInput';

interface FilterCriteria {
  attribute: string;
  operator: string;
  value: string | string[];
  attributeLabel: string;
  attributeValueType: string;
}

interface UserFilterProps {
  className?: string;
  onFilterChange?: (filter: FilterCriteria | null) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({ className, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [attributeValueType, setAttributeValueType] = useState<string>('STR');
  const [filterValue, setFilterValue] = useState<string | string[]>('');
  const [selectedAttributeLabel, setSelectedAttributeLabel] = useState<string>('');

  const handleAttributeSelect = async (attribute: string) => {
    setSelectedAttribute(attribute);
    setSelectedOperator(''); // Reset operator when attribute changes
    setFilterValue(''); // Reset value when attribute changes
    
    // Get the attribute's value type and display name for operator filtering
    try {
      const { userAttributes } = await import('@/services/userData');
      const userAttribute = userAttributes.find((attr: any) => attr?.name === attribute);
      if (userAttribute) {
        setAttributeValueType((userAttribute as any).valueType || (userAttribute as any).type || 'STR');
        setSelectedAttributeLabel((userAttribute as any).displayName || userAttribute.name || attribute);
      }
    } catch (error) {
      console.warn('Error loading attribute details:', error);
      setAttributeValueType('STR');
      setSelectedAttributeLabel(attribute);
    }
  };

  const handleOperatorSelect = (operator: string) => {
    setSelectedOperator(operator);
    setFilterValue(''); // Reset value when operator changes
  };

  const handleValueChange = (value: string | string[]) => {
    setFilterValue(value);
    
    // Emit filter change when all required fields are complete
    const shouldShowValueInput = selectedOperator && !['has_any_value', 'has_no_value'].includes(selectedOperator);
    const hasCompleteFilter = selectedAttribute && selectedOperator && 
      (!shouldShowValueInput || (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())));
    
    if (hasCompleteFilter && onFilterChange) {
      onFilterChange({
        attribute: selectedAttribute,
        operator: selectedOperator,
        value: value,
        attributeLabel: selectedAttributeLabel,
        attributeValueType: attributeValueType
      });
    }
  };

  const handleClearFilter = () => {
    setSelectedAttribute('');
    setSelectedOperator('');
    setFilterValue('');
    setSelectedAttributeLabel('');
    setAttributeValueType('STR');
    
    // Emit null filter to clear
    if (onFilterChange) {
      onFilterChange(null);
    }
  };

  // Check if we should show the value input
  const shouldShowValueInput = selectedOperator && !['has_any_value', 'has_no_value'].includes(selectedOperator);

  // Construct concise filter text
  const getFilterText = () => {
    if (!selectedAttribute || !selectedOperator) {
      return '';
    }

    const operatorLabels: Record<string, string> = {
      'is': 'is',
      'is_not': 'is not',
      'has_any_value': 'has any value',
      'has_no_value': 'has no value',
      'contain': 'contains',
      'does_not_contains': 'does not contain',
      'is_greater_than': 'is greater than',
      'is_less_than': 'is less than',
      'is_less_than_or_equal': 'is less than or equal to',
      'is_greater_than_or_equal': 'is greater than or equal to',
    };

    const operatorText = operatorLabels[selectedOperator] || selectedOperator;
    let valueText = '';

    if (shouldShowValueInput && filterValue) {
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 1) {
          valueText = ` "${filterValue[0]}"`;
        } else if (filterValue.length > 1) {
          valueText = ` ${filterValue.length} values`;
        }
      } else if (filterValue.toString().trim()) {
        valueText = ` "${filterValue}"`;
      }
    }

    return `${selectedAttributeLabel} ${operatorText}${valueText}`;
  };

  const filterText = getFilterText();
  const hasCompleteFilter = selectedAttribute && selectedOperator && 
    (!shouldShowValueInput || (filterValue && (Array.isArray(filterValue) ? filterValue.length > 0 : filterValue.toString().trim())));

  // Determine button text based on filter state
  const getButtonText = () => {
    if (hasCompleteFilter) {
      return filterText;
    }
    return 'Filter';
  };

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 ${
              hasCompleteFilter ? 'bg-blue-50 border-blue-300' : ''
            }`}
          >
            <Filter className="w-3 h-3 mr-1" />
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start" side="left">
          <div className="space-y-3">
            <div className="space-y-2">
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
            {shouldShowValueInput && (
              <div className="space-y-2">
                <label className="text-xs text-gray-600">Value</label>
                <ValueInput
                  operator={selectedOperator}
                  value={filterValue}
                  onValueChange={handleValueChange}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {hasCompleteFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
          title="Clear filter"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
