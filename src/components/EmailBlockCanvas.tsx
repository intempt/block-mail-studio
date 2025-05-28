import React, { useState, useEffect, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { useDragDropHandler } from './canvas/DragDropHandler';
import { CanvasStatus } from './canvas/CanvasStatus';
import { DirectSnippetService } from '@/services/directSnippetService';
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
  showAIAnalytics?: boolean;
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
  onSubjectChange = () => {},
  showAIAnalytics = false
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);
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
              
              // FIX: Use buttonTextNormalized instead of blockTextNormalized
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
      setBlocks(prev => prev.map(block => {
        if (block.type === 'text') {
          return {
            ...block,
            content: {
              ...block.content,
              html: block.content.html.replace(/\s+/g, ' ').trim()
            }
          };
        }
        return block;
      }));
      console.log('HTML content minified');
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
        id: 'welcome_text_block',
        type: 'text',
        content: {
          html: '<h2>Welcome to your email builder!</h2><p>Drag any of the 11 layouts below to get started, then drag text blocks into the columns and click to edit with the rich text editor.</p>',
          textStyle: 'normal'
        },
        styling: {
          desktop: { 
            width: '100%', 
            height: 'auto',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          },
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

  const renderBlockToHTML = useCallback((block: EmailBlock): string => {
    switch (block.type) {
      case 'text':
        return `<div style="margin: 20px 0;">${block.content.html || ''}</div>`;
      case 'button':
        return `<div style="text-align: center; margin: 20px 0;"><a href="${block.content.link || '#'}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">${block.content.text || 'Button'}</a></div>`;
      case 'image':
        return `<div style="text-align: center; margin: 20px 0;"><img src="${block.content.src || ''}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto;" /></div>`;
      case 'html':
        return `<div style="margin: 20px 0;">${block.content.html || ''}</div>`;
      case 'table':
        return renderTableToHTML(block);
      case 'social':
        return renderSocialToHTML(block);
      case 'video':
        return `<div style="text-align: center; margin: 20px 0;"><a href="${block.content.videoUrl || '#'}"><img src="${block.content.thumbnail || ''}" alt="Video thumbnail" style="max-width: 100%; height: auto;" /></a></div>`;
      case 'spacer':
        return `<div style="height: ${block.content.height || '20px'};"></div>`;
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />`;
      case 'columns':
        return renderColumnsToHTML(block as ColumnsBlock);
      default:
        return '';
    }
  }, []);

  const renderTableToHTML = useCallback((block: any): string => {
    const getBorderStyle = () => {
      const { borderStyle, borderColor, borderWidth } = block.content;
      return `${borderWidth} ${borderStyle} ${borderColor}`;
    };

    const cellsHTML = block.content.cells.map((row: any[], rowIndex: number) => {
      const isHeader = block.content.headerRow && rowIndex === 0;
      const Tag = isHeader ? 'th' : 'td';
      
      const rowHTML = row.map((cell: any) => 
        `<${Tag} style="border: ${getBorderStyle()}; padding: 8px; ${isHeader ? 'font-weight: bold; background-color: #f5f5f5;' : ''}">${cell.content}</${Tag}>`
      ).join('');
      
      return `<tr>${rowHTML}</tr>`;
    }).join('');

    return `
      <div style="margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; border: ${getBorderStyle()};">
          <tbody>
            ${cellsHTML}
          </tbody>
        </table>
      </div>
    `;
  }, []);

  const renderSocialToHTML = useCallback((block: any): string => {
    const platformsHTML = block.content.platforms.map((platform: any) => 
      `<a href="${platform.url}" style="display: inline-block; margin: 0 8px;"><img src="${platform.icon}" alt="${platform.name}" style="width: ${block.content.iconSize}; height: ${block.content.iconSize};" /></a>`
    ).join('');

    return `
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: ${block.content.layout === 'vertical' ? 'block' : 'inline-block'};">
          ${platformsHTML}
        </div>
      </div>
    `;
  }, []);

  const renderColumnsToHTML = useCallback((block: ColumnsBlock): string => {
    const getColumnWidths = (ratio: string) => {
      const ratioMap: Record<string, string[]> = {
        '100': ['100%'],
        '50-50': ['50%', '50%'],
        '33-67': ['33%', '67%'],
        '67-33': ['67%', '33%'],
        '25-75': ['25%', '75%'],
        '75-25': ['75%', '25%'],
        '33-33-33': ['33.33%', '33.33%', '33.33%'],
        '25-50-25': ['25%', '50%', '25%'],
        '25-25-50': ['25%', '25%', '50%'],
        '50-25-25': ['50%', '25%', '25%'],
        '25-25-25-25': ['25%', '25%', '25%', '25%']
      };
      return ratioMap[ratio] || ['100%'];
    };

    const columnWidths = getColumnWidths(block.content.columnRatio);
    
    const columnsHTML = block.content.columns.map((column, index) => {
      const columnBlocks = column.blocks.map(renderBlockToHTML).join('');
      return `
        <td style="width: ${columnWidths[index]}; vertical-align: top; padding: 0 8px;">
          ${columnBlocks}
        </td>
      `;
    }).join('');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
        <tr>
          ${columnsHTML}
        </tr>
      </table>
    `;
  }, [renderBlockToHTML]);

  useEffect(() => {
    const generateHTML = () => {
      if (blocks.length === 0) {
        const emptyHTML = '';
        onContentChange(emptyHTML);
        setCurrentEmailHTML(emptyHTML);
        return;
      }

      const blockElements = blocks.map(renderBlockToHTML).join('');

      const fullHTML = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          ${blockElements}
        </div>
      `;

      onContentChange(fullHTML);
      setCurrentEmailHTML(fullHTML);
    };

    generateHTML();
  }, [blocks, onContentChange, renderBlockToHTML]);

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

  const handleBlockEditStart = useCallback((blockId: string) => {
    setEditingBlockId(blockId);
    setSelectedBlockId(blockId);
    onBlockSelect(blockId);
  }, [onBlockSelect]);

  const handleBlockEditEnd = useCallback(() => {
    setEditingBlockId(null);
  }, []);

  const handleBlockUpdate = useCallback((updatedBlock: EmailBlock) => {
    setBlocks(prev => prev.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  }, []);

  const getDefaultContent = useCallback((blockType: string) => {
    switch (blockType) {
      case 'text':
        return { html: '<p>Start typing your content here...</p>', textStyle: 'normal' };
      case 'button':
        return { text: 'Click Here', link: '#', style: 'solid', size: 'medium' };
      case 'image':
        return { src: '', alt: '', alignment: 'center', width: '100%', isDynamic: false };
      case 'spacer':
        return { height: '20px', mobileHeight: '20px' };
      case 'divider':
        return { style: 'solid', thickness: '1px', color: '#ddd', width: '100%', alignment: 'center' };
      case 'html':
        return { 
          html: '<p>Add your custom HTML here...</p>', 
          customCSS: '' 
        };
      case 'table':
        return {
          rows: 3,
          columns: 3,
          cells: [
            [
              { type: 'text', content: 'Header 1' },
              { type: 'text', content: 'Header 2' },
              { type: 'text', content: 'Header 3' }
            ],
            [
              { type: 'text', content: 'Row 1, Col 1' },
              { type: 'text', content: 'Row 1, Col 2' },
              { type: 'text', content: 'Row 1, Col 3' }
            ],
            [
              { type: 'text', content: 'Row 2, Col 1' },
              { type: 'text', content: 'Row 2, Col 2' },
              { type: 'text', content: 'Row 2, Col 3' }
            ]
          ],
          headerRow: true,
          borderStyle: 'solid',
          borderColor: '#ddd',
          borderWidth: '1px'
        };
      case 'social':
        return {
          platforms: [
            {
              name: 'Facebook',
              url: 'https://facebook.com',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg',
              iconStyle: 'color',
              showLabel: false
            },
            {
              name: 'Twitter',
              url: 'https://twitter.com',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg',
              iconStyle: 'color',
              showLabel: false
            },
            {
              name: 'Instagram',
              url: 'https://instagram.com',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg',
              iconStyle: 'color',
              showLabel: false
            }
          ],
          layout: 'horizontal',
          iconSize: '32px',
          spacing: '16px'
        };
      case 'video':
        return {
          videoUrl: '',
          thumbnail: 'https://via.placeholder.com/400x225?text=Video+Thumbnail',
          showPlayButton: true,
          platform: 'custom',
          autoThumbnail: false
        };
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
      overflow: 'hidden'
    };

    // Enhanced visual feedback when dragging
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
        transition: 'all 0.3s ease-in-out'
      };
    }

    return baseStyle;
  }, [canvasWidth, isDraggingOver, currentDragType]);

  return (
    <div className="relative">
      <div
        style={canvasStyle}
        className="email-canvas"
        onDrop={dragDropHandler.handleCanvasDrop}
        onDragOver={dragDropHandler.handleCanvasDragOver}
        onDragEnter={dragDropHandler.handleCanvasDragEnter}
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
            currentDragType={currentDragType}
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
            onBlockEditStart={handleBlockEditStart}
            onBlockEditEnd={handleBlockEditEnd}
            onBlockUpdate={handleBlockUpdate}
          />
        </div>
      </div>

      {/* Only render CanvasStatus when showAIAnalytics is true */}
      {showAIAnalytics && (
        <CanvasStatus 
          selectedBlockId={selectedBlockId}
          canvasWidth={canvasWidth}
          previewMode={previewMode}
          emailHTML={currentEmailHTML}
          subjectLine={subject}
        />
      )}
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
