import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle
} from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import {
  EmailBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  ColumnsBlock
} from '@/types/emailBlocks';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { MJMLService } from '@/services/MJMLService';
import { useNotification } from '@/contexts/NotificationContext';
import { DropZoneIndicator } from './DropZoneIndicator';

export interface EmailBlockCanvasRef {
  addBlock: (block: EmailBlock) => void;
  replaceAllBlocks: (blocks: EmailBlock[]) => void;
  getCurrentHTML: () => string;
  optimizeImages: () => void;
  minifyHTML: () => void;
  checkLinks: () => boolean;
  findAndReplaceText: (search: string, replace: string) => void;
}

interface EmailBlockCanvasProps {
  onContentChange: (content: string) => void;
  onBlockSelect: (blockId: string | null) => void;
  onBlocksChange: (blocks: EmailBlock[]) => void;
  previewWidth: number;
  previewMode: 'desktop' | 'mobile';
  compactMode: boolean;
  subject: string;
  onSubjectChange: (subject: string) => void;
  showAIAnalytics: boolean;
}

export const EmailBlockCanvas = React.forwardRef<EmailBlockCanvasRef, EmailBlockCanvasProps>(
  (props, ref) => {
    const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);
    const [lastGeneratedHTML, setLastGeneratedHTML] = useState<string>('');

    const { success, error } = useNotification();

    const canvasRef = useRef<HTMLDivElement>(null);

    const generateEmailHTML = useCallback(async () => {
      if (emailBlocks.length === 0) {
        const emptyHTML = `
<mjml>
  <mj-head>
    <mj-title>${props.subject || 'Email Preview'}</mj-title>
    <mj-attributes>
      <mj-all font-family="system-ui, -apple-system, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h2>Welcome to your email builder!</h2>
          <p>Drag any of the 11 layouts below to get started, then drag text blocks into the columns and click to edit with the rich text editor.</p>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
        
        try {
          const result = await MJMLService.compile(emptyHTML);
          if (result.html) {
            console.log('EmailBlockCanvas: Generated empty email HTML');
            return result.html;
          }
        } catch (error) {
          console.error('EmailBlockCanvas: Error generating empty HTML:', error);
        }
        
        return '<div style="padding: 20px; font-family: system-ui;"><h2>Welcome to your email builder!</h2><p>Drag any of the 11 layouts below to get started, then drag text blocks into the columns and click to edit with the rich text editor.</p></div>';
      }

      let mjmlContent = `
<mjml>
  <mj-head>
    <mj-title>${props.subject || 'Email Preview'}</mj-title>
    <mj-attributes>
      <mj-all font-family="system-ui, -apple-system, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body>
`;

      for (const block of emailBlocks) {
        if (block.type === 'text') {
          mjmlContent += `
    <mj-section>
      <mj-column>
        <mj-text>
          ${block.content.html}
        </mj-text>
      </mj-column>
    </mj-section>
`;
        } else if (block.type === 'image') {
          mjmlContent += `
    <mj-section>
      <mj-column>
        <mj-image src="${block.content.src}" alt="${block.content.alt}" />
      </mj-column>
    </mj-section>
`;
        } else if (block.type === 'button') {
          mjmlContent += `
    <mj-section>
      <mj-column>
        <mj-button href="${block.content.href}">
          ${block.content.text}
        </mj-button>
      </mj-column>
    </mj-section>
`;
        } else if (block.type === 'columns') {
          mjmlContent += `
    <mj-section>
`;
          for (const column of block.content.columns) {
            mjmlContent += `
      <mj-column width="${column.width}">
`;
            for (const innerBlock of column.blocks) {
              if (innerBlock.type === 'text') {
                mjmlContent += `
        <mj-text>
          ${innerBlock.content.html}
        </mj-text>
`;
              } else if (innerBlock.type === 'image') {
                mjmlContent += `
        <mj-image src="${innerBlock.content.src}" alt="${innerBlock.content.alt}" />
`;
              } else if (innerBlock.type === 'button') {
                mjmlContent += `
        <mj-button href="${innerBlock.content.href}">
          ${innerBlock.content.text}
        </mj-button>
`;
              }
            }
            mjmlContent += `
      </mj-column>
`;
          }
          mjmlContent += `
    </mj-section>
`;
        }
      }

      mjmlContent += `
  </mj-body>
</mjml>
`;

      try {
        const result = await MJMLService.compile(mjmlContent);
        if (result.html) {
          setLastGeneratedHTML(result.html);
          props.onContentChange(result.html);
          return result.html;
        } else if (result.errors) {
          console.error('MJML rendering errors:', result.errors);
          error('MJML rendering failed. Check console for details.');
        }
      } catch (e) {
        console.error('MJML rendering error:', e);
        error('MJML rendering failed. Check console for details.');
      }

      return '<div style="padding: 20px; font-family: sans-serif;">Error rendering email</div>';
    }, [emailBlocks, props, error]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      addBlock: (block: EmailBlock) => {
        setEmailBlocks(prev => [...prev, block]);
      },
      replaceAllBlocks: (blocks: EmailBlock[]) => {
        setEmailBlocks(blocks);
      },
      getCurrentHTML: () => lastGeneratedHTML,
      optimizeImages: () => {
        console.log('Optimizing images...');
      },
      minifyHTML: () => {
        console.log('Minifying HTML...');
      },
      checkLinks: () => {
        console.log('Checking links...');
        return true;
      },
      findAndReplaceText: (search: string, replace: string) => {
        console.log('Finding and replacing text:', search, replace);
      }
    }));

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const newImageBlock: ImageBlock = {
          id: uuidv4(),
          type: 'image',
          content: {
            src: base64,
            alt: file.name,
            alignment: 'center',
            width: '100%'
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
        };

        setEmailBlocks(prev => [...prev, newImageBlock]);
      } catch (e) {
        error('Error uploading image');
      }
    }, [error]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      multiple: false
    });

    useEffect(() => {
      props.onBlocksChange(emailBlocks);
      generateEmailHTML();
    }, [emailBlocks, props, generateEmailHTML]);

    const handleBlockClick = (blockId: string) => {
      setSelectedBlockId(blockId);
      props.onBlockSelect(blockId);
    };

    const handleBlockDoubleClick = (blockId: string, blockType: string) => {
      setEditingBlockId(blockId);
    };

    const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
      e.dataTransfer.setData('text/plain', blockId);
      setCurrentDragType('block');
    };

    const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setDragOverIndex(null);
      setCurrentDragType(null);

      const droppedBlockId = e.dataTransfer.getData('text/plain');
      if (!droppedBlockId) return;

      const droppedBlock = emailBlocks.find(block => block.id === droppedBlockId);
      if (!droppedBlock) return;

      // Remove the block from its original position
      const updatedBlocks = emailBlocks.filter(block => block.id !== droppedBlockId);

      // Insert the block at the new position
      updatedBlocks.splice(targetIndex, 0, droppedBlock);

      setEmailBlocks(updatedBlocks);
    };

    const handleCanvasDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);

      const dropTarget = e.target as HTMLElement;
      const canvasElement = canvasRef.current;

      if (!canvasElement) return;

      // Find the index of the block being dragged over
      let targetIndex = -1;
      for (let i = 0; i < canvasElement.children.length; i++) {
        if (canvasElement.children[i].contains(dropTarget)) {
          targetIndex = i;
          break;
        }
      }

      // If dragging over the empty canvas, set index to 0
      if (targetIndex === -1 && canvasElement.contains(dropTarget)) {
        targetIndex = 0;
      }

      setDragOverIndex(targetIndex);

      // Determine drag type
      const data = e.dataTransfer.getData('text/plain');
      try {
        const dragData = JSON.parse(data);
        if (dragData.blockType === 'columns') {
          setCurrentDragType('layout');
        } else {
          setCurrentDragType('block');
        }
      } catch (e) {
        if (data.startsWith('block')) {
          setCurrentDragType('reorder');
        } else {
          setCurrentDragType('block');
        }
      }
    };

    const handleCanvasDragLeave = () => {
      setIsDraggingOver(false);
      setDragOverIndex(null);
      setCurrentDragType(null);
    };

    const handleCanvasDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setDragOverIndex(null);
      setCurrentDragType(null);

      const data = e.dataTransfer.getData('text/plain');
      try {
        const dragData = JSON.parse(data);
        if (dragData.blockType === 'columns') {
          const { columnCount, columnRatio } = dragData.layoutData;

          const newLayoutBlock: ColumnsBlock = {
            id: uuidv4(),
            type: 'columns',
            content: {
              columnCount: columnCount,
              columnRatio: columnRatio,
              columns: Array.from({ length: columnCount }, (_, i) => ({
                id: uuidv4(),
                blocks: [],
                width: `${100 / columnCount}%`
              })),
              gap: '16px'
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
          };

          setEmailBlocks(prev => {
            const newBlocks = [...prev];
            if (dragOverIndex !== null && dragOverIndex >= 0 && dragOverIndex <= newBlocks.length) {
              newBlocks.splice(dragOverIndex, 0, newLayoutBlock);
            } else {
              newBlocks.push(newLayoutBlock);
            }
            return newBlocks;
          });
        }
      } catch (e) {
        console.warn('Not a layout block drop');
      }
    };

    return (
      <div
        className="email-canvas relative bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden"
        style={{
          width: '100%',
          maxWidth: `${props.previewWidth}px`,
          minHeight: '400px'
        }}
        data-testid="email-canvas"
        {...getRootProps()}
        onDragOver={handleCanvasDragOver}
        onDragLeave={handleCanvasDragLeave}
        onDrop={handleCanvasDrop}
        onClick={() => {
          setSelectedBlockId(null);
          props.onBlockSelect(null);
        }}
        ref={canvasRef}
      >
        <input {...getInputProps()} />
        <CanvasRenderer
          blocks={emailBlocks}
          selectedBlockId={selectedBlockId}
          editingBlockId={editingBlockId}
          isDraggingOver={isDraggingOver}
          dragOverIndex={dragOverIndex}
          currentDragType={currentDragType}
          onBlockClick={handleBlockClick}
          onBlockDoubleClick={handleBlockDoubleClick}
          onBlockDragStart={handleBlockDragStart}
          onBlockDrop={handleBlockDrop}
          onDeleteBlock={(blockId: string) => {
            setEmailBlocks(prev => prev.filter(block => block.id !== blockId));
            setSelectedBlockId(null);
            props.onBlockSelect(null);
          }}
          onDuplicateBlock={(blockId: string) => {
            const blockToDuplicate = emailBlocks.find(block => block.id === blockId);
            if (!blockToDuplicate) return;

            const duplicatedBlock = {
              ...blockToDuplicate,
              id: uuidv4()
            };

            setEmailBlocks(prev => [...prev, duplicatedBlock]);
          }}
          onSaveAsSnippet={async (blockId: string) => {
            const blockToStar = emailBlocks.find(block => block.id === blockId);
            if (!blockToStar) return;

            setEmailBlocks(prev => prev.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  isStarred: true
                };
              }
              return block;
            }));

            success('Block saved as snippet');
          }}
          onUnstarBlock={async (blockId: string) => {
            setEmailBlocks(prev => prev.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  isStarred: false
                };
              }
              return block;
            }));
          }}
          onTipTapChange={(blockId: string, html: string) => {
            setEmailBlocks(prev => prev.map(block => {
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
          }}
          onTipTapBlur={() => {
            setEditingBlockId(null);
          }}
          onColumnDrop={(e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
            e.preventDefault();

            const droppedBlockId = e.dataTransfer.getData('text/plain');
            if (!droppedBlockId) return;

            const droppedBlock = emailBlocks.find(block => block.id === droppedBlockId);
            if (!droppedBlock) return;

            // Remove the block from its original position
            const updatedBlocks = emailBlocks.filter(block => block.id !== droppedBlockId);

            // Find the layout block and update its column
            const updatedLayoutBlocks = updatedBlocks.map(block => {
              if (block.id === layoutBlockId && block.type === 'columns') {
                const updatedColumns = block.content.columns.map((column, index) => {
                  if (index === columnIndex) {
                    return {
                      ...column,
                      blocks: [...column.blocks, droppedBlock]
                    };
                  }
                  return column;
                });

                return {
                  ...block,
                  content: {
                    ...block.content,
                    columns: updatedColumns
                  }
                };
              }
              return block;
            });

            setEmailBlocks(updatedLayoutBlocks);
          }}
          onBlockEditStart={(blockId: string) => {
            setEditingBlockId(blockId);
          }}
          onBlockEditEnd={() => {
            setEditingBlockId(null);
          }}
          onBlockUpdate={(block: EmailBlock) => {
            setEmailBlocks(prev =>
              prev.map(b => b.id === block.id ? block : b)
            );
          }}
        />
        {isDragActive && (
          <div className="absolute inset-0 bg-gray-100 opacity-50 flex items-center justify-center text-gray-500">
            Drop files here
          </div>
        )}
      </div>
    );
  }
);

EmailBlockCanvas.displayName = 'EmailBlockCanvas';
