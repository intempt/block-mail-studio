
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

  const loadUserAttributes = async () => {
    try {
      // Use dynamic import with proper error handling for type mismatches
      const module = await import('../../dummy/userAttributes');
      
      // Handle the case where userAttributes might not exist or be malformed
      if (!module || !module.userAttributes) {
        console.warn('No user attributes found in module');
        return [];
      }

      // Use any type to bypass TypeScript checking for the dummy data
      const rawAttributes = module.userAttributes as any[];
      
      // Filter out any null/undefined entries and validate structure
      return rawAttributes.filter((attr: any) => {
        return attr && 
               typeof attr === 'object' && 
               attr.name && 
               typeof attr.name === 'string';
      });
    } catch (error) {
      console.warn('Failed to load user attributes:', error);
      return [];
    }
  };

  const getFilteredAttributes = async () => {
    try {
      const allAttributes = await loadUserAttributes();
      
      let typeAttributes: any[];
      if (selectedAttributeType === 'all') {
        typeAttributes = allAttributes;
      } else {
        typeAttributes = allAttributes.filter((attr: any) => {
          if (!attr) return false;
          
          // Handle different type formats in the dummy data with flexible matching
          const attrType = attr.type || attr.category || attr.attributeType;
          
          // Map problematic types to our expected types
          if (selectedAttributeType === 'account' && attrType === 'account') return true;
          if (selectedAttributeType === 'user' && attrType === 'user') return true;
          if (selectedAttributeType === 'segment' && (attrType === 'segment' || attrType === 'scoring' || attrType === 'computed')) return true;
          
          return attrType === selectedAttributeType;
        });
      }
      
      if (!searchValue) return typeAttributes;
      
      return typeAttributes.filter((attr: any) => {
        if (!attr) return false;
        
        const name = String(attr.name || '');
        const displayName = String(attr.displayName || '');
        const description = String(attr.description || '');
        
        const searchLower = searchValue.toLowerCase();
        return name.toLowerCase().includes(searchLower) ||
               displayName.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower);
      });
    } catch (error) {
      console.warn('Error filtering attributes:', error);
      return [];
    }
  };

  const getSelectedAttributeLabel = async () => {
    if (!selectedAttribute) return 'Select attribute';
    
    try {
      const allAttributes = await loadUserAttributes();
      const attribute = allAttributes.find((attr: any) => attr?.name === selectedAttribute);
      return attribute ? (attribute.displayName || attribute.name) : selectedAttribute;
    } catch (error) {
      console.warn('Error finding attribute:', error);
      return selectedAttribute;
    }
  };

  const [filteredAttributes, setFilteredAttributes] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('Select attribute');

  React.useEffect(() => {
    getFilteredAttributes().then(setFilteredAttributes);
  }, [selectedAttributeType, searchValue]);

  React.useEffect(() => {
    getSelectedAttributeLabel().then(setSelectedLabel);
  }, [selectedAttribute]);

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
                  {selectedLabel}
                  <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start" side="left">
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
                        {filteredAttributes.map((attribute: any) => {
                          if (!attribute?.name) return null;
                          
                          // Safely get the value type with fallback
                          const valueType = String(attribute.valueType || 'STR');
                          const displayName = String(attribute.displayName || attribute.name);
                          const description = String(attribute.description || '');
                          
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
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
