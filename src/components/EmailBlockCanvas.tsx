import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';
import { EditView } from './canvas/EditView';
import { PreviewView } from './canvas/PreviewView';
import { useEmailHTMLGenerator } from '@/hooks/useEmailHTMLGenerator';
import { createBlock } from '@/utils/enhancedBlockFactory';
import { createDefaultBlockStyling } from '@/utils/blockUtils';
import './EmailBlockCanvas.css';

interface VariableOption {
  text: string;
  value: string;
}

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  onBlocksChange?: (blocks: EmailBlock[]) => void;
  previewWidth?: number;
  previewMode?: 'desktop' | 'mobile';
  compactMode?: boolean;
  subject?: string;
  onSubjectChange?: (subject: string) => void;
  showAIAnalytics?: boolean;
  onSnippetRefresh?: () => void;
  viewMode?: 'edit' | 'desktop-preview' | 'mobile-preview';
  containerWidth?: number; // New prop for responsive width
}

export interface EmailBlockCanvasRef {
  findAndReplaceText: (current: string, replacement: string) => void;
  optimizeImages: () => void;
  minifyHTML: () => void;
  checkLinks: () => { workingLinks: number; brokenLinks: number; totalLinks: number };
  addBlock: (block: EmailBlock) => void;
  replaceAllBlocks: (blocks: EmailBlock[]) => void;
}

export const EmailBlockCanvas = forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(({
  onContentChange,
  onBlockSelect,
  onBlocksChange,
  previewWidth = 600,
  previewMode = 'desktop',
  compactMode = false,
  subject = '',
  onSubjectChange = () => {},
  showAIAnalytics = false,
  onSnippetRefresh,
  viewMode = 'edit',
  containerWidth = 600 // Use container width for responsiveness
}, ref) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);

  const { currentEmailHTML } = useEmailHTMLGenerator(blocks, onContentChange);

  // Calculate effective canvas width based on container width
  const effectiveCanvasWidth = containerWidth > 0 ? Math.min(containerWidth - 64, 700) : previewWidth;

  console.log('EmailBlockCanvas: containerWidth =', containerWidth, 'effectiveCanvasWidth =', effectiveCanvasWidth);

  // Helper functions for creating default content and styles
  const getDefaultContent = useCallback((blockType: string) => {
    const block = createBlock(blockType);
    return block.content;
  }, []);

  const getDefaultStyles = useCallback((blockType: string) => {
    return createDefaultBlockStyling(blockType);
  }, []);

  // Emit blocks changes whenever blocks state changes
  useEffect(() => {
    if (onBlocksChange) {
      console.log('EmailBlockCanvas: Emitting blocks change:', blocks.length);
      onBlocksChange(blocks);
    }
  }, [blocks, onBlocksChange]);

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
                    newHTML = newHTML.replace(stippedCurrent, replacement);
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
    },
    replaceAllBlocks: (newBlocks: EmailBlock[]) => {
      console.log('EmailBlockCanvas: Replacing all blocks:', newBlocks.length);
      setBlocks(newBlocks);
    }
  }), [blocks, findAndReplaceText]);

  // Render preview mode
  if (viewMode === 'desktop-preview' || viewMode === 'mobile-preview') {
    return (
      <div 
        className="responsive-canvas-container"
        style={{ '--canvas-max-width': `${effectiveCanvasWidth}px` } as React.CSSProperties}
      >
        <div className="responsive-canvas-inner">
          <PreviewView
            emailHtml={currentEmailHTML}
            subject={subject}
            viewMode={viewMode}
            canvasWidth={effectiveCanvasWidth}
          />
        </div>
      </div>
    );
  }

  // Render edit mode
  return (
    <div 
      className="responsive-canvas-container"
      style={{ '--canvas-max-width': `${effectiveCanvasWidth}px` } as React.CSSProperties}
    >
      <div className="responsive-canvas-inner">
        <EditView
          blocks={blocks}
          setBlocks={setBlocks}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          editingBlockId={editingBlockId}
          setEditingBlockId={setEditingBlockId}
          onBlockSelect={onBlockSelect}
          previewWidth={effectiveCanvasWidth}
          previewMode={previewMode}
          compactMode={compactMode}
          subject={subject}
          onSubjectChange={onSubjectChange}
          showAIAnalytics={showAIAnalytics}
          onSnippetRefresh={onSnippetRefresh}
          currentEmailHTML={currentEmailHTML}
          getDefaultContent={getDefaultContent}
          getDefaultStyles={getDefaultStyles}
        />
      </div>
    </div>
  );
});

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
