
import React, { useEffect, useState } from 'react';
import { MarkdownFormatter } from './MarkdownFormatter';

interface StreamingMessageProps {
  content: string;
  isComplete: boolean;
  isStreaming: boolean;
  className?: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isComplete,
  isStreaming,
  className = ''
}) => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isComplete || !isStreaming) {
      setShowCursor(false);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isComplete, isStreaming]);

  return (
    <div className={className}>
      <MarkdownFormatter content={content} />
      {isStreaming && !isComplete && (
        <span className={`inline-block w-2 h-5 bg-blue-600 ml-1 transition-opacity duration-100 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`} />
      )}
    </div>
  );
};
