
import React from 'react';

export interface BlockItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface BlockSectionProps {
  blockItems: BlockItem[];
  compactMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onBlockAdd: (blockType: string) => void;
  onDragStart: (e: React.DragEvent, blockType: string) => void;
}

export interface BlockItemProps {
  block: BlockItem;
  compactMode: boolean;
  onBlockAdd: (blockType: string) => void;
  onDragStart: (e: React.DragEvent, blockType: string) => void;
}
