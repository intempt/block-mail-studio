
import React, { useState } from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// Import as any to bypass type issues with dummy data
const userAttributesData = require('../../dummy/userAttributes').userAttributes;

interface UserFilterProps {
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAttributeOpen, setIsAttributeOpen] = useState(false);
  const [selectedAttributeType, setSelectedAttributeType] = useState<string>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const attributeTypes = [
    { value: 'all', label: 'All attributes', icon: '🔍' },
    { value: 'user', label: 'User attributes', icon: '👤' },
    { value: 'account', label: 'Account attributes', icon: '🏢' },
    { value: 'segment', label: 'Calculated attributes', icon: '📊' },
  ];

  const getFilteredAttributes = () => {
    // Safely handle the dummy data with proper type checks
    let allAttributes: any[] = [];
    
    try {
      // Ensure we have an array to work with
      allAttributes = Array.isArray(userAttributesData) ? userAttributesData : [];
    } catch (error) {
      console.log('Error loading user attributes:', error);
      return [];
    }
    
    let typeAttributes: any[];
    if (selectedAttributeType === 'all') {
      typeAttributes = allAttributes;
    } else {
      typeAttributes = allAttributes.filter((attr: any) => {
        // Handle different type formats in the dummy data
        return attr?.type === selectedAttributeType || 
               attr?.category === selectedAttributeType ||
               attr?.attributeType === selectedAttributeType;
      });
    }
    
    if (!searchValue) return typeAttributes;
    
    return typeAttributes.filter((attr: any) => {
      if (!attr) return false;
      const name = attr.name || '';
      const displayName = attr.displayName || attr.label || '';
      const description = attr.description || '';
      
      const searchLower = searchValue.toLowerCase();
      return name.toLowerCase().includes(searchLower) ||
             displayName.toLowerCase().includes(searchLower) ||
             description.toLowerCase().includes(searchLower);
    });
  };

  const getSelectedAttributeLabel = () => {
    if (!selectedAttribute) return 'Select attribute';
    
    try {
      const allAttributes = Array.isArray(userAttributesData) ? userAttributesData : [];
      const attribute = allAttributes.find((attr: any) => attr?.name === selectedAttribute);
      return attribute ? (attribute.displayName || attribute.label || attribute.name) : selectedAttribute;
    } catch (error) {
      console.log('Error finding attribute:', error);
      return selectedAttribute;
    }
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
      <PopoverContent className="w-64 p-4" align="start" side="bottom">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Filter Options</h4>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Attribute</label>
            
            <Popover open={isAttributeOpen} onOpenChange={setIsAttributeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isAttributeOpen}
                  className="w-full h-8 justify-between text-xs"
                >
                  {getSelectedAttributeLabel()}
                  <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start" side="bottom">
                <div className="flex h-80">
                  {/* Left side - Attribute types */}
                  <div className="w-48 border-r">
                    <div className="p-3 border-b">
                      <Command>
                        <CommandInput 
                          placeholder="Search" 
                          value={searchValue}
                          onValueChange={setSearchValue}
                          className="h-8"
                        />
                      </Command>
                    </div>
                    <div className="p-2">
                      <div className="space-y-1">
                        {attributeTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setSelectedAttributeType(type.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-md transition-colors ${
                              selectedAttributeType === type.value
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-base">{type.icon}</span>
                            <span>{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Filtered attributes */}
                  <div className="flex-1">
                    <div className="p-3 border-b">
                      <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        {attributeTypes.find(t => t.value === selectedAttributeType)?.label}
                      </h5>
                    </div>
                    <Command className="border-0">
                      <CommandList className="max-h-64">
                        <CommandEmpty>No attributes found.</CommandEmpty>
                        {getFilteredAttributes().map((attribute: any) => {
                          if (!attribute?.name) return null;
                          
                          // Safely get the value type with fallback
                          const valueType = attribute.valueType || attribute.dataType || 'STR';
                          const displayName = attribute.displayName || attribute.label || attribute.name;
                          const description = attribute.description || '';
                          
                          return (
                            <CommandItem
                              key={attribute.name}
                              value={attribute.name}
                              onSelect={(value) => {
                                setSelectedAttribute(value);
                                setIsAttributeOpen(false);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm"
                            >
                              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                {String(valueType).slice(0, 3).toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">{displayName}</div>
                                {description && (
                                  <div className="text-xs text-gray-500">{description}</div>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandList>
                    </Command>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
