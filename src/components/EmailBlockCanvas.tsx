import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailBlockRenderer } from './EmailBlockRenderer';
import { EnhancedEmailSubjectLine } from './EnhancedEmailSubjectLine';
import { CanvasSubjectLine } from './CanvasSubjectLine';
import { HeaderAnalyticsBar } from './HeaderAnalyticsBar';
import { parseDragData } from '@/utils/dragDropUtils';
import { createEmailBlock } from '@/utils/blockUtils';
import { DirectSnippetService } from '@/services/directSnippetService';

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (block: EmailBlock | null) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject: string;
  onSubjectChange: (subject: string) => void;
  showAIAnalytics?: boolean;
  showSubjectAI?: boolean;
  onToggleSubjectAI?: () => void;
}

export interface EmailBlockCanvasRef {
  addBlock: (block: EmailBlock) => void;
  findAndReplaceText: (searchText: string, replaceText: string) => void;
  getBlocks: () => EmailBlock[];
  optimizeImages: () => void;
  minifyHTML: () => void;
  checkLinks: () => { valid: number; invalid: number; total: number };
}

const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  onBlockSelect,
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject,
  onSubjectChange,
  showAIAnalytics = false,
  showSubjectAI = false,
  onToggleSubjectAI
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const [universalContent, setUniversalContent] = useState<UniversalContent[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateEmailHTML = useCallback(() => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=${previewWidth}, initial-scale=1.0">
        <title>Email Preview</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; word-break: break-word; }
          .email-container { width: 100%; max-width: ${previewWidth}px; margin: auto; background-color: #fff; overflow: hidden; }
          .email-body { padding: 20px; }
          @media screen and (max-width: 600px) {
            .email-container { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-body">
            ${blocks.map(block => `<div key="${block.id}">${renderBlockToHTML(block)}</div>`).join('')}
          </div>
        </div>
      </body>
      </html>
    `;
  }, [blocks, previewWidth]);

  const renderBlockToHTML = (block: EmailBlock): string => {
    // Simple HTML rendering for email blocks
    switch (block.type) {
      case 'text':
        return (block.content as any)?.html || '<p>Text block</p>';
      case 'image':
        const imgContent = block.content as any;
        return `<img src="${imgContent?.src || ''}" alt="${imgContent?.alt || ''}" style="max-width: 100%;" />`;
      case 'button':
        const btnContent = block.content as any;
        return `<a href="${btnContent?.link || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">${btnContent?.text || 'Button'}</a>`;
      default:
        return '<div>Block content</div>';
    }
  };

  useEffect(() => {
    onContentChange(generateEmailHTML());
  }, [blocks, generateEmailHTML, onContentChange]);

  useImperativeHandle(ref, () => ({
    addBlock: (block: EmailBlock) => {
      setBlocks(prevBlocks => [...prevBlocks, block]);
    },
    findAndReplaceText: (searchText: string, replaceText: string) => {
      setBlocks(prevBlocks =>
        prevBlocks.map(block => {
          if (block.type === 'text' && block.content && typeof block.content === 'object' && 'html' in block.content) {
            const updatedHtml = (block.content.html as string).replace(searchText, replaceText);
            return { ...block, content: { ...block.content, html: updatedHtml } };
          }
          return block;
        })
      );
    },
    getBlocks: () => blocks,
    optimizeImages: () => {
      console.log('Optimizing images...');
      // Implementation for image optimization
    },
    minifyHTML: () => {
      console.log('Minifying HTML...');
      // Implementation for HTML minification
    },
    checkLinks: () => {
      const linkBlocks = blocks.filter(block => 
        (block.type === 'button' && (block.content as any)?.link) ||
        (block.type === 'image' && (block.content as any)?.link)
      );
      return {
        valid: linkBlocks.length,
        invalid: 0,
        total: linkBlocks.length
      };
    }
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination, draggableId } = result;

    if (source.index === destination.index) {
      return;
    }

    const parsedData = parseDragData(draggableId);

    if (parsedData && parsedData.isSnippet) {
      const snippet = DirectSnippetService.getSnippetById(parsedData.snippetId);
      if (snippet && snippet.blockData) {
        addBlockToCanvas(snippet.blockData);
      }
      return;
    }

    if (parsedData && parsedData.blockType) {
      const newBlock = createEmailBlock(parsedData.blockType);
      addBlockToCanvas(newBlock);
    }
  };

  const addBlockToCanvas = (block: EmailBlock) => {
    setBlocks(prevBlocks => {
      const newBlock = { ...block, id: `block_${Date.now()}` };
      return [...prevBlocks, newBlock];
    });
  };

  const handleBlockClick = (block: EmailBlock) => {
    setSelectedBlock(block);
    onBlockSelect(block);
  };

  const handleUniversalContentAdd = (content: UniversalContent) => {
    setUniversalContent(prev => [...prev, content]);
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock(null);
      onBlockSelect(null);
    }
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock) => {
    setBlocks(prev =>
      prev.map(block => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showAIAnalytics && (
        <HeaderAnalyticsBar
        //performanceMetrics={}
        //brandMetrics={}
        //performancePrediction={}
        //suggestions={}
        //onRefreshAnalysis={}
        //onApplySuggestion={}
        />
      )}

      <Card className="bg-white shadow-lg border-0 overflow-hidden">
        <div className="border-b border-gray-100">
          {compactMode ? (
            <CanvasSubjectLine
              value={subject}
              onChange={onSubjectChange}
              emailContent={generateEmailHTML()}
            />
          ) : (
            <EnhancedEmailSubjectLine
              value={subject}
              onChange={onSubjectChange}
              emailContent={generateEmailHTML()}
              showAI={showSubjectAI}
              onToggleAI={onToggleSubjectAI}
            />
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="email-canvas" type="BLOCK">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[300px] bg-gray-50 p-4"
              >
                {blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-4 last:mb-0"
                        onClick={() => handleBlockClick(block)}
                      >
                        <EmailBlockRenderer
                          block={block}
                          onBlockDelete={handleBlockDelete}
                          onBlockUpdate={handleBlockUpdate}
                          isSelected={selectedBlock?.id === block.id}
                          previewMode={previewMode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';

export { EmailBlockCanvas };
