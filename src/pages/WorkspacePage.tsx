import React, { useState, useEffect } from 'react';
import { AuthenticIntemptLayout } from '@/components/AuthenticIntemptLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversalConversationalInterface } from '@/components/UniversalConversationalInterface';
import { JourneysTab } from '@/components/JourneysTab';
import { SnippetsTab } from '@/components/SnippetsTab';
import { MessagesTable } from '@/components/MessagesTable';
import { TestRunner } from '@/components/TestRunner';
import { Search, Plus, Zap } from 'lucide-react';

interface WorkspacePageProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ onEmailBuilderOpen }) => {
  const [activeTab, setActiveTab] = useState('journeys');

  useEffect(() => {
    console.log('=== WorkspacePage: Component mounted/updated ===');
    console.log('WorkspacePage: onEmailBuilderOpen callback provided:', !!onEmailBuilderOpen);
    console.log('WorkspacePage: onEmailBuilderOpen type:', typeof onEmailBuilderOpen);
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

  const handleCreateMessage = () => {
    console.log('=== WorkspacePage: Create Message button clicked ===');
    console.log('WorkspacePage: onEmailBuilderOpen callback available:', !!onEmailBuilderOpen);
    console.log('WorkspacePage: onEmailBuilderOpen function:', onEmailBuilderOpen);
    
    if (onEmailBuilderOpen) {
      console.log('WorkspacePage: Calling onEmailBuilderOpen from Create Message button');
      try {
        onEmailBuilderOpen();
        console.log('WorkspacePage: onEmailBuilderOpen call completed successfully');
      } catch (error) {
        console.error('WorkspacePage: Error calling onEmailBuilderOpen:', error);
      }
    } else {
      console.error('WorkspacePage: onEmailBuilderOpen callback not provided');
      alert('Error: Email editor callback not available. Please refresh the page.');
    }
  };

  const handleForceLoadEditor = () => {
    console.log('=== WorkspacePage: Force Load Editor button clicked ===');
    console.log('WorkspacePage: onEmailBuilderOpen callback available:', !!onEmailBuilderOpen);
    
    if (onEmailBuilderOpen) {
      console.log('WorkspacePage: Force loading editor with empty content');
      try {
        onEmailBuilderOpen('', 'New Email Campaign');
        console.log('WorkspacePage: Force load completed successfully');
      } catch (error) {
        console.error('WorkspacePage: Error force loading editor:', error);
      }
    } else {
      console.error('WorkspacePage: onEmailBuilderOpen callback not provided for force load');
      alert('Error: Email editor callback not available. Please refresh the page.');
    }
  };

  const handleCreateJourney = () => {
    console.log('Create Journey clicked - feature coming soon');
  };

  const handleCreateSnippet = () => {
    console.log('Create Snippet clicked - feature coming soon');
  };

  const config = getContextConfig();

  console.log('=== WorkspacePage: Rendering ===');
  console.log('WorkspacePage: activeTab:', activeTab);

  return (
    <AuthenticIntemptLayout activeContext={config.breadcrumbText}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Force Load Editor Button - Emergency Access */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">Quick Access</h3>
              <p className="text-xs text-red-600">Direct access to email editor (debugging)</p>
            </div>
            <Button 
              onClick={handleForceLoadEditor}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Force Load Editor
            </Button>
          </div>
        </div>

        {/* Universal Chat Interface with Dynamic Title */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {getDynamicTitle()}
            </h2>
            <UniversalConversationalInterface 
              context={activeTab as 'journeys' | 'messages' | 'snippets'}
              onEmailBuilderOpen={onEmailBuilderOpen}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
            <TabsTrigger 
              value="tests"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Tests
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

          <TabsContent value="tests" className="space-y-6 mt-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <TestRunner />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticIntemptLayout>
  );
};

export default WorkspacePage;
