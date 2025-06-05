
import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Wand2,
  RefreshCw,
  Copy,
  LayoutDashboard
} from 'lucide-react';
import { EmailContext } from '@/services/tiptapAIService';
import { tiptapAIService } from '@/services/tiptapAIService';
import { UniversalTipTapEditor } from './UniversalTipTapEditor';
import { SimpleImageUploader } from './SimpleImageUploader';

interface EmailBlock {
  id: string;
  type: string;
  content: string;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleContentChange = (html: string) => {
    const updatedBlock: EmailBlock = {
      ...block,
      content: html
    };
    onBlockChange?.(updatedBlock);
    onUpdate?.(updatedBlock);
  };

  const handleGenerateContent = async () => {
    if (!editor) return;

    setIsGenerating(true);
    try {
      const prompt = `Generate content for a ${block.type} block.`;
      const result = await tiptapAIService.generateContent({ prompt });
      
      if (result.success && result.data) {
        handleContentChange(result.data);
      } else {
        console.error('Failed to generate content:', result.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <div className={`enhanced-text-block relative group ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      {/* Clean block content - Professional text editor */}
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
            content={block.content}
            contentType={contentType}
            onChange={handleContentChange}
            emailContext={emailContext}
            onBlur={onEditEnd}
            placeholder="Click to edit..."
          />
        )}
      </div>

      {/* Minimal hover controls only when selected */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="bg-white/90 shadow-sm hover:bg-white"
          >
            {isGenerating ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
