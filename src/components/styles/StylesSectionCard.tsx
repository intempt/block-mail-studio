
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StylesSectionCardProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const StylesSectionCard: React.FC<StylesSectionCardProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full justify-between p-3 h-auto text-left rounded-lg"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      {/* Content */}
      {isOpen && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
};
