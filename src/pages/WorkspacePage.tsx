
import React, { Suspense, lazy, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback, EditorLoadingFallback } from '@/components/LoadingFallback';
import { ComponentHealthChecker } from '@/components/ComponentHealthChecker';

// Lazy load the EmailEditor to prevent blocking the initial load
const EmailEditor = lazy(() => 
  import('@/components/EmailEditor').then(module => ({ default: module.default }))
);

export default function WorkspacePage() {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [forceLoad, setForceLoad] = useState(false);
  const [showHealthChecker, setShowHealthChecker] = useState(true);

  const handleContentChange = (content: string) => {
    setEmailContent(content);
  };

  const handleSubjectChange = (subject: string) => {
    setEmailSubject(subject);
  };

  const handleForceLoad = () => {
    setForceLoad(true);
    setShowHealthChecker(false);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Show health checker initially, then hide it after components load
  if (showHealthChecker && !forceLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ComponentHealthChecker onForceLoad={handleForceLoad} />
      </div>
    );
  }

  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Unable to load Email Editor</h2>
            <p className="text-gray-600 mb-4">There was an error loading the email editor.</p>
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
        <Suspense fallback={<EditorLoadingFallback />}>
          <EmailEditor
            content={emailContent}
            subject={emailSubject}
            onContentChange={handleContentChange}
            onSubjectChange={handleSubjectChange}
            onBack={handleBack}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
