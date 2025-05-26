
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  unreadCount: number;
  onClick: () => void;
}

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  isVisible,
  unreadCount,
  onClick
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        onClick={onClick}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full h-10 w-10 p-0 transition-all duration-200 animate-fade-in"
      >
        <ArrowDown className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};
