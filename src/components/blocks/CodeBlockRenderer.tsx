
import React from 'react';
import { CodeBlock } from '@/types/emailBlocks';

interface CodeBlockRendererProps {
  block: CodeBlock;
  isSelected: boolean;
  onUpdate: (block: CodeBlock) => void;
}

export const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="code-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      <pre
        className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto"
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        }}
      >
        <code>{block.content.code || '// Add your code here...'}</code>
      </pre>
    </div>
  );
};
