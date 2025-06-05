
import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: (event: KeyboardEvent) => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as any)?.isContentEditable
      ) {
        return;
      }

      // Build key combination string
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.metaKey) modifiers.push('cmd');
      if (event.shiftKey) modifiers.push('shift');
      if (event.altKey) modifiers.push('alt');
      
      const key = event.key.toLowerCase();
      const combination = [...modifiers, key].join('+');

      // Check if we have a handler for this combination
      if (shortcuts[combination]) {
        shortcuts[combination](event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
