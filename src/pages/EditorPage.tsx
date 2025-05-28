
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailEditor from '@/components/EmailEditor';

export default function EditorPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');

  const handleBack = () => {
    navigate('/');
  };

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
      onBack={handleBack}
    />
  );
}
