
import React, { useState, useEffect } from 'react';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversalConversationalInterface } from '@/components/UniversalConversationalInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';
import { MessagesTable } from '@/components/MessagesTable';
import { Search, Plus } from 'lucide-react';

interface WorkspacePageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ onEmailBuilderOpen }) => {
  const [activeTab, setActiveTab] = useState('journeys');

  useEffect(() => {
    console.log('WorkspacePage: Rendered with onEmailBuilderOpen:', !!onEmailBuilderOpen);
  }, [onEmailBuilderOpen]);

  const getContextConfig = () => {
    switch (activeTab) {
      case 'journeys':
        return {
          breadcrumbText: 'Journeys'
        };
      case 'messages':
        return {
          breadcrumbText: 'Messages'
        };
      case 'snippets':
        return {
          breadcrumbText: 'Snippets'
        };
      default:
        return {
          breadcrumbText: 'Journeys'
        };
    }
  };

  const handleCreateMessage = () => {
    console.log('WorkspacePage: Create Message button clicked');
    console.log('WorkspacePage: onEmailBuilderOpen callback available:', !!onEmailBuilderOpen);
    
    if (onEmailBuilderOpen) {
      console.log('WorkspacePage: Calling onEmailBuilderOpen from Create Message button');
      onEmailBuilderOpen();
    } else {
      console.error('WorkspacePage: onEmailBuilderOpen callback not provided');
    }
  };

  const handleCreateJourney = () => {
    console.log('Create Journey clicked - feature coming soon');
  };

  const handleCreateSnippet = () => {
    console.log('Create Snippet clicked - feature coming soon');
  };

  const config = getContextConfig();

  return (
    <AuthenticIntemptLayout activeContext={config.breadcrumbText}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Universal Chat Interface */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <UniversalConversationalInterface 
              context={activeTab as 'journeys' | 'messages' | 'snippets'}
              onEmailBuilderOpen={onEmailBuilderOpen}
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
            {/* Search Bar - no filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search journeys..."
                className="pl-10"
              />
            </div>
            
            <JourneysTab />
            
            {/* Create Journey Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleCreateJourney}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Journey
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 mt-6">
            {/* Search Bar - no filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
              />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <MessagesTable onEmailBuilderOpen={onEmailBuilderOpen} />
              </div>
            </div>
            
            {/* Create Message Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleCreateMessage}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Message
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6 mt-6">
            {/* Search Bar - no filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search snippets..."
                className="pl-10"
              />
            </div>
            
            <SnippetsTab />
            
            {/* Create Snippet Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleCreateSnippet}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
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
