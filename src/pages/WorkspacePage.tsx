
import React, { Suspense, lazy, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback, EditorLoadingFallback } from '@/components/LoadingFallback';
import { AgenticHomepage } from '@/components/AgenticHomepage';

// Lazy load the EmailEditor to prevent blocking the initial load
const EmailEditor = lazy(() => 
  import('@/components/EmailEditor').then(module => ({ default: module.default }))
);

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
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Unable to load Workspace</h2>
            <p className="text-gray-600 mb-4">There was an error loading the workspace.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <AgenticHomepage 
          onEnterEditor={handleEnterEditor}
        />
      </div>
    </ErrorBoundary>
  );
}
