
import { useState, useCallback } from 'react';

export const useSelection = (onSelectionChange?: (blockId: string | null) => void) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
    onSelectionChange?.(blockId);
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedBlockId(null);
    onSelectionChange?.(null);
  }, [onSelectionChange]);

  return {
    selectedBlockId,
    selectBlock,
    clearSelection
  };
};
