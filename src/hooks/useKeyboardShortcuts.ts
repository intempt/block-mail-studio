
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  editor: any;
  canvasRef: React.RefObject<any>;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleFullscreen: () => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  collaborationMode: boolean;
}

export const useKeyboardShortcuts = ({
  editor,
  canvasRef,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleFullscreen,
  onSave,
  onUndo,
  onRedo,
  collaborationMode
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as any)?.isContentEditable
      ) {
        // Allow undo/redo even in inputs for collaboration mode
        if (collaborationMode && (
          (event.ctrlKey && event.key === 'z') ||
          (event.ctrlKey && event.key === 'y')
        )) {
          // Let the editor handle these
          return;
        }
        // For other inputs, only allow save and panel toggles
        if (!(
          (event.ctrlKey && event.key === 's') ||
          (event.ctrlKey && event.key === '[') ||
          (event.ctrlKey && event.key === ']') ||
          event.key === 'F11'
        )) {
          return;
        }
      }

      // Enhanced keyboard shortcuts
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        onSave();
        return;
      }

      if (event.ctrlKey && event.key === 'z' && !collaborationMode) {
        event.preventDefault();
        onUndo?.();
        return;
      }

      if (event.ctrlKey && event.key === 'y' && !collaborationMode) {
        event.preventDefault();
        onRedo?.();
        return;
      }

      if (event.ctrlKey && event.key === '[') {
        event.preventDefault();
        onToggleLeftPanel();
        return;
      }

      if (event.ctrlKey && event.key === ']') {
        event.preventDefault();
        onToggleRightPanel();
        return;
      }

      if (event.key === 'F11') {
        event.preventDefault();
        onToggleFullscreen();
        return;
      }

      // Canvas-specific shortcuts (when not in collaboration mode)
      if (!collaborationMode && canvasRef.current) {
        // Delete selected block
        if (event.key === 'Delete' || event.key === 'Backspace') {
          if (canvasRef.current.deleteSelectedBlock) {
            canvasRef.current.deleteSelectedBlock();
            event.preventDefault();
          }
        }

        // Duplicate selected block
        if (event.ctrlKey && event.key === 'd') {
          if (canvasRef.current.duplicateSelectedBlock) {
            canvasRef.current.duplicateSelectedBlock();
            event.preventDefault();
          }
        }

        // Move blocks up/down
        if (event.ctrlKey && event.key === 'ArrowUp') {
          if (canvasRef.current.moveSelectedBlockUp) {
            canvasRef.current.moveSelectedBlockUp();
            event.preventDefault();
          }
        }

        if (event.ctrlKey && event.key === 'ArrowDown') {
          if (canvasRef.current.moveSelectedBlockDown) {
            canvasRef.current.moveSelectedBlockDown();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    editor,
    canvasRef,
    onToggleLeftPanel,
    onToggleRightPanel,
    onToggleFullscreen,
    onSave,
    onUndo,
    onRedo,
    collaborationMode
  ]);
};
