
import React, { useState } from 'react';
import { TextBlock } from '@/types/emailBlocks';
import { SimpleTipTapEditor } from './SimpleTipTapEditor';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';

interface EnhancedTextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (block: TextBlock) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
  globalStyles?: any;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd,
  globalStyles
}) => {
  const [text, setText] = useState(block.content.html || '');

  const handleContentChange = (html: string) => {
    setText(html);
  };

  const handleSave = () => {
    const updatedBlock: TextBlock = {
      ...block,
      content: {
        ...block.content,
        html: text,
      },
    };
    onUpdate(updatedBlock);
    onEditEnd();
  };

  const handleCancel = () => {
    setText(block.content.html || '');
    onEditEnd();
  };

  if (isEditing) {
    return (
      <div className="enhanced-text-block-editing border-2 border-blue-400 rounded-lg p-1">
        <SimpleTipTapEditor
          content={block.content.html || ''}
          onChange={handleContentChange}
          onBlur={handleSave}
        />
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 px-2 text-xs">
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  const styling = block.styling.desktop;

  return (
    <div
      className={`text-block-renderer ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        borderRadius: styling.borderRadius,
        border: styling.border,
        color: styling.textColor,
        fontSize: styling.fontSize,
        fontWeight: styling.fontWeight,
        ...globalStyles
      }}
      onClick={onEditStart}
    >
      {block.content.html ? (
        <div
          dangerouslySetInnerHTML={{ __html: block.content.html }}
          className="prose prose-sm max-w-none"
        />
      ) : (
        <p className="text-gray-400 italic">
          {block.content.placeholder || 'Click to add text...'}
        </p>
      )}
    </div>
  );
};
