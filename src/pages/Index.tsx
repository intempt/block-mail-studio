
import React, { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { EditView } from '@/components/canvas/EditView';
import { BlocksSidebar } from '@/components/sidebar/BlocksSidebar';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { EmailEditorToolbar } from '@/components/EmailEditorToolbar';
import { generateUniqueId } from '@/utils/blockUtils';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';

export default function Index() {
  // Main state
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [subject, setSubject] = useState('Welcome to our newsletter!');
  
  // UI state
  const [draggedLayout, setDraggedLayout] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState(600);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [compactMode, setCompactMode] = useState(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Default content generators
  const getDefaultContent = useCallback((blockType: string) => {
    switch (blockType) {
      case 'text':
        return {
          html: '<p>Click to edit this text</p>',
          text: 'Click to edit this text'
        };
      case 'image':
        return {
          src: 'https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Image',
          alt: 'Placeholder image',
          width: 400,
          height: 200
        };
      case 'button':
        return {
          text: 'Click me',
          url: '#',
          alignment: 'center'
        };
      case 'spacer':
        return {
          height: 20
        };
      case 'divider':
        return {
          style: 'solid',
          color: '#e5e7eb',
          thickness: 1
        };
      case 'video':
        return {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail: 'https://via.placeholder.com/400x225/e5e7eb/6b7280?text=Video',
          width: 400,
          height: 225
        };
      case 'social':
        return {
          platforms: [
            { name: 'facebook', url: '#' },
            { name: 'twitter', url: '#' },
            { name: 'instagram', url: '#' }
          ]
        };
      case 'html':
        return {
          html: '<div style="padding: 20px; background: #f3f4f6; text-align: center;">Custom HTML content</div>'
        };
      case 'table':
        return {
          rows: [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
          ]
        };
      case 'product':
        return {
          type: 'static',
          products: [
            {
              id: generateUniqueId(),
              title: 'Sample Product',
              description: 'This is a sample product description.',
              price: 29.99,
              originalPrice: 39.99,
              image: 'lucide:package'
            }
          ],
          selectedSchemaKey: null,
          schemaKeyStyles: {}
        };
      default:
        return {};
    }
  }, []);

  const getDefaultStyles = useCallback((blockType: string) => {
    return {
      desktop: {
        backgroundColor: 'transparent',
        padding: '16px',
        margin: '0px',
        borderRadius: '0px',
        fontSize: '16px',
        color: '#000000',
        textAlign: 'left' as const,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal' as const,
        lineHeight: '1.5'
      },
      mobile: {
        backgroundColor: 'transparent',
        padding: '12px',
        margin: '0px',
        borderRadius: '0px',
        fontSize: '14px',
        color: '#000000',
        textAlign: 'left' as const,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal' as const,
        lineHeight: '1.4'
      }
    };
  }, []);

  // Block management
  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    console.log('Adding block:', blockType, layoutConfig);
    
    const newBlock: EmailBlock = {
      id: generateUniqueId(),
      type: blockType as any,
      content: layoutConfig || getDefaultContent(blockType),
      styling: getDefaultStyles(blockType)
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, [getDefaultContent, getDefaultStyles]);

  const handleBlockSelect = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleSubjectChange = useCallback((newSubject: string) => {
    setSubject(newSubject);
  }, []);

  const handleSnippetRefresh = useCallback(() => {
    console.log('Refreshing snippets...');
  }, []);

  // Generate current email HTML for AI analysis
  const currentEmailHTML = blocks.map(block => {
    if (block.type === 'text') {
      return block.content.html || block.content.text || '';
    }
    return `[${block.type.toUpperCase()} BLOCK]`;
  }).join('\n');

  return (
    <AuthenticIntemptLayout activeContext="Email Editor">
      <div className="h-screen flex flex-col">
        {/* Top Toolbar */}
        <EmailEditorToolbar 
          onExport={() => console.log('Export')}
          onSave={() => console.log('Save')}
          onPreview={() => console.log('Preview')}
          onViewCode={() => console.log('View Code')}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <CollapsiblePanel
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title="Blocks"
            side="left"
            expandedWidth="w-80"
            collapsedWidth="w-12"
          >
            <BlocksSidebar
              onBlockAdd={handleBlockAdd}
              draggedLayout={draggedLayout}
              setDraggedLayout={setDraggedLayout}
            />
          </CollapsiblePanel>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-50 overflow-auto">
            <div className="p-8">
              <EditView
                blocks={blocks}
                setBlocks={setBlocks}
                selectedBlockId={selectedBlockId}
                setSelectedBlockId={setSelectedBlockId}
                editingBlockId={editingBlockId}
                setEditingBlockId={setEditingBlockId}
                onBlockSelect={handleBlockSelect}
                previewWidth={previewWidth}
                previewMode={previewMode}
                compactMode={compactMode}
                subject={subject}
                onSubjectChange={handleSubjectChange}
                showAIAnalytics={showAIAnalytics}
                onSnippetRefresh={handleSnippetRefresh}
                currentEmailHTML={currentEmailHTML}
                getDefaultContent={getDefaultContent}
                getDefaultStyles={getDefaultStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticIntemptLayout>
  );
}
