
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Undo,
  Redo,
  Download,
  Save,
  Eye,
  Code,
  Edit3,
  Monitor,
  Smartphone
} from 'lucide-react';

interface EmailEditorToolbarProps {
  onExport?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onViewCode?: () => void;
  campaignTitle?: string;
  onCampaignTitleChange?: (title: string) => void;
  previewMode?: 'desktop' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
}

export const EmailEditorToolbar: React.FC<EmailEditorToolbarProps> = ({ 
  onExport,
  onSave,
  onPreview,
  onViewCode,
  campaignTitle = 'new',
  onCampaignTitleChange,
  previewMode = 'desktop',
  onPreviewModeChange
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCampaignTitleChange?.(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Template title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Template:</span>
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-sm font-medium border-none p-0 h-auto focus:ring-0 focus:border-none w-20"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-slate-900">{campaignTitle}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTitleClick}
                  className="text-slate-400 hover:text-slate-600 h-5 w-5 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            Changes saved
          </span>
        </div>

        {/* Center - Device preview buttons */}
        <div className="flex items-center gap-1 border border-slate-200 rounded-md p-1">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Preview */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="h-8 px-3"
          >
            Preview
          </Button>

          {/* Send test */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            Send test
          </Button>

          {/* Save and exit */}
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="h-8 px-3 bg-teal-600 hover:bg-teal-700"
          >
            Save and exit
          </Button>
        </div>
      </div>
    </div>
  );
};
