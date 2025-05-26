
import React from 'react';

interface RibbonGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const RibbonGroup: React.FC<RibbonGroupProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`ribbon-group flex flex-col items-center px-4 py-2 border-r border-gray-100 last:border-r-0 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
        {children}
      </div>
      <span className="text-xs text-gray-600 font-medium text-center">
        {title}
      </span>
    </div>
  );
};
