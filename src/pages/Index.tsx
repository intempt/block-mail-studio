
import React, { useState, useCallback } from 'react';
import EmailEditor from '@/components/EmailEditor';
import { FloatingTestButton } from '@/components/FloatingTestButton';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BlocksSidebar } from '@/components/sidebar/BlocksSidebar';
import { BottomMetricsPanel } from '@/components/metrics/BottomMetricsPanel';

const Index = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('New Email Campaign');

  console.log('Index component rendering');
  console.log('EmailContent:', emailContent);
  console.log('SubjectLine:', subjectLine);

  const handleContentChange = useCallback((content: string) => {
    console.log('Content changed:', content);
    setEmailContent(content);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    console.log('Subject changed:', subject);
    setSubjectLine(subject);
  }, []);

  const handleBlockAdd = useCallback((blockType: string) => {
    console.log('Adding block:', blockType);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left Sidebar - Make sure it's visible */}
        <div className="flex-shrink-0 bg-white border-r border-gray-200">
          <div className="w-64 h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">BLOCKS</h2>
              <p className="text-sm text-gray-600">Drag to add content</p>
            </div>
            <BlocksSidebar onBlockAdd={handleBlockAdd} />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-gray-600">Email Editor</span>
              <span className="text-xs text-green-600 ml-2">✓ App Loading</span>
            </div>
          </header>
          
          {/* Main Editor Area */}
          <main className="flex-1 overflow-hidden bg-white">
            <div className="h-full p-4">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Email Editor</h1>
                <p className="text-gray-600">Create and edit your email campaigns</p>
              </div>
              
              <EmailEditor 
                content={emailContent}
                subject={subjectLine}
                onContentChange={handleContentChange}
                onSubjectChange={handleSubjectChange}
              />
            </div>
          </main>
          
          {/* Bottom Metrics Panel - Make sure it's visible */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200">
            <BottomMetricsPanel 
              emailContent={emailContent}
              subjectLine={subjectLine}
            />
          </div>
        </div>
        
        <FloatingTestButton />
      </div>
    </SidebarProvider>
  );
};

export default Index;
