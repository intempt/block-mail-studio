
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Layout, 
  Palette, 
  BarChart3, 
  Eye,
  ChevronDown,
  ChevronUp,
  Type,
  Home
} from 'lucide-react';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { PerformanceBrandPanel } from './PerformanceBrandPanel';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { TemplateStylePanel } from './TemplateStylePanel';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';

interface RibbonInterfaceProps {
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
}

export const RibbonInterface: React.FC<RibbonInterfaceProps> = ({
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
  previewMode = 'desktop'
}) => {
  const [activeTab, setActiveTab] = useState('insert');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderTemplatesTab = () => (
    <div className="flex items-center gap-brand-2 p-brand-3">
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Template Library</span>
        <Button variant="outline" size="sm" onClick={onTemplateLibraryOpen} className="border-brand text-brand-fg hover:bg-brand-muted">
          <FileText className="w-4 h-4 mr-2" />
          Browse Templates
        </Button>
      </div>
      <div className="h-6 w-px bg-brand-border" />
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Actions</span>
        <Button variant="outline" size="sm" className="border-brand text-brand-fg hover:bg-brand-muted">
          Save Template
        </Button>
        <Button variant="outline" size="sm" className="border-brand text-brand-fg hover:bg-brand-muted">
          Export HTML
        </Button>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="flex items-center gap-brand-2 p-brand-3">
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Preview Mode</span>
        <div className="flex border rounded-brand border-brand">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('desktop')}
            className="rounded-r-none"
          >
            Desktop
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPreviewModeChange?.('mobile')}
            className="rounded-l-none"
          >
            Mobile
          </Button>
        </div>
      </div>
      <div className="h-6 w-px bg-brand-border" />
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Canvas</span>
        <Badge variant="outline" className="border-brand text-brand-fg">600px</Badge>
      </div>
    </div>
  );

  const renderViewTab = () => (
    <div className="flex items-center gap-brand-2 p-brand-3">
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Zoom</span>
        <Button variant="outline" size="sm" className="border-brand text-brand-fg hover:bg-brand-muted">100%</Button>
      </div>
      <div className="h-6 w-px bg-brand-border" />
      <div className="flex items-center gap-brand-2">
        <span className="text-body font-medium text-brand-fg">Display</span>
        <Button variant="outline" size="sm" className="border-brand text-brand-fg hover:bg-brand-muted">
          <Eye className="w-4 h-4 mr-2" />
          Guidelines
        </Button>
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="bg-brand-bg border-b border-brand flex items-center justify-between px-brand-4 py-brand-2">
        <div className="flex items-center gap-brand-2">
          <Badge variant="secondary" className="text-caption bg-brand-muted text-brand-fg">Ribbon Hidden</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="text-brand-fg hover:bg-brand-muted"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg border-b border-brand">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-brand-4 py-brand-1 border-b border-brand">
          <TabsList className="bg-transparent gap-brand-3">
            <TabsTrigger value="templates" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Templates
            </TabsTrigger>
            <TabsTrigger value="home" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Home
            </TabsTrigger>
            <TabsTrigger value="insert" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Insert
            </TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Layout
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              Design
            </TabsTrigger>
            <TabsTrigger value="view" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
              View
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-brand-fg hover:bg-brand-muted"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>

        <div className="min-h-[80px]">
          <TabsContent value="templates" className="mt-0">
            {renderTemplatesTab()}
          </TabsContent>

          <TabsContent value="home" className="mt-0">
            <TemplateStylePanel onStylesChange={onGlobalStylesChange} />
          </TabsContent>

          <TabsContent value="insert" className="mt-0">
            <div className="h-80 overflow-hidden">
              <EnhancedEmailBlockPalette
                onBlockAdd={onBlockAdd}
                onSnippetAdd={onSnippetAdd}
                universalContent={universalContent}
                onUniversalContentAdd={onUniversalContentAdd}
                compactMode={true}
                snippetRefreshTrigger={snippetRefreshTrigger}
              />
            </div>
          </TabsContent>

          <TabsContent value="layout" className="mt-0">
            {renderLayoutTab()}
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <div className="h-80 overflow-hidden">
              <GlobalStylesPanel
                onStylesChange={onGlobalStylesChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="view" className="mt-0">
            {renderViewTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
