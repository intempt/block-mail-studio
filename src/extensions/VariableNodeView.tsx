
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { VariableTag } from '../components/canvas/VariableTag';

interface VariableNodeViewProps {
  node: {
    attrs: {
      text: string;
      value: string;
    };
  };
  deleteNode: () => void;
}

export const VariableNodeView: React.FC<VariableNodeViewProps> = ({ node, deleteNode }) => {
  return (
    <NodeViewWrapper as="span" className="variable-node-view">
      <VariableTag
        text={node.attrs.text}
        value={node.attrs.value}
        onRemove={deleteNode}
        className="mx-1"
      />
    </NodeViewWrapper>
  );
};
