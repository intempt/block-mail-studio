
import React, { useState, useCallback } from 'react';
import EmailEditor from '@/components/EmailEditor';
import { FloatingTestButton } from '@/components/FloatingTestButton';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BlocksSidebar } from '@/components/sidebar/BlocksSidebar';
import { BottomMetricsPanel } from '@/components/metrics/BottomMetricsPanel';

const Index = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('New Email Campaign');

  const handleContentChange = useCallback((content: string) => {
    setEmailContent(content);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setSubjectLine(subject);
  }, []);

  const handleBlockAdd = useCallback((blockType: string) => {
    // This will be handled by the EmailEditor component
    console.log('Adding block:', blockType);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <BlocksSidebar onBlockAdd={handleBlockAdd} />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-gray-600">Email Editor</span>
            </div>
          </header>
          
          <main className="flex-1 overflow-hidden">
            <EmailEditor 
              content={emailContent}
              subject={subjectLine}
              onContentChange={handleContentChange}
              onSubjectChange={handleSubjectChange}
            />
          </main>
          
          <BottomMetricsPanel 
            emailContent={emailContent}
            subjectLine={subjectLine}
          />
        </div>
        
        <FloatingTestButton />
      </div>
    </SidebarProvider>
  );
};

export default Index;
