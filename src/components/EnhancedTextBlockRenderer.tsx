
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

  const handleProAIGenerate = async (action: 'generate' | 'improve' | 'professional' | 'casual' | 'concise') => {
    if (!editor) return;

    setIsGenerating(true);
    try {
      let result;
      
      switch (action) {
        case 'generate':
          result = await TipTapProService.generateContent(
            `Generate content for a ${block.type} block`,
            'professional'
          );
          break;
        case 'improve':
          result = await TipTapProService.improveText(block.content, {
            style: 'professional',
            goal: 'clarity'
          });
          break;
        case 'professional':
          result = await TipTapProService.refineEmail(
            block.content,
            'Make this content more professional and business-appropriate'
          );
          break;
        case 'casual':
          result = await TipTapProService.refineEmail(
            block.content,
            'Make this content more casual and conversational'
          );
          break;
        case 'concise':
          result = await TipTapProService.refineEmail(
            block.content,
            'Make this content more concise and impactful'
          );
          break;
      }
      
      if (result?.success && result.data) {
        handleContentChange(result.data);
      } else {
        console.error('TipTap Pro AI action failed:', result?.error);
      }
    } catch (error) {
      console.error('Error with TipTap Pro AI:', error);
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
            content={block.content}
            contentType={contentType}
            onChange={handleContentChange}
            emailContext={emailContext}
            onBlur={onEditEnd}
            placeholder="Click to edit..."
          />
        )}
      </div>

      {/* Enhanced TipTap Pro AI controls when selected */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            {/* TipTap Pro AI Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded text-xs">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span className="font-medium text-purple-700">Pro AI</span>
            </div>

            {/* AI Action Buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleProAIGenerate('generate')}
              disabled={isGenerating}
              className="h-7 w-7 p-0 hover:bg-purple-50"
              title="Generate with TipTap Pro AI"
            >
              {isGenerating ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3 text-purple-600" />
              )}
            </Button>

            {block.content && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleProAIGenerate('improve')}
                  disabled={isGenerating}
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  title="Improve with AI"
                >
                  <Target className="w-3 h-3 text-blue-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleProAIGenerate('professional')}
                  disabled={isGenerating}
                  className="h-7 w-7 p-0 hover:bg-green-50"
                  title="Make Professional"
                >
                  <Type className="w-3 h-3 text-green-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleProAIGenerate('concise')}
                  disabled={isGenerating}
                  className="h-7 w-7 p-0 hover:bg-orange-50"
                  title="Make Concise"
                >
                  <TrendingUp className="w-3 h-3 text-orange-600" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
