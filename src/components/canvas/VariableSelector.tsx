
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Variable, ChevronDown } from 'lucide-react';
import { dummyVariables, VariableOption } from '../../../dummy/variables';

interface VariableSelectorProps {
  onSelectVariable: (variable: VariableOption) => void;
  trigger?: React.ReactNode;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  onSelectVariable,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectVariable = (variable: VariableOption) => {
    onSelectVariable(variable);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button
      size="sm"
      variant="ghost"
      className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
    >
      <Variable className="w-4 h-4" />
    </Button>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50"
        align="start"
        side="right"
      >
        <DropdownMenuLabel className="text-sm font-medium text-gray-700">
          Insert Variable
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-64 overflow-y-auto">
          {dummyVariables.map((variable, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleSelectVariable(variable)}
              className="cursor-pointer text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Variable className="w-3 h-3 text-purple-600" />
                <span>{variable.text}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
