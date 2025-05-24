import React, { useState, useRef } from 'react';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, SpacerBlock, DividerBlock, ColumnsBlock } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { ContextualEditor } from './ContextualEditor';
import { Card } from '@/components/ui/card';
import { generateUniqueId, createDefaultStyling } from '@/utils/blockUtils';
import { BlockRenderer } from './BlockRenderer';
import { SnippetService } from '@/services/snippetService';
import { SnippetSaveDialog } from './SnippetSaveDialog';
import './EmailBlockCanvas.css';

interface EmailBlockCanvasProps {
  onContentChange?: (html: string) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile' | 'tablet';
  compactMode?: boolean;
}

export interface EmailBlockCanvasRef {
  insertBlock: (blockType: string) => void;
  insertSnippet: (snippet: EmailSnippet) => void;
}

export const EmailBlockCanvas = React.forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  previewWidth,
  previewMode,
  compactMode = false
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showContextualEditor, setShowContextualEditor] = useState(false);
  const [showSnippetSaveDialog, setShowSnippetSaveDialog] = useState(false);
  const [blockToSave, setBlockToSave] = useState<EmailBlock | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  const insertBlock = (blockType: string, layoutData?: any) => {
    console.log('Inserting block:', blockType, layoutData);
    
    if (blockType === 'columns' && layoutData) {
      const newBlock = createColumnsBlock(layoutData);
      setBlocks(prev => [...prev, newBlock]);
      generateHTML([...blocks, newBlock]);
    } else {
      const newBlock = createBlockFromType(blockType);
      setBlocks(prev => [...prev, newBlock]);
      generateHTML([...blocks, newBlock]);
    }
  };

  const insertSnippet = (snippet: EmailSnippet) => {
    console.log('Inserting snippet:', snippet);
    
    // Create a new block from the snippet data
    const newBlock = {
      ...snippet.blockData,
      id: generateUniqueId(), // Generate new unique ID
      snippetId: snippet.id, // Keep reference to original snippet
      isStarred: false // Reset starred state for the new instance
    };
    
    setBlocks(prev => [...prev, newBlock]);
    generateHTML([...blocks, newBlock]);
    
    // Increment usage count for the snippet
    SnippetService.incrementUsage(snippet.id);
  };

  const handleStarBlock = (block: EmailBlock) => {
    setBlockToSave(block);
    setShowSnippetSaveDialog(true);
  };

  const handleSaveSnippet = async (name: string, description: string, category: string, tags: string[]) => {
    if (!blockToSave) return;
    
    try {
      await SnippetService.saveSnippet(blockToSave, name, description, category, tags);
      
      // Update the block to show it's starred
      setBlocks(prev => prev.map(b => 
        b.id === blockToSave.id ? { ...b, isStarred: true } : b
      ));
      
      setShowSnippetSaveDialog(false);
      setBlockToSave(null);
      
      console.log('Snippet saved successfully');
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  };

  const createColumnsBlock = (layoutData: any): EmailBlock => {
    return {
      id: generateUniqueId(),
      type: 'columns',
      position: { x: 0, y: 0 },
      styling: createDefaultStyling(),
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      },
      content: {
        columnCount: layoutData.columns,
        columnRatio: layoutData.ratio,
        columns: Array.from({ length: layoutData.columns }, () => ({
          id: generateUniqueId(),
          blocks: [],
          width: layoutData.preview[0]
        })),
        gap: '16px'
      }
    } as EmailBlock;
  };

  const createEcommerceTemplate = () => {
    console.log('Creating ecommerce template...');
    
    const ecommerceBlocks = [
      // Header with logo and navigation
      createBlockFromType('text', '<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;"><h1 style="margin: 0; font-size: 28px; font-weight: bold;">ACME Store</h1><p style="margin: 5px 0 0 0; opacity: 0.9;">Premium Quality Products</p></div>'),
      
      // Hero section
      createBlockFromType('image'),
      createBlockFromType('text', '<div style="text-align: center; padding: 30px 20px;"><h2 style="font-size: 32px; color: #1a1a1a; margin: 0 0 15px 0;">🔥 Flash Sale - 50% Off!</h2><p style="font-size: 18px; color: #666; margin: 0 0 20px 0;">Limited time offer on our best-selling products</p></div>'),
      
      // Product showcase (2 columns)
      (() => {
        const columnsBlock = createColumnsBlock({
          columns: 2,
          ratio: '50-50',
          preview: ['50%', '50%']
        });
        return columnsBlock;
      })(),
      
      // Call to action
      createBlockFromType('button'),
      
      // Divider
      createBlockFromType('divider'),
      
      // Social proof section
      createBlockFromType('text', '<div style="text-align: center; padding: 20px; background: #f8f9fa;"><h3 style="margin: 0 0 15px 0; color: #1a1a1a;">What Our Customers Say</h3><blockquote style="font-style: italic; color: #666; margin: 0; font-size: 16px;">"Amazing quality and fast shipping! Will definitely order again." - Sarah M.</blockquote></div>'),
      
      // Footer
      createBlockFromType('text', '<div style="text-align: center; padding: 20px; background: #2d3748; color: white; font-size: 14px;"><p style="margin: 0 0 10px 0;">Follow us on social media for exclusive deals!</p><p style="margin: 0; opacity: 0.8;">© 2024 ACME Store. All rights reserved.</p></div>')
    ];

    setBlocks(ecommerceBlocks);
    generateHTML(ecommerceBlocks);
  };

  const insertBlockIntoColumn = (blockType: string, columnId: string) => {
    const newBlock = createBlockFromType(blockType);
    
    setBlocks(prev => {
      const updated = prev.map(block => {
        if (block.type === 'columns') {
          const columnsBlock = block as ColumnsBlock;
          const updatedColumns = columnsBlock.content.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                blocks: [...column.blocks, newBlock]
              };
            }
            return column;
          });
          
          return {
            ...columnsBlock,
            content: {
              ...columnsBlock.content,
              columns: updatedColumns
            }
          };
        }
        return block;
      });
      generateHTML(updated);
      return updated;
    });
  };

  const handleBlockClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    setShowContextualEditor(true);
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock) => {
    setBlocks(prev => {
      const updated = prev.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      );
      generateHTML(updated);
      return updated;
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => {
      const updated = prev.filter(block => block.id !== blockId);
      generateHTML(updated);
      return updated;
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setShowContextualEditor(false);
    }
  };

  const generateHTML = (currentBlocks: EmailBlock[]) => {
    const emailHTML = `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${currentBlocks.map(block => renderBlockToHTML(block)).join('\n')}
      </div>
    `;
    onContentChange?.(emailHTML);
  };

  const renderBlockToHTML = (block: EmailBlock): string => {
    const styling = block.styling.desktop;
    const baseStyles = `
      background-color: ${styling.backgroundColor || 'transparent'};
      padding: ${styling.padding || '16px'};
      margin: ${styling.margin || '0'};
      border-radius: ${styling.borderRadius || '0'};
      border: ${styling.border || 'none'};
    `;

    switch (block.type) {
      case 'text':
        const textBlock = block as TextBlock;
        return `<div style="${baseStyles} color: ${styling.textColor || '#000'}; font-size: ${styling.fontSize || '16px'}; font-weight: ${styling.fontWeight || 'normal'};">${textBlock.content.html || ''}</div>`;
      case 'image':
        const imageBlock = block as ImageBlock;
        const imageEl = `<img src="${imageBlock.content.src || ''}" alt="${imageBlock.content.alt || ''}" style="width: 100%; height: auto; border-radius: ${styling.borderRadius || '0'};" />`;
        return `<div style="${baseStyles} text-align: center;">${imageBlock.content.link ? `<a href="${imageBlock.content.link}">${imageEl}</a>` : imageEl}</div>`;
      case 'button':
        const buttonBlock = block as ButtonBlock;
        return `<div style="${baseStyles} text-align: center;"><a href="${buttonBlock.content.link || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">${buttonBlock.content.text || 'Button'}</a></div>`;
      case 'columns':
        const columnsBlock = block as ColumnsBlock;
        const columnWidths = getColumnWidthsForRender(columnsBlock.content.columnRatio);
        return `<div style="${baseStyles}"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${columnsBlock.content.columns.map((column: any, index: number) => 
          `<td style="width: ${columnWidths[index]}; vertical-align: top; ${index > 0 ? 'padding-left: 8px;' : ''} ${index < columnsBlock.content.columns.length - 1 ? 'padding-right: 8px;' : ''}">${column.blocks.map((innerBlock: EmailBlock) => renderBlockToHTML(innerBlock)).join('')}</td>`
        ).join('')}</tr></table></div>`;
      case 'spacer':
        const spacerBlock = block as SpacerBlock;
        return `<div style="height: ${spacerBlock.content.height || '40px'}; line-height: ${spacerBlock.content.height || '40px'}; font-size: 1px;">&nbsp;</div>`;
      case 'divider':
        const dividerBlock = block as DividerBlock;
        return `<div style="${baseStyles}"><hr style="border: 0; height: ${dividerBlock.content.thickness || '1px'}; background-color: ${dividerBlock.content.color || '#e0e0e0'}; margin: 0;" /></div>`;
      default:
        return `<div style="${baseStyles}">Unknown block type</div>`;
    }
  };

  const getColumnWidthsForRender = (ratio: string) => {
    switch (ratio) {
      case '50-50': return ['50%', '50%'];
      case '33-67': return ['33%', '67%'];
      case '67-33': return ['67%', '33%'];
      case '25-75': return ['25%', '75%'];
      case '75-25': return ['75%', '25%'];
      case '60-40': return ['60%', '40%'];
      case '40-60': return ['40%', '60%'];
      case '33-33-33': return ['33.33%', '33.33%', '33.33%'];
      case '25-50-25': return ['25%', '50%', '25%'];
      case '25-25-50': return ['25%', '25%', '50%'];
      case '50-25-25': return ['50%', '25%', '25%'];
      case '25-25-25-25': return ['25%', '25%', '25%', '25%'];
      default: return ['100%'];
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Canvas drop data:', data);
      
      if (data.blockType === 'columns' && data.layoutData) {
        insertBlock('columns', data.layoutData);
      } else if (data.blockType) {
        insertBlock(data.blockType);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Expose functions through ref
  React.useImperativeHandle(ref, () => ({
    insertBlock,
    insertSnippet,
  }));

  React.useEffect(() => {
    // Initialize with ecommerce template instead of just welcome block
    if (blocks.length === 0) {
      createEcommerceTemplate();
    }
  }, []);

  const getCanvasStyles = () => {
    const baseStyles = "mx-auto transition-all duration-300 shadow-lg";
    const widthStyle = `max-width: ${previewWidth}px`;
    return { className: baseStyles, style: { maxWidth: `${previewWidth}px` } };
  };

  const getHeaderPadding = () => {
    return compactMode ? 'px-2 py-1' : 'px-4 py-2';
  };

  const getContentPadding = () => {
    return compactMode ? 'p-2' : 'p-4';
  };

  const getBlockSpacing = () => {
    return compactMode ? 'mb-2' : 'mb-4';
  };

  return (
    <div className="relative h-full">
      <Card 
        className={getCanvasStyles().className}
        style={getCanvasStyles().style}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className={`bg-slate-50 ${getHeaderPadding()} border-b border-slate-200`}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className={`${compactMode ? 'w-2 h-2' : 'w-3 h-3'} bg-red-400 rounded-full`}></div>
              <div className={`${compactMode ? 'w-2 h-2' : 'w-3 h-3'} bg-yellow-400 rounded-full`}></div>
              <div className={`${compactMode ? 'w-2 h-2' : 'w-3 h-3'} bg-green-400 rounded-full`}></div>
            </div>
            <span className={`${compactMode ? 'text-xs' : 'text-xs'} text-slate-500 ml-2`}>
              Email Canvas ({blocks.length} blocks)
            </span>
          </div>
        </div>
        
        <div 
          ref={canvasRef}
          className={`bg-white ${compactMode ? 'min-h-[400px]' : 'min-h-[600px]'} ${getContentPadding()}`}
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`block-wrapper ${getBlockSpacing()} cursor-pointer transition-all duration-200 ${
                selectedBlockId === block.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
              }`}
              onClick={() => handleBlockClick(block.id)}
            >
              <BlockRenderer 
                block={block}
                isSelected={selectedBlockId === block.id}
                onUpdate={handleBlockUpdate}
                onStarBlock={handleStarBlock}
                {...(block.type === 'columns' ? { onBlockAdd: insertBlockIntoColumn } : {})}
              />
            </div>
          ))}
          
          {blocks.length === 0 && (
            <div className={`text-center ${compactMode ? 'py-8' : 'py-16'} text-gray-400`}>
              <p className={compactMode ? 'text-sm' : 'text-base'}>
                Drop blocks here to start building your email
              </p>
            </div>
          )}
        </div>
      </Card>

      {showContextualEditor && selectedBlock && (
        <ContextualEditor
          block={selectedBlock}
          onBlockUpdate={handleBlockUpdate}
          onClose={() => {
            setShowContextualEditor(false);
            setSelectedBlockId(null);
          }}
          onDelete={() => handleDeleteBlock(selectedBlock.id)}
        />
      )}

      {showSnippetSaveDialog && (
        <SnippetSaveDialog
          onSave={handleSaveSnippet}
          onClose={() => {
            setShowSnippetSaveDialog(false);
            setBlockToSave(null);
          }}
        />
      )}
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';

const createBlockFromType = (type: string, customContent?: string): EmailBlock => {
  const baseBlock = {
    id: generateUniqueId(),
    position: { x: 0, y: 0 },
    styling: createDefaultStyling(),
    displayOptions: {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true
    }
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: customContent || '<p>Your text content here...</p>',
          textStyle: 'normal',
          placeholder: 'Click to add text...',
        },
      } as EmailBlock;
      
    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        content: {
          src: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=300&fit=crop',
          alt: 'Product showcase image',
          link: '#shop-now',
          alignment: 'center',
          width: '100%',
          isDynamic: false
        },
      } as EmailBlock;
      
    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        content: {
          text: 'Shop Now - 50% Off!',
          link: '#shop-now',
          style: 'solid',
          size: 'large'
        },
        styling: {
          ...baseBlock.styling,
          desktop: {
            ...baseBlock.styling.desktop,
            backgroundColor: '#ff6b6b',
            textColor: '#ffffff',
            padding: '15px 30px',
            borderRadius: '8px',
            textAlign: 'center',
          },
        },
      } as EmailBlock;

    case 'columns':
      return {
        ...baseBlock,
        type: 'columns',
        content: {
          columnCount: 2,
          columnRatio: '50-50',
          columns: [
            { id: generateUniqueId(), blocks: [], width: '50%' },
            { id: generateUniqueId(), blocks: [], width: '50%' }
          ],
          gap: '16px'
        },
      } as EmailBlock;
      
    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: '40px',
          mobileHeight: '20px'
        },
      } as EmailBlock;
      
    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        content: {
          style: 'solid',
          thickness: '1px',
          color: '#e0e0e0',
          width: '100%',
          alignment: 'center'
        },
      } as EmailBlock;
      
    default:
      return {
        ...baseBlock,
        type: 'text',
        content: {
          html: '<p>Unknown block type</p>',
          textStyle: 'normal'
        },
      } as EmailBlock;
  }
};
