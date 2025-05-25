
import React, { useState } from 'react';
import { IntemptMessagesInterface } from '@/components/IntemptMessagesInterface';
import EmailEditor from '@/components/EmailEditor';
import { EmailTemplate } from '@/components/TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [initialEmailHTML, setInitialEmailHTML] = useState<string>('');
  const [initialSubjectLine, setInitialSubjectLine] = useState<string>('');

  const templates = DirectTemplateService.getAllTemplates();

  const handleEmailBuilderOpen = (emailHTML?: string, subjectLine?: string) => {
    if (emailHTML) {
      setInitialEmailHTML(emailHTML);
    }
    if (subjectLine) {
      setInitialSubjectLine(subjectLine);
    }
    setShowEditor(true);
  };

  const handleBackToMessages = () => {
    setShowEditor(false);
    setInitialEmailHTML('');
    setInitialSubjectLine('');
  };

  if (showEditor) {
    return (
      <EmailEditor 
        initialHTML={initialEmailHTML}
        initialSubject={initialSubjectLine}
        onBack={handleBackToMessages}
      />
    );
  }

  return (
    <IntemptMessagesInterface 
      onEmailBuilderOpen={handleEmailBuilderOpen}
    />
  );
};

export default Index;
