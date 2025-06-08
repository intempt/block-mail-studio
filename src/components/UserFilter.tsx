
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserFilterProps {
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({ className }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 ${className || ''}`}
    >
      <Filter className="w-3 h-3 mr-1" />
      Filter by
    </Button>
  );
};
