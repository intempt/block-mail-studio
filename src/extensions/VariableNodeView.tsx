
import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { VariableTag } from '../components/canvas/VariableTag';

export const VariableNodeView: React.FC<NodeViewProps> = ({ node, deleteNode }) => {
  return (
    <NodeViewWrapper 
      as="span" 
      className="variable-node-view"
      contentEditable={false}
      draggable={false}
    >
      <VariableTag
        text={node.attrs.text}
        value={node.attrs.value}
        onRemove={deleteNode}
        className="mx-1"
      />
    </NodeViewWrapper>
  );
};
