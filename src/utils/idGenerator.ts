
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';

/**
 * Generates a unique ID with enhanced randomness to prevent collisions
 */
export const generateUniqueId = (prefix: string = 'block'): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomString}`;
};

/**
 * Recursively regenerates IDs for a block and all its nested blocks
 */
export const regenerateBlockIds = (block: EmailBlock): EmailBlock => {
  // Generate new ID for the current block
  const newId = generateUniqueId(`${block.id}_copy`);
  
  // Create the new block with the updated ID
  let newBlock: EmailBlock = {
    ...block,
    id: newId,
    isStarred: false // Reset starred state for duplicates
  };
  
  // Handle columns blocks recursively
  if (block.type === 'columns') {
    const columnsBlock = block as ColumnsBlock;
    const updatedColumns = columnsBlock.content.columns.map(column => ({
      ...column,
      id: generateUniqueId(`${column.id}_copy`), // Regenerate column ID too
      blocks: column.blocks.map(nestedBlock => regenerateBlockIds(nestedBlock)) // Recursively regenerate nested block IDs
    }));
    
    newBlock = {
      ...newBlock,
      content: {
        ...columnsBlock.content,
        columns: updatedColumns
      }
    } as ColumnsBlock;
  }
  
  return newBlock;
};

/**
 * Utility to check for ID collisions in a block array
 */
export const hasIdCollisions = (blocks: EmailBlock[]): boolean => {
  const seenIds = new Set<string>();
  
  const checkBlock = (block: EmailBlock): boolean => {
    if (seenIds.has(block.id)) {
      return true; // Collision found
    }
    seenIds.add(block.id);
    
    // Check nested blocks in columns
    if (block.type === 'columns') {
      const columnsBlock = block as ColumnsBlock;
      for (const column of columnsBlock.content.columns) {
        if (seenIds.has(column.id)) {
          return true;
        }
        seenIds.add(column.id);
        
        for (const nestedBlock of column.blocks) {
          if (checkBlock(nestedBlock)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  for (const block of blocks) {
    if (checkBlock(block)) {
      return true;
    }
  }
  
  return false;
};
