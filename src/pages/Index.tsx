
import React, { useState } from 'react';
import WorkspacePage from './WorkspacePage';
import EmailEditor from '@/components/EmailEditor';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [initialEmailHTML, setInitialEmailHTML] = useState<string>('');
  const [initialSubjectLine, setInitialSubjectLine] = useState<string>('');

  const handleEmailBuilderOpen = (emailHTML?: string, subjectLine?: string) => {
    console.log('=== Index.tsx: handleEmailBuilderOpen called ===');
    console.log('Index.tsx: emailHTML provided:', !!emailHTML, 'Length:', emailHTML?.length || 0);
    console.log('Index.tsx: subjectLine provided:', !!subjectLine, 'Value:', subjectLine || 'empty');
    console.log('Index.tsx: Current showEditor state:', showEditor);
    
    if (emailHTML) {
      console.log('Index.tsx: Setting initialEmailHTML');
      setInitialEmailHTML(emailHTML);
    } else {
      console.log('Index.tsx: No emailHTML provided, using empty string');
      setInitialEmailHTML('');
    }
    
    if (subjectLine) {
      console.log('Index.tsx: Setting initialSubjectLine');
      setInitialSubjectLine(subjectLine);
    } else {
      console.log('Index.tsx: No subjectLine provided, using empty string');
      setInitialSubjectLine('');
    }
    
    console.log('Index.tsx: Setting showEditor to true');
    setShowEditor(true);
    console.log('Index.tsx: handleEmailBuilderOpen completed');
  };

  const handleBackToWorkspace = () => {
    console.log('=== Index.tsx: handleBackToWorkspace called ===');
    setShowEditor(false);
    setInitialEmailHTML('');
    setInitialSubjectLine('');
    console.log('Index.tsx: Returned to workspace');
  };

  console.log('=== Index.tsx: Rendering ===');
  console.log('Index.tsx: showEditor:', showEditor);
  console.log('Index.tsx: initialEmailHTML length:', initialEmailHTML.length);
  console.log('Index.tsx: initialSubjectLine:', initialSubjectLine);

  if (showEditor) {
    console.log('Index.tsx: Rendering EmailEditor');
    return (
      <EmailEditor 
        initialHTML={initialEmailHTML}
        initialSubject={initialSubjectLine}
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
