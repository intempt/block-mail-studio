
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsiblePanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  title: string;
  side: 'left' | 'right';
  expandedWidth: string; // e.g., 'w-80' or 'w-96'
  collapsedWidth?: string; // e.g., 'w-8'
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  isCollapsed,
  onToggle,
  children,
  title,
  side,
  expandedWidth,
  collapsedWidth = 'w-8'
}) => {
  if (isCollapsed) {
    return (
      <div className={cn(
        collapsedWidth,
        'flex-shrink-0 bg-gray-100 border-r border-gray-200 relative transition-all duration-300 ease-in-out'
      )}>
        <div className="h-full flex flex-col items-center justify-start pt-4">
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1 h-8 w-6 hover:bg-gray-200 transition-colors"
            title={`Expand ${title}`}
          >
            {side === 'left' ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          
          {/* Vertical Title */}
          <div className="mt-6 transform -rotate-90 origin-center whitespace-nowrap">
            <span className="text-xs font-medium text-gray-600 tracking-wide">
              {title}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      expandedWidth,
      'flex-shrink-0 transition-all duration-300 ease-in-out relative'
    )}>
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          'absolute top-3 z-10 p-1 h-6 w-6 hover:bg-gray-200 transition-colors',
          side === 'left' ? 'right-2' : 'left-2'
        )}
        title={`Collapse ${title}`}
      >
        {side === 'left' ? (
          <ChevronLeft className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        )}
      </Button>
      
      {children}
    </div>
  );
};
