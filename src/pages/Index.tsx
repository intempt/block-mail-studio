
import React, { useState, useCallback } from 'react';
import EmailEditor from '@/components/EmailEditor';
import { FloatingTestButton } from '@/components/FloatingTestButton';

const Index = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('New Email Campaign');

  const handleContentChange = useCallback((content: string) => {
    setEmailContent(content);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setSubjectLine(subject);
  }, []);

  return (
    <>
      <EmailEditor 
        content={emailContent}
        subject={subjectLine}
        onContentChange={handleContentChange}
        onSubjectChange={handleSubjectChange}
      />
      <FloatingTestButton />
    </>
  );
};

export default Index;
