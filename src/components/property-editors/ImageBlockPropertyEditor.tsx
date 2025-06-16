
import React, { useState, useCallback } from 'react';
import { ImageBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleImageUploader } from '../SimpleImageUploader';
import { AlertTriangle, Upload } from 'lucide-react';

interface ImageBlockPropertyEditorProps {
  block: ImageBlock;
  onUpdate: (block: ImageBlock) => void;
}

export const ImageBlockPropertyEditor: React.FC<ImageBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const updateContent = (updates: Partial<ImageBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const handleUploadSuccess = useCallback((uploadedUrl: string) => {
    updateContent({ src: uploadedUrl });
    setIsUploading(false);
  }, []);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  const getImageSizeWarning = () => {
    if (block.content.src && !block.content.src.includes('placeholder')) {
      return (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            For best email deliverability, ensure your image is under 1MB and optimized for web.
            Recommended formats: JPG or PNG.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Image Source Section */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Image Source</Label>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <SimpleImageUploader
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  setIsUploading(false);
                }}
                maxSize={1024 * 1024} // 1MB limit for email
                accept="image/jpeg,image/png,image/jpg"
              />
            </div>
            {getImageSizeWarning()}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={block.content.src}
                onChange={(e) => updateContent({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
            </div>
            {getImageSizeWarning()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Properties */}
      <div>
        <Label htmlFor="alt-text">Alt Text (Required for Accessibility)</Label>
        <Input
          id="alt-text"
          value={block.content.alt}
          onChange={(e) => updateContent({ alt: e.target.value })}
          className="mt-2"
          placeholder="Describe the image for screen readers"
          required
        />
      </div>

      <div>
        <Label htmlFor="image-link">Link URL (Optional)</Label>
        <Input
          id="image-link"
          value={block.content.link || ''}
          onChange={(e) => updateContent({ link: e.target.value })}
          className="mt-2"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={block.content.alignment}
          onValueChange={(value) => updateContent({ alignment: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image-width">Width (MJML)</Label>
        <Input
          id="image-width"
          value={block.content.width}
          onChange={(e) => updateContent({ width: e.target.value })}
          className="mt-2"
          placeholder="100%, 400px, or auto"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="dynamic-content"
          checked={block.content.isDynamic}
          onCheckedChange={(checked) => updateContent({ isDynamic: checked })}
        />
        <Label htmlFor="dynamic-content">Use dynamic content</Label>
      </div>

      {block.content.isDynamic && (
        <div>
          <Label htmlFor="dynamic-variable">Dynamic Variable</Label>
          <Input
            id="dynamic-variable"
            value={block.content.dynamicVariable || ''}
            onChange={(e) => updateContent({ dynamicVariable: e.target.value })}
            className="mt-2"
            placeholder="{{product.image}}"
          />
        </div>
      )}

      {/* Preview Section */}
      {block.content.src && !block.content.src.includes('placeholder') && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium">Preview</Label>
          <div className="mt-2 text-center">
            <img
              src={block.content.src}
              alt={block.content.alt}
              style={{ maxWidth: '300px', maxHeight: '200px' }}
              className="mx-auto border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
