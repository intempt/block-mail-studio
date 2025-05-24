
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseKeyboardShortcutsProps {
  editor?: any; // TipTap editor instance
  canvasRef?: React.RefObject<any>; // Canvas reference
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleFullscreen: () => void;
  onSave: () => void;
  collaborationMode: boolean;
}

export const useKeyboardShortcuts = ({
  editor,
  canvasRef,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleFullscreen,
  onSave,
  collaborationMode
}: UseKeyboardShortcutsProps) => {
  const { toast } = useToast();
  const isFullscreenRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            onSave();
            toast({
              title: "Email Saved",
              description: "Your email has been saved successfully.",
            });
            break;
            
          case 'z':
            e.preventDefault();
            if (collaborationMode && editor) {
              editor.chain().focus().undo().run();
            } else if (canvasRef?.current?.undo) {
              canvasRef.current.undo();
            }
            toast({
              title: "Undo",
              description: "Last action undone.",
            });
            break;
            
          case 'y':
            e.preventDefault();
            if (collaborationMode && editor) {
              editor.chain().focus().redo().run();
            } else if (canvasRef?.current?.redo) {
              canvasRef.current.redo();
            }
            toast({
              title: "Redo",
              description: "Action redone.",
            });
            break;
            
          case 'b':
            e.preventDefault();
            if (collaborationMode && editor) {
              editor.chain().focus().toggleBold().run();
              toast({
                title: "Bold",
                description: "Text formatting applied.",
              });
            }
            break;
            
          case 'i':
            e.preventDefault();
            if (collaborationMode && editor) {
              editor.chain().focus().toggleItalic().run();
              toast({
                title: "Italic",
                description: "Text formatting applied.",
              });
            }
            break;
            
          case 'k':
            e.preventDefault();
            if (collaborationMode && editor) {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
                toast({
                  title: "Link Added",
                  description: "Link has been inserted.",
                });
              }
            }
            break;
            
          case '[':
            e.preventDefault();
            onToggleLeftPanel();
            break;
            
          case ']':
            e.preventDefault();
            onToggleRightPanel();
            break;
        }
      }
      
      // F11 for fullscreen (without Ctrl/Cmd)
      if (e.key === 'F11') {
        e.preventDefault();
        onToggleFullscreen();
        isFullscreenRef.current = !isFullscreenRef.current;
        toast({
          title: isFullscreenRef.current ? "Fullscreen Mode" : "Normal Mode",
          description: isFullscreenRef.current ? "Panels hidden for focus" : "Panels restored",
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, canvasRef, onToggleLeftPanel, onToggleRightPanel, onToggleFullscreen, onSave, collaborationMode, toast]);
};
