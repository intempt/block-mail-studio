
import React, { useState, useCallback } from 'react';
import Messages from './Messages';
import EmailEditor from '@/components/EmailEditor';

const MessagesHome = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [emailContent, setEmailContent] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('');

  const handleEmailBuilderOpen = useCallback((emailHTML?: string, subject?: string) => {
    console.log('=== MessagesHome: handleEmailBuilderOpen called ===');
    console.log('MessagesHome: emailHTML provided:', !!emailHTML, 'Length:', emailHTML?.length || 0);
    console.log('MessagesHome: subject provided:', !!subject, 'Value:', subject || 'empty');
    
    setEmailContent(emailHTML || '');
    setSubjectLine(subject || '');
    setShowEditor(true);
    console.log('MessagesHome: handleEmailBuilderOpen completed');
  }, []);

  const handleBackToMessages = useCallback(() => {
    console.log('=== MessagesHome: handleBackToMessages called ===');
    setShowEditor(false);
    setEmailContent('');
    setSubjectLine('');
    console.log('MessagesHome: Returned to messages');
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setEmailContent(content);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setSubjectLine(subject);
  }, []);

  console.log('=== MessagesHome: Rendering ===');
  console.log('MessagesHome: showEditor:', showEditor);
  console.log('MessagesHome: emailContent length:', emailContent.length);
  console.log('MessagesHome: subjectLine:', subjectLine);

  if (showEditor) {
    console.log('MessagesHome: Rendering EmailEditor');
    return (
      <EmailEditor 
        content={emailContent}
        subject={subjectLine}
        onContentChange={handleContentChange}
        onSubjectChange={handleSubjectChange}
        onBack={handleBackToMessages}
      />
    );
  }

  console.log('MessagesHome: Rendering Messages page');
  return (
    <Messages onEmailBuilderOpen={handleEmailBuilderOpen} />
  );
};

export default MessagesHome;
