
import React, { useState } from 'react';
import { RibbonTab } from './RibbonTab';
import { QuickAccessToolbar } from './QuickAccessToolbar';
import { HomeTab } from './tabs/HomeTab';
import { InsertTab } from './tabs/InsertTab';
import { DesignTab } from './tabs/DesignTab';
import { LayoutTab } from './tabs/LayoutTab';
import { ReviewTab } from './tabs/ReviewTab';
import { ViewTab } from './tabs/ViewTab';

interface RibbonInterfaceProps {
  onContentChange: (content: string) => void;
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd: (snippet: any) => void;
  onGlobalStylesChange: (styles: any) => void;
  selectedBlockId: string | null;
  emailHTML: string;
  subjectLine: string;
  editor: any;
  canvasRef: React.RefObject<any>;
}

export type RibbonTabType = 'home' | 'insert' | 'design' | 'layout' | 'review' | 'view';

export const RibbonInterface: React.FC<RibbonInterfaceProps> = ({
  onContentChange,
  onBlockAdd,
  onSnippetAdd,
  onGlobalStylesChange,
  selectedBlockId,
  emailHTML,
  subjectLine,
  editor,
  canvasRef
}) => {
  const [activeTab, setActiveTab] = useState<RibbonTabType>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', shortcut: 'Alt+H' },
    { id: 'insert', label: 'Insert', shortcut: 'Alt+N' },
    { id: 'design', label: 'Design', shortcut: 'Alt+G' },
    { id: 'layout', label: 'Layout', shortcut: 'Alt+P' },
    { id: 'review', label: 'Review', shortcut: 'Alt+R' },
    { id: 'view', label: 'View', shortcut: 'Alt+W' }
  ];

  const renderTabContent = () => {
    if (isCollapsed) return null;

    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            editor={editor}
            selectedBlockId={selectedBlockId}
            onContentChange={onContentChange}
          />
        );
      case 'insert':
        return (
          <InsertTab
            onBlockAdd={onBlockAdd}
            onSnippetAdd={onSnippetAdd}
            snippetRefreshTrigger={0}
          />
        );
      case 'design':
        return (
          <DesignTab
            onGlobalStylesChange={onGlobalStylesChange}
          />
        );
      case 'layout':
        return (
          <LayoutTab
            selectedBlockId={selectedBlockId}
          />
        );
      case 'review':
        return (
          <ReviewTab
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            canvasRef={canvasRef}
          />
        );
      case 'view':
        return (
          <ViewTab />
        );
      default:
        return null;
    }
  };

  return (
    <div className="ribbon-interface bg-white border-b border-gray-200 shadow-sm">
      {/* Quick Access Toolbar */}
      <QuickAccessToolbar />
      
      {/* Ribbon Tabs */}
      <div className="ribbon-tabs border-b border-gray-100">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            {tabs.map((tab) => (
              <RibbonTab
                key={tab.id}
                id={tab.id as RibbonTabType}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as RibbonTabType)}
                shortcut={tab.shortcut}
              />
            ))}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
            title={isCollapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
          >
            <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Ribbon Content */}
      <div className={`ribbon-content transition-all duration-200 ${isCollapsed ? 'h-0 overflow-hidden' : 'h-auto'}`}>
        {renderTabContent()}
      </div>
    </div>
  );
};
