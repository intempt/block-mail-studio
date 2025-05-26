
import React, { useState, useCallback } from 'react';
import WorkspacePage from './WorkspacePage';
import EmailEditor from '@/components/EmailEditor';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [emailContent, setEmailContent] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('');

  const handleEmailBuilderOpen = useCallback((emailHTML?: string, subject?: string) => {
    console.log('=== Index.tsx: handleEmailBuilderOpen called ===');
    console.log('Index.tsx: emailHTML provided:', !!emailHTML, 'Length:', emailHTML?.length || 0);
    console.log('Index.tsx: subject provided:', !!subject, 'Value:', subject || 'empty');
    
    setEmailContent(emailHTML || '');
    setSubjectLine(subject || '');
    setShowEditor(true);
    console.log('Index.tsx: handleEmailBuilderOpen completed');
  }, []);

  const handleBackToWorkspace = useCallback(() => {
    console.log('=== Index.tsx: handleBackToWorkspace called ===');
    setShowEditor(false);
    setEmailContent('');
    setSubjectLine('');
    console.log('Index.tsx: Returned to workspace');
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setEmailContent(content);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setSubjectLine(subject);
  }, []);

  console.log('=== Index.tsx: Rendering ===');
  console.log('Index.tsx: showEditor:', showEditor);
  console.log('Index.tsx: emailContent length:', emailContent.length);
  console.log('Index.tsx: subjectLine:', subjectLine);

  if (showEditor) {
    console.log('Index.tsx: Rendering EmailEditor');
    return (
      <EmailEditor 
        content={emailContent}
        subject={subjectLine}
        onContentChange={handleContentChange}
        onSubjectChange={handleSubjectChange}
        onBack={handleBackToWorkspace}
      />
    );
  }

  console.log('Index.tsx: Rendering WorkspacePage');
  return (
    <WorkspacePage onEmailBuilderOpen={handleEmailBuilderOpen} />
  );
};

export default Index;
