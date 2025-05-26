
import React from 'react';

interface RibbonTabProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  shortcut?: string;
}

export const RibbonTab: React.FC<RibbonTabProps> = ({
  id,
  label,
  isActive,
  onClick,
  shortcut
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 relative group ${
        isActive
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
      title={shortcut}
    >
      {label}
      {shortcut && (
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
          {shortcut}
        </span>
      )}
    </button>
  );
};
