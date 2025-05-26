
import React, { useState } from 'react';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UniversalConversationalInterface } from '@/components/UniversalConversationalInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';
import { MessagesTable } from '@/components/MessagesTable';

interface WorkspacePageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ onEmailBuilderOpen }) => {
  const [activeTab, setActiveTab] = useState('journeys');

  const getContextConfig = () => {
    switch (activeTab) {
      case 'journeys':
        return {
          title: 'Journeys',
          description: 'Create and manage automated customer workflows',
          chatTitle: 'What kind of journey would you like to create?',
          chatDescription: 'Describe your customer workflow and let AI help you build it',
          buttonText: 'Create Journey',
          breadcrumbText: 'Journeys'
        };
      case 'messages':
        return {
          title: 'Messages',
          description: 'Create and manage your email, SMS, and push campaigns',
          chatTitle: 'What kind of message is next?',
          chatDescription: 'Describe your email, SMS or push task and let AI help you build it',
          buttonText: 'Create Message',
          breadcrumbText: 'Messages'
        };
      case 'snippets':
        return {
          title: 'Snippets',
          description: 'Create and manage reusable content blocks',
          chatTitle: 'What content snippet do you need?',
          chatDescription: 'Describe your content needs and let AI help you create it',
          buttonText: 'Create Snippet',
          breadcrumbText: 'Snippets'
        };
      default:
        return {
          title: 'Journeys',
          description: 'Create and manage automated customer workflows',
          chatTitle: 'What kind of journey would you like to create?',
          chatDescription: 'Describe your customer workflow and let AI help you build it',
          buttonText: 'Create Journey',
          breadcrumbText: 'Journeys'
        };
    }
  };

  const config = getContextConfig();

  return (
    <AuthenticIntemptLayout activeContext={config.breadcrumbText}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {config.buttonText}
          </Button>
        </div>

        {/* PROMPT-FIRST: Universal Chat Interface at the top */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{config.chatTitle}</h2>
              <p className="text-gray-600">{config.chatDescription}</p>
            </div>
            
            <UniversalConversationalInterface 
              context={activeTab as 'journeys' | 'messages' | 'snippets'}
              onEmailBuilderOpen={onEmailBuilderOpen}
            />
          </div>
        </div>

        {/* Tab Navigation - Reordered with Journeys first */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="journeys" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Journeys
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="snippets"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Snippets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journeys" className="space-y-6 mt-6">
            <JourneysTab />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 mt-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
                <MessagesTable />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6 mt-6">
            <SnippetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticIntemptLayout>
  );
};

export default WorkspacePage;
