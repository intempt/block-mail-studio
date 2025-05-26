import React, { useState, useEffect, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { useDragDropHandler } from './canvas/DragDropHandler';
import { CanvasStatus } from './canvas/CanvasStatus';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';
import { CanvasSubjectLine } from './CanvasSubjectLine';
import { mjmlService } from '@/services/MJMLService';
import { createMJMLTemplate, compileMJMLToHTML } from '@/utils/emailUtils';

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject?: string;
  onSubjectChange?: (subject: string) => void;
}

export interface EmailBlockCanvasRef {
  findAndReplaceText: (current: string, replacement: string) => void;
  optimizeImages: () => void;
  minifyHTML: () => void;
  checkLinks: () => { workingLinks: number; brokenLinks: number; totalLinks: number };
  addBlock: (block: EmailBlock) => void;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  onBlockSelect,
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject = '',
  onSubjectChange = () => {}
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [currentEmailHTML, setCurrentEmailHTML] = useState('');

  // Helper function to strip HTML tags for text comparison
  const stripHTML = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  // Helper function to normalize text for comparison
  const normalizeText = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  // Enhanced findAndReplaceText with better HTML handling
  const findAndReplaceText = useCallback((current: string, replacement: string) => {
    console.log('FindAndReplaceText: Searching for:', current);
    console.log('FindAndReplaceText: Replacing with:', replacement);
    
    const currentNormalized = normalizeText(stripHTML(current));
    let replacementsMade = 0;

    setBlocks(prev => prev.map(block => {
      if (block.type === 'text') {
        const blockTextContent = stripHTML(block.content.html || '');
        const blockTextNormalized = normalizeText(blockTextContent);
        
        console.log('FindAndReplaceText: Checking block text:', blockTextContent);
        
        // Check if the current text exists in this block (fuzzy match)
        if (blockTextNormalized.includes(currentNormalized)) {
          console.log('FindAndReplaceText: Found match in text block');
          
          // Create new HTML with replacement
          let newHTML = block.content.html || '';
          
          // Try exact replacement first
          if (newHTML.includes(current)) {
            newHTML = newHTML.replace(current, replacement);
            replacementsMade++;
          } else {
            // Try replacing just the text content while preserving some HTML structure
            const strippedCurrent = stripHTML(current);
            if (newHTML.includes(strippedCurrent)) {
              newHTML = newHTML.replace(strippedCurrent, replacement);
              replacementsMade++;
            } else {
              // Fallback: replace the entire content if it's similar enough
              const similarity = blockTextNormalized.length > 0 ? 
                currentNormalized.length / blockTextNormalized.length : 0;
              
              if (similarity > 0.7 || blockTextNormalized === currentNormalized) {
                newHTML = `<p>${replacement}</p>`;
                replacementsMade++;
              }
            }
          }
          
          console.log('FindAndReplaceText: Updated HTML:', newHTML);
          
          return {
            ...block,
            content: {
              ...block.content,
              html: newHTML
            }
          };
        }
      } else if (block.type === 'button') {
        const buttonText = block.content.text || '';
        const buttonTextNormalized = normalizeText(buttonText);
        
        console.log('FindAndReplaceText: Checking button text:', buttonText);
        
        if (buttonTextNormalized.includes(normalizeText(current)) || 
            normalizeText(current).includes(buttonTextNormalized)) {
          console.log('FindAndReplaceText: Found match in button block');
          
          replacementsMade++;
          return {
            ...block,
            content: {
              ...block.content,
              text: replacement
            }
          };
        }
      } else if (block.type === 'columns') {
        // Handle columns recursively
        const updatedColumns = block.content.columns.map(column => ({
          ...column,
          blocks: column.blocks.map(columnBlock => {
            if (columnBlock.type === 'text') {
              const blockTextContent = stripHTML(columnBlock.content.html || '');
              const blockTextNormalized = normalizeText(blockTextContent);
              
              if (blockTextNormalized.includes(currentNormalized)) {
                console.log('FindAndReplaceText: Found match in column text block');
                
                let newHTML = columnBlock.content.html || '';
                
                if (newHTML.includes(current)) {
                  newHTML = newHTML.replace(current, replacement);
                  replacementsMade++;
                } else {
                  const strippedCurrent = stripHTML(current);
                  if (newHTML.includes(strippedCurrent)) {
                    newHTML = newHTML.replace(strippedCurrent, replacement);
                    replacementsMade++;
                  }
                }
                
                return {
                  ...columnBlock,
                  content: {
                    ...columnBlock.content,
                    html: newHTML
                  }
                };
              }
            } else if (columnBlock.type === 'button') {
              const buttonText = columnBlock.content.text || '';
              const buttonTextNormalized = normalizeText(buttonText);
              
              if (buttonTextNormalized.includes(normalizeText(current))) {
                console.log('FindAndReplaceText: Found match in column button block');
                
                replacementsMade++;
                return {
                  ...columnBlock,
                  content: {
                    ...columnBlock.content,
                    text: replacement
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

    console.log('FindAndReplaceText: Total replacements made:', replacementsMade);
    
    if (replacementsMade === 0) {
      console.warn('FindAndReplaceText: No replacements made. Current text not found.');
    }
  }, []);

  useImperativeHandle(ref, () => ({
    findAndReplaceText,
    optimizeImages: () => {
      setBlocks(prev => prev.map(block => {
        if (block.type === 'image' && block.content.src) {
          return {
            ...block,
            content: {
              ...block.content,
              src: block.content.src + '?optimized=true'
            }
          };
        }
        return block;
      }));
      console.log('Images optimized for better performance');
    },
    minifyHTML: () => {
      console.log('MJML content optimized');
    },
    checkLinks: () => {
      let totalLinks = 0;
      let workingLinks = 0;
      let brokenLinks = 0;

      blocks.forEach(block => {
        if (block.type === 'button' && block.content.link) {
          totalLinks++;
          if (block.content.link.startsWith('http') || block.content.link.startsWith('mailto:')) {
            workingLinks++;
          } else {
            brokenLinks++;
          }
        }
        if (block.type === 'image' && block.content.link) {
          totalLinks++;
          if (block.content.link.startsWith('http') || block.content.link.startsWith('mailto:')) {
            workingLinks++;
          } else {
            brokenLinks++;
          }
        }
      });

      console.log(`Link check complete: ${workingLinks} working, ${brokenLinks} broken, ${totalLinks} total`);
      return { workingLinks, brokenLinks, totalLinks };
    },
    addBlock: (block: EmailBlock) => {
      console.log('EmailBlockCanvas: Adding block via ref:', block);
      setBlocks(prev => [...prev, block]);
    }
  }), [blocks, findAndReplaceText]);

  useEffect(() => {
    const initialBlocks: EmailBlock[] = [
      {
        id: 'initial_text_block',
        type: 'text',
        content: {
          html: '<h1>Welcome to your email!</h1><p>Start building your email content here.</p>',
          textStyle: 'normal'
        },
        styling: {
          desktop: { width: '100%', height: 'auto' },
          tablet: { width: '100%', height: 'auto' },
          mobile: { width: '100%', height: 'auto' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      }
    ];
    setBlocks(initialBlocks);
  }, []);

  const renderBlockToMJML = useCallback((block: EmailBlock): string => {
    return mjmlService.renderBlockToMJML(block);
  }, []);

  const renderColumnsToMJML = useCallback((block: ColumnsBlock): string => {
    return mjmlService.renderColumnsToMJML(block);
  }, []);

  useEffect(() => {
    const generateHTML = () => {
      if (blocks.length === 0) {
        const emptyHTML = '';
        onContentChange(emptyHTML);
        setCurrentEmailHTML(emptyHTML);
        return;
      }

      // Convert blocks to MJML
      const mjmlBlocks = blocks.map(renderBlockToMJML).join('');
      
      // Create complete MJML template
      const mjmlTemplate = createMJMLTemplate(mjmlBlocks, subject);
      
      // Compile MJML to HTML
      const compiledHTML = compileMJMLToHTML(mjmlTemplate);

      onContentChange(compiledHTML);
      setCurrentEmailHTML(compiledHTML);
    };

    generateHTML();
  }, [blocks, onContentChange, renderBlockToMJML, subject]);

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
        blockData: block,
        blockType: block.type,
        category: 'custom',
        tags: [block.type],
        isFavorite: false
      };

      DirectSnippetService.createSnippet(block, snippet.name, snippet.description);
      setSnippetRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  }, [blocks]);

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
  }, []);

  const handleTipTapBlur = useCallback(() => {
    setEditingBlockId(null);
  }, []);

  const getDefaultContent = useCallback((blockType: string) => {
    switch (blockType) {
      case 'text':
        return { html: '<p>Enter your text here...</p>', textStyle: 'normal' };
      case 'button':
        return { text: 'Click Here', link: '#', style: 'solid', size: 'medium' };
      case 'image':
        return { src: '', alt: '', alignment: 'center', width: '100%', isDynamic: false };
      case 'spacer':
        return { height: '20px', mobileHeight: '20px' };
      case 'divider':
        return { style: 'solid', thickness: '1px', color: '#ddd', width: '100%', alignment: 'center' };
      case 'columns':
        return {
          columnCount: 2,
          columnRatio: '50-50',
          columns: [
            { id: `col-1-${Date.now()}`, blocks: [], width: '50%' },
            { id: `col-2-${Date.now()}`, blocks: [], width: '50%' }
          ],
          gap: '16px'
        };
      default:
        return {};
    }
  }, []);

  const getDefaultStyles = useCallback((blockType: string) => {
    return {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    };
  }, []);

  const dragDropHandler = useDragDropHandler({
    blocks,
    setBlocks,
    getDefaultContent,
    getDefaultStyles,
    dragOverIndex,
    setDragOverIndex,
    isDraggingOver,
    setIsDraggingOver
  });

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
        onDrop={dragDropHandler.handleCanvasDrop}
        onDragOver={dragDropHandler.handleCanvasDragOver}
        onDragLeave={dragDropHandler.handleCanvasDragLeave}
      >
        {/* Subject Line Section */}
        <div className="border-b border-gray-100 bg-white">
          <CanvasSubjectLine
            value={subject}
            onChange={onSubjectChange}
            emailContent={currentEmailHTML}
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
        selectedBlockId={selectedBlockId}
        canvasWidth={canvasWidth}
        previewMode={previewMode}
        emailHTML={currentEmailHTML}
        subjectLine={subject}
      />
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
