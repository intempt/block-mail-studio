
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { TextBlock, ImageBlock, ButtonBlock, DividerBlock, EmailBlock } from '@/types/emailBlocks';
import { TextBlockComponent } from './email-block-components/TextBlockComponent';
import { ImageBlockComponent } from './email-block-components/ImageBlockComponent';
import { ButtonBlockComponent } from './email-block-components/ButtonBlockComponent';
import { DividerBlockComponent } from './email-block-components/DividerBlockComponent';
import { ItemTypes } from '@/constants/itemTypes';
import { parseHTMLToBlocks, generateEmailHTML } from '@/utils/htmlParser';
import './EmailBlockCanvas.css';

export interface EmailBlockCanvasRef {
  getBlocks: () => EmailBlock[];
  addBlock: (block: EmailBlock, index?: number) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  getSelectedBlock: () => EmailBlock | null;
  setSelectedBlock: (blockId: string | null) => void;
  exportToHTML: () => string;
  importFromHTML: (html: string) => void;
  updateSubjectLine: (subject: string) => void;
  updateBlockContent: (blockId: string, content: any) => void;
  updateBlockStyle: (blockId: string, styleChanges: any) => void;
  replaceTextInAllBlocks: (oldText: string, newText: string) => void;
  applyDesignSuggestion: (suggestion: any) => void;
  applyGlobalStyles: (styles: any) => void;
  findAndReplaceText: (searchText: string, replaceText: string) => void;
}

interface EmailBlockCanvasProps {
  content?: string;
  subject?: string;
  onContentChange?: (content: string) => void;
  onSubjectChange?: (subject: string) => void;
  onSelectionChange?: (block: EmailBlock | null) => void;
  selectedBlockId?: string;
  globalStyles?: any;
}

const EmailBlockCanvas = React.forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(
  ({ content, subject, onContentChange, onSubjectChange, onSelectionChange, selectedBlockId, globalStyles }, ref) => {
    const [blocks, setBlocks] = useState<EmailBlock[]>([]);
    const [subjectLine, setSubjectLine] = useState<string>(subject || '');
    const [isDragging, setIsDragging] = useState(false);

    const handleAddBlock = useCallback((block: EmailBlock, index?: number) => {
      setBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        if (index !== undefined) {
          newBlocks.splice(index, 0, block);
        } else {
          newBlocks.push(block);
        }
        return newBlocks;
      });
    }, []);

    const handleUpdateBlock = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        )
      );
    }, []);

    const handleDeleteBlock = useCallback((blockId: string) => {
      setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    }, []);

    const handleMoveBlock = useCallback((fromIndex: number, toIndex: number) => {
      setBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        const [movedBlock] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, movedBlock);
        return newBlocks;
      });
    }, []);

    const handleBlockSelect = useCallback((blockId: string | null) => {
      const selectedBlock = blocks.find(b => b.id === blockId) || null;
      onSelectionChange?.(selectedBlock);
    }, [blocks, onSelectionChange]);

    const handleSubjectLineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newSubject = e.target.value;
      setSubjectLine(newSubject);
      onSubjectChange?.(newSubject);
    }, [onSubjectChange]);

    // Add new methods for enhanced canvas integration
    const updateBlockContent = useCallback((blockId: string, newContent: any) => {
      setBlocks(prevBlocks => 
        prevBlocks.map(block => {
          if (block.id === blockId) {
            const updatedBlock = { ...block };
            
            // Update content based on block type
            if (block.type === 'text' && newContent.html) {
              updatedBlock.content = { ...block.content, html: newContent.html };
            } else if (block.type === 'button' && newContent.text) {
              updatedBlock.content = { ...block.content, text: newContent.text };
            } else {
              updatedBlock.content = { ...block.content, ...newContent };
            }
            
            return updatedBlock;
          }
          return block;
        })
      );
    }, []);

    const updateBlockStyle = useCallback((blockId: string, styleChanges: any) => {
      setBlocks(prevBlocks => 
        prevBlocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              styling: {
                ...block.styling,
                desktop: { ...block.styling.desktop, ...styleChanges }
              }
            };
          }
          return block;
        })
      );
    }, []);

    const replaceTextInAllBlocks = useCallback((oldText: string, newText: string) => {
      setBlocks(prevBlocks => 
        prevBlocks.map(block => {
          const updatedBlock = { ...block };
          
          if (block.type === 'text' && block.content.html) {
            updatedBlock.content.html = block.content.html.replace(new RegExp(oldText, 'gi'), newText);
          } else if (block.type === 'button' && block.content.text) {
            updatedBlock.content.text = block.content.text.replace(new RegExp(oldText, 'gi'), newText);
          }
          
          return updatedBlock;
        })
      );
    }, []);

    const applyDesignSuggestion = useCallback((suggestion: any) => {
      console.log('Canvas: Applying design suggestion:', suggestion);
      
      if (suggestion.blockId && suggestion.styleChanges) {
        updateBlockStyle(suggestion.blockId, suggestion.styleChanges);
      } else if (suggestion.globalStyleChanges) {
        // Apply global style changes if provided
        console.log('Canvas: Applying global style changes');
      }
    }, [updateBlockStyle]);

    const applyGlobalStyles = useCallback((styles: any) => {
      if (!styles) return;
      
      console.log('Canvas: Applying global brand styles to all blocks');
      
      // Update all text blocks with new typography
      setBlocks(prevBlocks => 
        prevBlocks.map(block => {
          if (block.type === 'text') {
            const updatedStyling = { ...block.styling };
            
            // Apply font family from global styles
            if (styles.text && styles.email.defaultFontFamily) {
              updatedStyling.desktop = {
                ...updatedStyling.desktop,
                fontFamily: styles.email.defaultFontFamily
              };
            }
            
            return { ...block, styling: updatedStyling };
          } else if (block.type === 'button') {
            const updatedStyling = { ...block.styling };
            
            // Apply button styles from global styles
            if (styles.buttons && styles.buttons.default) {
              updatedStyling.desktop = {
                ...updatedStyling.desktop,
                backgroundColor: styles.buttons.default.backgroundColor,
                textColor: styles.buttons.default.textColor,
                borderRadius: `${styles.buttons.default.borderRadius}px`
              };
            }
            
            return { ...block, styling: updatedStyling };
          }
          
          return block;
        })
      );
    }, []);

    const findAndReplaceText = useCallback((searchText: string, replaceText: string) => {
      replaceTextInAllBlocks(searchText, replaceText);
    }, [replaceTextInAllBlocks]);

    // Apply global styles when they change
    useEffect(() => {
      if (globalStyles) {
        applyGlobalStyles(globalStyles);
      }
    }, [globalStyles, applyGlobalStyles]);

    useEffect(() => {
      if (content) {
        const initialBlocks = parseHTMLToBlocks(content);
        setBlocks(initialBlocks);
      }
    }, [content]);

    useImperativeHandle(ref, () => ({
      getBlocks: () => blocks,
      addBlock: handleAddBlock,
      updateBlock: handleUpdateBlock,
      deleteBlock: handleDeleteBlock,
      moveBlock: handleMoveBlock,
      getSelectedBlock: () => blocks.find(b => b.id === selectedBlockId) || null,
      setSelectedBlock: handleBlockSelect,
      exportToHTML: () => generateEmailHTML(blocks, subjectLine),
      importFromHTML: (html: string) => {
        const importedBlocks = parseHTMLToBlocks(html);
        setBlocks(importedBlocks);
      },
      updateSubjectLine: (newSubject: string) => {
        setSubjectLine(newSubject);
        onSubjectChange?.(newSubject);
      },
      updateBlockContent,
      updateBlockStyle,
      replaceTextInAllBlocks,
      applyDesignSuggestion,
      applyGlobalStyles,
      findAndReplaceText
    }));

    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.BLOCK,
      drop: (item: { id: string, type: string }, monitor) => {
        if (!item || !item.type) return;

        const newBlock: EmailBlock = {
          id: uuidv4(),
          type: item.type as any,
          content: {
            html: '<p>New text block</p>',
            src: 'https://via.placeholder.com/400x200',
            alt: 'Placeholder Image',
            text: 'Click Me',
            link: 'https://example.com',
            style: 'solid',
            size: 'medium',
            placeholder: 'Enter text...'
          },
          styling: {
            desktop: {
              width: '100%',
              height: 'auto',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              color: '#333',
              padding: '10px',
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }
          }
        };

        handleAddBlock(newBlock);
        return { success: true };
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    const getBlockComponent = (block: EmailBlock, index: number) => {
      const [{ isDragging: dragging }, drag, preview] = useDrag({
        type: ItemTypes.EXISTING_BLOCK,
        item: { id: block.id, type: block.type, index: index },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
        begin: () => {
          handleDragStart();
          return {};
        },
        end: () => {
          handleDragEnd();
        }
      });

      const [, drop] = useDrop({
        accept: ItemTypes.EXISTING_BLOCK,
        drop: (item: { id: string, type: BlockType, index: number }, monitor) => {
          if (!monitor) return;
          const sourceIndex = item.index;
          const targetIndex = index;

          if (sourceIndex !== targetIndex) {
            handleMoveBlock(sourceIndex, targetIndex);
          }
        },
      });

      const isSelected = selectedBlockId === block.id;

      const blockStyle = {
        opacity: dragging ? 0.5 : 1,
        border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
        marginBottom: '10px',
        padding: '10px',
        cursor: 'grab',
        backgroundColor: isDragging ? '#eee' : 'transparent',
      };

      switch (block.type) {
        case 'text':
          return (
            <div ref={node => drag(drop(preview(node)))} style={blockStyle} key={block.id} onClick={() => handleBlockSelect(block.id)}>
              <TextBlockComponent
                block={block as TextBlock}
                onBlockUpdate={handleUpdateBlock}
              />
            </div>
          );
        case 'image':
          return (
            <div ref={node => drag(drop(preview(node)))} style={blockStyle} key={block.id} onClick={() => handleBlockSelect(block.id)}>
              <ImageBlockComponent
                block={block as ImageBlock}
                onBlockUpdate={handleUpdateBlock}
              />
            </div>
          );
        case 'button':
          return (
            <div ref={node => drag(drop(preview(node)))} style={blockStyle} key={block.id} onClick={() => handleBlockSelect(block.id)}>
              <ButtonBlockComponent
                block={block as ButtonBlock}
                onBlockUpdate={handleUpdateBlock}
              />
            </div>
          );
        case 'divider':
          return (
            <div ref={node => drag(drop(preview(node)))} style={blockStyle} key={block.id} onClick={() => handleBlockSelect(block.id)}>
              <DividerBlockComponent
                block={block as DividerBlock}
                onBlockUpdate={handleUpdateBlock}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div 
        className="email-canvas-container"
        style={{
          '--email-max-width': globalStyles?.email?.maxWidth ? `${globalStyles.email.maxWidth}px` : '600px',
          '--email-bg-color': globalStyles?.email?.backgroundColor || '#ffffff',
          '--email-font-family': globalStyles?.email?.defaultFontFamily || 'Arial, sans-serif'
        } as React.CSSProperties}
      >
        <div className="subject-line">
          <input
            type="text"
            placeholder="Subject Line"
            value={subjectLine}
            onChange={handleSubjectLineChange}
          />
        </div>
        <div ref={drop} className="email-canvas">
          {blocks.map((block, index) => (
            getBlockComponent(block, index)
          ))}
          {isOver && canDrop && <div className="drop-indicator">Drop here</div>}
        </div>
      </div>
    );
  }
);

EmailBlockCanvas.displayName = 'EmailBlockCanvas';

export { EmailBlockCanvas };
export default EmailBlockCanvas;
