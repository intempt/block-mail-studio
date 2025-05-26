
import React, { useState } from 'react';
import { UniversalConversationalInterface } from '@/components/UniversalConversationalInterface';

const Index = () => {
  const [emailBuilderData, setEmailBuilderData] = useState<{html?: string, subject?: string} | null>(null);

  const handleEmailBuilderOpen = (emailHTML?: string, subjectLine?: string) => {
    console.log('Opening email builder with:', { emailHTML, subjectLine });
    setEmailBuilderData({ html: emailHTML, subject: subjectLine });
    // In a real app, this would navigate to the email builder or open a modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GrowthOS Assistant
            </h1>
            <p className="text-gray-600">
              Create campaigns, optimize content, and design customer journeys with AI
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <UniversalConversationalInterface 
              context="messages"
              onEmailBuilderOpen={handleEmailBuilderOpen}
            />
          </div>

          {emailBuilderData && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Email Builder Would Open:</h3>
              <p className="text-sm text-blue-700">Subject: {emailBuilderData.subject}</p>
              <p className="text-sm text-blue-700">HTML Length: {emailBuilderData.html?.length || 0} characters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
