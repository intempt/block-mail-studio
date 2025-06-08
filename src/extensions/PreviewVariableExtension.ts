
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PreviewVariableNodeView } from './PreviewVariableNodeView';

export interface PreviewVariableOptions {
  HTMLAttributes: Record<string, any>;
}

export const PreviewVariable = Node.create<PreviewVariableOptions>({
  name: 'previewVariable',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  content: '',

  addAttributes() {
    return {
      text: {
        default: null,
        parseHTML: element => element.getAttribute('data-text'),
        renderHTML: attributes => {
          if (!attributes.text) {
            return {};
          }
          return {
            'data-text': attributes.text,
          };
        },
      },
      value: {
        default: null,
        parseHTML: element => element.getAttribute('data-value'),
        renderHTML: attributes => {
          if (!attributes.value) {
            return {};
          }
          return {
            'data-value': attributes.value,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const value = node.attrs.value || '';
    return ['span', mergeAttributes({ 'data-type': 'variable' }, this.options.HTMLAttributes, HTMLAttributes), value];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PreviewVariableNodeView);
  },
});
