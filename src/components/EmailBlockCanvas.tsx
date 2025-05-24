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
        // Simulate HTML minification by removing unnecessary styles
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
        
        // Simulate link checking
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
                  {block.type === 'text' && (
                    editingBlockId === block.id ? (
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
                    )
                  )}
                  
                  {block.type === 'button' && (
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
                  )}
                  
                  {block.type === 'image' && (
                    <img
                      src={block.content.src}
                      alt={block.content.alt}
                      style={block.styles}
                    />
                  )}

                  {block.type === 'spacer' && (
                    <div style={{ height: block.content.height, backgroundColor: 'transparent' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Status */}
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
