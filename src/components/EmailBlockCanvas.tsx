import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  forwardRef, 
  useImperativeHandle,
  useMemo
} from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer2, 
  Eye,
  Code,
  Save,
  Download,
  Settings,
  Sparkles,
  Target,
  BarChart3,
  Plus
} from 'lucide-react';
import { EmailBlock, TextBlock, ButtonBlock, ImageBlock, ColumnsBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { DragDropHandler } from './canvas/DragDropHandler';
import { CanvasSubjectLine } from './CanvasSubjectLine';
import { EnhancedAISuggestionsWidget } from './EnhancedAISuggestionsWidget';
import { DirectTemplateService } from '@/services/directTemplateService';
import { directSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';
import { enhancedBlockFactory } from '@/utils/enhancedBlockFactory';

interface GlobalStyles {
  email?: {
    backgroundColor?: string;
    width?: string;
    defaultFontFamily?: string;
  };
  text?: {
    body?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      lineHeight?: string;
    };
    h1?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h2?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h3?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
    h4?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      fontWeight?: string;
    };
  };
  buttons?: {
    default?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
      borderRadius?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
    };
  };
  links?: {
    normal?: string;
    hover?: string;
    textDecoration?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
}

export interface EmailBlockCanvasRef {
  addBlock: (block: EmailBlock, insertIndex?: number) => void;
  duplicateBlock: (blockId: string) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  getBlocks: () => EmailBlock[];
  setBlocks: (blocks: EmailBlock[]) => void;
  exportToHTML: () => string;
  findAndReplaceText: (searchText: string, replaceText: string) => void;
  saveAsSnippet: (blockId: string) => Promise<void>;
}

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject?: string;
  onSubjectChange?: (subject: string) => void;
  showAIAnalytics?: boolean;
  globalStyles?: GlobalStyles;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  onBlockSelect,
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject = '',
  onSubjectChange = () => {},
  showAIAnalytics = false,
  globalStyles = {}
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);

  const dragDropHandler = useRef<DragDropHandler>(new DragDropHandler());

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
    setCurrentDragType(dragDropHandler.current.getDragType(e));
    setDragOverIndex(dragDropHandler.current.determineDropIndex(e, blocks, canvasRef.current));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(dragDropHandler.current.determineDropIndex(e, blocks, canvasRef.current));
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
    setDragOverIndex(null);
    setCurrentDragType(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const dropIndex = dragDropHandler.current.determineDropIndex(e, blocks, canvasRef.current);
    const dragType = dragDropHandler.current.getDragType(e);

    if (dragType === 'layout') {
      const layoutType = e.dataTransfer.getData('layoutType');
      if (layoutType) {
        const newBlock = enhancedBlockFactory.createLayoutBlock(layoutType);
        addBlock(newBlock, dropIndex);
      }
    } else if (dragType === 'block') {
      const blockId = e.dataTransfer.getData('blockId');
      if (blockId) {
        moveBlockTo(blockId, dropIndex);
      }
    } else if (dragType === 'reorder') {
      const blockId = e.dataTransfer.getData('blockId');
      if (blockId) {
        moveBlockTo(blockId, dropIndex);
      }
    }

    setDragOverIndex(null);
    setCurrentDragType(null);
  };

  const moveBlockTo = (blockId: string, newIndex: number | null) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);

    if (blockIndex === -1 || newIndex === null) {
      return;
    }

    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(blockIndex, 1);
    updatedBlocks.splice(newIndex, 0, movedBlock);

    setBlocks(updatedBlocks);
  };

  const handleBlockClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  };

  const handleBlockDoubleClick = (blockId: string, blockType: string) => {
    if (blockType === 'text') {
      setEditingBlockId(blockId);
    }
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('blockId', blockId);
    dragDropHandler.current.setDragType(e, 'reorder');
  };

  const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) {
      moveBlockTo(blockId, targetIndex);
    }

    setDragOverIndex(null);
    setCurrentDragType(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
    setSelectedBlockId(null);
    onBlockSelect(null);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);

    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `duplicate_${blockId}_${Date.now()}`,
      };

      const blockIndex = blocks.findIndex(block => block.id === blockId);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      setBlocks(updatedBlocks);
    }
  };

  const handleSaveAsSnippet = async (blockId: string) => {
    const blockToSave = blocks.find(block => block.id === blockId);
    if (blockToSave) {
      try {
        const snippet: EmailSnippet = {
          id: `snippet-${Date.now()}`,
          name: `Snippet for ${blockToSave.type}`,
          description: `Snippet created from a ${blockToSave.type} block`,
          blockData: blockToSave,
          createdAt: new Date(),
          updatedAt: new Date(),
          usageCount: 0,
          category: 'custom',
          tags: [],
        };
        await directSnippetService.saveSnippet(snippet);
        blockToSave.isStarred = true;
        setBlocks([...blocks]);
      } catch (error) {
        console.error('Failed to save snippet:', error);
      }
    }
  };

  const handleUnstarBlock = (blockId: string) => {
    const blockToUnstar = blocks.find(block => block.id === blockId);
    if (blockToUnstar) {
      blockToUnstar.isStarred = false;
      setBlocks([...blocks]);
    }
  };

  const handleTipTapChange = (blockId: string, html: string) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id === blockId && block.type === 'text') {
        return {
          ...block,
          content: html,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  const handleTipTapBlur = () => {
    setEditingBlockId(null);
  };

  const handleColumnDrop = (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) {
      const blockToMove = blocks.find(b => b.id === blockId);
      if (!blockToMove) return;

      // Remove the block from the main blocks array
      const updatedBlocks = blocks.filter(b => b.id !== blockId);
      
      // Find the layout block and update its columns
      const layoutBlockIndex = updatedBlocks.findIndex(b => b.id === layoutBlockId);
      if (layoutBlockIndex === -1) return;

      const layoutBlock = updatedBlocks[layoutBlockIndex] as ColumnsBlock;
      if (layoutBlock.type !== 'columns') return;

      // Ensure the column exists
      if (!layoutBlock.content.columns[columnIndex]) return;

      // Add the block to the specified column
      layoutBlock.content.columns[columnIndex].blocks.push(blockToMove);
      
      // Update the layout block in the blocks array
      updatedBlocks[layoutBlockIndex] = layoutBlock;

      // Update state
      setBlocks(updatedBlocks);
    }

    setDragOverIndex(null);
    setCurrentDragType(null);
  };

  const handleBlockEditStart = (blockId: string) => {
    setEditingBlockId(blockId);
  };

  const handleBlockEditEnd = () => {
    setEditingBlockId(null);
  };

  useImperativeHandle(ref, () => ({
    addBlock: (block: EmailBlock, insertIndex?: number) => {
      const updatedBlocks = [...blocks];
      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= blocks.length) {
        updatedBlocks.splice(insertIndex, 0, block);
      } else {
        updatedBlocks.push(block);
      }
      setBlocks(updatedBlocks);
    },
    duplicateBlock: handleDuplicateBlock,
    deleteBlock: handleDeleteBlock,
    moveBlock: moveBlockTo,
    getBlocks: () => blocks,
    setBlocks: (newBlocks: EmailBlock[]) => {
      setBlocks(newBlocks);
    },
    exportToHTML: () => {
      // Implement HTML export logic here
      return '<div>Email HTML Content</div>';
    },
    findAndReplaceText: (searchText: string, replaceText: string) => {
      const updatedBlocks = blocks.map(block => {
        if (block.type === 'text' && typeof block.content === 'object' && 'html' in block.content) {
          const regex = new RegExp(searchText, 'g');
          const updatedHtml = (block.content.html as string).replace(regex, replaceText);
          return {
            ...block,
            content: {
              ...block.content,
              html: updatedHtml
            }
          };
        }
        return block;
      });
      setBlocks(updatedBlocks);
    },
    saveAsSnippet: handleSaveAsSnippet
  }));

  useEffect(() => {
    // Update content when blocks change
    const htmlContent = blocks.map(block => {
      if (block.type === 'text' && typeof block.content === 'object' && 'html' in block.content) {
        return `<div data-block-id="${block.id}">${block.content.html}</div>`;
      } else {
        return `<div data-block-id="${block.id}">Block of type ${block.type}</div>`;
      }
    }).join('');
    onContentChange(htmlContent);
  }, [blocks, onContentChange]);

  // Update the canvas container styles to apply global email styles
  const canvasContainerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      width: previewMode === 'mobile' ? '375px' : `${previewWidth}px`,
      minHeight: '500px',
      margin: '0 auto',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    };

    // Apply global email styles
    if (globalStyles.email) {
      if (globalStyles.email.backgroundColor) {
        baseStyle.backgroundColor = globalStyles.email.backgroundColor;
      }
      if (globalStyles.email.defaultFontFamily) {
        baseStyle.fontFamily = globalStyles.email.defaultFontFamily;
      }
    }

    return baseStyle;
  }, [previewMode, previewWidth, globalStyles]);

  return (
    <div className="email-block-canvas bg-white">
      {/* Subject Line Section */}
      {!compactMode && (
        <div className="mb-6">
          <CanvasSubjectLine
            value={subject}
            onChange={onSubjectChange}
            emailContent={blocks.map(b => b.content).join(' ')}
          />
        </div>
      )}

      {/* Canvas Container */}
      <div 
        ref={canvasRef}
        className="canvas-container bg-white border border-gray-200 relative"
        style={canvasContainerStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleCanvasClick}
      >
        <CanvasRenderer
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          editingBlockId={editingBlockId}
          isDraggingOver={isDraggingOver}
          dragOverIndex={dragOverIndex}
          currentDragType={currentDragType}
          onBlockClick={handleBlockClick}
          onBlockDoubleClick={handleBlockDoubleClick}
          onBlockDragStart={handleBlockDragStart}
          onBlockDrop={handleBlockDrop}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onSaveAsSnippet={handleSaveAsSnippet}
          onUnstarBlock={handleUnstarBlock}
          onTipTapChange={handleTipTapChange}
          onTipTapBlur={handleTipTapBlur}
          onColumnDrop={handleColumnDrop}
          onBlockEditStart={handleBlockEditStart}
          onBlockEditEnd={handleBlockEditEnd}
          onBlockUpdate={handleBlockUpdate}
          globalStyles={globalStyles}
        />
      </div>

      {/* AI Suggestions Widget */}
      {showAIAnalytics && (
        <EnhancedAISuggestionsWidget
          isOpen={showAISuggestions}
          onToggle={() => setShowAISuggestions(!showAISuggestions)}
          emailHTML={exportToHTML()}
          subjectLine={subject}
          canvasRef={ref as React.RefObject<EmailBlockCanvasRef>}
          onSubjectLineChange={onSubjectChange}
        />
      )}
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
