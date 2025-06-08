
import { useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailTemplate } from '@/components/TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { useNotification } from '@/contexts/NotificationContext';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface UseEmailEditorHandlersProps {
  canvasRef: React.RefObject<any>;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  setEmailContent: (content: string) => void;
  setTemplates: (templates: EmailTemplate[]) => void;
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  setCanvasWidth: (width: number) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setViewMode: (mode: ViewMode) => void;
  setShowPreview: (show: boolean) => void;
  canvasWidth: number;
}

export const useEmailEditorHandlers = ({
  canvasRef,
  onContentChange,
  onSubjectChange,
  setEmailContent,
  setTemplates,
  setDeviceMode,
  setCanvasWidth,
  setPreviewMode,
  setViewMode,
  setShowPreview,
  canvasWidth
}: UseEmailEditorHandlersProps) => {
  const { success, error } = useNotification();

  const getDefaultContent = useCallback((blockType: string) => {
    switch (blockType) {
      case 'text':
        return { html: '<p>Start typing your content here...</p>', textStyle: 'normal' };
      case 'button':
        return { text: 'Click Here', link: '#', style: 'solid', size: 'medium' };
      case 'image':
        return { src: '', alt: '', alignment: 'center', width: '100%', isDynamic: false };
      default:
        return {};
    }
  }, []);

  const getDefaultStyles = useCallback((blockType: string) => {
    return {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    };
  }, []);

  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    if (canvasRef.current) {
      const newBlock: EmailBlock = {
        id: `${blockType}_${Date.now()}`,
        type: blockType as any,
        content: getDefaultContent(blockType),
        styling: getDefaultStyles(blockType),
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        },
        isStarred: false
      };

      if (layoutConfig) {
        newBlock.content = { ...newBlock.content, ...layoutConfig };
      }

      canvasRef.current.addBlock(newBlock);
      success(`${blockType} block added successfully`);
    }
  }, [canvasRef, success, getDefaultContent, getDefaultStyles]);

  const handleSnippetAdd = useCallback((snippet: EmailSnippet) => {
    if (snippet.blockData && canvasRef.current) {
      canvasRef.current.addBlock(snippet.blockData);
      success(`Snippet "${snippet.name}" added successfully`);
    }
  }, [canvasRef, success]);

  const handleContentChange = useCallback((newContent: string) => {
    console.log('EmailEditor: Content updated from canvas');
    setEmailContent(newContent);
    onContentChange(newContent);
  }, [onContentChange, setEmailContent]);

  const handleDeviceChange = useCallback((device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    setDeviceMode(device);
    
    const widthMap = {
      desktop: 600,
      tablet: 768,
      mobile: 375,
      custom: canvasWidth
    };
    
    if (device !== 'custom') {
      setCanvasWidth(widthMap[device]);
    }
  }, [canvasWidth, setDeviceMode, setCanvasWidth]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== 'edit') {
      setPreviewMode(mode === 'desktop-preview' ? 'desktop' : 'mobile');
    }
  }, [setViewMode, setPreviewMode]);

  const handleImportBlocks = useCallback((blocks: EmailBlock[], subject?: string) => {
    if (canvasRef.current) {
      canvasRef.current.replaceAllBlocks(blocks);
      success(`Successfully imported ${blocks.length} blocks`);
      
      if (subject) {
        onSubjectChange(subject);
      }
    }
  }, [canvasRef, onSubjectChange, success]);

  const handleSaveTemplate = useCallback((template: any) => {
    try {
      DirectTemplateService.saveTemplate(template);
      const updatedTemplates = DirectTemplateService.getAllTemplates();
      setTemplates(updatedTemplates);
      success('Template saved successfully');
    } catch (err) {
      error('Failed to save template');
    }
  }, [success, error, setTemplates]);

  const handlePublish = useCallback(() => {
    success('Email published successfully');
  }, [success]);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, [setShowPreview]);

  return {
    handleBlockAdd,
    handleSnippetAdd,
    handleContentChange,
    handleDeviceChange,
    handleViewModeChange,
    handleImportBlocks,
    handleSaveTemplate,
    handlePublish,
    handlePreview
  };
};
