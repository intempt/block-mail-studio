import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { useDragDropHandler } from './canvas/DragDropHandler';
import { blockFactory } from '@/utils/blockFactory';
import { DirectSnippetService } from '@/services/directSnippetService';
import { generateUniqueId } from '@/utils/blockUtils';

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile';
  compactMode: boolean;
  subject: string;
  onSubjectChange: (subject: string) => void;
  showAIAnalytics: boolean;
}

export interface EmailBlockCanvasRef {
  addBlock: (block: EmailBlock) => void;
  getBlocks: () => EmailBlock[];
  exportHTML: () => string;
  exportMJML: () => string;
  findAndReplaceText: (searchText: string, replaceText: string) => void;
}

const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  onBlockSelect,
  previewWidth,
  previewMode,
  compactMode,
  subject,
  onSubjectChange,
  showAIAnalytics
}, ref) => {
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver
  } = useDragDropHandler(
    emailBlocks,
    setEmailBlocks,
    setSelectedBlockId,
    setIsDraggingOver,
    setDragOverIndex,
    setCurrentDragType
  );

  // Imperative handle for external access
  useImperativeHandle(ref, () => ({
    addBlock: (block: EmailBlock) => {
      setEmailBlocks(prev => [...prev, block]);
    },
    getBlocks: () => emailBlocks,
    exportHTML: () => {
      // Implement HTML export logic here
      return '<div>Email HTML</div>';
    },
    exportMJML: () => {
      // Implement MJML export logic here
      return '<mjml>Email MJML</mjml>';
    },
    findAndReplaceText: (searchText: string, replaceText: string) => {
      setEmailBlocks(prev =>
        prev.map(block => {
          if (block.type === 'text' && block.content && typeof block.content === 'object' && 'html' in block.content && typeof block.content.html === 'string') {
            const newHtml = block.content.html.replace(new RegExp(searchText, 'g'), replaceText);
            return {
              ...block,
              content: {
                ...block.content,
                html: newHtml
              }
            };
          }
          return block;
        })
      );
    }
  }));

  useEffect(() => {
    // Update content when blocks change
    const newContent = generateCanvasHTML(emailBlocks, previewWidth, previewMode, subject);
    onContentChange(newContent);
  }, [emailBlocks, previewWidth, previewMode, subject, onContentChange]);

  const handleBlockClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  };

  const handleBlockDoubleClick = (blockId: string, blockType: string) => {
    setSelectedBlockId(blockId);
    setEditingBlockId(blockId);
    onBlockSelect(blockId);
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    handleDragStart(e, blockId);
  };

  const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
    handleDrop(e, targetIndex);
  };

  const handleDeleteBlock = (blockId: string) => {
    setEmailBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
    onBlockSelect(null);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = emailBlocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock = { ...blockToDuplicate, id: generateUniqueId() };
      setEmailBlocks(prev => [...prev, newBlock]);
    }
  };

  const handleSaveAsSnippet = async (blockId: string) => {
    const blockToSave = emailBlocks.find(block => block.id === blockId);
    if (blockToSave) {
      const newSnippet: EmailSnippet = {
        id: `snippet-${Date.now()}`,
        name: `Snippet for ${blockToSave.type}`,
        blockData: blockToSave,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      };
      DirectSnippetService.saveSnippet(newSnippet);
      blockToSave.isStarred = true;
      setEmailBlocks(prev =>
        prev.map(block => block.id === blockId ? { ...block, isStarred: true } : block)
      );
    }
  };

  const handleUnstarBlock = (blockId: string) => {
    setEmailBlocks(prev =>
      prev.map(block => block.id === blockId ? { ...block, isStarred: false } : block)
    );
  };

  const handleTipTapChange = (blockId: string, html: string) => {
    setEmailBlocks(prev =>
      prev.map(block => {
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
      })
    );
  };

  const handleTipTapBlur = () => {
    setEditingBlockId(null);
  };

  const handleColumnDrop = (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) {
        console.warn('No data found in drag event');
        return;
      }

      const dragData = JSON.parse(data);
      if (!dragData || !dragData.blockType) {
        console.warn('Invalid drag data:', dragData);
        return;
      }

      const { blockType, isLayout, layoutData } = dragData;

      setEmailBlocks(prevBlocks => {
        return prevBlocks.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            const updatedColumns = (block.content as any).columns.map((col: any, index: number) => {
              if (index === columnIndex) {
                if (isLayout && layoutData) {
                  // Handle layout block drop into column
                  console.log('Dropping layout into column is not supported.');
                  return col;
                } else {
                  // Handle regular block drop into column
                  const newBlock = blockFactory(blockType);
                  return {
                    ...col,
                    blocks: [...col.blocks, newBlock]
                  };
                }
              }
              return col;
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
        });
      });
    } catch (error) {
      console.error('Error handling column drop:', error);
    }
  };

  const handleBlockEditStart = (blockId: string) => {
    setEditingBlockId(blockId);
  };

  const handleBlockEditEnd = () => {
    setEditingBlockId(null);
  };

  const handleBlockUpdate = (block: EmailBlock) => {
    setEmailBlocks(prev =>
      prev.map(b => b.id === block.id ? block : b)
    );
  };

  const generateCanvasHTML = (blocks: EmailBlock[], previewWidth: number, previewMode: string, subject: string) => {
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject || 'Email Preview'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
          }
          .email-container {
            width: ${previewWidth}px;
            background-color: #fff;
            margin: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          /* Add more global styles here */
        </style>
      </head>
      <body>
        <div class="email-container">
    `;

    blocks.forEach(block => {
      switch (block.type) {
        case 'text':
          html += `<div style="padding: 10px;">${(block.content as any).html || 'Text Block'}</div>`;
          break;
        case 'image':
          html += `<img src="${(block.content as any).src}" alt="Image" style="width: 100%;">`;
          break;
        case 'button':
          html += `<a href="${(block.content as any).link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">${(block.content as any).text || 'Button'}</a>`;
          break;
        case 'spacer':
          html += `<div style="height: ${(block.content as any).height || '20px'};"></div>`;
          break;
        case 'divider':
          html += `<hr style="border: none; border-top: 1px solid #ccc;">`;
          break;
        case 'columns':
          html += '<div style="display: flex;">';
          (block.content as any).columns.forEach((column: any) => {
            html += `<div style="width: ${column.width}; padding: 10px;">`;
            column.blocks.forEach((innerBlock: any) => {
              html += `<p>Inner Block: ${innerBlock.type}</p>`;
            });
            html += '</div>';
          });
          html += '</div>';
          break;
        // Add more block types here
      }
    });

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  };

  return (
    <div
      className="email-block-canvas relative"
      ref={canvasRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleBlockDrop}
    >
      <CanvasRenderer
        blocks={emailBlocks}
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
      />
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
export { EmailBlockCanvas };
