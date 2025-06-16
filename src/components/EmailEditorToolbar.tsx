
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Undo,
  Redo,
  Download,
  Save,
  Eye,
  Code,
  Edit3,
  Monitor,
  Smartphone,
  ChevronDown,
  Trash2
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

  const handleDelete = () => {
    console.log('Delete campaign...');
    // TODO: Implement delete functionality
  };

  return (
    <div className="w-full bg-brand-bg border-b border-brand px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Campaign title */}
        <div className="flex items-center u-gap-4">
          <div className="flex items-center u-gap-2">
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-base font-medium border-none u-p-0 h-auto focus:ring-0 focus:border-none w-32 min-w-fit bg-transparent"
                style={{ fontSize: '16px' }}
                autoFocus
              />
            ) : (
              <div className="flex items-center u-gap-1">
                <span className="font-medium text-brand-fg" style={{ fontSize: '16px' }}>{campaignTitle}</span>
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
            className="h-[38px] w-[38px] u-p-0"
            style={{ fontSize: '14px' }}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('mobile')}
            className="h-[38px] w-[38px] u-p-0"
            style={{ fontSize: '14px' }}
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
            className="h-[38px] w-[38px] u-p-0"
            style={{ fontSize: '14px' }}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-[38px] w-[38px] u-p-0"
            style={{ fontSize: '14px' }}
          >
            <Redo className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Preview */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="h-[38px] u-p-3 u-gap-2"
            style={{ fontSize: '14px' }}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          {/* Send test */}
          <Button
            variant="outline"
            size="sm"
            className="h-[38px] u-p-3"
            style={{ fontSize: '14px' }}
          >
            Send test
          </Button>

          {/* Save with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="h-[38px] u-p-3 u-gap-2"
                style={{ fontSize: '14px' }}
              >
                <Save className="w-4 h-4" />
                Save
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save and continue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
