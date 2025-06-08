
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFilterProps {
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');

  const attributes = [
    { value: 'email', label: 'Email' },
    { value: 'lastSeen', label: 'Last Seen' },
    { value: 'status', label: 'Status' },
    { value: 'location', label: 'Location' },
  ];

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
      <PopoverContent className="w-64 p-4" align="end" side="bottom">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Filter Options</h4>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Attribute</label>
            <Select value={selectedAttribute} onValueChange={setSelectedAttribute}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                {attributes.map((attribute) => (
                  <SelectItem key={attribute.value} value={attribute.value} className="text-xs">
                    {attribute.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
