
// Block Manager - Central export point for all block functionality
export { BlockSection } from './BlockSection';
export { BlockItem } from './BlockItem';
export { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
export { PaletteTabContent } from './PaletteTabContent';

// Re-export types for convenience
export type { 
  BlockItem as BlockItemType, 
  RibbonBlockItem, 
  BlockItemProps, 
  BlockSectionProps 
} from './types';
