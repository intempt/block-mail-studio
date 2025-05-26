
import React from 'react';

interface LayoutOption {
  id: string;
  name: string;
  columns: number;
  ratio: string;
  preview: string[];
}

interface DynamicLayoutIconProps {
  layout: LayoutOption;
  className?: string;
}

export const DynamicLayoutIcon: React.FC<DynamicLayoutIconProps> = ({ 
  layout, 
  className = "w-6 h-5" 
}) => {
  const getColumnWidths = () => {
    // Convert percentage strings to actual widths for SVG (total width = 24)
    return layout.preview.map(percent => {
      const numericValue = parseFloat(percent.replace('%', ''));
      return (numericValue / 100) * 22; // 22 to leave space for gaps with larger size
    });
  };

  const renderColumns = () => {
    const widths = getColumnWidths();
    let currentX = 1; // Start with 1px margin
    const columnHeight = 14;
    const gap = 0.5;

    return widths.map((width, index) => {
      const rect = (
        <rect
          key={index}
          x={currentX}
          y={1}
          width={width}
          height={columnHeight}
          fill="#dbeafe"
          stroke="#93c5fd"
          strokeWidth="0.5"
          rx="0.5"
        />
      );
      currentX += width + gap;
      return rect;
    });
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderColumns()}
    </svg>
  );
};
