
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { emailAIService } from '@/services/EmailAIService';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  analysis?: string;
}

interface ImageUploaderProps {
  onImagesChange?: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesChange,
  maxImages = 5
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = [];
    
    for (const file of acceptedFiles.slice(0, maxImages - images.length)) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);
      
      const uploadedImage: UploadedImage = {
        id,
        file,
        url,
      };
      
      newImages.push(uploadedImage);
      
      // Analyze image with AI
      setAnalyzing(id);
      try {
        const analysis = await emailAIService.analyzeImage(url);
        uploadedImage.analysis = analysis;
      } catch (error) {
        console.error('Failed to analyze image:', error);
        uploadedImage.analysis = 'Image analysis unavailable';
      } finally {
        setAnalyzing(null);
      }
    }
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  }, [images, maxImages, onImagesChange]);

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url);
        return false;
      }
      return true;
    });
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxImages,
  });

  return (
    <div className="space-y-4">
      <Card 
        {...getRootProps()} 
        className={`p-6 border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images or click to select'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {images.length}/{maxImages} images uploaded
          </p>
        </div>
      </Card>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image) => (
            <Card key={image.id} className="p-3">
              <div className="relative">
                <img 
                  src={image.url} 
                  alt="Uploaded" 
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 w-6 h-6 p-0"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-600">
                {analyzing === image.id ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing...
                  </div>
                ) : image.analysis ? (
                  <p className="line-clamp-2">{image.analysis}</p>
                ) : (
                  <p className="text-gray-400">Analysis pending</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
