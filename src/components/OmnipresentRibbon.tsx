
import React, { useState, useEffect } from 'react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { ButtonsCard } from './ButtonsCard';
import { LinksCard } from './LinksCard';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { EmailImportDialog } from './dialogs/EmailImportDialog';
import { EmailExportDialog } from './dialogs/EmailExportDialog';
import { EmailBlock } from '@/types/emailBlocks';
import { useNotification } from '@/contexts/NotificationContext';
import { RibbonHeader } from './ribbon/RibbonHeader';
import { RibbonToolbar } from './ribbon/RibbonToolbar';
import { RibbonPreviewIndicator } from './ribbon/RibbonPreviewIndicator';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface OmnipresentRibbonProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  onGlobalStylesChange: (styles: any) => void;
  emailHTML: string;
  subjectLine: string;
  editor?: any;
  snippetRefreshTrigger?: number;
  onTemplateLibraryOpen?: () => void;
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
  previewMode?: 'desktop' | 'mobile';
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: any) => void;
  onPublish: () => void;
  canvasRef?: React.RefObject<any>;
  onSubjectLineChange?: (subject: string) => void;
  onToggleAIAnalytics?: () => void;
  onImportBlocks?: (blocks: EmailBlock[], subject?: string) => void;
  blocks: EmailBlock[];
  onGmailPreview?: (mode: 'desktop' | 'mobile') => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const OmnipresentRibbon: React.FC<OmnipresentRibbonProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  onGlobalStylesChange,
  emailHTML,
  subjectLine,
  editor,
  snippetRefreshTrigger = 0,
  onTemplateLibraryOpen,
  onPreviewModeChange,
  previewMode = 'desktop',
  onBack,
  canvasWidth,
  deviceMode,
  onDeviceChange,
  onWidthChange,
  onPreview,
  onSaveTemplate,
  onPublish,
  canvasRef,
  onSubjectLineChange,
  onToggleAIAnalytics,
  onImportBlocks,
  blocks,
  onGmailPreview,
  viewMode = 'edit',
  onViewModeChange
}) => {
  const { success, error, warning } = useNotification();
  const [showButtons, setShowButtons] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showTextHeadings, setShowTextHeadings] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('New Email Campaign');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draggedLayout, setDraggedLayout] = useState<string | null>(null);
  
  useEffect(() => {
    const savedDraft = localStorage.getItem('email-builder-draft');
    if (savedDraft) {
      try {
        const { title } = JSON.parse(savedDraft);
        if (title) {
          setCampaignTitle(title);
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  const closeAllPanels = () => {
    setShowButtons(false);
    setShowLinks(false);
    setShowEmailSettings(false);
    setShowTextHeadings(false);
  };

  const handleExport = () => {
    console.log('OmnipresentRibbon: Opening export dialog with blocks:', blocks.length);
    setShowExportDialog(true);
  };

  const handleSave = () => {
    try {
      const draftData = {
        title: campaignTitle,
        subject: subjectLine,
        html: emailHTML,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('email-builder-draft', JSON.stringify(draftData));
      success('Email draft saved successfully');
    } catch (err) {
      error('Failed to save email draft');
    }
  };

  const handleDeleteCanvas = () => {
    if (confirm('Are you sure you want to clear all content? This will also clear your saved draft.')) {
      try {
        localStorage.removeItem('email-builder-draft');
        success('Canvas cleared successfully');
      } catch (err) {
        error('Failed to clear canvas');
      }
    }
  };

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const handleImportBlocks = (blocks: EmailBlock[], subject?: string) => {
    if (onImportBlocks) {
      onImportBlocks(blocks, subject);
      success(`Successfully imported ${blocks.length} blocks`);
    }
    setShowImportDialog(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Top Header */}
      <RibbonHeader
        campaignTitle={campaignTitle}
        setCampaignTitle={setCampaignTitle}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        viewMode={viewMode}
        onBack={onBack}
        onViewModeChange={onViewModeChange}
        onDeleteCanvas={handleDeleteCanvas}
        onImport={handleImport}
        onExport={handleExport}
        onSave={handleSave}
      />

      {/* Toolbar - Only show in edit mode */}
      {viewMode === 'edit' && (
        <RibbonToolbar
          onBlockAdd={onBlockAdd}
          draggedLayout={draggedLayout}
          setDraggedLayout={setDraggedLayout}
          showEmailSettings={showEmailSettings}
          showTextHeadings={showTextHeadings}
          showButtons={showButtons}
          showLinks={showLinks}
          closeAllPanels={closeAllPanels}
          setShowEmailSettings={setShowEmailSettings}
          setShowTextHeadings={setShowTextHeadings}
          setShowButtons={setShowButtons}
          setShowLinks={setShowLinks}
        />
      )}

      {/* Preview Mode Indicator */}
      <RibbonPreviewIndicator viewMode={viewMode} />

      {/* Settings Panels - Only show in edit mode */}
      {viewMode === 'edit' && (
        <>
          <EmailSettingsCard
            isOpen={showEmailSettings}
            onToggle={() => setShowEmailSettings(!showEmailSettings)}
            onStylesChange={onGlobalStylesChange}
          />

          <TextHeadingsCard
            isOpen={showTextHeadings}
            onToggle={() => setShowTextHeadings(!showTextHeadings)}
            onStylesChange={onGlobalStylesChange}
          />

          <ButtonsCard
            isOpen={showButtons}
            onToggle={() => setShowButtons(!showButtons)}
            onStylesChange={onGlobalStylesChange}
          />

          <LinksCard
            isOpen={showLinks}
            onToggle={() => setShowLinks(!showLinks)}
            onStylesChange={onGlobalStylesChange}
          />
        </>
      )}

      <EmailImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportBlocks}
      />

      <EmailExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        blocks={blocks}
        subject={subjectLine}
        emailHTML={emailHTML}
        campaignTitle={campaignTitle}
      />
    </div>
  );
};

export default OmnipresentRibbon;
