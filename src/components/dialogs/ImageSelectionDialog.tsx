import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleImageUploader } from '../SimpleImageUploader';
import { AlertTriangle } from 'lucide-react';

interface ImageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: {
    src: string;
    alt: string;
    width?: string;
    link?: string;
  }) => void;
  currentImage?: {
    src: string;
    alt: string;
    width?: string;
    link?: string;
  };
}

export const ImageSelectionDialog: React.FC<ImageSelectionDialogProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  currentImage
}) => {
  const [imageData, setImageData] = useState({
    src: currentImage?.src || '',
    alt: currentImage?.alt || '',
    width: currentImage?.width || '100%',
    link: currentImage?.link || ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = useCallback((uploadedUrl: string) => {
    setImageData(prev => ({ ...prev, src: uploadedUrl }));
    setIsUploading(false);
  }, []);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  const handleSave = () => {
    if (!imageData.src) {
      alert('Please provide an image URL or upload an image');
      return;
    }

    if (!imageData.alt) {
      alert('Alt text is required for email accessibility');
      return;
    }

    onImageSelect(imageData);
    onClose();
  };

  const getImageSizeWarning = () => {
    if (imageData.src && !imageData.src.includes('placeholder')) {
      return (
        <Alert>
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
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Image - MJML Compliant</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                value={imageData.src}
                onChange={(e) => setImageData(prev => ({ ...prev, src: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
            </div>
            {getImageSizeWarning()}
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="alt-text">Alt Text (Required for Accessibility)</Label>
            <Input
              id="alt-text"
              value={imageData.alt}
              onChange={(e) => setImageData(prev => ({ ...prev, alt: e.target.value }))}
              placeholder="Describe the image for screen readers"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="image-width">Width (MJML)</Label>
            <Input
              id="image-width"
              value={imageData.width}
              onChange={(e) => setImageData(prev => ({ ...prev, width: e.target.value }))}
              placeholder="100%, 400px, or auto"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="image-link">Link URL (Optional)</Label>
            <Input
              id="image-link"
              value={imageData.link}
              onChange={(e) => setImageData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
              className="mt-2"
            />
          </div>

          {/* Preview */}
          {imageData.src && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-2 text-center">
                <img
                  src={imageData.src}
                  alt={imageData.alt}
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                  className="mx-auto border rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isUploading || !imageData.src || !imageData.alt}
          >
            {isUploading ? 'Uploading...' : 'Add Image'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
