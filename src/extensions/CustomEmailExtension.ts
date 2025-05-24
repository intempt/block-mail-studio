
import { Extension } from '@tiptap/core';

export const CustomEmailExtension = Extension.create({
  name: 'customEmail',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          style: {
            default: null,
            parseHTML: element => element.getAttribute('style'),
            renderHTML: attributes => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setEmailStyle: (style: string) => ({ commands }) => {
        commands.updateAttributes('paragraph', { style });
        commands.updateAttributes('heading', { style });
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => {
        // Toggle email preview mode
        console.log('Toggle email preview');
        return true;
      },
    };
  },
});
