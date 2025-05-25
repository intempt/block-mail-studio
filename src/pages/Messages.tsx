import React, { useState } from 'react';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ConversationalMessagesInterface } from '@/components/ConversationalMessagesInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';
import { MessagesTable } from '@/components/MessagesTable';

interface MessagesPageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onEmailBuilderOpen }) => {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <AuthenticIntemptLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Create and manage your email, SMS, and push campaigns</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Message
          </Button>
        </div>

        {/* PROMPT-FIRST: Chat Interface at the top */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">What kind of message is next?</h2>
              <p className="text-gray-600">Describe your email, SMS or push task and let AI help you build it</p>
            </div>
            
            <ConversationalMessagesInterface 
              onEmailBuilderOpen={onEmailBuilderOpen}
            />
          </div>
        </div>

        {/* Tab Navigation - Now below the chat */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="journeys"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Journeys
            </TabsTrigger>
            <TabsTrigger 
              value="snippets"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Snippets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6 mt-6">
            {/* Messages Table will be rendered here */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
                {/* Table content here - keeping existing MessagesTable structure */}
                <MessagesTable />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journeys" className="space-y-6 mt-6">
            <JourneysTab />
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6 mt-6">
            <SnippetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticIntemptLayout>
  );
};

export default MessagesPage;
