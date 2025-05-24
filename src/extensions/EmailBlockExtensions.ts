
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EmailBlock } from '@/types/emailBlocks';

// Base Email Block Extension
export const EmailBlockNode = Node.create({
  name: 'emailBlock',
  
  group: 'block',
  
  content: '',
  
  isolating: true,
  
  defining: true,
  
  addAttributes() {
    return {
      blockData: {
        default: null,
      },
      blockType: {
        default: 'text',
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-email-block]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes, node }) {
    const blockData = node.attrs.blockData as EmailBlock;
    
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-email-block': node.attrs.blockType,
        'data-block-id': blockData?.id,
        class: 'email-block-wrapper',
      }),
      0,
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(EmailBlockNodeView);
  },
  
  addCommands() {
    return {
      insertEmailBlock: (blockData: EmailBlock) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            blockData,
            blockType: blockData.type,
          },
        });
      },
      
      updateEmailBlock: (blockData: EmailBlock) => ({ commands, state }) => {
        const { from, to } = state.selection;
        return commands.updateAttributes(this.name, {
          blockData,
        });
      },
    };
  },
});

// React component for rendering blocks in TipTap
import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { BlockRenderer } from '@/components/BlockRenderer';

const EmailBlockNodeView: React.FC<NodeViewProps> = ({ node, selected, updateAttributes }) => {
  const blockData = node.attrs.blockData as EmailBlock;
  
  if (!blockData) {
    return (
      <NodeViewWrapper className="email-block-node">
        <div className="p-4 bg-gray-100 text-gray-500 border-2 border-dashed">
          Invalid block data
        </div>
      </NodeViewWrapper>
    );
  }
  
  const handleBlockUpdate = (updatedBlock: EmailBlock) => {
    updateAttributes({
      blockData: updatedBlock,
    });
  };
  
  return (
    <NodeViewWrapper 
      className={`email-block-node ${selected ? 'selected' : ''}`}
      data-block-type={blockData.type}
      data-block-id={blockData.id}
    >
      <div className={`block-wrapper ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
        <BlockRenderer 
          block={blockData}
          isSelected={selected}
          onUpdate={handleBlockUpdate}
        />
      </div>
    </NodeViewWrapper>
  );
};
