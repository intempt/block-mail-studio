
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
  campaignTitle = 'Untitled Campaign',
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
    <div className="w-full bg-brand-bg border-b border-brand px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Template title */}
        <div className="flex items-center u-gap-4">
          <div className="flex items-center u-gap-2">
            <span className="text-caption text-brand-fg opacity-70">Template:</span>
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-caption font-medium border-none u-p-0 h-auto focus:ring-0 focus:border-none w-32 min-w-fit bg-transparent"
                autoFocus
              />
            ) : (
              <div className="flex items-center u-gap-1">
                <span className="text-caption font-medium text-brand-fg">{campaignTitle}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTitleClick}
                  className="text-brand-fg opacity-40 hover:opacity-60 h-5 w-5 u-p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          
          <span className="text-caption text-brand-primary bg-brand-secondary u-p-2 rounded">
            Changes saved
          </span>
        </div>

        {/* Center - Device preview buttons */}
        <div className="flex items-center u-gap-1 border border-brand rounded u-p-1">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('desktop')}
            className="h-8 w-8 u-p-0"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('mobile')}
            className="h-8 w-8 u-p-0"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center u-gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 u-p-0"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 u-p-0"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Preview */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="h-8 u-p-3"
          >
            Preview
          </Button>

          {/* Send test */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 u-p-3"
          >
            Send test
          </Button>

          {/* Save and exit - Now using design tokens */}
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="h-8 u-p-3"
          >
            Save and exit
          </Button>
        </div>
      </div>
    </div>
  );
};
