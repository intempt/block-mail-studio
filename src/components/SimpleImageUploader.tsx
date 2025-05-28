
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';

interface SimpleImageUploaderProps {
  onUploadStart?: () => void;
  onUploadSuccess: (uploadedUrl: string) => void;
  onUploadError: (error: any) => void;
  maxSize?: number;
  accept?: string;
}

export const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({ 
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/jpeg,image/png,image/jpg"
}) => {
  const [isUploading, setIsUploading] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    if (file.size > maxSize) {
      onUploadError(new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`));
      return;
    }

    setIsUploading(true);
    onUploadStart?.();

    try {
      // Convert file to data URL for immediate use
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUploadSuccess(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        onUploadError(new Error('Failed to read file'));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      onUploadError(error);
      setIsUploading(false);
    }
  }, [maxSize, onUploadStart, onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': accept.split(',')
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`p-6 border-2 border-dashed cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isUploading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
        ) : (
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        )}
        <p className="text-sm text-gray-600">
          {isUploading 
            ? 'Uploading...' 
            : isDragActive 
              ? 'Drop image here...' 
              : 'Drag & drop an image or click to select'
          }
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max size: {maxSize / 1024 / 1024}MB
        </p>
      </div>
    </Card>
  );
};
