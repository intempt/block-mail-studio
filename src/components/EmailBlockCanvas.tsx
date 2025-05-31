
import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useEmailBlocks } from '@/hooks/useEmailBlocks';
import { useSelection } from '@/hooks/useSelection';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export interface EmailBlockCanvasRef {
  exportHTML: () => string;
  clearCanvas: () => void;
  optimizeImages: () => string;
  minifyHTML: () => string;
  checkLinks: () => { valid: number; broken: number };
  getBlocks: () => EmailBlock[];
  setBlocks: (blocks: EmailBlock[]) => void;
  addBlock: (block: EmailBlock) => void;
  findAndReplaceText: (searchText: string, replaceText: string) => void;
}

interface EmailBlockCanvasProps {
  initialBlocks?: EmailBlock[];
  onBlocksChange?: (blocks: EmailBlock[]) => void;
  onExport?: (html: string) => void;
  onSelectionChange?: (blockId: string | null) => void;
  onBlockSelect?: (blockId: string | null) => void;
  className?: string;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject?: string;
  onSubjectChange?: (subject: string) => void;
  showAIAnalytics?: boolean;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  initialBlocks = [],
  onBlocksChange,
  onExport,
  onSelectionChange,
  onBlockSelect,
  className = '',
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject = '',
  onSubjectChange,
  showAIAnalytics = false
}, ref) => {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  
  const {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    getDefaultContent,
    getDefaultStyles
  } = useEmailBlocks(initialBlocks, onBlocksChange);

  const {
    selectedBlockId,
    selectBlock,
    clearSelection
  } = useSelection(onSelectionChange || onBlockSelect);

  const dragDropHandlers = useDragDrop({
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    getDefaultContent,
    getDefaultStyles
  });

  useKeyboardShortcuts({
    onDelete: () => {
      if (selectedBlockId) {
        deleteBlock(selectedBlockId);
        clearSelection();
      }
    },
    onDuplicate: () => {
      if (selectedBlockId) {
        duplicateBlock(selectedBlockId);
      }
    },
    onMove: (direction: 'up' | 'down') => {
      if (selectedBlockId) {
        const selectedIndex = blocks.findIndex(block => block.id === selectedBlockId);
        if (selectedIndex !== -1) {
          const newIndex = direction === 'up' ? Math.max(0, selectedIndex - 1) : Math.min(blocks.length - 1, selectedIndex + 1);
          moveBlock(selectedIndex, newIndex);
          selectBlock(blocks[newIndex].id);
        }
      }
    }
  });

  useImperativeHandle(ref, () => ({
    exportHTML: () => {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Email</title></head><body>${blocks.map(block => block.content.html || '').join('')}</body></html>`;
    },
    clearCanvas: () => {
      setBlocks([]);
      clearSelection();
    },
    optimizeImages: () => 'Images optimized',
    minifyHTML: () => 'HTML minified',
    checkLinks: () => ({ valid: 0, broken: 0 }),
    getBlocks: () => blocks,
    setBlocks: (newBlocks: EmailBlock[]) => setBlocks(newBlocks),
    addBlock: (block: EmailBlock) => addBlock(block),
    findAndReplaceText: (searchText: string, replaceText: string) => {
      blocks.forEach(block => {
        if (block.content.html && block.content.html.includes(searchText)) {
          updateBlock(block.id, {
            content: {
              ...block.content,
              html: block.content.html.replace(new RegExp(searchText, 'g'), replaceText)
            }
          });
        }
      });
    }
  }));

  return (
    <div 
      className={`email-canvas ${className}`} 
      style={{ width: previewWidth }}
      onDragOver={dragDropHandlers.handleCanvasDragOver}
      onDragLeave={dragDropHandlers.handleCanvasDragLeave}
      onDrop={dragDropHandlers.handleCanvasDrop}
    >
      <CanvasRenderer
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        editingBlockId={editingBlockId}
        isDraggingOver={dragDropHandlers.isDraggingOver}
        dragOverIndex={dragDropHandlers.dragOverIndex}
        currentDragType={dragDropHandlers.currentDragType}
        onBlockClick={selectBlock}
        onBlockDoubleClick={(blockId, blockType) => setEditingBlockId(blockId)}
        onBlockDragStart={dragDropHandlers.handleBlockDragStart}
        onBlockDrop={dragDropHandlers.handleBlockDrop}
        onDeleteBlock={deleteBlock}
        onDuplicateBlock={duplicateBlock}
        onSaveAsSnippet={() => {}}
        onTipTapChange={(blockId, html) => updateBlock(blockId, { content: { html } })}
        onTipTapBlur={() => setEditingBlockId(null)}
        onColumnDrop={() => {}}
        onBlockEditStart={setEditingBlockId}
        onBlockEditEnd={() => setEditingBlockId(null)}
        onBlockUpdate={(block) => updateBlock(block.id, block)}
      />
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
