
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversalConversationalInterface } from '@/components/UniversalConversationalInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';
import { MessagesTable } from '@/components/MessagesTable';
import { Search, Plus } from 'lucide-react';

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('journeys');

  const handleEmailBuilderOpen = () => {
    navigate('/editor');
  };

  const getContextConfig = () => {
    switch (activeTab) {
      case 'journeys':
        return { breadcrumbText: 'Journeys' };
      case 'messages':
        return { breadcrumbText: 'Messages' };
      case 'snippets':
        return { breadcrumbText: 'Snippets' };
      default:
        return { breadcrumbText: 'Journeys' };
    }
  };

  const getDynamicTitle = () => {
    switch (activeTab) {
      case 'journeys':
        return 'Describe your Journey';
      case 'messages':
        return 'Describe your Message';
      case 'snippets':
        return 'Describe your Snippet';
      default:
        return 'Describe your Journey';
    }
  };

  const config = getContextConfig();

  return (
    <AuthenticIntemptLayout activeContext={config.breadcrumbText}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Universal Chat Interface */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {getDynamicTitle()}
            </h2>
            <UniversalConversationalInterface 
              context={activeTab as 'journeys' | 'messages' | 'snippets'}
              onEmailBuilderOpen={handleEmailBuilderOpen}
            />
          </div>
        </div>

        {/* Tab Navigation */}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search journeys..." className="pl-10" />
            </div>
            <JourneysTab />
            <div className="pt-4 border-t border-gray-200">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Journey
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <MessagesTable onEmailBuilderOpen={handleEmailBuilderOpen} />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleEmailBuilderOpen}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Message
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search snippets..." className="pl-10" />
            </div>
            <SnippetsTab />
            <div className="pt-4 border-t border-gray-200">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Snippet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticIntemptLayout>
  );
};

export default WorkspacePage;
