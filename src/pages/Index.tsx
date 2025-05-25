
import React, { useState } from 'react';
import WorkspacePage from './WorkspacePage';
import EmailEditor from '@/components/EmailEditor';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [initialEmailHTML, setInitialEmailHTML] = useState<string>('');
  const [initialSubjectLine, setInitialSubjectLine] = useState<string>('');

  const handleEmailBuilderOpen = (emailHTML?: string, subjectLine?: string) => {
    if (emailHTML) {
      setInitialEmailHTML(emailHTML);
    }
    if (subjectLine) {
      setInitialSubjectLine(subjectLine);
    }
    setShowEditor(true);
  };

  const handleBackToWorkspace = () => {
    setShowEditor(false);
    setInitialEmailHTML('');
    setInitialSubjectLine('');
  };

  if (showEditor) {
    return (
      <EmailEditor 
        initialHTML={initialEmailHTML}
        initialSubject={initialSubjectLine}
        onBack={handleBackToWorkspace}
      />
    );
  }

  return (
    <WorkspacePage onEmailBuilderOpen={handleEmailBuilderOpen} />
  );
};

export default Index;
