
import React from 'react';

interface StatusBarProps {
  blockCount: number;
  emailSize: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ blockCount, emailSize }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-gray-50 px-6 py-2 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-4">
        <span>{blockCount} blocks</span>
        <span>Size: {formatFileSize(emailSize)}</span>
      </div>
      <div>
        Ready
      </div>
    </div>
  );
};
