
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
    // In preview mode, show the variable text (display name) instead of the raw value
    const text = node.attrs.text || '';
    return ['span', mergeAttributes({ 'data-type': 'variable' }, this.options.HTMLAttributes, HTMLAttributes), text];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PreviewVariableNodeView);
  },
});
