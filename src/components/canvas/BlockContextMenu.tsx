
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { 
  Edit, 
  Copy, 
  Trash2, 
  Star, 
  ArrowUp, 
  ArrowDown,
  Move,
  Settings
} from 'lucide-react';

interface BlockContextMenuProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSaveAsSnippet: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSettings: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const BlockContextMenu: React.FC<BlockContextMenuProps> = ({
  children,
  onEdit,
  onDuplicate,
  onDelete,
  onSaveAsSnippet,
  onMoveUp,
  onMoveDown,
  onSettings,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Block
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={onSaveAsSnippet}>
          <Star className="w-4 h-4 mr-2" />
          Save as Snippet
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
          <ArrowUp className="w-4 h-4 mr-2" />
          Move Up
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
          <ArrowDown className="w-4 h-4 mr-2" />
          Move Down
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Block Settings
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Block
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
