
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
  content: any;
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
      content: typeof block.content === 'object' ? { ...block.content, html } : html
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

  // Prepare content with blockId for the editor
  const editorContent = typeof block.content === 'object' 
    ? { ...block.content, blockId: block.id }
    : block.content;

  return (
    <div className={`enhanced-text-block relative group ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      {/* Clean block content - Professional text editor with TipTap Pro */}
      <div className="min-h-[60px]">
        {block.type === 'image' ? (
          <>
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
              <img src={imageUploadUrl} alt="Uploaded" className="w-full h-auto" />
            )}
          </>
        ) : (
          <UniversalTipTapEditor
            content={editorContent}
            contentType={contentType}
            onChange={handleContentChange}
            emailContext={emailContext}
            onBlur={onEditEnd}
            placeholder="Click to edit..."
          />
        )}
      </div>

      {/* Simplified AI controls when selected */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <AIDropdownMenu
              selectedText=""
              fullContent={typeof block.content === 'object' ? block.content.html || '' : block.content || ''}
              onContentUpdate={handleContentChange}
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
