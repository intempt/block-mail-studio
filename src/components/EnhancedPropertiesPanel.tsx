
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { PropertyEditorPanel } from './PropertyEditorPanel';

export interface EnhancedPropertiesPanelProps {
  selectedBlock: EmailBlock | null;
  onBlockUpdate: (block: EmailBlock) => void;
  onBlockDelete: (blockId: string) => void;
  globalStyles?: any;
  onGlobalStylesChange?: (styles: any) => void;
}

export const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedBlock,
  onBlockUpdate,
  onBlockDelete,
  globalStyles,
  onGlobalStylesChange
}) => {
  return (
    <PropertyEditorPanel
      selectedBlock={selectedBlock}
      onBlockUpdate={onBlockUpdate}
    />
  );
};
