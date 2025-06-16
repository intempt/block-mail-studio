
import React from 'react';

export interface BlockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

export interface RibbonBlockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface BlockItemProps {
  block: BlockItem | RibbonBlockItem;
  compactMode?: boolean;
  onBlockAdd: (blockType: string) => void;
  onDragStart?: (e: React.DragEvent, blockType: string) => void;
}

export interface BlockSectionProps {
  blockItems: (BlockItem | RibbonBlockItem)[];
  compactMode?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onBlockAdd: (blockType: string) => void;
  onDragStart?: (e: React.DragEvent, blockType: string) => void;
}
