import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './CanvasRenderer';
import { StandaloneBlockControls } from './StandaloneBlockControls';
import { useDragDropHandler } from './DragDropHandler';
import { CanvasStatus } from './CanvasStatus';
import { CanvasSubjectLine } from '../CanvasSubjectLine';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';

interface VariableOption {
  text: string;
  value: string;
}

interface EditViewProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  selectedBlockId: string | null;
  setSelectedBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  editingBlockId: string | null;
  setEditingBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  onBlockSelect: (blockId: string | null) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile';
  compactMode: boolean;
  subject: string;
  onSubjectChange: (subject: string) => void;
  showAIAnalytics: boolean;
  onSnippetRefresh?: () => void;
  currentEmailHTML: string;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
}

export const EditView: React.FC<EditViewProps> = ({
  blocks,
  setBlocks,
  selectedBlockId,
  setSelectedBlockId,
  editingBlockId,
  setEditingBlockId,
  onBlockSelect,
  previewWidth,
  previewMode,
  compactMode,
  subject,
  onSubjectChange,
  showAIAnalytics,
  onSnippetRefresh,
  currentEmailHTML,
  getDefaultContent,
  getDefaultStyles
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);
  
  // Simplified hover state - only track which block is hovered
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const handleBlockClick = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  }, [onBlockSelect, setSelectedBlockId]);

  const handleBlockDoubleClick = useCallback((blockId: string, blockType: string) => {
    setEditingBlockId(blockId);
  }, [setEditingBlockId]);

  // Simplified hover handlers - only update selectedBlockId when block actually changes
  const handleBlockHover = useCallback((blockId: string) => {
    if (hoveredBlockId !== blockId) {
      setHoveredBlockId(blockId);
      setSelectedBlockId(blockId);
      onBlockSelect(blockId);
    }
  }, [hoveredBlockId, setSelectedBlockId, onBlockSelect]);

  const handleBlockLeave = useCallback((blockId: string) => {
    // Don't clear selectedBlockId when leaving blocks - keep it persistent
    // Only clear hoveredBlockId for visual feedback
    setHoveredBlockId(null);
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    // Handle deletion of blocks inside columns
    setBlocks(prev => prev.map(block => {
      if (block.type === 'columns') {
        const updatedColumns = block.content.columns.map(column => ({
          ...column,
          blocks: column.blocks.filter(b => b.id !== blockId)
        }));
        return {
          ...block,
          content: {
            ...block.content,
            columns: updatedColumns
          }
        };
      }
      return block;
    }).filter(block => block.id !== blockId));

    // Clear selected state if deleted block was selected
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      onBlockSelect(null);
    }
    
    // Clear hover state if deleted block was hovered
    if (hoveredBlockId === blockId) {
      setHoveredBlockId(null);
    }
  }, [selectedBlockId, onBlockSelect, setBlocks, setSelectedBlockId, hoveredBlockId]);

  const handleBlockDuplicate = useCallback((blockId: string) => {
    // First try to find block at top level
    let blockToDuplicate = blocks.find(block => block.id === blockId);
    let isNestedBlock = false;
    
    // If not found at top level, search in columns
    if (!blockToDuplicate) {
      for (const block of blocks) {
        if (block.type === 'columns') {
          for (const column of block.content.columns) {
            const found = column.blocks.find(b => b.id === blockId);
            if (found) {
              blockToDuplicate = found;
              isNestedBlock = true;
              break;
            }
          }
          if (blockToDuplicate) break;
        }
      }
    }

    if (blockToDuplicate) {
      const duplicatedBlock: EmailBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}_copy_${Date.now()}`,
        isStarred: false
      };

      if (isNestedBlock) {
        // Handle duplication within columns
        setBlocks(prev => prev.map(block => {
          if (block.type === 'columns') {
            const updatedColumns = block.content.columns.map(column => {
              const blockIndex = column.blocks.findIndex(b => b.id === blockId);
              if (blockIndex !== -1) {
                const newBlocks = [...column.blocks];
                newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
                return { ...column, blocks: newBlocks };
              }
              return column;
            });
            return {
              ...block,
              content: {
                ...block.content,
                columns: updatedColumns
              }
            };
          }
          return block;
        }));
      } else {
        // Handle top-level duplication
        const blockIndex = blocks.findIndex(block => block.id === blockId);
        const newBlocks = [...blocks];
        newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
        setBlocks(newBlocks);
      }
    }
  }, [blocks, setBlocks]);

  const handleSaveAsSnippet = useCallback(async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    try {
      const snippet: Omit<EmailSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'> = {
        name: `${block.type} snippet`,
        description: `Saved ${block.type} block`,
        blockData: block,
        blockType: block.type,
        category: 'custom',
        tags: [block.type],
        isFavorite: false
      };

      // Create the snippet
      DirectSnippetService.createSnippet(block, snippet.name, snippet.description);
      
      // Update the block's starred state
      setBlocks(prev => prev.map(b => 
        b.id === blockId ? { ...b, isStarred: true } : b
      ));
      
      // Trigger snippet refresh
      onSnippetRefresh?.();
      
      console.log('Block starred and snippet created:', blockId);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  }, [blocks, onSnippetRefresh]);

  const handleUnstarBlock = useCallback((blockId: string) => {
    // Find snippets related to this block and remove them
    const allSnippets = DirectSnippetService.getCustomSnippets();
    const relatedSnippet = allSnippets.find(snippet => 
      snippet.blockData?.id === blockId || 
      snippet.name.includes(blockId) ||
      snippet.blockData?.type === blocks.find(b => b.id === blockId)?.type
    );
    
    if (relatedSnippet) {
      DirectSnippetService.deleteSnippet(relatedSnippet.id);
    }
    
    // Update the block's starred state
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, isStarred: false } : b
    ));
    
    // Trigger snippet refresh
    onSnippetRefresh?.();
    
    console.log('Block unstarred and snippet removed:', blockId);
  }, [blocks, onSnippetRefresh]);

  const handleTipTapChange = useCallback((blockId: string, html: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId && block.type === 'text') {
        return {
          ...block,
          content: {
            ...block.content,
            html: html
          }
        };
      }
      return block;
    }));
  }, [setBlocks]);

  const handleTipTapBlur = useCallback(() => {
    setEditingBlockId(null);
  }, [setEditingBlockId]);

  const handleBlockEditStart = useCallback((blockId: string) => {
    setEditingBlockId(blockId);
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  }, [onBlockSelect, setEditingBlockId, setSelectedBlockId]);

  const handleBlockEditEnd = useCallback(() => {
    setEditingBlockId(null);
  }, [setEditingBlockId]);

  const handleBlockUpdate = useCallback((updatedBlock: EmailBlock) => {
    setBlocks(prev => prev.map(block => {
      // Direct block update
      if (block.id === updatedBlock.id) {
        return updatedBlock;
      }
      
      // Check if it's a block inside a column layout
      if (block.type === 'columns') {
        const updatedColumns = block.content.columns.map(column => ({
          ...column,
          blocks: column.blocks.map(columnBlock => 
            columnBlock.id === updatedBlock.id ? updatedBlock : columnBlock
          )
        }));
        
        // Only update if we actually found the block in this column layout
        const hasChanges = block.content.columns.some(column =>
          column.blocks.some(columnBlock => columnBlock.id === updatedBlock.id)
        );
        
        if (hasChanges) {
          return {
            ...block,
            content: {
              ...block.content,
              columns: updatedColumns
            }
          };
        }
      }
      
      return block;
    }));
  }, [setBlocks]);

  const handleAddVariable = useCallback((blockId: string, variable: VariableOption) => {
    console.log('Adding variable to block:', blockId, variable);
    
    // The EnhancedTextBlockRenderer will handle the insertion through its ref
    // For non-text blocks, we'll fall back to the original method
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId && block.type !== 'text') {
        if (block.type === 'button') {
          // Add variable to button text
          const currentText = block.content.text || '';
          const newText = currentText + ` ${variable.value}`;
          
          return {
            ...block,
            content: {
              ...block.content,
              text: newText
            }
          };
        }
      } else if (block.type === 'columns') {
        // Handle columns recursively
        const updatedColumns = block.content.columns.map(column => ({
          ...column,
          blocks: column.blocks.map(columnBlock => {
            if (columnBlock.id === blockId) {
              if (columnBlock.type === 'text') {
                // Text blocks in columns are handled by the editor
                return columnBlock;
              } else if (columnBlock.type === 'button') {
                const currentText = columnBlock.content.text || '';
                const newText = currentText + ` ${variable.value}`;
                
                return {
                  ...columnBlock,
                  content: {
                    ...columnBlock.content,
                    text: newText
                  }
                };
              }
            }
            return columnBlock;
          })
        }));
        
        return {
          ...block,
          content: {
            ...block.content,
            columns: updatedColumns
          }
        };
      }
      
      return block;
    }));
  }, [setBlocks]);

  const dragDropHandler = useDragDropHandler({
    blocks,
    setBlocks,
    getDefaultContent,
    getDefaultStyles,
    dragOverIndex,
    setDragOverIndex,
    isDraggingOver,
    setIsDraggingOver,
    setCurrentDragType
  });

  const canvasWidth = useMemo(() => {
    if (compactMode) return previewMode === 'mobile' ? 320 : 480;
    return previewMode === 'mobile' ? 375 : previewWidth;
  }, [compactMode, previewMode, previewWidth]);

  const canvasStyle = useMemo(() => {
    const baseStyle = {
      width: `${canvasWidth}px`,
      minHeight: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      position: 'relative' as const,
      transition: 'width 0.15s ease-in-out, max-width 0.15s ease-in-out'
    };

    if (isDraggingOver && currentDragType) {
      const colorMap = {
        block: '#3b82f6',
        layout: '#8b5cf6', 
        reorder: '#f59e0b'
      };
      
      const color = colorMap[currentDragType];
      
      return {
        ...baseStyle,
        backgroundColor: `${color}08`,
        border: `3px dashed ${color}`,
        boxShadow: `inset 0 0 40px ${color}25, 0 10px 25px -5px rgba(0, 0, 0, 0.1)`,
        transform: 'scale(1.01)',
        transition: 'all 0.15s ease-in-out'
      };
    }

    return baseStyle;
  }, [canvasWidth, isDraggingOver, currentDragType]);

  const handleApplyFix = useCallback((fixedContent: string, fixType?: 'subject' | 'content') => {
    if (fixType === 'subject') {
      onSubjectChange(fixedContent);
    } else {
      console.log('Applied AI fix to email content');
    }
  }, [onSubjectChange]);

  return (
    <div className="relative">
      <div
        style={canvasStyle}
        className="email-canvas"
        data-testid="email-canvas"
        onDrop={dragDropHandler.handleCanvasDrop}
        onDragOver={dragDropHandler.handleCanvasDragOver}
        onDragEnter={dragDropHandler.handleCanvasDragEnter}
        onDragLeave={dragDropHandler.handleCanvasDragLeave}
      >
        <div className="border-b border-gray-100 bg-white">
          <CanvasSubjectLine
            value={subject}
            onChange={onSubjectChange}
            emailContent={currentEmailHTML}
          />
        </div>

        <div className="p-6">
          <CanvasRenderer
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            editingBlockId={editingBlockId}
            isDraggingOver={isDraggingOver}
            dragOverIndex={dragOverIndex}
            currentDragType={currentDragType}
            onBlockClick={handleBlockClick}
            onBlockDoubleClick={handleBlockDoubleClick}
            onBlockDragStart={dragDropHandler.handleBlockDragStart}
            onBlockDrop={dragDropHandler.handleBlockDrop}
            onDeleteBlock={handleBlockDelete}
            onDuplicateBlock={handleBlockDuplicate}
            onSaveAsSnippet={handleSaveAsSnippet}
            onUnstarBlock={handleUnstarBlock}
            onTipTapChange={handleTipTapChange}
            onTipTapBlur={handleTipTapBlur}
            onColumnDrop={dragDropHandler.handleColumnDrop}
            onBlockEditStart={handleBlockEditStart}
            onBlockEditEnd={handleBlockEditEnd}
            onBlockUpdate={handleBlockUpdate}
            onAddVariable={handleAddVariable}
            onBlockHover={handleBlockHover}
            onBlockLeave={handleBlockLeave}
          />

          {/* Standalone Block Controls */}
          <StandaloneBlockControls
            selectedBlockId={selectedBlockId}
            blocks={blocks}
            onDelete={handleBlockDelete}
            onDuplicate={handleBlockDuplicate}
            onDragStart={dragDropHandler.handleBlockDragStart}
            onSaveAsSnippet={handleSaveAsSnippet}
            onUnstar={handleUnstarBlock}
            onAddVariable={handleAddVariable}
          />
        </div>
      </div>
    </div>
  );
};
