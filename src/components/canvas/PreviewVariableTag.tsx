
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Variable } from 'lucide-react';

interface PreviewVariableTagProps {
  text: string;
  value: string;
  className?: string;
}

export const PreviewVariableTag: React.FC<PreviewVariableTagProps> = ({
  text,
  value,
  className = ''
}) => {
  return (
    <Badge 
      variant="secondary" 
      className={`inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 px-2 py-1 rounded-md ${className}`}
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      <Variable className="w-3 h-3" />
      <span className="text-caption font-medium">{text}</span>
    </Badge>
  );
};
