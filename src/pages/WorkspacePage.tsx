
import React, { useState } from 'react';
import { AgenticHomepage } from '@/components/AgenticHomepage';

interface WorkspacePageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subject?: string) => void;
}

export default function WorkspacePage({ onEmailBuilderOpen }: WorkspacePageProps) {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const handleContentChange = (content: string) => {
    setEmailContent(content);
  };

  const handleSubjectChange = (subject: string) => {
    setEmailSubject(subject);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleEnterEditor = (emailHTML?: string, subjectLine?: string) => {
    if (onEmailBuilderOpen) {
      onEmailBuilderOpen(emailHTML, subjectLine);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgenticHomepage 
        onEnterEditor={handleEnterEditor}
      />
    </div>
  );
}
