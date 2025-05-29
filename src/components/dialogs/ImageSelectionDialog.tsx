
import React from 'react';

interface ImageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: {
    src: string;
    alt: string;
    width?: string;
    link?: string;
  }) => void;
  currentImage?: any;
}

export const ImageSelectionDialog: React.FC<ImageSelectionDialogProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  currentImage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Select Image</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Alt Text</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Image description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onImageSelect({
                  src: 'https://via.placeholder.com/400x200',
                  alt: 'Sample image'
                });
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
