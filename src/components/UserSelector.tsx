
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { users, User } from '../../dummy/users';

interface FilterCriteria {
  attribute: string;
  operator: string;
  value: string | string[];
  attributeLabel: string;
  attributeValueType: string;
}

interface UserSelectorProps {
  onUserChange?: (user: User | null) => void;
  filter?: FilterCriteria | null;
  className?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  onUserChange,
  filter,
  className 
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(users.slice(0, 50));
  const [showLoadMore, setShowLoadMore] = useState(true);

  // Apply filter whenever filter changes
  useEffect(() => {
    if (!filter) {
      setFilteredUsers(users);
      setDisplayedUsers(users.slice(0, 50));
      setShowLoadMore(users.length > 50);
      return;
    }

    const filtered = users.filter(user => {
      // Get the attribute value from the user object
      const attributeValue = getAttributeValue(user, filter.attribute);
      
      if (attributeValue === undefined || attributeValue === null) {
        return filter.operator === 'has_no_value';
      }

      switch (filter.operator) {
        case 'is':
          return String(attributeValue).toLowerCase() === String(filter.value).toLowerCase();
        case 'is_not':
          return String(attributeValue).toLowerCase() !== String(filter.value).toLowerCase();
        case 'has_any_value':
          return attributeValue !== undefined && attributeValue !== null && String(attributeValue).trim() !== '';
        case 'has_no_value':
          return attributeValue === undefined || attributeValue === null || String(attributeValue).trim() === '';
        case 'contain':
          if (Array.isArray(filter.value)) {
            return filter.value.some(val => 
              String(attributeValue).toLowerCase().includes(String(val).toLowerCase())
            );
          }
          return String(attributeValue).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'does_not_contains':
          return !String(attributeValue).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'is_greater_than':
          return Number(attributeValue) > Number(filter.value);
        case 'is_less_than':
          return Number(attributeValue) < Number(filter.value);
        case 'is_less_than_or_equal':
          return Number(attributeValue) <= Number(filter.value);
        case 'is_greater_than_or_equal':
          return Number(attributeValue) >= Number(filter.value);
        default:
          return true;
      }
    });

    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, 50));
    setShowLoadMore(filtered.length > 50);

    // Clear selection if current selected user is not in filtered list
    if (selectedUserId && !filtered.find(u => u.profile === selectedUserId)) {
      setSelectedUserId('');
      if (onUserChange) {
        onUserChange(null);
      }
    }
  }, [filter, selectedUserId, onUserChange]);

  const getAttributeValue = (user: User, attributeName: string): any => {
    // Handle common user properties
    const commonAttributes: Record<string, keyof User> = {
      'identifier': 'identifier',
      'lastSeen': 'lastSeen',
      'profile': 'profile'
    };

    if (commonAttributes[attributeName]) {
      return user[commonAttributes[attributeName]];
    }

    // For other attributes, you might need to extend User type or handle custom attributes
    // For now, return undefined for unknown attributes
    return undefined;
  };

  const selectedUser = displayedUsers.find(u => u.profile === selectedUserId) || 
                      filteredUsers.find(u => u.profile === selectedUserId);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    const user = filteredUsers.find(u => u.profile === userId);
    if (user && onUserChange) {
      onUserChange(user);
    }
  };

  const handleLoadMore = () => {
    setDisplayedUsers(filteredUsers);
    setShowLoadMore(false);
  };

  return (
    <Select value={selectedUserId} onValueChange={handleUserChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select">
          {selectedUser && (
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-3 h-3" />
              <span className="truncate">{selectedUser.identifier}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {displayedUsers.map((user) => (
          <SelectItem key={user.profile} value={user.profile} className="text-xs">
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-3 h-3" />
              <div className="flex flex-col">
                <span className="font-medium truncate">{user.identifier}</span>
                <span className="text-gray-500 text-xs">Last seen: {user.lastSeen}</span>
              </div>
            </div>
          </SelectItem>
        ))}
        {showLoadMore && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLoadMore}
              className="w-full text-xs"
            >
              Load More ({filteredUsers.length - displayedUsers.length} remaining)
            </Button>
          </div>
        )}
        {filteredUsers.length === 0 && (
          <div className="p-2 text-center text-xs text-gray-500">
            No users match the current filter
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
