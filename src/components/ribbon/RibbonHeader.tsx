
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Save,
  Edit3,
  Trash2
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
  const handleDesktopClick = () => {
    onPreviewModeChange?.('desktop');
  };

  const handleMobileClick = () => {
    onPreviewModeChange?.('mobile');
  };

  return (
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
      
      {/* View Mode Controls - Desktop/Mobile Toggle with Active State */}
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDesktopClick}
            className={`flex items-center gap-2 h-9 px-4 rounded-md transition-all font-medium ${
              previewMode === 'desktop'
                ? 'bg-white shadow-sm text-blue-600 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm">Desktop</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMobileClick}
            className={`flex items-center gap-2 h-9 px-4 rounded-md transition-all font-medium ${
              previewMode === 'mobile'
                ? 'bg-white shadow-sm text-blue-600 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm">Mobile</span>
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteCanvas}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button onClick={onImport} variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
