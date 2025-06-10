
import { useDragDropController } from './DragDropController';
import { EmailBlock } from '@/types/emailBlocks';

interface UseDragDropHandlerProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
  dragOverIndex: number | null;
  setDragOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isDraggingOver: boolean;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDragType: React.Dispatch<React.SetStateAction<'block' | 'layout' | 'reorder' | null>>;
}

export const useDragDropHandler = (props: UseDragDropHandlerProps) => {
  // Use the new controller for all drag drop operations
  return useDragDropController({
    blocks: props.blocks,
    setBlocks: props.setBlocks,
    getDefaultContent: props.getDefaultContent,
    getDefaultStyles: props.getDefaultStyles
  });
};
