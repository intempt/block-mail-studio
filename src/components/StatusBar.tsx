
import React from 'react';

export interface StatusBarProps {
  blockCount: number;
  emailSize?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  blockCount,
  emailSize
}) => {
  return (
    <div className="bg-gray-100 border-t px-4 py-2 text-sm text-gray-600 flex justify-between">
      <span>Blocks: {blockCount}</span>
      {emailSize && <span>Size: {(emailSize / 1024).toFixed(1)}KB</span>}
    </div>
  );
};
