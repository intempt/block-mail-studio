
import React, { useState } from 'react';
import { UniversalTipTapEditor } from '../UniversalTipTapEditor';
import { BlockControls } from './BlockControls';
import { ColumnRenderer } from './ColumnRenderer';

interface SimpleBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

interface CanvasRendererProps {
  blocks: SimpleBlock[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
  isDraggingOver: boolean;
  dragOverIndex: number | null;
  onBlockClick: (blockId: string) => void;
  onBlockDoubleClick: (blockId: string, blockType: string) => void;
  onBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  onBlockDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onTipTapChange: (blockId: string, html: string) => void;
  onTipTapBlur: () => void;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  blocks,
  selectedBlockId,
  editingBlockId,
  isDraggingOver,
  dragOverIndex,
  onBlockClick,
  onBlockDoubleClick,
  onBlockDragStart,
  onBlockDrop,
  onDeleteBlock,
  onDuplicateBlock,
  onTipTapChange,
  onTipTapBlur,
  onColumnDrop
}) => {
  const [editingContent, setEditingContent] = useState<{
    blockId: string;
    contentType: 'text' | 'button' | 'image' | 'link' | 'html';
    property: string;
    position?: { x: number; y: number };
  } | null>(null);

  const handleContentClick = (
    e: React.MouseEvent,
    blockId: string,
    contentType: 'text' | 'button' | 'image' | 'link' | 'html',
    property: string
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setEditingContent({
      blockId,
      contentType,
      property,
      position: { x: rect.left, y: rect.top - 80 }
    });
  };

  const handleUniversalEditorChange = (html: string) => {
    if (editingContent) {
      onTipTapChange(editingContent.blockId, html);
    }
  };

  const handleUniversalEditorBlur = () => {
    setEditingContent(null);
    onTipTapBlur();
  };

  const renderEditableContent = (block: SimpleBlock, content: string, contentType: 'text' | 'button' | 'image' | 'link' | 'html', property: string) => {
    const isEditing = editingContent?.blockId === block.id && editingContent?.property === property;
    
    if (isEditing) {
      return (
        <UniversalTipTapEditor
          content={content}
          contentType={contentType}
          onChange={handleUniversalEditorChange}
          onBlur={handleUniversalEditorBlur}
          position={editingContent.position}
        />
      );
    }

    return (
      <div
        onClick={(e) => handleContentClick(e, block.id, contentType, property)}
        className="cursor-text hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 transition-all rounded p-1 -m-1"
        dangerouslySetInnerHTML={{ __html: content || `<span style="color: #999; font-style: italic;">Click to edit...</span>` }}
      />
    );
  };

  const renderBlock = (block: SimpleBlock): React.ReactNode => {
    if (block.type === 'columns') {
      return (
        <ColumnRenderer
          block={block}
          onColumnDrop={onColumnDrop}
          renderBlock={renderBlock}
        />
      );
    }

    switch (block.type) {
      case 'text':
        return (
          <div className="min-h-[20px]">
            {renderEditableContent(block, block.content.text, 'text', 'text')}
          </div>
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
              {renderEditableContent(block, block.content.text, 'button', 'text')}
            </a>
          </div>
        );
      
      case 'image':
        const isEditingImage = editingContent?.blockId === block.id && editingContent?.property === 'src';
        return (
          <div className="relative">
            {isEditingImage ? (
              <UniversalTipTapEditor
                content={block.content.src}
                contentType="image"
                onChange={handleUniversalEditorChange}
                onBlur={handleUniversalEditorBlur}
                placeholder="Enter image URL..."
                position={editingContent.position}
              />
            ) : (
              <img
                src={block.content.src}
                alt={block.content.alt}
                style={block.styles}
                onClick={(e) => handleContentClick(e, block.id, 'image', 'src')}
                className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
              />
            )}
            <div className="mt-2">
              {renderEditableContent(block, block.content.alt, 'text', 'alt')}
            </div>
          </div>
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
            <div className="relative inline-block">
              {renderEditableContent(block, block.content.thumbnail, 'image', 'thumbnail')}
            </div>
            <p style={{ marginTop: '10px' }}>
              <a href={block.content.videoUrl} style={{ color: '#3B82F6' }}>
                {renderEditableContent(block, 'Watch Video', 'link', 'videoUrl')}
              </a>
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
                {renderEditableContent(block, platform.name, 'link', `platform-${index}`)}
              </a>
            ))}
          </div>
        );

      case 'html':
        return renderEditableContent(block, block.content.html, 'html', 'html');

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
                      {renderEditableContent(
                        block, 
                        block.content.cells?.[i]?.[j]?.content || `Cell ${i + 1},${j + 1}`,
                        'text',
                        `cell-${i}-${j}`
                      )}
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
    <>
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
            onClick={() => onBlockClick(block.id)}
            onDragStart={(e) => onBlockDragStart(e, block.id)}
            onDrop={(e) => onBlockDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
            style={block.styles}
          >
            <BlockControls
              blockId={block.id}
              onDelete={onDeleteBlock}
              onDuplicate={onDuplicateBlock}
              onDragStart={onBlockDragStart}
            />
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
    </>
  );
};
