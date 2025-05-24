
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
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video';
    property: string;
    position?: { x: number; y: number };
  } | null>(null);

  const handleContentClick = (
    e: React.MouseEvent,
    blockId: string,
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video',
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

  const getContentForProperty = (block: SimpleBlock, property: string): string => {
    const parts = property.split('-');
    if (parts[0] === 'platform' && parts.length === 2) {
      const index = parseInt(parts[1]);
      return block.content.platforms?.[index]?.name || '';
    }
    if (parts[0] === 'platformUrl' && parts.length === 2) {
      const index = parseInt(parts[1]);
      return block.content.platforms?.[index]?.url || '';
    }
    if (parts[0] === 'platformIcon' && parts.length === 2) {
      const index = parseInt(parts[1]);
      return block.content.platforms?.[index]?.icon || '';
    }
    if (parts[0] === 'cell' && parts.length === 3) {
      const row = parseInt(parts[1]);
      const col = parseInt(parts[2]);
      return block.content.cells?.[row]?.[col]?.content || '';
    }
    
    switch (property) {
      case 'text': return block.content.text || '';
      case 'alt': return block.content.alt || '';
      case 'src': return block.content.src || '';
      case 'link': return block.content.link || '';
      case 'html': return block.content.html || '';
      case 'videoUrl': return block.content.videoUrl || '';
      case 'thumbnail': return block.content.thumbnail || '';
      default: return '';
    }
  };

  const renderEditableContent = (
    block: SimpleBlock, 
    content: string, 
    contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video', 
    property: string,
    placeholder?: string
  ) => {
    const isEditing = editingContent?.blockId === block.id && editingContent?.property === property;
    
    if (isEditing) {
      return (
        <UniversalTipTapEditor
          content={getContentForProperty(block, property)}
          contentType={contentType}
          onChange={handleUniversalEditorChange}
          onBlur={handleUniversalEditorBlur}
          position={editingContent.position}
          placeholder={placeholder}
        />
      );
    }

    const isEmpty = !content || content.trim() === '';
    const displayContent = isEmpty ? 
      `<span style="color: #999; font-style: italic;">${placeholder || 'Click to edit...'}</span>` : 
      content;

    return (
      <div
        onClick={(e) => handleContentClick(e, block.id, contentType, property)}
        className="cursor-text hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 transition-all rounded p-1 -m-1"
        dangerouslySetInnerHTML={{ __html: displayContent }}
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
            {renderEditableContent(block, block.content.text, 'text', 'text', 'Enter your text...')}
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
                display: 'inline-block',
                position: 'relative'
              }}
              onClick={(e) => e.preventDefault()}
            >
              {renderEditableContent(block, block.content.text, 'button', 'text', 'Button text')}
              <div 
                className="absolute -top-1 -right-1 opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => handleContentClick(e, block.id, 'url', 'link')}
                title="Edit button URL"
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer">
                  🔗
                </div>
              </div>
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
                contentType="url"
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
                onClick={(e) => handleContentClick(e, block.id, 'url', 'src')}
                className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
              />
            )}
            <div className="mt-2">
              {renderEditableContent(block, block.content.alt, 'text', 'alt', 'Image description...')}
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
              <div 
                className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                onClick={(e) => handleContentClick(e, block.id, 'url', 'thumbnail')}
              >
                {renderEditableContent(block, block.content.thumbnail, 'url', 'thumbnail', 'Video thumbnail URL...')}
              </div>
            </div>
            <p style={{ marginTop: '10px' }}>
              <span 
                className="cursor-pointer hover:underline text-blue-600"
                onClick={(e) => handleContentClick(e, block.id, 'video', 'videoUrl')}
              >
                {renderEditableContent(block, block.content.videoUrl || 'Watch Video', 'video', 'videoUrl', 'Video URL...')}
              </span>
            </p>
          </div>
        );

      case 'social':
        return (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            {block.content.platforms?.map((platform: any, index: number) => (
              <div key={index} className="inline-block m-2 p-2 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all rounded"
                    onClick={(e) => handleContentClick(e, block.id, 'url', `platformIcon-${index}`)}
                  >
                    <img 
                      src={platform.icon || 'https://via.placeholder.com/32x32?text=S'} 
                      alt={platform.name}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="text-sm">
                    {renderEditableContent(block, platform.name, 'text', `platform-${index}`, 'Platform name')}
                  </div>
                  <div 
                    className="text-xs text-blue-600 cursor-pointer hover:underline"
                    onClick={(e) => handleContentClick(e, block.id, 'url', `platformUrl-${index}`)}
                  >
                    {renderEditableContent(block, platform.url, 'url', `platformUrl-${index}`, 'Platform URL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'html':
        return renderEditableContent(block, block.content.html, 'html', 'html', 'Enter HTML...');

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
                        block.content.cells?.[i]?.[j]?.content || '',
                        'text',
                        `cell-${i}-${j}`,
                        `Cell ${i + 1},${j + 1}`
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
