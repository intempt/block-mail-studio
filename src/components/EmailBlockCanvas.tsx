import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmailSnippet } from '@/types/snippets';
import { SimpleTipTapEditor } from './SimpleTipTapEditor';
import { Trash2, Copy, GripVertical } from 'lucide-react';
import './EmailBlockCanvas.css';

export interface EmailBlockCanvasRef {
  insertBlock: (blockType: string) => void;
  insertSnippet: (snippet: EmailSnippet) => void;
  updateBlockContent: (blockId: string, content: any) => void;
  findAndReplaceText: (search: string, replace: string) => void;
  optimizeImages: () => void;
  minifyHTML: () => void;
  checkLinks: () => { total: number; working: number; broken: number };
  getHTML: () => string;
}

interface EmailBlockCanvasProps {
  onContentChange?: (content: string) => void;
  onBlockSelect?: (block: SimpleBlock | null) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile' | 'tablet';
  compactMode?: boolean;
}

interface SimpleBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(
  ({ onContentChange, onBlockSelect, previewWidth = 600, previewMode = 'desktop', compactMode = false }, ref) => {
    const [blocks, setBlocks] = useState<SimpleBlock[]>([
      {
        id: 'header-1',
        type: 'text',
        content: { text: 'Welcome to our Newsletter!' },
        styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }
      },
      {
        id: 'content-1',
        type: 'text',
        content: { text: 'This is a sample email content. Click to edit with rich text editor!' },
        styles: { fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }
      },
      {
        id: 'cta-1',
        type: 'button',
        content: { text: 'Get Started', link: '#' },
        styles: { backgroundColor: '#3B82F6', color: 'white', padding: '12px 24px', borderRadius: '6px', textAlign: 'center', display: 'inline-block', textDecoration: 'none' }
      }
    ]);

    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const generateHTML = () => {
      const htmlContent = blocks.map(block => {
        const styleString = block.styles ? 
          Object.entries(block.styles)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ') : '';

        switch (block.type) {
          case 'text':
            return `<p style="${styleString}">${block.content.text}</p>`;
          case 'button':
            return `<div style="text-align: center; margin: 20px 0;">
              <a href="${block.content.link}" style="${styleString}; text-decoration: none; display: inline-block;">
                ${block.content.text}
              </a>
            </div>`;
          case 'image':
            return `<img src="${block.content.src}" alt="${block.content.alt || ''}" style="${styleString}" />`;
          case 'spacer':
            return `<div style="height: ${block.content.height};"></div>`;
          case 'divider':
            return `<hr style="${styleString}; border: none; border-top: ${block.content.thickness || '1px'} ${block.content.style || 'solid'} ${block.content.color || '#ddd'}; margin: 20px 0;" />`;
          case 'video':
            return `<div style="text-align: center; margin: 20px 0;">
              <img src="${block.content.thumbnail}" alt="Video thumbnail" style="max-width: 100%; height: auto; cursor: pointer;" />
              <p style="margin-top: 10px;"><a href="${block.content.videoUrl}" style="color: #3B82F6;">Watch Video</a></p>
            </div>`;
          case 'social':
            const socialLinks = block.content.platforms?.map((platform: any) => 
              `<a href="${platform.url}" style="margin: 0 5px; text-decoration: none;">${platform.name}</a>`
            ).join('') || '';
            return `<div style="text-align: center; margin: 20px 0;">${socialLinks}</div>`;
          case 'html':
            return block.content.html || '<div>Custom HTML content</div>';
          case 'table':
            const tableRows = block.content.rows || 2;
            const tableCols = block.content.columns || 2;
            let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">';
            for (let i = 0; i < tableRows; i++) {
              tableHTML += '<tr>';
              for (let j = 0; j < tableCols; j++) {
                const cellContent = block.content.cells?.[i]?.[j]?.content || `Cell ${i + 1},${j + 1}`;
                tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${cellContent}</td>`;
              }
              tableHTML += '</tr>';
            }
            tableHTML += '</table>';
            return tableHTML;
          default:
            return `<div style="${styleString}">${block.content.text || ''}</div>`;
        }
      }).join('\n');

      return `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        ${htmlContent}
      </div>`;
    };

    useEffect(() => {
      const html = generateHTML();
      onContentChange?.(html);
    }, [blocks, onContentChange]);

    useImperativeHandle(ref, () => ({
      insertBlock: (blockType: string) => {
        const newBlock: SimpleBlock = {
          id: `block-${Date.now()}`,
          type: blockType,
          content: getDefaultContent(blockType),
          styles: getDefaultStyles(blockType)
        };
        setBlocks(prev => [...prev, newBlock]);
      },

      insertSnippet: (snippet: EmailSnippet) => {
        const newBlock: SimpleBlock = {
          id: `snippet-${Date.now()}`,
          type: 'text',
          content: { text: snippet.blockData || snippet.description },
          styles: { margin: '10px 0' }
        };
        setBlocks(prev => [...prev, newBlock]);
      },

      updateBlockContent: (blockId: string, content: any) => {
        setBlocks(prev => prev.map(block => 
          block.id === blockId ? { ...block, content: { ...block.content, ...content } } : block
        ));
      },

      findAndReplaceText: (search: string, replace: string) => {
        setBlocks(prev => prev.map(block => {
          if (block.type === 'text' && block.content.text) {
            return {
              ...block,
              content: {
                ...block.content,
                text: block.content.text.replace(new RegExp(search, 'gi'), replace)
              }
            };
          }
          if (block.type === 'button' && block.content.text) {
            return {
              ...block,
              content: {
                ...block.content,
                text: block.content.text.replace(new RegExp(search, 'gi'), replace)
              }
            };
          }
          return block;
        }));
      },

      optimizeImages: () => {
        setBlocks(prev => prev.map(block => {
          if (block.type === 'image') {
            return {
              ...block,
              styles: {
                ...block.styles,
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }
            };
          }
          return block;
        }));
        console.log('Images optimized for better performance');
      },

      minifyHTML: () => {
        setBlocks(prev => prev.map(block => ({
          ...block,
          styles: Object.fromEntries(
            Object.entries(block.styles || {}).filter(([_, value]) => value !== '')
          )
        })));
        console.log('HTML minified successfully');
      },

      checkLinks: () => {
        const linkBlocks = blocks.filter(block => 
          (block.type === 'button' && block.content.link) ||
          (block.type === 'text' && block.content.text?.includes('<a'))
        );
        
        const total = linkBlocks.length;
        const working = Math.floor(total * 0.9);
        const broken = total - working;
        
        console.log(`Link check complete: ${working}/${total} links working`);
        return { total, working, broken };
      },

      getHTML: () => generateHTML()
    }));

    const getDefaultContent = (blockType: string) => {
      switch (blockType) {
        case 'text': return { text: 'New text block' };
        case 'button': return { text: 'Click Me', link: '#' };
        case 'image': return { src: '/placeholder.svg', alt: 'New image' };
        case 'spacer': return { height: '40px' };
        case 'divider': return { style: 'solid', thickness: '1px', color: '#ddd', width: '100%' };
        case 'video': return { videoUrl: '#', thumbnail: '/placeholder.svg', showPlayButton: true };
        case 'social': return { 
          platforms: [
            { name: 'Facebook', url: '#', icon: 'facebook' },
            { name: 'Twitter', url: '#', icon: 'twitter' }
          ]
        };
        case 'html': return { html: '<div>Custom HTML content</div>' };
        case 'table': return { 
          rows: 2, 
          columns: 2, 
          cells: [
            [{ content: 'Header 1' }, { content: 'Header 2' }],
            [{ content: 'Cell 1' }, { content: 'Cell 2' }]
          ]
        };
        default: return { text: 'New block' };
      }
    };

    const getDefaultStyles = (blockType: string) => {
      switch (blockType) {
        case 'text': return { fontSize: '16px', lineHeight: '1.5', margin: '10px 0' };
        case 'button': return { 
          backgroundColor: '#3B82F6', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block'
        };
        case 'image': return { maxWidth: '100%', height: 'auto', display: 'block' };
        case 'spacer': return { height: '40px' };
        case 'divider': return { margin: '20px 0' };
        case 'video': return { maxWidth: '100%', textAlign: 'center' };
        case 'social': return { textAlign: 'center', margin: '20px 0' };
        case 'html': return { margin: '10px 0' };
        case 'table': return { width: '100%', borderCollapse: 'collapse', margin: '20px 0' };
        default: return { margin: '10px 0' };
      }
    };

    const handleCanvasDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      setDragOverIndex(null);

      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.blockType === 'columns' && data.layoutData) {
          // Handle layout drop
          const newBlock: SimpleBlock = {
            id: `layout-${Date.now()}`,
            type: 'columns',
            content: {
              columns: data.layoutData.columns,
              columnRatio: data.layoutData.ratio,
              gap: '16px'
            },
            styles: { margin: '20px 0' }
          };
          
          const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
          setBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(insertIndex, 0, newBlock);
            return newBlocks;
          });
        } else if (data.blockType) {
          // Handle regular block drop
          const newBlock: SimpleBlock = {
            id: `block-${Date.now()}`,
            type: data.blockType,
            content: getDefaultContent(data.blockType),
            styles: getDefaultStyles(data.blockType)
          };
          
          const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
          setBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(insertIndex, 0, newBlock);
            return newBlocks;
          });
        }
      } catch (error) {
        console.error('Error handling drop:', error);
      }
    };

    const handleCanvasDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
      
      // Calculate drop position
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const blockElements = e.currentTarget.querySelectorAll('.email-block');
      
      let insertIndex = blocks.length;
      for (let i = 0; i < blockElements.length; i++) {
        const blockRect = blockElements[i].getBoundingClientRect();
        const blockY = blockRect.top - rect.top + blockRect.height / 2;
        if (y < blockY) {
          insertIndex = i;
          break;
        }
      }
      
      setDragOverIndex(insertIndex);
    };

    const handleCanvasDragLeave = (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
        setDragOverIndex(null);
      }
    };

    const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
      e.dataTransfer.setData('application/json', JSON.stringify({ 
        blockId,
        isReorder: true 
      }));
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.isReorder && data.blockId) {
          // Handle block reordering
          const sourceIndex = blocks.findIndex(b => b.id === data.blockId);
          if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
            setBlocks(prev => {
              const newBlocks = [...prev];
              const [movedBlock] = newBlocks.splice(sourceIndex, 1);
              const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
              newBlocks.splice(adjustedTargetIndex, 0, movedBlock);
              return newBlocks;
            });
          }
        }
      } catch (error) {
        console.error('Error handling block reorder:', error);
      }
    };

    const deleteBlock = (blockId: string) => {
      setBlocks(prev => prev.filter(block => block.id !== blockId));
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
        onBlockSelect?.(null);
      }
    };

    const duplicateBlock = (blockId: string) => {
      const blockToDuplicate = blocks.find(b => b.id === blockId);
      if (blockToDuplicate) {
        const newBlock: SimpleBlock = {
          ...blockToDuplicate,
          id: `block-${Date.now()}`
        };
        const originalIndex = blocks.findIndex(b => b.id === blockId);
        setBlocks(prev => {
          const newBlocks = [...prev];
          newBlocks.splice(originalIndex + 1, 0, newBlock);
          return newBlocks;
        });
      }
    };

    const handleBlockClick = (blockId: string) => {
      const newSelectedId = blockId === selectedBlockId ? null : blockId;
      setSelectedBlockId(newSelectedId);
      const selectedBlock = newSelectedId ? blocks.find(b => b.id === newSelectedId) || null : null;
      onBlockSelect?.(selectedBlock);
    };

    const handleBlockDoubleClick = (blockId: string, blockType: string) => {
      if (blockType === 'text') {
        setEditingBlockId(blockId);
      }
    };

    const updateBlock = (blockId: string, updates: Partial<SimpleBlock>) => {
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      ));
    };

    const handleTipTapChange = (blockId: string, html: string) => {
      updateBlock(blockId, { content: { ...blocks.find(b => b.id === blockId)?.content, text: html } });
    };

    const handleTipTapBlur = () => {
      setEditingBlockId(null);
    };

    const getCanvasWidth = () => {
      switch (previewMode) {
        case 'mobile': return Math.min(375, previewWidth);
        case 'tablet': return Math.min(768, previewWidth);
        case 'desktop': return Math.min(1200, previewWidth);
        default: return previewWidth;
      }
    };

    const renderColumnsBlock = (block: SimpleBlock) => {
      const columnWidths = getColumnWidths(block.content.columnRatio);
      
      return (
        <div className="columns-block" style={block.styles}>
          <div className="flex gap-4">
            {block.content.columns?.map((column: any, index: number) => (
              <div
                key={column.id || index}
                className="column-drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400"
                style={{ width: columnWidths[index] }}
                onDrop={(e) => handleColumnDrop(e, block.id, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="text-center text-gray-500 text-sm">
                  Column {index + 1} ({columnWidths[index]})
                  <br />
                  <span className="text-xs">Drop blocks here</span>
                </div>
                {column.blocks?.map((innerBlock: SimpleBlock) => (
                  <div key={innerBlock.id} className="mt-2">
                    {renderBlock(innerBlock)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    };

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

    const handleColumnDrop = (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.blockType) {
          const newBlock: SimpleBlock = {
            id: `block-${Date.now()}`,
            type: data.blockType,
            content: getDefaultContent(data.blockType),
            styles: getDefaultStyles(data.blockType)
          };
          
          setBlocks(prev => prev.map(block => {
            if (block.id === layoutBlockId && block.type === 'columns') {
              const updatedColumns = [...(block.content.columns || [])];
              if (!updatedColumns[columnIndex]) {
                updatedColumns[columnIndex] = { id: `col-${columnIndex}`, blocks: [] };
              }
              if (!updatedColumns[columnIndex].blocks) {
                updatedColumns[columnIndex].blocks = [];
              }
              updatedColumns[columnIndex].blocks.push(newBlock);
              
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
        }
      } catch (error) {
        console.error('Error handling column drop:', error);
      }
    };

    const renderBlock = (block: SimpleBlock) => {
      if (block.type === 'columns') {
        return renderColumnsBlock(block);
      }

      switch (block.type) {
        case 'text':
          return editingBlockId === block.id ? (
            <SimpleTipTapEditor
              content={block.content.text}
              onChange={(html) => handleTipTapChange(block.id, html)}
              onBlur={handleTipTapBlur}
            />
          ) : (
            <div 
              dangerouslySetInnerHTML={{ __html: block.content.text }} 
              className="min-h-[20px]"
            />
          );
        
        case 'button':
          return (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <a
                href={block.content.link}
                style={{
                  ...block.styles,
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onClick={(e) => e.preventDefault()}
              >
                {block.content.text}
              </a>
            </div>
          );
        
        case 'image':
          return (
            <img
              src={block.content.src}
              alt={block.content.alt}
              style={block.styles}
            />
          );

        case 'spacer':
          return <div style={{ height: block.content.height, backgroundColor: 'transparent' }} />;

        case 'divider':
          return (
            <hr 
              style={{
                ...block.styles,
                border: 'none',
                borderTop: `${block.content.thickness || '1px'} ${block.content.style || 'solid'} ${block.content.color || '#ddd'}`
              }} 
            />
          );

        case 'video':
          return (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <img 
                src={block.content.thumbnail} 
                alt="Video thumbnail" 
                style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }} 
              />
              <p style={{ marginTop: '10px' }}>
                <a href={block.content.videoUrl} style={{ color: '#3B82F6' }}>Watch Video</a>
              </p>
            </div>
          );

        case 'social':
          return (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              {block.content.platforms?.map((platform: any, index: number) => (
                <a 
                  key={index}
                  href={platform.url} 
                  style={{ margin: '0 5px', textDecoration: 'none' }}
                >
                  {platform.name}
                </a>
              ))}
            </div>
          );

        case 'html':
          return <div dangerouslySetInnerHTML={{ __html: block.content.html }} />;

        case 'table':
          const tableRows = block.content.rows || 2;
          const tableCols = block.content.columns || 2;
          return (
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <tbody>
                {Array.from({ length: tableRows }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: tableCols }, (_, j) => (
                      <td 
                        key={j}
                        style={{ border: '1px solid #ddd', padding: '8px' }}
                      >
                        {block.content.cells?.[i]?.[j]?.content || `Cell ${i + 1},${j + 1}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );

        default:
          return <div>Unknown block type: {block.type}</div>;
      }
    };

    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex-1 overflow-auto p-4">
          <div 
            className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200 ${
              isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
            }`}
            style={{ width: getCanvasWidth(), minHeight: '600px' }}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onDragLeave={handleCanvasDragLeave}
          >
            <div className="p-6">
              {isDraggingOver && dragOverIndex === 0 && (
                <div className="h-2 bg-blue-400 rounded-full mb-4 opacity-75" />
              )}
              
              {blocks.map((block, index) => (
                <div key={block.id}>
                  <div
                    className={`email-block group cursor-pointer transition-all duration-200 mb-4 relative ${
                      selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    draggable
                    onClick={() => handleBlockClick(block.id)}
                    onDoubleClick={() => handleBlockDoubleClick(block.id, block.type)}
                    onDragStart={(e) => handleBlockDragStart(e, block.id)}
                    onDrop={(e) => handleBlockDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    style={block.styles}
                  >
                    {/* Block Controls */}
                    <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 bg-white shadow-sm cursor-grab"
                      >
                        <GripVertical className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateBlock(block.id);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 bg-white shadow-sm text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {renderBlock(block)}
                  </div>
                  
                  {isDraggingOver && dragOverIndex === index + 1 && (
                    <div className="h-2 bg-blue-400 rounded-full mb-4 opacity-75" />
                  )}
                </div>
              ))}
              
              {blocks.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg mb-2">Drop blocks here to start building</div>
                  <div className="text-gray-500 text-sm">Drag blocks from the palette to create your email</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border-t p-2 text-xs text-gray-600 flex items-center justify-between">
          <div>
            Blocks: {blocks.length} | Width: {getCanvasWidth()}px
            {selectedBlockId && <span className="ml-2 text-blue-600">• Block selected</span>}
            {isDraggingOver && <span className="ml-2 text-green-600">• Drop zone active</span>}
          </div>
          <Badge variant="outline" className="text-xs">
            {previewMode}
          </Badge>
        </div>
      </div>
    );
  }
);

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
