import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { DragDropHandler } from './canvas/DragDropHandler';
import { CanvasStatus } from './canvas/CanvasStatus';
import { directSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';
import { CanvasSubjectLine } from './CanvasSubjectLine';

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject?: string;
  onSubjectChange?: (subject: string) => void;
}

export const EmailBlockCanvas: React.FC<EmailBlockCanvasProps> = ({
  onContentChange,
  onBlockSelect,
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject = '',
  onSubjectChange = () => {}
}) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);

  useEffect(() => {
    // Load initial blocks or fetch from API
    const initialBlocks: EmailBlock[] = [
      {
        id: 'initial_text_block',
        type: 'text',
        content: {
          text: '<h1>Welcome to your email!</h1><p>Start building your email content here.</p>'
        },
        styles: {}
      }
    ];
    setBlocks(initialBlocks);
  }, []);

  useEffect(() => {
    const generateHTML = () => {
      if (blocks.length === 0) {
        onContentChange('');
        return;
      }

      const blockElements = blocks.map(block => {
        switch (block.type) {
          case 'text':
            return `<div style="margin: 20px 0;">${block.content.text || ''}</div>`;
          case 'button':
            return `<div style="text-align: center; margin: 20px 0;"><a href="${block.content.link || '#'}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">${block.content.text || 'Button'}</a></div>`;
          case 'image':
            return `<div style="text-align: center; margin: 20px 0;"><img src="${block.content.src || ''}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto;" /></div>`;
          case 'spacer':
            return `<div style="height: ${block.content.height || '20px'};"></div>`;
          case 'divider':
            return `<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />`;
          default:
            return '';
        }
      }).join('');

      const fullHTML = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          ${blockElements}
        </div>
      `;

      onContentChange(fullHTML);
    };

    generateHTML();
  }, [blocks, onContentChange]);

  const handleBlockClick = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  }, [onBlockSelect]);

  const handleBlockDoubleClick = useCallback((blockId: string, blockType: string) => {
    setEditingBlockId(blockId);
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      onBlockSelect(null);
    }
  }, [selectedBlockId, onBlockSelect]);

  const handleBlockDuplicate = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock: EmailBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}_copy_${Date.now()}`
      };
      const blockIndex = blocks.findIndex(block => block.id === blockId);
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      setBlocks(newBlocks);
    }
  }, [blocks]);

  const handleSaveAsSnippet = useCallback(async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    try {
      const snippet: Omit<EmailSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'> = {
        name: `${block.type} snippet`,
        description: `Saved ${block.type} block`,
        content: block,
        category: 'custom',
        tags: [block.type]
      };

      await directSnippetService.saveSnippet(snippet);
      setSnippetRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  }, [blocks]);

  const handleTipTapChange = useCallback((blockId: string, html: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          content: {
            ...block.content,
            text: html
          }
        };
      }
      return block;
    }));
  }, []);

  const handleTipTapBlur = useCallback(() => {
    setEditingBlockId(null);
  }, []);

  const dragDropHandler = useMemo(() => 
    new DragDropHandler(
      blocks,
      setBlocks,
      setIsDraggingOver,
      setDragOverIndex
    ), [blocks]
  );

  const canvasWidth = useMemo(() => {
    if (compactMode) return previewMode === 'mobile' ? 320 : 480;
    return previewMode === 'mobile' ? 375 : previewWidth;
  }, [compactMode, previewMode, previewWidth]);

  const canvasStyle = useMemo(() => ({
    width: `${canvasWidth}px`,
    minHeight: '500px',
    margin: '0 auto',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden'
  }), [canvasWidth]);

  return (
    <div className="relative">
      <div
        style={canvasStyle}
        className="email-canvas"
        onDrop={dragDropHandler.handleDrop}
        onDragOver={dragDropHandler.handleDragOver}
        onDragLeave={dragDropHandler.handleDragLeave}
      >
        {/* Subject Line Section */}
        <div className="border-b border-gray-100 bg-white">
          <CanvasSubjectLine
            value={subject}
            onChange={onSubjectChange}
            emailContent=""
          />
        </div>

        {/* Email Content */}
        <div className="p-6">
          <CanvasRenderer
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            editingBlockId={editingBlockId}
            isDraggingOver={isDraggingOver}
            dragOverIndex={dragOverIndex}
            onBlockClick={handleBlockClick}
            onBlockDoubleClick={handleBlockDoubleClick}
            onBlockDragStart={dragDropHandler.handleBlockDragStart}
            onBlockDrop={dragDropHandler.handleBlockDrop}
            onDeleteBlock={handleBlockDelete}
            onDuplicateBlock={handleBlockDuplicate}
            onSaveAsSnippet={handleSaveAsSnippet}
            onTipTapChange={handleTipTapChange}
            onTipTapBlur={handleTipTapBlur}
            onColumnDrop={dragDropHandler.handleColumnDrop}
          />
        </div>
      </div>

      <CanvasStatus 
        totalBlocks={blocks.length}
        selectedBlockId={selectedBlockId}
        canvasWidth={canvasWidth}
        previewMode={previewMode}
      />
    </div>
  );
};
