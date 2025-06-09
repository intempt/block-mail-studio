
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { 
  ArrowLeft,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Save,
  Edit3,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface RibbonHeaderProps {
  campaignTitle: string;
  setCampaignTitle: (title: string) => void;
  isEditingTitle: boolean;
  setIsEditingTitle: (editing: boolean) => void;
  viewMode: ViewMode;
  onBack?: () => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onDeleteCanvas: () => void;
  onImport: () => void;
  onExport: () => void;
  onSave: () => void;
  previewMode?: 'desktop' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
}

export const RibbonHeader: React.FC<RibbonHeaderProps> = ({
  campaignTitle,
  setCampaignTitle,
  isEditingTitle,
  setIsEditingTitle,
  viewMode,
  onBack,
  onViewModeChange,
  onDeleteCanvas,
  onImport,
  onExport,
  onSave,
  previewMode = 'desktop',
  onPreviewModeChange
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDesktopClick = () => {
    if (isInPreviewMode) {
      onViewModeChange?.('desktop-preview');
    }
    onPreviewModeChange?.('desktop');
  };

  const handleMobileClick = () => {
    if (isInPreviewMode) {
      onViewModeChange?.('mobile-preview');
    }
    onPreviewModeChange?.('mobile');
  };

  const handlePreviewToggle = () => {
    if (viewMode === 'edit') {
      const newViewMode = previewMode === 'desktop' ? 'desktop-preview' : 'mobile-preview';
      onViewModeChange?.(newViewMode);
    } else {
      onViewModeChange?.('edit');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteCanvas();
  };

  const isInPreviewMode = viewMode === 'desktop-preview' || viewMode === 'mobile-preview';
  const currentPreviewMode = viewMode === 'desktop-preview' ? 'desktop' : 
                            viewMode === 'mobile-preview' ? 'mobile' : previewMode;

  return (
    <>
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <Input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className="text-xl font-semibold border-none p-0 h-auto focus:ring-0 focus:border-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">{campaignTitle}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle Button */}
          <Button
            onClick={handlePreviewToggle}
            className={`flex items-center gap-2 h-9 px-4 rounded-md transition-all font-medium ${
              isInPreviewMode
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={isInPreviewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
          >
            {isInPreviewMode ? (
              <>
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </>
            )}
          </Button>

          {/* Desktop/Mobile Buttons - Now consistent with other action buttons */}
          <Button
            variant={currentPreviewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={handleDesktopClick}
            className="flex items-center gap-2 h-9 px-3 min-w-[80px] justify-center"
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
          
          <Button
            variant={currentPreviewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={handleMobileClick}
            className="flex items-center gap-2 h-9 px-3 min-w-[80px] justify-center"
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="flex items-center gap-2 h-9 px-3 min-w-[80px] justify-center"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={onImport} variant="outline" size="sm" className="h-9 px-3 min-w-[80px] justify-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={onExport} variant="outline" size="sm" className="h-9 px-3 min-w-[80px] justify-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={onSave} variant="default" size="sm" className="h-9 px-3 min-w-[80px] justify-center">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Email Campaign"
        description="Are you sure you want to delete this email campaign? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </>
  );
};
