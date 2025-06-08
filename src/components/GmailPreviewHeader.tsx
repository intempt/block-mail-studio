
import React from 'react';
import { Eye } from 'lucide-react';
import { UserSelector } from './UserSelector';
import { User } from '../../dummy/users';

interface GmailPreviewHeaderProps {
  onUserChange?: (user: User) => void;
}

export const GmailPreviewHeader: React.FC<GmailPreviewHeaderProps> = ({ 
  onUserChange 
}) => {
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
            onUserChange={onUserChange}
            className="w-48 h-7 text-xs bg-white border-blue-200"
          />
        </div>
      </div>
    </div>
  );
};
