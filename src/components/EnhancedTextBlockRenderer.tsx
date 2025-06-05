
import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wand2,
  RefreshCw,
  Copy,
  Eye,
  Code,
  Brush,
  LayoutDashboard,
  FileText,
  Image,
  Link,
  Video,
  ListOrdered,
  Quote,
  SeparatorHorizontal,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
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
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  editor,
  emailContext: emailContextProp,
  onBlockChange,
  onBlockRemove,
  onBlockDuplicate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleContentChange = (html: string) => {
    const updatedBlock: EmailBlock = {
      ...block,
      content: html
    };
    onBlockChange?.(updatedBlock);
  };

  const handleGenerateContent = async () => {
    if (!editor) return;

    setIsGenerating(true);
    try {
      const prompt = `Generate content for a ${block.type} block.`;
      const result = await tiptapAIService.generateContent({ prompt });
      
      if (result.success && result.data) {
        setGeneratedContent(result.data);
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

  const handleDuplicateBlock = () => {
    onBlockDuplicate?.(block);
  };

  const handleRemoveBlock = () => {
    onBlockRemove?.(block.id);
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const handleBlockTypeChange = (newType: string) => {
    const updatedBlock: EmailBlock = {
      ...block,
      type: newType
    };
    onBlockChange?.(updatedBlock);
  };

  const renderBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'heading1': return <Heading1 className="w-4 h-4" />;
      case 'heading2': return <Heading2 className="w-4 h-4" />;
      case 'heading3': return <Heading3 className="w-4 h-4" />;
      case 'heading4': return <Heading4 className="w-4 h-4" />;
      case 'heading5': return <Heading5 className="w-4 h-4" />;
      case 'heading6': return <Heading6 className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'button': return <Brush className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'list-ordered': return <ListOrdered className="w-4 h-4" />;
      case 'list-unordered': return <ListOrdered className="w-4 h-4" />;
      case 'quote': return <Quote className="w-4 h-4" />;
      case 'divider': return <SeparatorHorizontal className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderBlockTypeLabel = (type: string) => {
    switch (type) {
      case 'heading1': return 'Heading 1';
      case 'heading2': return 'Heading 2';
      case 'heading3': return 'Heading 3';
      case 'heading4': return 'Heading 4';
      case 'heading5': return 'Heading 5';
      case 'heading6': return 'Heading 6';
      case 'text': return 'Text Block';
      case 'image': return 'Image Block';
      case 'button': return 'Button Block';
      case 'link': return 'Link Block';
      case 'video': return 'Video Block';
      case 'list-ordered': return 'Ordered List';
      case 'list-unordered': return 'Unordered List';
      case 'quote': return 'Quote Block';
      case 'divider': return 'Divider';
      default: return 'Text Block';
    }
  };

  let contentType: 'text' | 'button' | 'image' | 'link' | 'video' | 'html' | 'url' = 'text';
  if (block.type === 'button') contentType = 'button';
  if (block.type === 'image') contentType = 'image';
  if (block.type === 'link') contentType = 'link';
  if (block.type === 'video') contentType = 'video';

  // Create email context for AI operations
  const aiEmailContext: EmailContext = {
    blockType: 'text',
    emailHTML: emailContextProp,
    targetAudience: 'general'
  };

  return (
    <Card className="relative mb-4">
      {/* Block Content */}
      <div className="p-4">
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
            emailContext={aiEmailContext}
          />
        )}
      </div>

      {/* Block Actions */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleActions}
          className="hover:bg-gray-100 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
        </Button>
      </div>

      {showActions && (
        <div className="absolute top-8 right-2 bg-white border rounded shadow-md z-20 w-48">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full justify-start text-sm hover:bg-gray-100 transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3 mr-2" />
                Generate Content
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicateBlock}
            className="w-full justify-start text-sm hover:bg-gray-100 transition-colors"
          >
            <Copy className="w-3 h-3 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveBlock}
            className="w-full justify-start text-sm hover:bg-gray-100 transition-colors"
          >
            <Code className="w-3 h-3 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </Card>
  );
};
