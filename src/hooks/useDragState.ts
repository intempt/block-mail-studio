
import { useState, useCallback } from 'react';

export interface DragState {
  dragOverIndex: number | null;
  isDraggingOver: boolean;
  currentDragType: 'block' | 'layout' | 'reorder' | null;
}

export const useDragState = () => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [currentDragType, setCurrentDragType] = useState<'block' | 'layout' | 'reorder' | null>(null);

  const resetDragState = useCallback(() => {
    setDragOverIndex(null);
    setIsDraggingOver(false);
    setCurrentDragType(null);
  }, []);

  const startDrag = useCallback((dragType: 'block' | 'layout' | 'reorder') => {
    setCurrentDragType(dragType);
    setIsDraggingOver(true);
  }, []);

  const updateDragPosition = useCallback((index: number | null) => {
    setDragOverIndex(index);
    setIsDraggingOver(true);
  }, []);

  return {
    // State
    dragOverIndex,
    isDraggingOver,
    currentDragType,
    
    // Actions
    setDragOverIndex,
    setIsDraggingOver,
    setCurrentDragType,
    resetDragState,
    startDrag,
    updateDragPosition
  };
};
