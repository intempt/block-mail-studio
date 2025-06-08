
import { useState, useEffect, useCallback, useMemo } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { EmailTemplate } from '@/components/TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

export const useEmailEditorState = (content: string, subject: string) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [showAIAnalytics, setShowAIAnalytics] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  // Track the actual email content for preview synchronization
  const [emailContent, setEmailContent] = useState(content);

  // Load templates on mount
  useEffect(() => {
    try {
      const loadedTemplates = DirectTemplateService.getAllTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.warn('Error loading templates:', error);
      setTemplates([]);
    }
  }, []);

  // Sync emailContent when content prop changes
  useEffect(() => {
    if (content !== emailContent) {
      setEmailContent(content);
    }
  }, [content, emailContent]);

  return {
    // State
    blocks,
    setBlocks,
    emailBlocks,
    setEmailBlocks,
    showPreview,
    setShowPreview,
    showTemplateLibrary,
    setShowTemplateLibrary,
    templates,
    setTemplates,
    universalContent,
    snippetRefreshTrigger,
    setSnippetRefreshTrigger,
    showAIAnalytics,
    setShowAIAnalytics,
    selectedBlockId,
    setSelectedBlockId,
    canvasWidth,
    setCanvasWidth,
    deviceMode,
    setDeviceMode,
    previewMode,
    setPreviewMode,
    viewMode,
    setViewMode,
    emailContent,
    setEmailContent
  };
};
