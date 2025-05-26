
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Undo, Redo, FileText } from 'lucide-react';

export const QuickAccessToolbar: React.FC = () => {
  return (
    <div className="quick-access-toolbar bg-gray-50 border-b border-gray-200 px-4 py-1 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Save (Ctrl+S)">
          <Save className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Undo (Ctrl+Z)">
          <Undo className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Redo (Ctrl+Y)">
          <Redo className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-600">Email Builder</span>
      </div>
    </div>
  );
};
