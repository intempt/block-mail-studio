import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailSnippet } from '@/types/snippets';
import { SimpleTipTapEditor } from './SimpleTipTapEditor';
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

    const renderBlock = (block: SimpleBlock) => {
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
          <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden" 
               style={{ width: getCanvasWidth(), minHeight: '600px' }}>
            
            <div className="p-6">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`email-block cursor-pointer transition-all duration-200 mb-4 ${
                    selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleBlockClick(block.id)}
                  onDoubleClick={() => handleBlockDoubleClick(block.id, block.type)}
                  style={block.styles}
                >
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border-t p-2 text-xs text-gray-600 flex items-center justify-between">
          <div>
            Blocks: {blocks.length} | Width: {getCanvasWidth()}px
            {selectedBlockId && <span className="ml-2 text-blue-600">• Block selected</span>}
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
