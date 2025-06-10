
import { useCallback } from 'react';

interface UseCanvasDragProps {
  setIsDraggingOver: (value: boolean) => void;
  setDragOverIndex: (value: number | null) => void;
}

export const useCanvasDrag = ({ setIsDraggingOver, setDragOverIndex }: UseCanvasDragProps) => {
  const handleCanvasDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
    setDragOverIndex(null);
  }, [setIsDraggingOver, setDragOverIndex]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);

    const target = e.target as HTMLElement;
    const canvas = target.closest('.email-canvas');

    if (canvas) {
      const children = Array.from(canvas.querySelectorAll('[data-testid^="email-block-"]'));
      
      if (children.length === 0) {
        setDragOverIndex(0);
        return;
      }

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const rect = child.getBoundingClientRect();
        const mouseY = e.clientY;
        
        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          setDragOverIndex(i);
          return;
        } else if (mouseY < rect.top) {
          setDragOverIndex(i);
          return;
        }
      }
      setDragOverIndex(children.length);
    }
  }, [setDragOverIndex, setIsDraggingOver]);

  const handleCanvasDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);
  }, [setIsDraggingOver, setDragOverIndex]);

  return {
    handleCanvasDragEnter,
    handleCanvasDragOver,
    handleCanvasDragLeave
  };
};
