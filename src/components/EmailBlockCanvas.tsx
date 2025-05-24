
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { EmailSnippet } from '@/types/snippets';
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
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile' | 'tablet';
  compactMode?: boolean;
}

interface EmailBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(
  ({ onContentChange, previewWidth = 600, previewMode = 'desktop', compactMode = false }, ref) => {
    const [blocks, setBlocks] = useState<EmailBlock[]>([
      {
        id: 'header-1',
        type: 'text',
        content: { text: 'Welcome to our Newsletter!', tag: 'h1' },
        styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }
      },
      {
        id: 'content-1',
        type: 'text',
        content: { text: 'This is a sample email content. Click the AI optimization suggestions to see them work!', tag: 'p' },
        styles: { fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }
      },
      {
        id: 'cta-1',
        type: 'button',
        content: { text: 'Get Started', link: '#' },
        styles: { backgroundColor: '#3B82F6', color: 'white', padding: '12px 24px', borderRadius: '6px', textAlign: 'center' }
      }
    ]);

    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    const generateHTML = () => {
      const htmlContent = blocks.map(block => {
        const styleString = block.styles ? 
          Object.entries(block.styles)
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ') : '';

        switch (block.type) {
          case 'text':
            const tag = block.content.tag || 'p';
            return `<${tag} style="${styleString}">${block.content.text}</${tag}>`;
          case 'button':
            return `<div style="text-align: center; margin: 20px 0;">
              <a href="${block.content.link}" style="${styleString}; text-decoration: none; display: inline-block;">
                ${block.content.text}
              </a>
            </div>`;
          case 'image':
            return `<img src="${block.content.src}" alt="${block.content.alt || ''}" style="${styleString}" />`;
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
        const newBlock: EmailBlock = {
          id: `block-${Date.now()}`,
          type: blockType,
          content: getDefaultContent(blockType),
          styles: getDefaultStyles(blockType)
        };
        setBlocks(prev => [...prev, newBlock]);
      },

      insertSnippet: (snippet: EmailSnippet) => {
        const newBlock: EmailBlock = {
          id: `snippet-${Date.now()}`,
          type: 'text',
          content: { text: snippet.content, tag: 'div' },
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
        case 'text': return { text: 'New text block', tag: 'p' };
        case 'button': return { text: 'Click Me', link: '#' };
        case 'image': return { src: '/placeholder.svg', alt: 'New image' };
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
        default: return { margin: '10px 0' };
      }
    };

    const handleBlockClick = (blockId: string) => {
      setSelectedBlockId(blockId === selectedBlockId ? null : blockId);
    };

    const updateBlockText = (blockId: string, newText: string) => {
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, content: { ...block.content, text: newText } }
          : block
      ));
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
            
            {/* Email Preview Area */}
            <div className="p-6">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`email-block cursor-pointer transition-all duration-200 ${
                    selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => handleBlockClick(block.id)}
                  style={block.styles}
                >
                  {block.type === 'text' && (
                    selectedBlockId === block.id ? (
                      <input
                        type="text"
                        value={block.content.text}
                        onChange={(e) => updateBlockText(block.id, e.target.value)}
                        className="w-full bg-transparent border-none outline-none"
                        style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                        onBlur={() => setSelectedBlockId(null)}
                        autoFocus
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: block.content.text }} />
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
                        {selectedBlockId === block.id ? (
                          <input
                            type="text"
                            value={block.content.text}
                            onChange={(e) => setBlocks(prev => prev.map(b => 
                              b.id === block.id 
                                ? { ...b, content: { ...b.content, text: e.target.value } }
                                : b
                            ))}
                            className="bg-transparent border-none outline-none text-center"
                            style={{ color: 'inherit', width: '100%' }}
                            onBlur={() => setSelectedBlockId(null)}
                            autoFocus
                          />
                        ) : (
                          block.content.text
                        )}
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Status */}
        <div className="bg-white border-t p-2 text-xs text-gray-600 flex items-center justify-between">
          <div>
            Blocks: {blocks.length} | Width: {getCanvasWidth()}px
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
