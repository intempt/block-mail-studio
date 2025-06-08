
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { users, User } from '../../dummy/users';

interface UserSelectorProps {
  onUserChange?: (user: User) => void;
  className?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  onUserChange,
  className 
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].profile);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(users.slice(0, 50));
  const [showLoadMore, setShowLoadMore] = useState(true);

  const selectedUser = displayedUsers.find(u => u.profile === selectedUserId) || 
                      users.find(u => u.profile === selectedUserId);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    const user = displayedUsers.find(u => u.profile === userId) || 
                 users.find(u => u.profile === userId);
    if (user && onUserChange) {
      onUserChange(user);
    }
  };

  const handleLoadMore = () => {
    setDisplayedUsers(users);
    setShowLoadMore(false);
  };

  return (
    <Select value={selectedUserId} onValueChange={handleUserChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <img src="/gmail-icon.png" alt="Gmail" className="w-3 h-3" />
            <span>{selectedUser?.identifier}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {displayedUsers.map((user) => (
          <SelectItem key={user.profile} value={user.profile} className="text-xs">
            <div className="flex flex-col">
              <span className="font-medium">{user.identifier}</span>
              <span className="text-gray-500 text-xs">Last seen: {user.lastSeen}</span>
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
              Load More ({users.length - displayedUsers.length} remaining)
            </Button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
