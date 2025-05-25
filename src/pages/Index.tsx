
import React, { useState } from 'react';
import { AgenticHomepage } from '@/components/AgenticHomepage';
import EmailEditor from '@/components/EmailEditor';
import { EmailTemplate } from '@/components/TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [initialEmailHTML, setInitialEmailHTML] = useState<string>('');
  const [initialSubjectLine, setInitialSubjectLine] = useState<string>('');

  const templates = DirectTemplateService.getAllTemplates();

  const handleEnterEditor = (emailHTML?: string, subjectLine?: string) => {
    if (emailHTML) {
      setInitialEmailHTML(emailHTML);
    }
    if (subjectLine) {
      setInitialSubjectLine(subjectLine);
    }
    setShowEditor(true);
  };

  const handleBackToHomepage = () => {
    setShowEditor(false);
    setInitialEmailHTML('');
    setInitialSubjectLine('');
  };

  if (showEditor) {
    return (
      <EmailEditor 
        initialHTML={initialEmailHTML}
        initialSubject={initialSubjectLine}
        onBack={handleBackToHomepage}
      />
    );
  }

  return (
    <AgenticHomepage 
      templates={templates}
      onEnterEditor={handleEnterEditor}
    />
  );
};

export default Index;
