
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { GmailPreviewHeader } from '../GmailPreviewHeader';
import { UserSelector } from '../UserSelector';
import { UserFilter } from '../UserFilter';
import { User, UserDetails } from '@/types/user';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface FilterCriteria {
  attribute: string;
  operator: string;
  value: string | string[];
  attributeLabel: string;
  attributeValueType: string;
}

interface RibbonPreviewIndicatorProps {
  viewMode: ViewMode;
  onUserChange?: (user: User, userDetails: UserDetails) => void;
}

export const RibbonPreviewIndicator: React.FC<RibbonPreviewIndicatorProps> = ({ 
  viewMode, 
  onUserChange 
}) => {
  const [currentFilter, setCurrentFilter] = useState<FilterCriteria | null>(null);

  if (viewMode === 'edit') return null;

  if (viewMode === 'desktop-preview') {
    return <GmailPreviewHeader onUserChange={onUserChange} />;
  }

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
            Mobile Preview
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
