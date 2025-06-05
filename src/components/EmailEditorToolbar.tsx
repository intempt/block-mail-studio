
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Save,
  Eye,
  Code
} from 'lucide-react';
import { UndoRedoToolbar } from './UndoRedoToolbar';

interface EmailEditorToolbarProps {
  onExport?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onViewCode?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const EmailEditorToolbar: React.FC<EmailEditorToolbarProps> = ({ 
  onExport,
  onSave,
  onPreview,
  onViewCode,
  canUndo = false,
  canRedo = false,
  onUndo = () => {},
  onRedo = () => {}
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center gap-1">
        {/* Undo/Redo Actions */}
        <UndoRedoToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
        />

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Document Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-8 w-8 p-0"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* View Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewCode}
            className="h-8 w-8 p-0"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        <div className="ml-auto">
          <span className="text-sm text-slate-600">Canvas-based Email Editor</span>
        </div>
      </div>
    </div>
  );
};
