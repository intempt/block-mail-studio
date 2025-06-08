
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { UserSelector } from './UserSelector';
import { UserFilter } from './UserFilter';
import { User } from '../../dummy/users';
import { UserDetails } from '../../dummy/userDetails';

interface FilterCriteria {
  attribute: string;
  operator: string;
  value: string | string[];
  attributeLabel: string;
  attributeValueType: string;
}

interface GmailPreviewHeaderProps {
  onUserChange?: (user: User, userDetails: UserDetails) => void;
}

export const GmailPreviewHeader: React.FC<GmailPreviewHeaderProps> = ({ 
  onUserChange 
}) => {
  const [currentFilter, setCurrentFilter] = useState<FilterCriteria | null>(null);

  const handleFilterChange = (filter: FilterCriteria | null) => {
    setCurrentFilter(filter);
  };

  const handleUserSelection = (user: User | null, userDetails?: UserDetails | null) => {
    if (user && userDetails && onUserChange) {
      onUserChange(user, userDetails);
    }
  };

  return (
    <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Gmail Desktop Preview
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600">Recipient:</span>
          <UserSelector 
            onUserChange={handleUserSelection}
            filter={currentFilter}
            className="w-48 h-7 text-xs bg-white border-blue-200"
          />
          <UserFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
    </div>
  );
};
