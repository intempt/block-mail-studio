
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, User, Building, BarChart3, List } from 'lucide-react';
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
import { userAttributes } from '@/services/userData';
import { UserAttribute } from '@/types/user';

interface AttributeSelectorProps {
  selectedAttribute: string;
  onAttributeSelect: (attribute: string) => void;
  className?: string;
}

export const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  selectedAttribute,
  onAttributeSelect,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttributeType, setSelectedAttributeType] = useState<string>('all');
  const [searchValue, setSearchValue] = useState('');
  const [filteredAttributes, setFilteredAttributes] = useState<UserAttribute[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('Select attribute');

  const attributeTypes = [
    { value: 'all', label: 'All attributes', icon: List },
    { value: 'user', label: 'User attributes', icon: User },
    { value: 'account', label: 'Account attributes', icon: Building },
    { value: 'segment', label: 'Calculated attributes', icon: BarChart3 },
  ];

  const getFilteredAttributes = () => {
    let typeAttributes: UserAttribute[];
    if (selectedAttributeType === 'all') {
      typeAttributes = userAttributes;
    } else {
      typeAttributes = userAttributes.filter((attr: UserAttribute) => {
        const attrType = attr.type || attr.category;
        
        if (selectedAttributeType === 'account' && attrType === 'account') return true;
        if (selectedAttributeType === 'user' && attrType === 'user') return true;
        if (selectedAttributeType === 'segment' && (attrType === 'segment' || attrType === 'computed')) return true;
        
        return attrType === selectedAttributeType;
      });
    }
    
    if (!searchValue) return typeAttributes;
    
    return typeAttributes.filter((attr: UserAttribute) => {
      const name = String(attr.name || '');
      const displayName = String(attr.displayName || '');
      const description = String(attr.description || '');
      
      const searchLower = searchValue.toLowerCase();
      return name.toLowerCase().includes(searchLower) ||
             displayName.toLowerCase().includes(searchLower) ||
             description.toLowerCase().includes(searchLower);
    });
  };

  const getSelectedAttributeLabel = () => {
    if (!selectedAttribute) return 'Select attribute';
    
    const attribute = userAttributes.find((attr: UserAttribute) => attr?.name === selectedAttribute);
    return attribute ? (attribute.displayName || attribute.name) : selectedAttribute;
  };

  useEffect(() => {
    setFilteredAttributes(getFilteredAttributes());
  }, [selectedAttributeType, searchValue]);

  useEffect(() => {
    setSelectedLabel(getSelectedAttributeLabel());
  }, [selectedAttribute]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`w-full h-8 justify-between text-xs ${className || ''}`}
        >
          {selectedLabel}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start" side="left">
        <div className="flex flex-col h-80">
          {/* Search input at the top */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search attributes"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-1">
            {/* Left side - Attribute types */}
            <div className="w-64 border-r">
              <div className="p-2">
                <div className="space-y-1">
                  {attributeTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedAttributeType(type.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-md transition-colors whitespace-nowrap ${
                          selectedAttributeType === type.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Right side - Filtered attributes */}
            <div className="flex-1">
              <Command className="border-0">
                <CommandList className="max-h-64">
                  <CommandEmpty>No attributes found.</CommandEmpty>
                  {filteredAttributes.map((attribute: UserAttribute) => {
                    if (!attribute?.name) return null;
                    
                    const valueType = String(attribute.valueType || 'STR');
                    const displayName = String(attribute.displayName || attribute.name);
                    const description = String(attribute.description || '');
                    
                    return (
                      <CommandItem
                        key={attribute.name}
                        value={attribute.name}
                        onSelect={(value) => {
                          onAttributeSelect(value);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                      >
                        <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          {valueType.slice(0, 3).toUpperCase()}
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
        </div>
      </PopoverContent>
    </Popover>
  );
};
