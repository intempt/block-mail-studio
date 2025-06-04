
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Variable } from 'lucide-react';

interface VariableTagProps {
  text: string;
  value: string;
  onRemove: () => void;
  className?: string;
}

export const VariableTag: React.FC<VariableTagProps> = ({
  text,
  value,
  onRemove,
  className = ''
}) => {
  return (
    <Badge 
      variant="secondary" 
      className={`inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 transition-colors px-2 py-1 ${className}`}
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      <Variable className="w-3 h-3" />
      <span className="text-xs font-medium">{text}</span>
      <Button
        size="sm"
        variant="ghost"
        className="w-4 h-4 p-0 hover:bg-purple-300 rounded-full ml-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="w-3 h-3" />
      </Button>
    </Badge>
  );
};
