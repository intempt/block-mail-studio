
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Edit3, 
  Palette, 
  Table as TableIcon, 
  User, 
  Store, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Layout,
  Type,
  Image,
  Link,
  Grid3X3,
  Mail,
  Zap,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import { AdvancedBlockLibrary } from './AdvancedBlockLibrary';
import { EmailBlockEditor } from './EmailBlockEditor';
import { BrandKitManager, BrandKit } from './BrandKitManager';
import { AdvancedTableBuilder } from './AdvancedTableBuilder';
import { DynamicContentEditor } from './DynamicContentEditor';
import { IndustryTemplateLibrary } from './IndustryTemplateLibrary';
import { SmartDesignAssistant } from './SmartDesignAssistant';
import { IntelligentAssistant } from './IntelligentAssistant';
import { TemplateEvolution } from './TemplateEvolution';
import { CollaborationHub } from './CollaborationHub';
import { WorkspaceManager } from './WorkspaceManager';

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tools: Tool[];
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

interface ProfessionalToolPaletteProps {
  editor: Editor | null;
}

export const ProfessionalToolPalette: React.FC<ProfessionalToolPaletteProps> = ({ editor }) => {
  const [selectedTool, setSelectedTool] = useState<string>('blocks');
  const [expandedCategory, setExpandedCategory] = useState<string>('content');
  const [currentBrandKit, setCurrentBrandKit] = useState<BrandKit>();

  const toolCategories: ToolCategory[] = [
    {
      id: 'content',
      name: 'Content',
      icon: <Edit3 className="w-4 h-4" />,
      description: 'Add and edit content blocks',
      tools: [
        {
          id: 'blocks',
          name: 'Content Blocks',
          icon: <Layers className="w-4 h-4" />,
          description: 'Pre-built content sections'
        },
        {
          id: 'advanced',
          name: 'Custom Blocks',
          icon: <Grid3X3 className="w-4 h-4" />,
          description: 'Advanced block editor'
        },
        {
          id: 'table',
          name: 'Tables',
          icon: <TableIcon className="w-4 h-4" />,
          description: 'Data tables and layouts'
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: <Palette className="w-4 h-4" />,
      description: 'Styling and branding tools',
      tools: [
        {
          id: 'brand',
          name: 'Brand Kit',
          icon: <Palette className="w-4 h-4" />,
          description: 'Colors, fonts, and assets'
        },
        {
          id: 'templates',
          name: 'Industry Templates',
          icon: <Store className="w-4 h-4" />,
          description: 'Professional templates'
        }
      ]
    },
    {
      id: 'personalization',
      name: 'Personalization',
      icon: <User className="w-4 h-4" />,
      description: 'Dynamic and personalized content',
      tools: [
        {
          id: 'dynamic',
          name: 'Dynamic Content',
          icon: <User className="w-4 h-4" />,
          description: 'Personalized content blocks'
        }
      ]
    },
    {
      id: 'ai',
      name: 'AI Tools',
      icon: <Brain className="w-4 h-4" />,
      description: 'AI-powered features',
      tools: [
        {
          id: 'assistant',
          name: 'Smart Assistant',
          icon: <Brain className="w-4 h-4" />,
          description: 'AI design suggestions',
          badge: 'Pro'
        },
        {
          id: 'intelligent',
          name: 'AI Optimizer',
          icon: <Sparkles className="w-4 h-4" />,
          description: 'Intelligent optimization',
          badge: 'Pro'
        },
        {
          id: 'evolution',
          name: 'A/B Testing',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Template evolution',
          badge: 'Pro'
        }
      ]
    },
    {
      id: 'collaboration',
      name: 'Team',
      icon: <Users className="w-4 h-4" />,
      description: 'Team collaboration tools',
      tools: [
        {
          id: 'collaboration',
          name: 'Team Hub',
          icon: <Users className="w-4 h-4" />,
          description: 'Collaboration features'
        },
        {
          id: 'workspace',
          name: 'Workspace',
          icon: <Layout className="w-4 h-4" />,
          description: 'Workspace settings'
        }
      ]
    }
  ];

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'blocks':
        return <AdvancedBlockLibrary editor={editor} />;
      case 'advanced':
        return <EmailBlockEditor editor={editor} />;
      case 'brand':
        return <BrandKitManager currentBrandKit={currentBrandKit} onBrandKitChange={setCurrentBrandKit} />;
      case 'table':
        return <AdvancedTableBuilder editor={editor} />;
      case 'dynamic':
        return <DynamicContentEditor editor={editor} />;
      case 'templates':
        return <IndustryTemplateLibrary editor={editor} />;
      case 'assistant':
        return <SmartDesignAssistant editor={editor} emailHTML="" />;
      case 'intelligent':
        return <IntelligentAssistant editor={editor} emailHTML="" />;
      case 'evolution':
        return <TemplateEvolution editor={editor} templateId="template-1" />;
      case 'collaboration':
        return <CollaborationHub projectId="project-1" />;
      case 'workspace':
        return <WorkspaceManager onSettingsChange={() => {}} />;
      default:
        return <AdvancedBlockLibrary editor={editor} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tool Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {toolCategories.map((category) => (
            <div key={category.id} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-3 hover:bg-slate-50"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? '' : category.id)}
              >
                <div className="flex items-center gap-3">
                  {category.icon}
                  <div className="text-left">
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-xs text-slate-500">{category.description}</div>
                  </div>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              
              {expandedCategory === category.id && (
                <div className="ml-4 space-y-1">
                  {category.tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? 'default' : 'ghost'}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {tool.icon}
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {tool.name}
                            {tool.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {tool.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{tool.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Tool Content */}
      <div className="flex-1 overflow-hidden">
        {renderToolContent()}
      </div>
    </div>
  );
};
