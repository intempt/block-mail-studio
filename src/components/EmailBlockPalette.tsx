
import React from 'react';

interface EmailBlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
}

export const EmailBlockPalette: React.FC<EmailBlockPaletteProps> = ({ onBlockAdd }) => {
  const blockTypes = [
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'button', label: 'Button' },
    { type: 'divider', label: 'Divider' },
    { type: 'spacer', label: 'Spacer' }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Block Palette</h3>
      <div className="space-y-2">
        {blockTypes.map(block => (
          <button
            key={block.type}
            onClick={() => onBlockAdd(block.type)}
            className="w-full p-3 text-left border rounded hover:bg-gray-50"
          >
            {block.label}
          </button>
        ))}
      </div>
    </div>
  );
};
