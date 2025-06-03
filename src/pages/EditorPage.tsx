
import React, { useState } from 'react';
import EmailEditor from '@/components/EmailEditor';

export default function EditorPage() {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('New Email Campaign');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
  };

  return (
    <EmailEditor
      content={content}
      subject={subject}
      onContentChange={handleContentChange}
      onSubjectChange={handleSubjectChange}
    />
  );
}
