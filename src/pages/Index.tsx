
import React, { useState } from 'react';
import { IntegratedMessagesInterface } from '@/components/IntegratedMessagesInterface';
import { IntemptLayout } from '@/components/IntemptLayout';
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
    <IntemptLayout>
      <IntegratedMessagesInterface 
        onEmailBuilderOpen={handleEmailBuilderOpen}
      />
    </IntemptLayout>
  );
};

export default Index;
