import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, SpacerBlock, DividerBlock } from '@/types/emailBlocks';

interface ContextualEditorProps {
  block: EmailBlock;
  onBlockUpdate: (block: EmailBlock) => void;
  onClose: () => void;
  onDelete: () => void;
}

export const ContextualEditor: React.FC<ContextualEditorProps> = ({ 
  block, 
  onBlockUpdate, 
  onClose,
  onDelete
}) => {
  const [textContent, setTextContent] = useState(
    block.type === 'text' ? (block as TextBlock).content.html || '' : ''
  );

  const isTextBlock = block.type === 'text';

  const handleTextChange = (value: string) => {
    setTextContent(value);
    if (isTextBlock) {
      const updatedBlock = {
        ...block,
        content: {
          ...(block as TextBlock).content,
          html: value
        }
      };
      onBlockUpdate(updatedBlock);
    }
  };

  const applyTextStyle = (style: string) => {
    const textarea = document.querySelector(`#text-content-${block.id}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textContent.substring(start, end);
    
    if (selectedText) {
      let styledText = '';
      switch (style) {
        case 'bold':
          styledText = `<strong>${selectedText}</strong>`;
          break;
        case 'italic':
          styledText = `<em>${selectedText}</em>`;
          break;
        case 'underline':
          styledText = `<u>${selectedText}</u>`;
          break;
        default:
          styledText = selectedText;
      }
      
      const newText = textContent.substring(0, start) + styledText + textContent.substring(end);
      handleTextChange(newText);
    }
  };

  const renderTextEditor = () => (
    <div className="space-y-4">
      {/* Simple Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 rounded border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyTextStyle('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyTextStyle('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyTextStyle('underline')}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      {/* Text Content Editor */}
      <div>
        <Label htmlFor={`text-content-${block.id}`}>Content</Label>
        <Textarea
          id={`text-content-${block.id}`}
          value={textContent}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your text content..."
          className="min-h-24 mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting</p>
      </div>
    </div>
  );

  const renderImageEditor = () => {
    const imageBlock = block as ImageBlock;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="image-src">Image URL</Label>
          <Input
            id="image-src"
            value={imageBlock.content.src}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, src: e.target.value }
            })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="image-alt">Alt Text</Label>
          <Input
            id="image-alt"
            value={imageBlock.content.alt}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, alt: e.target.value }
            })}
            placeholder="Describe the image"
          />
        </div>
        <div>
          <Label htmlFor="image-link">Link URL (optional)</Label>
          <Input
            id="image-link"
            value={imageBlock.content.link || ''}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, link: e.target.value }
            })}
            placeholder="https://example.com"
          />
        </div>
      </div>
    );
  };

  const renderButtonEditor = () => {
    const buttonBlock = block as ButtonBlock;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={buttonBlock.content.text}
            onChange={(e) => onBlockUpdate({
              ...buttonBlock,
              content: { ...buttonBlock.content, text: e.target.value }
            })}
            placeholder="Click Here"
          />
        </div>
        <div>
          <Label htmlFor="button-link">Button Link</Label>
          <Input
            id="button-link"
            value={buttonBlock.content.link}
            onChange={(e) => onBlockUpdate({
              ...buttonBlock,
              content: { ...buttonBlock.content, link: e.target.value }
            })}
            placeholder="https://example.com"
          />
        </div>
      </div>
    );
  };

  const renderStylingControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Styling</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="bg-color">Background</Label>
          <Input
            id="bg-color"
            type="color"
            value={block.styling.desktop.backgroundColor || '#ffffff'}
            onChange={(e) => onBlockUpdate({
              ...block,
              styling: {
                ...block.styling,
                desktop: {
                  ...block.styling.desktop,
                  backgroundColor: e.target.value
                }
              }
            })}
          />
        </div>
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={block.styling.desktop.padding || '16px'}
            onChange={(e) => onBlockUpdate({
              ...block,
              styling: {
                ...block.styling,
                desktop: {
                  ...block.styling.desktop,
                  padding: e.target.value
                }
              }
            })}
            placeholder="16px"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-80 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit {block.type} Block</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Content Editor */}
        <div>
          <h4 className="text-sm font-medium mb-3">Content</h4>
          {block.type === 'text' && renderTextEditor()}
          {block.type === 'image' && renderImageEditor()}
          {block.type === 'button' && renderButtonEditor()}
          {block.type === 'spacer' && (
            <div>
              <Label htmlFor="spacer-height">Height</Label>
              <Input
                id="spacer-height"
                value={(block as SpacerBlock).content.height || '40px'}
                onChange={(e) => onBlockUpdate({
                  ...block,
                  content: { 
                    height: e.target.value,
                    mobileHeight: (block as SpacerBlock).content.mobileHeight || '20px'
                  }
                })}
                placeholder="40px"
              />
              <Label htmlFor="spacer-mobile-height" className="mt-3 block">Mobile Height</Label>
              <Input
                id="spacer-mobile-height"
                value={(block as SpacerBlock).content.mobileHeight || '20px'}
                onChange={(e) => onBlockUpdate({
                  ...block,
                  content: { 
                    ...(block as SpacerBlock).content,
                    mobileHeight: e.target.value
                  }
                })}
                placeholder="20px"
              />
            </div>
          )}
          {block.type === 'divider' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="divider-thickness">Thickness</Label>
                <Input
                  id="divider-thickness"
                  value={(block as DividerBlock).content.thickness || '1px'}
                  onChange={(e) => onBlockUpdate({
                    ...block,
                    content: { ...(block as DividerBlock).content, thickness: e.target.value }
                  })}
                  placeholder="1px"
                />
              </div>
              <div>
                <Label htmlFor="divider-color">Color</Label>
                <Input
                  id="divider-color"
                  type="color"
                  value={(block as DividerBlock).content.color || '#e0e0e0'}
                  onChange={(e) => onBlockUpdate({
                    ...block,
                    content: { ...(block as DividerBlock).content, color: e.target.value }
                  })}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Styling Controls */}
        {renderStylingControls()}
      </div>
    </Card>
  );
};
