
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
        tag: 'span[data-type="preview-variable"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    // In preview mode, render as a styled span with custom attributes for CSS styling
    const text = node.attrs.text || '';
    return [
      'span', 
      mergeAttributes(
        { 
          'data-type': 'preview-variable',
          'data-variable-text': text,
          'data-variable-value': node.attrs.value || '',
          class: 'preview-variable-tag inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200 px-2 py-1 rounded-md mx-1'
        }, 
        this.options.HTMLAttributes, 
        HTMLAttributes
      ), 
      [
        'span',
        { class: 'variable-icon' },
        '🔤'
      ],
      [
        'span',
        { class: 'variable-text font-medium text-caption' },
        text
      ]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PreviewVariableNodeView);
  },
});
