
import React, { useState } from 'react';
import { IntemptLayout } from '@/components/IntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ConversationalMessagesInterface } from '@/components/ConversationalMessagesInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';

interface MessagesPageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onEmailBuilderOpen }) => {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <IntemptLayout>
      <div className="space-y-6">
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

        {/* Tab Navigation */}
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

          <TabsContent value="messages" className="space-y-6">
            <ConversationalMessagesInterface 
              onEmailBuilderOpen={onEmailBuilderOpen}
            />
          </TabsContent>

          <TabsContent value="journeys" className="space-y-6">
            <JourneysTab />
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6">
            <SnippetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </IntemptLayout>
  );
};

export default MessagesPage;
