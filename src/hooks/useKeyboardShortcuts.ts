
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export const useKeyboardShortcuts = ({
  onDelete,
  onDuplicate,
  onMove
}: KeyboardShortcutsProps) => {
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

      // Delete selected block
      if (event.key === 'Delete' || event.key === 'Backspace') {
        onDelete();
        event.preventDefault();
      }

      // Duplicate selected block
      if (event.ctrlKey && event.key === 'd') {
        onDuplicate();
        event.preventDefault();
      }

      // Move blocks up/down
      if (event.ctrlKey && event.key === 'ArrowUp') {
        onMove('up');
        event.preventDefault();
      }

      if (event.ctrlKey && event.key === 'ArrowDown') {
        onMove('down');
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDelete, onDuplicate, onMove]);
};
