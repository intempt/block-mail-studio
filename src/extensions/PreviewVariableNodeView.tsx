
import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { PreviewVariableTag } from '../components/canvas/PreviewVariableTag';

export const PreviewVariableNodeView: React.FC<NodeViewProps> = ({ node }) => {
  return (
    <NodeViewWrapper 
      as="span" 
      className="preview-variable-node-view"
      contentEditable={false}
      draggable={false}
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      <PreviewVariableTag
        text={node.attrs.text}
        value={node.attrs.value}
        className="mx-1"
      />
    </NodeViewWrapper>
  );
};
