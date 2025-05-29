
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmailBlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
}

export const EmailBlockPalette: React.FC<EmailBlockPaletteProps> = ({ onBlockAdd }) => {
  const blocks = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'divider', label: 'Divider', icon: '➖' },
    { type: 'spacer', label: 'Spacer', icon: '⬜' }
  ];

  return (
    <Card className="h-full p-4">
      <h3 className="font-semibold mb-4">Blocks</h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <button
            key={block.type}
            onClick={() => onBlockAdd(block.type)}
            className="w-full p-3 text-left border rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <span>{block.icon}</span>
            <span>{block.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};
