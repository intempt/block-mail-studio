
import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Wand2,
  RefreshCw,
  Copy,
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
  Type
} from 'lucide-react';
import { EmailContext } from '@/services/tiptapAIService';
import { tiptapAIService } from '@/services/tiptapAIService';
import { TipTapProService } from '@/services/TipTapProService';
import { UniversalTipTapEditor } from './UniversalTipTapEditor';
import { SimpleImageUploader } from './SimpleImageUploader';
import { AIDropdownMenu } from './AIDropdownMenu';

interface EmailBlock {
  id: string;
  type: string;
  content: string | { html: string; textStyle?: string };
}

interface EnhancedTextBlockRendererProps {
  block: EmailBlock;
  editor: Editor | null;
  emailContext?: string;
  onBlockChange?: (block: EmailBlock) => void;
  onBlockRemove?: (id: string) => void;
  onBlockDuplicate?: (block: EmailBlock) => void;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (block: EmailBlock) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onInsertVariable?: () => void;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  editor,
  emailContext: emailContextProp,
  onBlockChange,
  onBlockRemove,
  onBlockDuplicate,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd,
  onInsertVariable
}) => {
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleContentChange = (html: string) => {
    const updatedBlock: EmailBlock = {
      ...block,
      content: typeof block.content === 'string' ? html : { 
        html, 
        textStyle: (block.content as any)?.textStyle || 'normal' 
      }
    };
    onBlockChange?.(updatedBlock);
    onUpdate?.(updatedBlock);
  };

  const handleImageUploadStart = () => {
    setIsUploadingImage(true);
  };

  const handleImageUploadSuccess = (url: string) => {
    setImageUploadUrl(url);
    setIsUploadingImage(false);
    handleContentChange(`<img src="${url}" alt="Uploaded Image" />`);
  };

  const handleImageUploadError = (error: any) => {
    console.error('Image upload failed:', error);
    setIsUploadingImage(false);
  };

  // Extract content for the editor
  const getContentForEditor = () => {
    if (typeof block.content === 'string') {
      return block.content;
    }
    if (block.content && typeof block.content === 'object' && 'html' in block.content) {
      return block.content.html;
    }
    return '<p>Click to edit...</p>';
  };

  let contentType: 'text' | 'button' | 'image' | 'link' | 'video' | 'html' | 'url' = 'text';
  if (block.type === 'button') contentType = 'button';
  if (block.type === 'image') contentType = 'image';
  if (block.type === 'link') contentType = 'link';
  if (block.type === 'video') contentType = 'video';

  // Create proper email context object for AI operations
  const emailContext: EmailContext = {
    blockType: contentType,
    emailHTML: emailContextProp || '',
    targetAudience: 'general'
  };

  return (
    <div className={`enhanced-text-block relative group border rounded-lg transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 border-blue-300' : 'border-gray-200 hover:border-gray-300'}`}>
      {/* Main content area */}
      <div className="min-h-[60px] relative">
        {block.type === 'image' ? (
          <div className="p-4">
            {isUploadingImage ? (
              <div className="text-center py-6">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Uploading image...</p>
              </div>
            ) : (
              <SimpleImageUploader
                onUploadStart={handleImageUploadStart}
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={handleImageUploadError}
              />
            )}
            {imageUploadUrl && (
              <img src={imageUploadUrl} alt="Uploaded" className="w-full h-auto mt-4" />
            )}
          </div>
        ) : (
          <div className="relative">
            <UniversalTipTapEditor
              content={getContentForEditor()}
              contentType={contentType}
              onChange={handleContentChange}
              emailContext={emailContext}
              onBlur={onEditEnd}
              placeholder="Click to edit..."
              blockId={block.id}
            />
          </div>
        )}
      </div>

      {/* AI controls - Always visible when block is selected */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <AIDropdownMenu
              selectedText=""
              fullContent={getContentForEditor()}
              onContentUpdate={handleContentChange}
              size="sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-600 hover:text-blue-600"
              title="AI Assistant"
            >
              <Sparkles className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            <Type className="w-3 h-3 inline mr-1" />
            Editing
          </div>
        </div>
      )}
    </div>
  );
};
