
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Palette, 
  Layout, 
  Wand2, 
  ArrowRight,
  Mail,
  ShoppingCart,
  Calendar,
  Megaphone,
  Users,
  Building
} from 'lucide-react';
import { emailAIService, EmailGenerationRequest } from '@/services/EmailAIService';

interface EmailCreationHubProps {
  editor: Editor | null;
  onEmailGenerated: (emailData: any) => void;
  onTransitionToEdit: () => void;
}

interface Template {
  id: string;
  name: string;
  industry: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
}

interface BrandKit {
  id: string;
  name: string;
  colors: string[];
  font: string;
  style: string;
}

const industryTemplates: Template[] = [
  {
    id: 'saas-welcome',
    name: 'SaaS Welcome',
    industry: 'Technology',
    icon: <Mail className="w-4 h-4" />,
    description: 'Onboard new users to your software platform',
    prompt: 'Create a welcome email for a SaaS platform that onboards new users with clear next steps and feature highlights'
  },
  {
    id: 'ecom-promo',
    name: 'E-commerce Sale',
    industry: 'Retail',
    icon: <ShoppingCart className="w-4 h-4" />,
    description: 'Drive sales with compelling promotional content',
    prompt: 'Design a promotional email for an e-commerce store with a 30% off sale, featuring product highlights and urgency'
  },
  {
    id: 'event-invite',
    name: 'Event Invitation',
    industry: 'Events',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Invite attendees to your upcoming event',
    prompt: 'Create an event invitation email for a professional conference with event details, speakers, and registration CTA'
  },
  {
    id: 'newsletter',
    name: 'Company Newsletter',
    industry: 'General',
    icon: <Megaphone className="w-4 h-4" />,
    description: 'Share company updates and insights',
    prompt: 'Design a monthly newsletter with company updates, industry insights, and team highlights'
  }
];

const brandKits: BrandKit[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    colors: ['#3B82F6', '#1E40AF', '#F8FAFC'],
    font: 'Inter',
    style: 'Clean, minimal, professional'
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
    font: 'Poppins',
    style: 'Bold, colorful, dynamic'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: ['#1F2937', '#6B7280', '#E5E7EB'],
    font: 'Arial',
    style: 'Traditional, trustworthy, formal'
  }
];

export const EmailCreationHub: React.FC<EmailCreationHubProps> = ({
  editor,
  onEmailGenerated,
  onTransitionToEdit
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBrandKit, setSelectedBrandKit] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent'>('professional');

  const generateFromTemplate = async (template: Template) => {
    setIsGenerating(true);
    try {
      const request: EmailGenerationRequest = {
        prompt: template.prompt,
        tone,
        type: 'welcome'
      };

      const response = await emailAIService.generateEmail(request);
      onEmailGenerated(response);
      onTransitionToEdit();
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromPrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const request: EmailGenerationRequest = {
        prompt: customPrompt,
        tone,
        type: 'welcome'
      };

      const response = await emailAIService.generateEmail(request);
      onEmailGenerated(response);
      onTransitionToEdit();
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Create Your Email</h2>
        </div>
        <p className="text-sm text-slate-600">
          Start with AI assistance to create professional emails in seconds
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
            <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
            <TabsTrigger value="brand" className="text-xs">Brand</TabsTrigger>
            <TabsTrigger value="blocks" className="text-xs">Blocks</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0">
              <div className="p-6 h-full flex flex-col">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      What email do you want to create?
                    </label>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe your email... e.g., 'Create a welcome email for new subscribers to our fitness app'"
                      className="resize-none h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Tone</label>
                      <select 
                        value={tone} 
                        onChange={(e) => setTone(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Brand Kit</label>
                      <select 
                        value={selectedBrandKit} 
                        onChange={(e) => setSelectedBrandKit(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      >
                        <option value="">Default</option>
                        {brandKits.map(kit => (
                          <option key={kit.id} value={kit.id}>{kit.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateFromPrompt}
                  disabled={!customPrompt.trim() || isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Industry Templates</h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Professional templates tailored for your industry
                    </p>
                  </div>

                  {industryTemplates.map((template) => (
                    <Card key={template.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-900">{template.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {template.industry}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                          <Button
                            size="sm"
                            onClick={() => generateFromTemplate(template)}
                            disabled={isGenerating}
                            className="w-full"
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="brand" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Brand Kits</h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Apply consistent branding to your emails
                    </p>
                  </div>

                  {brandKits.map((kit) => (
                    <Card 
                      key={kit.id} 
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedBrandKit === kit.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedBrandKit(kit.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex gap-1">
                          {kit.colors.map((color, index) => (
                            <div 
                              key={index}
                              className="w-4 h-4 rounded-full border border-slate-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">{kit.name}</h4>
                          <p className="text-xs text-slate-600 mb-1">Font: {kit.font}</p>
                          <p className="text-xs text-slate-500">{kit.style}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="blocks" className="h-full m-0">
              <div className="p-6">
                <div className="text-center py-8">
                  <Layout className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-2">Email Blocks</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Pre-built sections will be available after generating your first email
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
