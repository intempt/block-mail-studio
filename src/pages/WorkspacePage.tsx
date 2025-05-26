import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDebounce } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import Iframe from '@tiptap/extension-iframe';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { setBlockType } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { OmnipresentRibbon } from '@/components/OmnipresentRibbon';
import { EmailPreview } from '@/components/EmailPreview';
import { EmailBlockPalette } from '@/components/EmailBlockPalette';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';
import { EmailTemplate } from '@/components/TemplateManager';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { createDragData } from '@/utils/dragDropUtils';
import { generateUniqueId } from '@/utils/blockUtils';
import { EmailBlock } from '@/components/EmailBlock';
import { EnhancedTopBar } from '@/components/EnhancedTopBar';

interface Block {
  id: string;
  type: string;
  content: any;
  styles?: any;
}

export const WorkspacePage = () => {
  const router = useRouter();
  const [emailHTML, setEmailHTML] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [universalContent, setUniversalContent] = useState<UniversalContent[]>([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [globalStyles, setGlobalStyles] = useState({});
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);

  const { toast } = useToast();
  const lowlight = createLowlight()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table,
      TableRow,
      TableCell,
      TableHeader,
      Youtube,
      Iframe,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Color,
      TextStyle,
    ],
    content: '<p>Lets get started!</p>',
    onUpdate: ({ editor }) => {
      setEmailHTML(editor.getHTML());
    },
  });

  const [debouncedEmailHTML] = useDebounce(emailHTML, 500);

  useEffect(() => {
    setEmailHTML(editor?.getHTML() || '');
  }, [editor?.isReady, editor?.getHTML]);

  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    console.log('Adding block:', blockType, layoutConfig);
    const newBlock = {
      id: generateUniqueId(),
      type: blockType,
      content: layoutConfig || { text: 'New ' + blockType },
      styles: {}
    };
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  }, []);

  const handleSnippetAdd = useCallback((snippet: EmailSnippet) => {
    console.log('Adding snippet:', snippet);
    if (editor) {
      editor.commands.insertContent(snippet.html);
      setEmailHTML(editor.getHTML());
    }
  }, [editor]);

  const handleUniversalContentAdd = useCallback((content: UniversalContent) => {
    setUniversalContent(prevContent => [...prevContent, content]);
  }, []);

  const handleBlockUpdate = useCallback((blockId: string, newContent: any) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  }, []);

  const handleBlockStyleUpdate = useCallback((blockId: string, newStyles: any) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, styles: newStyles } : block
      )
    );
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  }, []);

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    const dragData = createDragData({ blockType });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('application/json');

    if (dragData) {
      try {
        const data = JSON.parse(dragData);
        if (data.blockType) {
          handleBlockAdd(data.blockType, data.layoutData);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  }, [handleBlockAdd]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleTogglePalette = () => {
    setIsPaletteOpen(!isPaletteOpen);
  };

  const handleGlobalStylesChange = (styles: any) => {
    setGlobalStyles(styles);
  };

  const handleCanvasWidthChange = (width: number) => {
    setCanvasWidth(width);
    setDeviceMode('custom');
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceMode(device);
    switch (device) {
      case 'desktop':
        setCanvasWidth(1200);
        break;
      case 'tablet':
        setCanvasWidth(768);
        break;
      case 'mobile':
        setCanvasWidth(375);
        break;
      default:
        setCanvasWidth(600);
        break;
    }
  };

  const handleSaveTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });
  
      if (response.ok) {
        toast({
          title: "Template saved!",
          description: "Your email template has been successfully saved.",
        });
        setSnippetRefreshTrigger(prev => prev + 1);
      } else {
        toast({
          variant: "destructive",
          title: "Error saving template",
          description: "Failed to save the email template. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        variant: "destructive",
        title: "Error saving template",
        description: "An unexpected error occurred while saving the template.",
      });
    }
  };

  const handlePublish = () => {
    console.log('Publishing email...');
    toast({
      title: "Email Published!",
      description: "Your email has been successfully published.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <EnhancedTopBar 
        onBack={() => router.push('/')}
        canvasWidth={canvasWidth}
        deviceMode={deviceMode}
        onDeviceChange={handleDeviceChange}
        onWidthChange={handleCanvasWidthChange}
        onPreview={() => setIsPreviewOpen(true)}
        onSaveTemplate={handleSaveTemplate}
        onPublish={handlePublish}
        emailHTML={debouncedEmailHTML}
        subjectLine={subjectLine}
      />

      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full lg:w-80 flex-shrink-0 border-r border-gray-200 bg-white">
          <EnhancedEmailBlockPalette
            onBlockAdd={handleBlockAdd}
            onSnippetAdd={handleSnippetAdd}
            universalContent={universalContent}
            onUniversalContentAdd={handleUniversalContentAdd}
            compactMode={true}
            snippetRefreshTrigger={snippetRefreshTrigger}
          />
        </div>

        <div
          className="flex-1 h-full overflow-auto p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto" style={{ width: `${canvasWidth}px` }}>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Subject Line"
                className="w-full text-lg font-medium text-gray-800 border-none focus:outline-none focus:ring-0"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
              />
            </div>
            {blocks.map((block) => (
              <EmailBlock
                key={block.id}
                block={block}
                onBlockUpdate={handleBlockUpdate}
                onBlockStyleUpdate={handleBlockStyleUpdate}
                onBlockDelete={handleBlockDelete}
                emailHTML={debouncedEmailHTML}
                editor={editor}
              />
            ))}
            <div className="min-h-[200px] p-4">
              {blocks.length === 0 && (
                <div className="text-center text-gray-500">
                  Drag and drop blocks here to start building your email.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmailPreview
        emailHTML={debouncedEmailHTML}
        subjectLine={subjectLine}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        deviceMode={deviceMode}
      />
    </div>
  );
};
