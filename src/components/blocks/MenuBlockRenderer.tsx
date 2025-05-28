
import React from 'react';
import { MenuBlock } from '@/types/emailBlocks';

interface MenuBlockRendererProps {
  block: MenuBlock;
  isSelected: boolean;
  onUpdate: (block: MenuBlock) => void;
}

export const MenuBlockRenderer: React.FC<MenuBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="menu-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      <nav className={`flex ${block.content.layout === 'vertical' ? 'flex-col' : 'flex-row'} justify-center items-center gap-4`}>
        {block.content.items.map((item, index) => (
          <a
            key={index}
            href={item.link || item.url || '#'}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {item.text || item.label || 'Menu Item'}
          </a>
        ))}
      </nav>
    </div>
  );
};
